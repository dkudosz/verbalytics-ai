import { requireAuth } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuration | Dashboard | Verbalytics AI",
  description: "Configure your Verbalytics AI settings and preferences.",
  openGraph: {
    title: "Configuration | Dashboard | Verbalytics AI",
    description: "Configure your Verbalytics AI settings and preferences.",
  },
  alternates: {
    canonical: "https://verbalytics.ai/dashboard/configuration",
  },
};

export default async function ConfigurationPage() {
  await requireAuth();

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold">Configuration</h1>
              </div>
              <p className="text-muted-foreground">Configure your settings and preferences.</p>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Settings</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configuration interface coming soon.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}





