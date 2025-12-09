import { Card, CardContent } from "@/components/ui/card";
import ValuesGrid from "@/components/sections/about/ValuesGrid";
import StatsBar from "@/components/sections/about/StatsBar";
import { Target, Heart, Lightbulb, Users } from "lucide-react";
import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "About Us - Verbalytics AI | Revolutionizing Customer Support QA",
  description:
    "Learn about Verbalytics AI's mission to revolutionize customer support quality assurance through AI-powered call transcription and analysis. Founded in 2020, we help support teams worldwide improve customer satisfaction.",
  keywords: [
    "about Verbalytics AI",
    "customer support quality assurance",
    "call transcription company",
    "AI analytics startup",
    "support team tools",
    "customer service technology",
  ],
  authors: [{ name: "Verbalytics AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verbalytics.ai/about",
    siteName: "Verbalytics AI",
    title: "About Us - Verbalytics AI | Revolutionizing Customer Support QA",
    description:
      "Learn about Verbalytics AI's mission to revolutionize customer support quality assurance through AI-powered call transcription and analysis.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Verbalytics AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Verbalytics AI",
    description:
      "Learn about Verbalytics AI's mission to revolutionize customer support quality assurance.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://verbalytics.ai/about",
  },
};

export default function Page() {
  const values = [
    {
      icon: Target,
      title: "Quality Focus",
      description:
        "We're committed to helping support teams deliver exceptional customer experiences through intelligent analysis.",
    },
    {
      icon: Heart,
      title: "Customer-First",
      description:
        "Your support team's success directly impacts customer satisfaction. We build tools that help you excel.",
    },
    {
      icon: Lightbulb,
      title: "AI Innovation",
      description:
        "We leverage cutting-edge AI to provide insights that were previously impossible to discover.",
    },
    {
      icon: Users,
      title: "Agent Empowerment",
      description:
        "We believe in empowering agents with actionable feedback, not just monitoring them.",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Verbalytics AI",
    url: "https://verbalytics.ai",
    logo: "https://verbalytics.ai/logo.png",
    description:
      "AI-powered call transcription and agent analysis for customer support teams. Revolutionizing customer support quality assurance through intelligent automation.",
    foundingDate: "2020",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "hello@verbalytics.ai",
    },
    sameAs: [
      "https://twitter.com/verbalyticsai",
      "https://linkedin.com/company/verbalyticsai",
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-background">
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
                About Verbalytics AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're on a mission to revolutionize customer support quality
                assurance through AI-powered call transcription and analysis.
              </p>
            </div>

            <div className="max-w-4xl mx-auto mb-20">
              <Card className="shadow-card">
                <CardContent className="pt-6">
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Founded in 2020, Verbalytics AI was born from a critical
                      need in customer support: quality assurance teams were
                      spending countless hours manually reviewing call
                      recordings, struggling to identify patterns, and missing
                      opportunities to improve agent performance.
                    </p>
                    <p>
                      Our founders, experienced in both customer support
                      operations and AI technology, recognized that modern
                      support teams needed intelligent automation. They set out
                      to create a platform that not only transcribes calls
                      accurately but also provides actionable insights through
                      AI analysis.
                    </p>
                    <p>
                      Today, Verbalytics AI serves support teams worldwide, from
                      growing startups to Fortune 500 companies, helping them
                      improve customer satisfaction scores, reduce training
                      time, and ensure consistent service quality across all
                      interactions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ValuesGrid values={values} />

            <StatsBar />
          </div>
        </section>
      </div>
    </>
  );
}
