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
    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
        where: { supabaseId: supabaseUser.id },
        data: {
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
          metadata: supabaseUser.user_metadata || {},
        },
      });
    } else {
      // Create new user with default subscriber role
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
  } catch (error) {
    console.error("Error syncing user to database:", error);
    throw error;
  }
}

