import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";

interface SupportTicketForm {
  subject: string;
  priority: string;
  category: string;
  description: string;
}

// Map priority to JIRA priority
function mapPriorityToJira(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: "Lowest",
    medium: "Medium",
    high: "High",
    urgent: "Highest",
  };
  return priorityMap[priority] || "Medium";
}

// Map category to JIRA issue type
function mapCategoryToIssueType(category: string): string {
  const categoryMap: Record<string, string> = {
    general: "Task",
    technical: "Bug",
    billing: "Task",
    feature: "Story",
    bug: "Bug",
    account: "Task",
  };
  return categoryMap[category] || "Task";
}

// Create JIRA issue
async function createJiraIssue(
  ticketData: SupportTicketForm,
  userEmail: string,
  userName: string | null
): Promise<{ key: string; id: string }> {
  const jiraBaseUrl = process.env.JIRA_BASE_URL;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraApiToken = process.env.JIRA_API_TOKEN;
  const jiraProjectKey = process.env.JIRA_PROJECT_KEY;

  if (!jiraBaseUrl || !jiraEmail || !jiraApiToken || !jiraProjectKey) {
    throw new Error("JIRA configuration is missing. Please check environment variables.");
  }

  // Create basic auth header
  const authHeader = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");

  // Prepare issue data
  const issueType = mapCategoryToIssueType(ticketData.category);
  const priority = mapPriorityToJira(ticketData.priority);

  // Build description with user information
  const description = `User Information:
Email: ${userEmail}
Name: ${userName || "Not provided"}

Issue Details:
${ticketData.description}

Category: ${ticketData.category}
Priority: ${ticketData.priority}`;

  const issueData = {
    fields: {
      project: {
        key: jiraProjectKey,
      },
      summary: ticketData.subject,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description,
              },
            ],
          },
        ],
      },
      issuetype: {
        name: issueType,
      },
      priority: {
        name: priority,
      },
      labels: ["support-ticket", "web-portal", ticketData.category],
    },
  };

  try {
    const response = await fetch(`${jiraBaseUrl}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issueData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("JIRA API error:", errorText);
      throw new Error(`Failed to create JIRA issue: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      key: result.key,
      id: result.id,
    };
  } catch (error: any) {
    console.error("Error creating JIRA issue:", error);
    throw new Error(`Failed to create JIRA issue: ${error.message}`);
  }
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

    const body: SupportTicketForm = await request.json();

    // Validate required fields
    if (!body.subject || !body.description) {
      return NextResponse.json(
        { error: "Subject and description are required" },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(body.priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      "general",
      "technical",
      "billing",
      "feature",
      "bug",
      "account",
    ];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { error: "Invalid category value" },
        { status: 400 }
      );
    }

    // Create JIRA issue
    const jiraIssue = await createJiraIssue(
      body,
      user.email,
      user.name
    );

    return NextResponse.json(
      {
        message: "Support ticket created successfully",
        ticketId: jiraIssue.key,
        jiraIssueId: jiraIssue.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Support ticket error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to create support ticket. Please try again later.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

