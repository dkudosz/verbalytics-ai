import { requireAuth } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuration | Dashboard | Verbalytics AI",
  description:
    "Configure Verbalytics AI webhook settings, including endpoint, authentication, payload, and expected responses.",
  openGraph: {
    title: "Configuration | Dashboard | Verbalytics AI",
    description:
      "Configure Verbalytics AI webhook settings, including endpoint, authentication, payload, and expected responses.",
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
              <p className="text-muted-foreground">
                Configure your webhook settings and authentication details.
              </p>
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Transcription Webhook</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Use this endpoint to receive transcription requests from
                    Verbalytics AI. Ensure your server validates the bearer
                    token and responds with appropriate status codes.
                  </p>

                  <div>
                    <p className="font-medium text-foreground">Endpoint</p>
                    <p className="font-mono text-sm break-all">
                      https://hicore.systems/webhooks/verbalytics/transcribe
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="font-medium text-foreground">Method</p>
                      <p className="font-mono text-sm">POST</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Auth Header</p>
                      <p className="text-sm">
                        <span className="font-mono text-foreground">
                          Authorization: Bearer {"<user-token>"}
                        </span>
                        <br />
                        Token is generated for each user at signup.
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">Request Body</p>
                    <pre className="bg-muted/70 rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground">
                      {`{
  "agentId": "string"
}`}
                    </pre>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      Possible Responses
                    </p>
                    <div className="bg-muted/70 rounded-lg p-4 text-sm space-y-2 text-foreground">
                      <p className="font-mono">
                        200 OK — Request accepted for processing
                      </p>
                      <p className="font-mono">
                        400 Bad Request — Missing or invalid fields (e.g.,
                        agentId)
                      </p>
                      <p className="font-mono">
                        401 Unauthorized — Invalid or missing bearer token
                      </p>
                      <p className="font-mono">
                        404 Not Found — Provided agentId does not exist
                      </p>
                      <p className="font-mono">
                        429 Too Many Requests — Rate limit exceeded
                      </p>
                      <p className="font-mono">
                        500 Internal Server Error — Unexpected server error
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
