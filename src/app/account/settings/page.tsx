"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    autoSave: true,
    darkMode: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your preferences have been updated successfully." });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences and configurations.</p>
          </div>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch id="email-notifications" checked={settings.emailNotifications} onCheckedChange={() => handleToggle("emailNotifications")} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch id="push-notifications" checked={settings.pushNotifications} onCheckedChange={() => handleToggle("pushNotifications")} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and offers</p>
                  </div>
                  <Switch id="marketing-emails" checked={settings.marketingEmails} onCheckedChange={() => handleToggle("marketingEmails")} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-reports">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
                  </div>
                  <Switch id="weekly-reports" checked={settings.weeklyReports} onCheckedChange={() => handleToggle("weeklyReports")} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Preferences</h2>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save your work</p>
                  </div>
                  <Switch id="auto-save" checked={settings.autoSave} onCheckedChange={() => handleToggle("autoSave")} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                  </div>
                  <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={() => handleToggle("darkMode")} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-destructive/50">
              <CardHeader>
                <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
                <p className="text-sm text-muted-foreground">Irreversible actions</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">Delete All Data</Button>
                <Button variant="outline" className="w-full justify-start text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">Close Account</Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity">Save All Settings</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

