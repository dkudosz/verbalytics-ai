import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Lightbulb, Users } from "lucide-react";

const About = () => {
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
      <Navigation />

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

          {/* Story Section */}
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

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="shadow-card hover:shadow-glow transition-shadow duration-300">
                  <CardContent className="pt-6 text-center">
                    <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <value.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="pt-6 text-center">
                    <div className="h-24 w-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto text-primary-foreground text-2xl font-bold">
                      {member.initials}
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-gradient-secondary rounded-2xl p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  99.9%
                </div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  150+
                </div>
                <div className="text-muted-foreground">Countries</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  4.9/5
                </div>
                <div className="text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
