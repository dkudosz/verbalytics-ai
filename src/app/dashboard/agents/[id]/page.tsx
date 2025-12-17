import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenericTable } from "@/components/dashboard/GenericTable";
import type { Metadata } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PageProps = {
  params: {
    id: string;
  };
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

  const agent = await prisma.agent.findFirst({
    where: {
      id: params.id,
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

  const callColumns = [
    { key: "date", header: "Date" },
    { key: "callerId", header: "Caller ID" },
    { key: "duration", header: "Call Duration" },
    { key: "score", header: "Score" },
    { key: "transcript", header: "Transcript" },
  ];

  const callData: Array<{
    date: string;
    callerId: string;
    duration: string;
    score: string;
    transcript: string;
  }> = [];

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
                <CardContent className="text-sm text-muted-foreground">
                  Call statistics coming soon.
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <GenericTable columns={callColumns} data={callData} emptyMessage="No calls yet." />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

