import { requireAuth } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { ScriptsTable } from "@/components/dashboard/scripts-table";
import { SystemTokenDisplay } from "@/components/dashboard/system-token-display";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Configuration | Dashboard | Verbalytics AI",
  description:
    "Configure Verbalytics AI webhook settings, manage scripts, including endpoint, authentication, payload, and expected responses.",
  openGraph: {
    title: "Configuration | Dashboard | Verbalytics AI",
    description:
      "Configure Verbalytics AI webhook settings, manage scripts, including endpoint, authentication, payload, and expected responses.",
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
                Configure your webhook settings, authentication details, and manage scripts.
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
                      <p className="font-medium text-foreground mb-2">Auth Header</p>
                      <p className="text-sm mb-4">
                        <span className="font-mono text-foreground">
                          Authorization: Bearer {"<system-token>"}
                        </span>
                        <br />
                        <span className="text-muted-foreground">
                          Token is generated for each user. Use the System Token section below to generate or regenerate your token.
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-foreground mb-2">Request Body</p>
                    <pre className="bg-muted/70 rounded-lg p-4 text-sm font-mono overflow-x-auto text-foreground mb-4">
                      {`{
  "agentId": "string",
  "file": "string",
  "callDate": "string",
  "scriptId": "string | null"
}`}
                    </pre>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parameter</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium font-mono text-sm">
                              agentId
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              string
                            </TableCell>
                            <TableCell className="text-sm">
                              The unique identifier of the agent associated with the transcription request.
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium font-mono text-sm">
                              file
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              string
                            </TableCell>
                            <TableCell className="text-sm">
                              The file path or identifier of the audio/video file to be transcribed.
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium font-mono text-sm">
                              callDate
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              string
                            </TableCell>
                            <TableCell className="text-sm">
                              The date and time when the call was made, typically in ISO 8601 format.
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium font-mono text-sm">
                              scriptId
                            </TableCell>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              string | null
                            </TableCell>
                            <TableCell className="text-sm">
                              Optional identifier of the script to be used for this transcription. Can be null if no script is associated.
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
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

            <div className="mt-6">
              <SystemTokenDisplay />
            </div>

            <div className="mt-6">
              <ScriptsTable />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
