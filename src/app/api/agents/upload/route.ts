import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// CSV parser that handles quoted fields with commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());
  return result;
}

// Email validation function
function isValidEmail(email: string): boolean {
  if (!email || email.trim() === "") {
    return false;
  }

  // RFC 5322 compliant email regex (simplified but covers most cases)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
}


export async function POST(request: NextRequest) {
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

    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      return NextResponse.json({ error: "Invalid file type. Please upload a CSV file." }, { status: 400 });
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length === 0) {
      return NextResponse.json({ error: "CSV file is empty" }, { status: 400 });
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, "").trim());

    // Expected columns
    const expectedColumns = [
      "agentId",
      "agentName",
      "agentSurname",
      "agentEmail",
      "agentPhone",
      "agentSlack",
      "agentDiscord",
    ];
    const requiredColumns = ["agentId", "agentName", "agentSurname", "agentEmail"];

    // Validate headers
    const missingColumns = expectedColumns.filter((col) => !headers.includes(col));
    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required columns: ${missingColumns.join(", ")}`,
          expectedColumns,
        },
        { status: 400 }
      );
    }

    // Parse rows
    const rows: Array<Record<string, string>> = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, "").trim());

      // Skip empty rows
      if (values.length === 0 || !values.some((v) => v)) {
        continue;
      }

      // Skip template/metadata rows (rows where all non-empty values are "required")
      const nonEmptyValues = values.filter((v) => v);
      if (nonEmptyValues.length > 0 && nonEmptyValues.every((v) => v.toLowerCase() === "required")) {
        continue;
      }

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      // Validate required fields
      const missingFields = requiredColumns.filter((col) => !row[col] || row[col].trim() === "");
      if (missingFields.length > 0) {
        errors.push(`Row ${i + 1}: Missing required fields: ${missingFields.join(", ")}`);
        continue;
      }

      // Validate email format (agentEmail is required, so it will always be present at this point)
      if (!isValidEmail(row.agentEmail)) {
        errors.push(`Row ${i + 1}: Invalid email format for agentEmail: "${row.agentEmail}"`);
        continue;
      }

      rows.push(row);
    }

    if (errors.length > 0 && rows.length === 0) {
      return NextResponse.json(
        {
          error: "All rows have validation errors",
          details: errors,
        },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: "No valid rows found in CSV file" }, { status: 400 });
    }

    // Save agents to database
    const savedAgents = [];
    const saveErrors: string[] = [];

    for (const row of rows) {
      try {
        // Check if agent with same agentId already exists for this user
        // Note: If you get "Cannot read properties of undefined", you need to:
        // 1. Stop the dev server
        // 2. Run: npm run prisma:generate
        // 3. Make sure the database migration has been run (see AGENTS_TABLE_SETUP.md)
        const existingAgent = await (prisma as any).agent?.findUnique({
          where: {
            userId_agentId: {
              userId: user.id,
              agentId: row.agentId,
            },
          },
        });

        if (existingAgent) {
          // Update existing agent
          const updatedAgent = await prisma.agent.update({
            where: { id: existingAgent.id },
            data: {
              agentName: row.agentName,
              agentSurname: row.agentSurname,
              agentEmail: row.agentEmail,
              agentPhone: row.agentPhone || null,
              agentSlack: row.agentSlack || null,
              agentDiscord: row.agentDiscord || null,
            },
          });
          savedAgents.push(updatedAgent);
        } else {
          // Create new agent
          const newAgent = await prisma.agent.create({
            data: {
              userId: user.id,
              agentId: row.agentId,
              agentName: row.agentName,
              agentSurname: row.agentSurname,
              agentEmail: row.agentEmail,
              agentPhone: row.agentPhone || null,
              agentSlack: row.agentSlack || null,
              agentDiscord: row.agentDiscord || null,
            },
          });
          savedAgents.push(newAgent);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        saveErrors.push(`Failed to save agent ${row.agentId}: ${errorMessage}`);
      }
    }

    if (savedAgents.length === 0 && saveErrors.length > 0) {
      return NextResponse.json(
        {
          error: "Failed to save agents to database",
          details: saveErrors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "CSV file processed and saved successfully",
      processed: savedAgents.length,
      errors: errors.length > 0 || saveErrors.length > 0 ? [...errors, ...saveErrors] : undefined,
      data: savedAgents,
    });
  } catch (error) {
    console.error("CSV upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to process CSV file",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

