"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Copy, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SystemTokenDisplay() {
  const [systemToken, setSystemToken] = useState<string | null>(null);
  const [oldSystemTokens, setOldSystemTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchToken = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/system-token");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch system token");
      }

      setSystemToken(data.systemToken);
      setOldSystemTokens(data.oldSystemTokens || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load system token";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const response = await fetch("/api/user/system-token", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to regenerate system token");
      }

      toast({
        title: "Success",
        description: "System token regenerated successfully",
      });

      setSystemToken(data.systemToken);
      setOldSystemTokens(data.oldSystemTokens || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to regenerate system token";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      toast({
        title: "Copied!",
        description: "Token copied to clipboard",
      });
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy token to clipboard",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Token</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={regenerating}
                >
                  {systemToken ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Token
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Generate Token
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {systemToken ? "Regenerate System Token?" : "Generate System Token?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-2">
                      {systemToken ? (
                        <>
                          <div className="font-semibold text-foreground">
                            This action is irreversible!
                          </div>
                          <div>
                            Regenerating your system token will invalidate the current token. Any
                            systems or integrations using the current token will need to be updated
                            with the new token immediately.
                          </div>
                        </>
                      ) : (
                        <div>
                          A new system token will be generated for your account. This token is used
                          for authenticating webhook requests.
                        </div>
                      )}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={regenerating}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {regenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {systemToken ? "Regenerating..." : "Generating..."}
                      </>
                    ) : (
                      systemToken ? "Regenerate Token" : "Generate Token"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          {systemToken ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Current Token</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-muted/70 rounded-lg p-3 text-sm font-mono break-all">
                    {systemToken}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyToken(systemToken)}
                    className="shrink-0"
                  >
                    {copiedToken === systemToken ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Usage:</p>
                <code className="bg-muted/70 rounded px-2 py-1 text-xs">
                  Authorization: Bearer {systemToken.substring(0, 20)}...
                </code>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No system token generated yet.</p>
              <p className="text-sm mt-2">Click "Generate Token" to create one.</p>
            </div>
          )}
        </CardContent>
      </Card>
  );
}

