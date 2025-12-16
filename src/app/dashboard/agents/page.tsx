import { requireAuth } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Bot } from "lucide-react";
import type { Metadata } from "next";
import { CsvUploadWrapper } from "@/components/dashboard/CsvUploadWrapper";

export const metadata: Metadata = {
  title: "Agents | Dashboard | Verbalytics AI",
  description:
    "Manage and configure your AI agents for call transcription and analysis.",
  openGraph: {
    title: "Agents | Dashboard | Verbalytics AI",
    description:
      "Manage and configure your AI agents for call transcription and analysis.",
  },
  alternates: {
    canonical: "https://verbalytics.ai/dashboard/agents",
  },
};

export default async function AgentsPage() {
  await requireAuth();

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-2">
                <Bot className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Agents</h1>
              </div>
              <p className="text-muted-foreground">
                Manage and configure your agents.
              </p>
            </div>

            <div className="space-y-6">
              <CsvUploadWrapper />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
