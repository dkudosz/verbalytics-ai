import { NextRequest, NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score >= 0.5; // reCAPTCHA v3 returns a score (0.0 to 1.0)
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

// Send email via AWS SES
async function sendEmail(formData: ContactFormData) {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "eu-west-1";
  const fromEmail = process.env.AWS_SES_FROM_EMAIL;
  const toEmail = process.env.CONTACT_EMAIL || "hello@verbalytics.ai";

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

  const emailHtml = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Subject:</strong> ${formData.subject}</p>
    <h3>Message:</h3>
    <p>${formData.message.replace(/\n/g, "<br>")}</p>
  `;

  const emailText = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}
  `;

  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: `Contact Form: ${formData.subject}`,
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
    ReplyToAddresses: [formData.email],
  });

  return sesClient.send(command);
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message || !body.recaptchaToken) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const isRecaptchaValid = await verifyRecaptcha(body.recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Send email via SES
    await sendEmail(body);

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

