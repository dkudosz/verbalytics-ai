import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/dashboard/generic-table";
import type { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Download, Loader2, CheckCircle } from "lucide-react";

const prisma = new PrismaClient();

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Agent Details | Dashboard | Verbalytics AI",
  description: "View agent details and statistics.",
};

export default async function AgentDetailPage({ params }: PageProps) {
  await requireAuth();
  const user = await getUserWithRole();

  if (!user) {
    return null;
  }

  const resolvedParams = await params;

  const agent = await prisma.agent.findFirst({
    where: {
      id: resolvedParams.id,
      userId: user.id,
    },
  });

  if (!agent) {
    return (
      <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
        <div className="min-h-screen bg-background">
          <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Agent not found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">This agent does not exist or you do not have access.</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // Fetch transcripts for this agent
  const transcripts = await prisma.transcript.findMany({
    where: {
      agentId: agent.id,
      userId: user.id,
    },
    orderBy: {
      timestamp: "desc",
    },
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const callColumns = [
    { key: "date", header: "Date" },
    { key: "transcriptId", header: "Transcript ID" },
    { key: "status", header: "Status" },
    { key: "download", header: "Download" },
  ];

  const callData = transcripts.map((transcript) => ({
    date: dateFormatter.format(transcript.timestamp),
    transcriptId: (
      <Link
        href={`/dashboard/transcripts?transcriptId=${encodeURIComponent(transcript.transcriptId)}`}
        className="text-primary hover:underline font-mono text-sm"
      >
        {transcript.transcriptId}
      </Link>
    ),
    status: transcript.status === "COMPLETED" ? (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Completed</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">In Progress</span>
      </div>
    ),
    download: transcript.status === "COMPLETED" && transcript.downloadUrl ? (
      <a
        href={transcript.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    ) : (
      <span className="text-muted-foreground text-sm">N/A</span>
    ),
  }));

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{agent.agentName} {agent.agentSurname}</h1>
              <p className="text-muted-foreground">Agent ID: {agent.agentId}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium break-words">{agent.agentEmail}</span>
                  </div>
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium break-words">{agent.agentPhone || "—"}</span>
                  </div>
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                    <span className="text-muted-foreground">Slack</span>
                    <span className="font-medium break-words">{agent.agentSlack || "—"}</span>
                  </div>
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                    <span className="text-muted-foreground">Discord</span>
                    <span className="font-medium break-words">{agent.agentDiscord || "—"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Call Statistics</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <div className="grid grid-cols-[120px,1fr] gap-2 items-center">
                    <span className="text-muted-foreground">Total Calls</span>
                    <span className="font-medium">{transcripts.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Transcripts ({transcripts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <GenericTable columns={callColumns} data={callData} emptyMessage="No transcripts yet." />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

