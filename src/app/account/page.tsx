"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/hooks";

interface ProfileData {
  name: string;
  email: string;
  company: string;
  role: string;
}

export default function Page() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({ 
    name: "", 
    email: "", 
    company: "", 
    role: "" 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to fetch profile";
        const errorDetails = errorData.details ? `: ${errorData.details}` : "";
        throw new Error(`${errorMessage}${errorDetails}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfile();
    }
  }, [authLoading, user, fetchProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const data = await response.json();
      setProfileData({
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.role,
      });

      toast({
        title: "Profile updated",
        description: "Your account information has been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
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
                <h3 className="font-semibold text-lg mb-1">{profileData.name || "Loading..."}</h3>
                <p className="text-sm text-muted-foreground">{profileData.role || "Loading..."}</p>
                <Button variant="outline" className="w-full">Change Photo</Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">Loading profile data...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          disabled={isSaving}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email} 
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={isSaving}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          value={profileData.company} 
                          onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                          disabled={isSaving}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input 
                          id="role" 
                          value={profileData.role} 
                          onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity"
                      disabled={isSaving || isLoading}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                )}
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
    </ProtectedRoute>
  );
}

