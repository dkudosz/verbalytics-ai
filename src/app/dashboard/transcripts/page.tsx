import Link from "next/link";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GenericTable } from "@/components/dashboard/GenericTable";
import { FileText, Clock3, IdCard } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import type { Metadata } from "next";
import { TranscriptFilters } from "./TranscriptFilters";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Transcripts | Dashboard | Verbalytics AI",
  description:
    "Browse and filter your call transcripts by date range or Transcript ID.",
  openGraph: {
    title: "Transcripts | Dashboard | Verbalytics AI",
    description:
      "Browse and filter your call transcripts by date range or Transcript ID.",
  },
  alternates: {
    canonical: "https://verbalytics.ai/dashboard/transcripts",
  },
};

type SearchParams = {
  from?: string;
  to?: string;
  transcriptId?: string;
};

export default async function TranscriptsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAuth();
  const user = await getUserWithRole();

  if (!user) {
    return null;
  }

  const resolvedSearchParams = await searchParams;
  const fromParam = resolvedSearchParams?.from;
  const toParam = resolvedSearchParams?.to;
  const transcriptIdQuery = resolvedSearchParams?.transcriptId?.trim();

  const fromDate = fromParam ? new Date(fromParam) : undefined;
  const toDateRaw = toParam ? new Date(toParam) : undefined;
  const toDate =
    toDateRaw && !Number.isNaN(toDateRaw.getTime())
      ? new Date(new Date(toDateRaw).setUTCHours(23, 59, 59, 999))
      : undefined;

  const timestampFilter: { gte?: Date; lte?: Date } = {};
  if (fromDate && !Number.isNaN(fromDate.getTime())) {
    timestampFilter.gte = fromDate;
  }
  if (toDate && !Number.isNaN(toDate.getTime())) {
    timestampFilter.lte = toDate;
  }

  type WhereClause = {
    userId: string;
    timestamp?: { gte?: Date; lte?: Date };
    transcriptId?: {
      contains: string;
      mode: "insensitive";
    };
  };

  const whereClause: WhereClause = {
    userId: user.id,
  };

  if (timestampFilter.gte || timestampFilter.lte) {
    whereClause.timestamp = timestampFilter;
  }

  if (transcriptIdQuery) {
    whereClause.transcriptId = {
      contains: transcriptIdQuery,
      mode: "insensitive",
    };
  }

  const transcripts = await prisma.transcript.findMany({
    where: whereClause,
    include: {
      agent: true,
    },
    orderBy: { timestamp: "desc" },
  });

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const columns = [
    { key: "timestamp", header: "Timestamp" },
    { key: "transcriptId", header: "Transcript ID" },
    { key: "agent", header: "Agent" },
  ];

  const tableData = transcripts.map((transcript) => ({
    timestamp: dateFormatter.format(transcript.timestamp),
    transcriptId: transcript.transcriptId,
    agent: (
      <div className="flex flex-col">
        <span className="font-medium">
          {transcript.agentName} {transcript.agentSurname}
        </span>
        <Link
          className="text-primary text-sm hover:underline"
          href={`/dashboard/agents/${transcript.agentId}`}
        >
          View agent details
        </Link>
      </div>
    ),
  }));

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Transcripts</h1>
              </div>
              <p className="text-muted-foreground">
                View and manage your call transcripts.
              </p>
            </div>

            <div className="mb-6 rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Timestamp values may be delayed; when possible, search or filter
              by Transcript ID for the most reliable match.
            </div>

            <TranscriptFilters
              fromParam={fromParam}
              toParam={toParam}
              transcriptIdQuery={transcriptIdQuery}
            />

            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">Recent Transcripts</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground">
                    {transcripts.length}
                  </span>
                </div>
                <IdCard className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <GenericTable
                    columns={columns}
                    data={tableData}
                    emptyMessage="No transcripts yet. New transcripts will appear here once they are generated."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
