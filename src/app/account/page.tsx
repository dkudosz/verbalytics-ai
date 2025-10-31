"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/hooks";

export default function Page() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({ name: "John Doe", email: "john@example.com", company: "Acme Inc.", role: "Product Manager" });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile updated", description: "Your account information has been saved successfully." });
  };

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">Manage your account information and preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardContent className="pt-6 text-center">
                <div className="h-32 w-32 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground text-4xl font-bold">
                  <User className="h-16 w-16" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{profileData.name}</h3>
                <p className="text-sm text-muted-foreground">{profileData.role}</p>
                <Button variant="outline" className="w-full">Change Photo</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={profileData.company} onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profileData.role} onChange={(e) => setProfileData({ ...profileData, role: e.target.value })} />
                    </div>
                  </div>
                  <Button type="submit" className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Subscription</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Plan</span>
                    <span className="font-semibold">Professional</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Billing Cycle</span>
                    <span className="font-semibold">Monthly</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Payment</span>
                    <span className="font-semibold">Nov 1, 2025</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">Manage Subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Security</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">Change Password</Button>
                  <Button variant="outline" className="w-full justify-start">Two-Factor Authentication</Button>
                  <Button variant="outline" className="w-full justify-start">Active Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}

