import { NextRequest, NextResponse } from "next/server";
import { getUser, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await getUserWithRole();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get full user data including metadata
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { metadata: true },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract settings from metadata
    const metadata = fullUser.metadata as Record<string, any> | null;
    const settings = metadata?.settings || {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
      weeklyReports: true,
      autoSave: true,
      darkMode: false,
    };

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserWithRole();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const settings = body.settings;

    if (!settings) {
      return NextResponse.json(
        { error: "Settings are required" },
        { status: 400 }
      );
    }

    // Get current user data to preserve existing metadata
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { metadata: true },
    });

    const currentMetadata = (currentUser?.metadata as Record<string, any>) || {};
    
    // Update metadata with settings
    const updatedMetadata = {
      ...currentMetadata,
      settings: settings,
    };

    // Update user in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: updatedMetadata,
      },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: settings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}



