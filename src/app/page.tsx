import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, FileText, Brain, Bell, Star } from "lucide-react";
import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Verbalytics AI - AI-Powered Call Transcription & Agent Analysis",
  description: "Transform customer support calls into actionable insights. Automatically transcribe calls, analyze agent performance, and get AI-powered suggestions to improve your team's effectiveness. Trusted by support teams worldwide.",
  keywords: [
    "call transcription",
    "customer support analytics",
    "AI call analysis",
    "agent performance",
    "call center software",
    "speech to text",
    "customer service analytics",
    "support quality assurance",
    "call recording analysis",
    "AI-powered transcription",
  ],
  authors: [{ name: "Verbalytics AI" }],
  creator: "Verbalytics AI",
  publisher: "Verbalytics AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verbalytics.ai",
    siteName: "Verbalytics AI",
    title: "Verbalytics AI - AI-Powered Call Transcription & Agent Analysis",
    description: "Transform customer support calls into actionable insights. Automatically transcribe calls, analyze agent performance, and get AI-powered suggestions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Verbalytics AI - Call Transcription & Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verbalytics AI - AI-Powered Call Transcription & Agent Analysis",
    description: "Transform customer support calls into actionable insights with AI-powered transcription and analysis.",
    images: ["/og-image.png"],
    creator: "@verbalyticsai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://verbalytics.ai",
  },
  category: "Technology",
};

export default function Page() {
  const features = [
    { icon: Mic, title: "Audio Transcription", description: "Accurate, real-time transcription of customer support calls with advanced speech recognition technology." },
    { icon: FileText, title: "Agent Script Analysis", description: "Automatically download and analyze agent scripts to ensure compliance and quality standards." },
    { icon: Brain, title: "AI-Powered Insights", description: "Get intelligent suggestions and actionable recommendations to improve agent performance." },
    { icon: Bell, title: "Smart Notifications", description: "Receive instant alerts via email, Slack, Discord, and more when action is needed." },
  ];

  const workflow = [
    { step: 1, title: "Transcribe Audio", description: "Upload call recordings and get accurate transcriptions in minutes." },
    { step: 2, title: "Download Agent Details", description: "Automatically retrieve agent information and context for each call." },
    { step: 3, title: "Analyze Scripts", description: "Compare agent performance against approved scripts and guidelines." },
    { step: 4, title: "AI Analysis", description: "Our AI analyzes transcripts to identify opportunities for improvement." },
    { step: 5, title: "Get Suggestions", description: "Receive personalized recommendations and action items for agents." },
    { step: 6, title: "Team Notifications", description: "Automatically notify relevant team members via your preferred channels." },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Customer Support Manager, TechCorp", content: "Verbalytics AI has revolutionized our quality assurance process. We catch issues faster and our agents are improving every day!", rating: 5 },
    { name: "Michael Chen", role: "Head of Operations, SupportHub", content: "The AI insights are incredibly accurate. Our customer satisfaction scores have increased by 30% since implementing Verbalytics AI.", rating: 5 },
    { name: "Emma Wilson", role: "VP of Customer Success, GrowthCo", content: "The automated notifications save us hours every week. Best investment we've made for our support team.", rating: 5 },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Verbalytics AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "49",
      priceCurrency: "USD",
    },
    description: "AI-powered call transcription and agent analysis for customer support teams. Automatically transcribe calls, analyze agent performance, and get actionable insights.",
    featureList: [
      "Audio Transcription",
      "Agent Script Analysis",
      "AI-Powered Insights",
      "Smart Notifications",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "3",
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-background">
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
              AI-Powered Call Transcription
              <br />
              & Agent Analysis
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform customer support calls into actionable insights. Automatically transcribe calls, analyze agent performance, and get AI-powered suggestions to improve your team's effectiveness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signin">
                <Button size="lg" className="bg-gradient-primary shadow-glow hover:opacity-90 transition-opacity text-lg px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Support Teams</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to monitor, analyze, and improve customer support interactions.
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

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our automated workflow processes your calls and delivers actionable insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {workflow.map((item, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Support Teams Worldwide</h2>
            <p className="text-xl text-muted-foreground">See how Verbalytics AI is transforming customer support operations</p>
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

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
            <CardContent className="py-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join support teams already using Verbalytics AI to improve customer satisfaction and agent performance.
              </p>
              <Link href="/signin">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Start Your Free Trial
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
    </>
  );
}

