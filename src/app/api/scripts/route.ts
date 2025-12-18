import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await requireAuth();
    const user = await getUserWithRole();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "subscriber" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const scripts = await prisma.script.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      scripts: scripts.map((script) => ({
        id: script.id,
        scriptName: script.scriptName,
        scriptText: script.scriptText,
        createdAt: script.createdAt.toISOString(),
        updatedAt: script.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching scripts:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch scripts",
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

    if (user.role !== "subscriber" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { scriptName, scriptText } = body;

    if (!scriptName || !scriptText) {
      return NextResponse.json(
        { error: "Script name and script text are required" },
        { status: 400 }
      );
    }

    if (typeof scriptName !== "string" || typeof scriptText !== "string") {
      return NextResponse.json(
        { error: "Script name and script text must be strings" },
        { status: 400 }
      );
    }

    if (!scriptName.trim()) {
      return NextResponse.json(
        { error: "Script name cannot be empty" },
        { status: 400 }
      );
    }

    if (!scriptText.trim()) {
      return NextResponse.json(
        { error: "Script text cannot be empty" },
        { status: 400 }
      );
    }

    const script = await prisma.script.create({
      data: {
        userId: user.id,
        scriptName: scriptName.trim(),
        scriptText: scriptText.trim(),
      },
    });

    return NextResponse.json({
      message: "Script created successfully",
      script: {
        id: script.id,
        scriptName: script.scriptName,
        scriptText: script.scriptText,
        createdAt: script.createdAt.toISOString(),
        updatedAt: script.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating script:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to create script",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAuth();
    const user = await getUserWithRole();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "subscriber" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { scriptId, scriptName, scriptText } = body;

    if (!scriptId) {
      return NextResponse.json(
        { error: "Script ID is required" },
        { status: 400 }
      );
    }

    if (!scriptName || !scriptText) {
      return NextResponse.json(
        { error: "Script name and script text are required" },
        { status: 400 }
      );
    }

    if (typeof scriptName !== "string" || typeof scriptText !== "string") {
      return NextResponse.json(
        { error: "Script name and script text must be strings" },
        { status: 400 }
      );
    }

    if (!scriptName.trim()) {
      return NextResponse.json(
        { error: "Script name cannot be empty" },
        { status: 400 }
      );
    }

    if (!scriptText.trim()) {
      return NextResponse.json(
        { error: "Script text cannot be empty" },
        { status: 400 }
      );
    }

    // Verify the script belongs to the current user
    const existingScript = await prisma.script.findFirst({
      where: {
        id: scriptId,
        userId: user.id,
      },
    });

    if (!existingScript) {
      return NextResponse.json(
        { error: "Script not found or access denied" },
        { status: 404 }
      );
    }

    // Update the script
    const updatedScript = await prisma.script.update({
      where: {
        id: scriptId,
      },
      data: {
        scriptName: scriptName.trim(),
        scriptText: scriptText.trim(),
      },
    });

    return NextResponse.json({
      message: "Script updated successfully",
      script: {
        id: updatedScript.id,
        scriptName: updatedScript.scriptName,
        scriptText: updatedScript.scriptText,
        createdAt: updatedScript.createdAt.toISOString(),
        updatedAt: updatedScript.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating script:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to update script",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuth();
    const user = await getUserWithRole();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "subscriber" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { scriptId } = body;

    if (!scriptId) {
      return NextResponse.json(
        { error: "Script ID is required" },
        { status: 400 }
      );
    }

    // Verify the script belongs to the current user
    const script = await prisma.script.findFirst({
      where: {
        id: scriptId,
        userId: user.id,
      },
    });

    if (!script) {
      return NextResponse.json(
        { error: "Script not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the script
    await prisma.script.delete({
      where: {
        id: scriptId,
      },
    });

    return NextResponse.json({
      message: "Script deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting script:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to delete script",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

