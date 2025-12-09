import { NextRequest, NextResponse } from "next/server";
import { getUser, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";
import { syncUserToDatabase } from "@/lib/auth/utils";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // First check if user is authenticated in Supabase
    const supabaseUser = await getUser();
    
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to get user from database
    let dbUser = await getUserWithRole();
    
    // If user doesn't exist in database, sync them
    if (!dbUser) {
      await syncUserToDatabase(supabaseUser);
      dbUser = await getUserWithRole();
      
      if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    // Get full user data including metadata
    const fullUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        metadata: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract company and role from metadata
    const metadata = fullUser.metadata as Record<string, any> | null;
    const company = metadata?.company || "";
    const roleString = metadata?.role || "";

    return NextResponse.json({
      name: fullUser.name || "",
      email: fullUser.email,
      company: company,
      role: roleString,
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch profile",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // First check if user is authenticated in Supabase
    const supabaseUser = await getUser();
    
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try to get user from database
    let user = await getUserWithRole();
    
    // If user doesn't exist in database, sync them
    if (!user) {
      await syncUserToDatabase(supabaseUser);
      user = await getUserWithRole();
      
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    const body = await request.json();
    const { name, email, company, role } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Get current user data to preserve existing metadata
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { metadata: true },
    });

    const currentMetadata = (currentUser?.metadata as Record<string, any>) || {};
    
    // Update metadata with company and role
    const updatedMetadata = {
      ...currentMetadata,
      company: company || "",
      role: role || "",
    };

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name,
        email: email,
        metadata: updatedMetadata,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        metadata: true,
      },
    });

    // Extract company and role from metadata for response
    const metadata = updatedUser.metadata as Record<string, any> | null;
    const companyValue = metadata?.company || "";
    const roleValue = metadata?.role || "";

    return NextResponse.json({
      name: updatedUser.name || "",
      email: updatedUser.email,
      company: companyValue,
      role: roleValue,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    
    // Handle unique constraint violation (email already exists)
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to update profile",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

