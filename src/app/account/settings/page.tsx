"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ProtectedRoute from "@/components/auth/protected-route";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth/hooks";
import { Loader2 } from "lucide-react";

export default function Page() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    autoSave: true,
    darkMode: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/settings");

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data);
    } catch {
      // Error handled by toast notification, using default settings
      toast({
        title: "Error",
        description: "Failed to load settings. Using defaults.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchSettings();
    }
  }, [authLoading, user, fetchSettings]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save settings.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save settings");
      }

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountRequest = async (requestType: "delete" | "close") => {
    if (confirmationText !== "delete") {
      toast({
        title: "Invalid confirmation",
        description: "Please type 'delete' to confirm.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmittingRequest(true);
      const response = await fetch("/api/user/account-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType,
          confirmation: confirmationText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit request");
      }

      setRequestSubmitted(true);
      setConfirmationText("");
      if (requestType === "delete") {
        setDeleteDialogOpen(false);
      } else {
        setCloseDialogOpen(false);
      }

      toast({
        title: "Request submitted",
        description:
          "Your request has been sent and will be fulfilled within 5 working days.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences and configurations.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    Configure how you receive notifications
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={() => handleToggle("emailNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={() => handleToggle("pushNotifications")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and offers
                      </p>
                    </div>
                    <Switch
                      id="marketing-emails"
                      checked={settings.marketingEmails}
                      onCheckedChange={() => handleToggle("marketingEmails")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly performance summaries
                      </p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={settings.weeklyReports}
                      onCheckedChange={() => handleToggle("weeklyReports")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Preferences</h2>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto Save</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save your work
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={settings.autoSave}
                      onCheckedChange={() => handleToggle("autoSave")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch to dark theme
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={settings.darkMode}
                      onCheckedChange={() => handleToggle("darkMode")}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-destructive/50">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-destructive">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Irreversible actions
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={requestSubmitted}
                  >
                    Delete All Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setCloseDialogOpen(true)}
                    disabled={requestSubmitted}
                  >
                    Close Account
                  </Button>
                </CardContent>
              </Card>

              {/* Delete All Data Confirmation Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-destructive">
                      Delete All Data
                    </DialogTitle>
                    <DialogDescription>
                      This action will permanently delete all your data. This
                      cannot be undone. To confirm, please type{" "}
                      <strong>delete</strong> in the box below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="delete-confirmation">
                        Type 'delete' to confirm
                      </Label>
                      <Input
                        id="delete-confirmation"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="delete"
                        disabled={isSubmittingRequest}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDeleteDialogOpen(false);
                        setConfirmationText("");
                      }}
                      disabled={isSubmittingRequest}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAccountRequest("delete")}
                      disabled={
                        isSubmittingRequest || confirmationText !== "delete"
                      }
                    >
                      {isSubmittingRequest ? "Submitting..." : "Confirm Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Close Account Confirmation Dialog */}
              <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-destructive">
                      Close Account
                    </DialogTitle>
                    <DialogDescription>
                      This action will close your account permanently. This
                      cannot be undone. To confirm, please type{" "}
                      <strong>delete</strong> in the box below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="close-confirmation">
                        Type 'delete' to confirm
                      </Label>
                      <Input
                        id="close-confirmation"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder="delete"
                        disabled={isSubmittingRequest}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCloseDialogOpen(false);
                        setConfirmationText("");
                      }}
                      disabled={isSubmittingRequest}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleAccountRequest("close")}
                      disabled={
                        isSubmittingRequest || confirmationText !== "delete"
                      }
                    >
                      {isSubmittingRequest ? "Submitting..." : "Confirm Close"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity"
                  disabled={isSaving || isLoading}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save All Settings"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
