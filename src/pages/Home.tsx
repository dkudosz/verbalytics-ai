import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Zap, Shield, TrendingUp, Users, CheckCircle2, Star } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with our optimized infrastructure.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security to protect your valuable data.",
    },
    {
      icon: TrendingUp,
      title: "Scale Effortlessly",
      description: "Grow your business without worrying about infrastructure limits.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team in real-time, anywhere in the world.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content: "SaaSify transformed how we operate. The ROI was visible within weeks!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CTO, InnovateCo",
      content: "Best decision we made. The platform is intuitive and powerful.",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      role: "Product Manager, GrowthLab",
      content: "Outstanding support and features. Highly recommend to any growing team.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              Transform Your Business
              <br />
              With Modern SaaS
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline operations, boost productivity, and scale effortlessly with our cutting-edge platform designed for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signin">
                <Button size="lg" className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SaaSify?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed, all in one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-shadow duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Built for Growth, Designed for Success</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform combines powerful features with an intuitive interface, helping teams of all sizes achieve more.
              </p>
              <ul className="space-y-4">
                {["Real-time analytics and insights", "99.9% uptime guarantee", "24/7 customer support", "Seamless integrations", "Advanced automation tools"].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-hero rounded-2xl h-96 shadow-glow"></div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Thousands of Teams</h2>
            <p className="text-xl text-muted-foreground">See what our customers have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
            <CardContent className="py-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of teams already using SaaSify to transform their business.
              </p>
              <Link to="/signin">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Start Your Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
