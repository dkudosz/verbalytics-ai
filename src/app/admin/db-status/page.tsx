"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/protected-route";

export default function DBStatusPage() {
  const [status, setStatus] = useState<
    "idle" | "checking" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [timestamp, setTimestamp] = useState<string>("");

  const checkConnection = async () => {
    setStatus("checking");
    setMessage("");

    try {
      const response = await fetch("/api/health/db");
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || data.message);
      }
      setTimestamp(data.timestamp);
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Failed to check database connection");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container mx-auto py-12 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={checkConnection} disabled={status === "checking"}>
                {status === "checking" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Database Connection"
                )}
              </Button>

              {status === "success" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Connected</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>Connection Failed</span>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  status === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-medium">{message}</p>
                {timestamp && (
                  <p className="text-sm mt-2 opacity-75">
                    Checked at: {new Date(timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>How to test:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Click the button above to test the connection</li>
                <li>
                  Or visit{" "}
                  <code className="bg-muted px-1 rounded">/api/health/db</code>{" "}
                  directly
                </li>
                <li>
                  Or run{" "}
                  <code className="bg-muted px-1 rounded">npm run db:test</code>{" "}
                  in terminal
                </li>
                <li>
                  Or open Prisma Studio:{" "}
                  <code className="bg-muted px-1 rounded">
                    npm run prisma:studio
                  </code>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
