import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await requireAuth();
    const user = await getUserWithRole();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        systemToken: true,
        oldSystemTokens: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      systemToken: fullUser.systemToken || null,
      oldSystemTokens: (fullUser.oldSystemTokens as string[]) || [],
    });
  } catch (error) {
    console.error("Error fetching system token:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch system token",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const user = await getUserWithRole();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a new secure token
    const newToken = randomBytes(32).toString("hex");

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        systemToken: true,
        oldSystemTokens: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare old tokens array
    const oldTokens = (currentUser.oldSystemTokens as string[]) || [];
    
    // If there's a current token, add it to old tokens
    if (currentUser.systemToken) {
      oldTokens.push(currentUser.systemToken);
    }

    // Update user with new token and old tokens
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        systemToken: newToken,
        oldSystemTokens: oldTokens,
      },
      select: {
        systemToken: true,
        oldSystemTokens: true,
      },
    });

    return NextResponse.json({
      message: "System token regenerated successfully",
      systemToken: updatedUser.systemToken,
      oldSystemTokens: (updatedUser.oldSystemTokens as string[]) || [],
    });
  } catch (error) {
    console.error("Error regenerating system token:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to regenerate system token",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

