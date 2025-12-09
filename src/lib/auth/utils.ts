import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getUserWithRole() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { id: true, email: true, name: true, role: true, image: true },
    });

    return dbUser;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const dbUser = await getUserWithRole();

  if (!dbUser) {
    redirect("/signin");
  }

  if (!allowedRoles.includes(dbUser.role)) {
    redirect("/dashboard");
  }

  return dbUser;
}

export async function syncUserToDatabase(supabaseUser: any) {
  try {
    // First try to find by supabaseId
    let existingUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    // If not found by supabaseId, try to find by email (in case supabaseId changed or mismatch)
    if (!existingUser && supabaseUser.email) {
      existingUser = await prisma.user.findUnique({
        where: { email: supabaseUser.email },
      });

      // If found by email but supabaseId doesn't match, update the supabaseId
      if (existingUser && existingUser.supabaseId !== supabaseUser.id) {
        existingUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { supabaseId: supabaseUser.id },
        });
      }
    }

    if (existingUser) {
      // Update existing user - only update fields that might have changed
      // Don't overwrite email if it's the same to avoid constraint issues
      const updateData: any = {};

      if (supabaseUser.email && supabaseUser.email !== existingUser.email) {
        updateData.email = supabaseUser.email;
      }

      const newName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null;
      if (newName !== existingUser.name) {
        updateData.name = newName;
      }

      const newImage = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null;
      if (newImage !== existingUser.image) {
        updateData.image = newImage;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        return await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData,
        });
      }

      // Return existing user if no changes needed
      return existingUser;
    } else {
      // Create new user with default subscriber role
      // But first check if email already exists to avoid constraint violation
      if (supabaseUser.email) {
        const emailUser = await prisma.user.findUnique({
          where: { email: supabaseUser.email },
        });

        if (emailUser) {
          // User exists with this email but different supabaseId - update it
          return await prisma.user.update({
            where: { id: emailUser.id },
            data: {
              supabaseId: supabaseUser.id,
              name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || emailUser.name,
              image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || emailUser.image,
            },
          });
        }
      }

      // No existing user found, create new one
      return await prisma.user.create({
        data: {
          supabaseId: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
          role: "subscriber",
          metadata: supabaseUser.user_metadata || {},
        },
      });
    }
  } catch (error: any) {
    // If it's a unique constraint error on email, try to find and return the existing user
    if (error.code === "P2002" && error.meta?.target?.includes("email") && supabaseUser.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: supabaseUser.email },
      });

      if (existingUser) {
        // Update supabaseId if it doesn't match
        if (existingUser.supabaseId !== supabaseUser.id) {
          return await prisma.user.update({
            where: { id: existingUser.id },
            data: { supabaseId: supabaseUser.id },
          });
        }
        return existingUser;
      }
    }

    throw error;
  }
}

