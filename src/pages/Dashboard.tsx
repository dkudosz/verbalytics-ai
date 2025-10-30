import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { icon: Users, label: "Total Users", value: "2,543", change: "+12.5%" },
    { icon: DollarSign, label: "Revenue", value: "$45,231", change: "+8.2%" },
    { icon: Activity, label: "Active Sessions", value: "892", change: "+3.1%" },
    { icon: TrendingUp, label: "Growth", value: "23.4%", change: "+2.4%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-shadow duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-card">
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

            <Card className="shadow-card">
              <CardHeader>
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/account" className="block p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <p className="font-medium">My Account</p>
                    <p className="text-xs text-muted-foreground">Manage your profile</p>
                  </Link>
                  <Link to="/settings" className="block p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                    <p className="font-medium">Settings</p>
                    <p className="text-xs text-muted-foreground">Configure your preferences</p>
                  </Link>
                  <div className="block p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer">
                    <p className="font-medium">Support</p>
                    <p className="text-xs text-muted-foreground">Get help from our team</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
