import { requireAuth } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transcripts | Dashboard | Verbalytics AI",
  description: "View and manage your call transcripts and analysis results.",
  openGraph: {
    title: "Transcripts | Dashboard | Verbalytics AI",
    description: "View and manage your call transcripts and analysis results.",
  },
  alternates: {
    canonical: "https://verbalytics.ai/dashboard/transcripts",
  },
};

export default async function TranscriptsPage() {
  await requireAuth();

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
              <p className="text-muted-foreground">View and manage your call transcripts.</p>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Transcript Management</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Transcript management interface coming soon.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}



