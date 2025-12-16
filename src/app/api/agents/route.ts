import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Check authentication
        await requireAuth();
        const user = await getUserWithRole();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user has permission (subscriber or admin)
        if (user.role !== "subscriber" && user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch agents for the current user
        // Check if Agent model exists (Prisma client needs regeneration)
        if (!('agent' in prisma)) {
            return NextResponse.json(
                {
                    error: "Agent model not available. Please: 1) Stop the dev server, 2) Run 'npm run prisma:generate', 3) Make sure the database migration has been run, 4) Restart the dev server.",
                },
                { status: 500 }
            );
        }

        const agents = await (prisma as any).agent.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            agents,
        });
    } catch (error) {
        console.error("Error fetching agents:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to fetch agents",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        await requireAuth();
        const user = await getUserWithRole();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user has permission (subscriber or admin)
        if (user.role !== "subscriber" && user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { agentId } = body;

        if (!agentId) {
            return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
        }

        // Verify the agent belongs to the current user
        if (!('agent' in prisma)) {
            return NextResponse.json(
                {
                    error: "Agent model not available. Please: 1) Stop the dev server, 2) Run 'npm run prisma:generate', 3) Make sure the database migration has been run, 4) Restart the dev server.",
                },
                { status: 500 }
            );
        }

        const agent = await (prisma as any).agent.findFirst({
            where: {
                id: agentId,
                userId: user.id,
            },
        });

        if (!agent) {
            return NextResponse.json({ error: "Agent not found or access denied" }, { status: 404 });
        }

        // Delete the agent
        await (prisma as any).agent.delete({
            where: {
                id: agentId,
            },
        });

        return NextResponse.json({
            message: "Agent deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting agent:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to delete agent",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        // Check authentication
        await requireAuth();
        const user = await getUserWithRole();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user has permission (subscriber or admin)
        if (user.role !== "subscriber" && user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { agentId, agentName, agentSurname, agentEmail, agentPhone, agentSlack, agentDiscord } = body;

        if (!agentId) {
            return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
        }

        // Validate required fields
        if (!agentName || !agentSurname || !agentEmail) {
            return NextResponse.json(
                { error: "Agent name, surname, and email are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(agentEmail.trim())) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Check if Agent model exists
        if (!('agent' in prisma)) {
            return NextResponse.json(
                {
                    error: "Agent model not available. Please: 1) Stop the dev server, 2) Run 'npm run prisma:generate', 3) Make sure the database migration has been run, 4) Restart the dev server.",
                },
                { status: 500 }
            );
        }

        // Verify the agent belongs to the current user
        const agent = await (prisma as any).agent.findFirst({
            where: {
                id: agentId,
                userId: user.id,
            },
        });

        if (!agent) {
            return NextResponse.json({ error: "Agent not found or access denied" }, { status: 404 });
        }

        // Update the agent
        const updatedAgent = await (prisma as any).agent.update({
            where: {
                id: agentId,
            },
            data: {
                agentName: agentName.trim(),
                agentSurname: agentSurname.trim(),
                agentEmail: agentEmail.trim(),
                agentPhone: agentPhone?.trim() || null,
                agentSlack: agentSlack?.trim() || null,
                agentDiscord: agentDiscord?.trim() || null,
            },
        });

        return NextResponse.json({
            message: "Agent updated successfully",
            agent: updatedAgent,
        });
    } catch (error) {
        console.error("Error updating agent:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            {
                error: "Failed to update agent",
                details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
            },
            { status: 500 }
        );
    }
}

