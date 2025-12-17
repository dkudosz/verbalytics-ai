import { NextRequest, NextResponse } from "next/server";
import { getUser, getUserWithRole } from "@/lib/auth/utils";
import { PrismaClient } from "@prisma/client";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const prisma = new PrismaClient();

async function sendAccountRequestEmail(
  userData: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: Date;
    metadata: any;
  },
  requestType: "delete" | "close"
) {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "eu-west-1";
  const fromEmail = process.env.AWS_SES_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || "hello@verbalytics.ai";

  if (!accessKeyId || !secretAccessKey || !fromEmail) {
    throw new Error("AWS SES credentials are not properly configured");
  }

  const sesClient = new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const requestTypeLabel = requestType === "delete" ? "Delete All Data" : "Close Account";
  const metadata = userData.metadata as Record<string, any> | null;
  const company = metadata?.company || "Not provided";

  const emailHtml = `
    <h2>Account ${requestTypeLabel} Request</h2>
    <p>A user has requested to ${requestType === "delete" ? "delete all their data" : "close their account"}.</p>
    
    <h3>User Details:</h3>
    <ul>
      <li><strong>User ID:</strong> ${userData.id}</li>
      <li><strong>Email:</strong> ${userData.email}</li>
      <li><strong>Name:</strong> ${userData.name || "Not provided"}</li>
      <li><strong>Company:</strong> ${company}</li>
      <li><strong>Role:</strong> ${userData.role}</li>
      <li><strong>Account Created:</strong> ${new Date(userData.createdAt).toLocaleString()}</li>
    </ul>
    
    <h3>Request Type:</h3>
    <p><strong>${requestTypeLabel}</strong></p>
    
    <p><em>This request was confirmed by the user typing 'delete' in the confirmation field.</em></p>
    
    <p>Please process this request within 5 working days.</p>
  `;

  const emailText = `
Account ${requestTypeLabel} Request

A user has requested to ${requestType === "delete" ? "delete all their data" : "close their account"}.

User Details:
- User ID: ${userData.id}
- Email: ${userData.email}
- Name: ${userData.name || "Not provided"}
- Company: ${company}
- Role: ${userData.role}
- Account Created: ${new Date(userData.createdAt).toLocaleString()}

Request Type: ${requestTypeLabel}

This request was confirmed by the user typing 'delete' in the confirmation field.

Please process this request within 5 working days.
  `;

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [adminEmail],
    },
    Message: {
      Subject: {
        Data: `Account ${requestTypeLabel} Request - ${userData.email}`,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: emailHtml,
          Charset: "UTF-8",
        },
        Text: {
          Data: emailText,
          Charset: "UTF-8",
        },
      },
    },
    ReplyToAddresses: [userData.email],
  });

  return sesClient.send(command);
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserWithRole();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestType, confirmation } = body;

    // Validate request type
    if (requestType !== "delete" && requestType !== "close") {
      return NextResponse.json(
        { error: "Invalid request type" },
        { status: 400 }
      );
    }

    // Validate confirmation
    if (confirmation !== "delete") {
      return NextResponse.json(
        { error: "Confirmation text must be 'delete'" },
        { status: 400 }
      );
    }

    // Get full user data
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        metadata: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send email to admin
    await sendAccountRequestEmail(fullUser, requestType);

    return NextResponse.json({
      message: "Request submitted successfully",
      requestType: requestType,
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: "Failed to submit request",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}






