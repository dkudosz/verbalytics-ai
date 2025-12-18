import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Users, FileText, CreditCard } from "lucide-react";
import { requireAuth, getUserWithRole } from "@/lib/auth/utils";
import ProtectedRoute from "@/components/auth/protected-route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page() {
  await requireAuth();
  const user = await getUserWithRole();

  if (!user) {
    return null;
  }

  // Fetch total agents count for the current user
  const totalAgents = await prisma.agent.count({
    where: {
      userId: user.id,
    },
  });

  // Fetch total completed transcripts count for the current user
  const totalCompletedTranscripts = await prisma.transcript.count({
    where: {
      userId: user.id,
      status: "COMPLETED",
    },
  });

  // Get user subscription info from metadata or use defaults
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      metadata: true,
      createdAt: true,
      role: true,
    },
  });

  const metadata = (fullUser?.metadata as Record<string, any> | null) || {};
  const subscriptionPlan = metadata?.subscription?.plan || "Professional";
  const billingCycle = metadata?.subscription?.billingCycle || "Monthly";
  const subscriptionStartDate = metadata?.subscription?.startDate 
    ? new Date(metadata.subscription.startDate)
    : fullUser?.createdAt || new Date();
  
  // Calculate next renewal date (assuming monthly billing)
  // Start from the subscription start date and find the next renewal
  const now = new Date();
  let nextRenewalDate = new Date(subscriptionStartDate);
  
  // Keep adding months until we get a future date
  while (nextRenewalDate <= now) {
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
  }
  
  // Format renewal date
  const renewalDateFormatted = nextRenewalDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const stats = [
    { 
      icon: Users, 
      label: "Total Agents", 
      value: totalAgents.toString(), 
      change: null 
    },
    { 
      icon: FileText, 
      label: "Total Completed Transcripts", 
      value: totalCompletedTranscripts.toString(), 
      change: null 
    },
    { 
      icon: CreditCard, 
      label: "Current Subscription", 
      value: `${subscriptionPlan} (${billingCycle})`,
      change: `Renews ${renewalDateFormatted}`,
    },
    { 
      icon: TrendingUp, 
      label: "Growth", 
      value: "23.4%", 
      change: "+2.4%" 
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["subscriber", "admin"]}>
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-12 px-4 md:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 animate-fade-up">
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="shadow-card hover:shadow-glow transition-shadow duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <stat.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      {stat.change && (
                        <span className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-muted-foreground"}`}>
                          {stat.change}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Recent Activity</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New user registration", time: "2 minutes ago" },
                    { action: "Payment received", time: "15 minutes ago" },
                    { action: "New feature deployed", time: "1 hour ago" },
                    { action: "System update completed", time: "3 hours ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <span className="text-sm">{activity.action}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
