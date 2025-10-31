import { Card, CardContent } from "@/components/ui/card";
import ValuesGrid from "@/components/sections/about/ValuesGrid";
import TeamGrid from "@/components/sections/about/TeamGrid";
import StatsBar from "@/components/sections/about/StatsBar";
import { Target, Heart, Lightbulb, Users } from "lucide-react";

export default function Page() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to empowering businesses with technology that drives real results.",
    },
    {
      icon: Heart,
      title: "Customer-First",
      description: "Your success is our success. We build relationships, not just software.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly evolving and improving to stay ahead of the curve.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe the best solutions come from working together.",
    },
  ];

  const team = [
    { name: "Alex Rivera", role: "CEO & Co-Founder", initials: "AR" },
    { name: "Jordan Lee", role: "CTO & Co-Founder", initials: "JL" },
    { name: "Sam Parker", role: "Head of Product", initials: "SP" },
    { name: "Morgan Taylor", role: "Head of Engineering", initials: "MT" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              About SaaSify
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to revolutionize how teams work together, making powerful tools accessible to businesses of all sizes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-20">
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2020, SaaSify began with a simple observation: businesses were struggling with complex, expensive software that didn't meet their needs. We knew there had to be a better way.
                  </p>
                  <p>
                    Our founders, veterans of the tech industry, set out to create a platform that combines enterprise-grade power with user-friendly simplicity. Today, we serve thousands of teams worldwide, from startups to Fortune 500 companies.
                  </p>
                  <p>
                    What started as a small team of passionate developers has grown into a diverse group of innovators, all united by the goal of helping businesses thrive in the digital age.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <ValuesGrid values={values} />

          <TeamGrid team={team} />

          <StatsBar />
        </div>
      </section>
    </div>
  );
}

