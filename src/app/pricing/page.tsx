import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Pricing - Verbalytics AI | Transparent Call Transcription Plans",
  description:
    "Choose the perfect plan based on your call volume. Starting at $49/month for up to 500 calls. All plans include AI transcription, agent analysis, and actionable insights. Free trial available.",
  keywords: [
    "call transcription pricing",
    "customer support analytics pricing",
    "AI transcription cost",
    "call analysis software pricing",
    "support team pricing plans",
    "transcription service pricing",
  ],
  authors: [{ name: "Verbalytics AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verbalytics.ai/pricing",
    siteName: "Verbalytics AI",
    title: "Pricing - Verbalytics AI | Transparent Call Transcription Plans",
    description:
      "Choose the perfect plan based on your call volume. Starting at $49/month. All plans include AI transcription, agent analysis, and actionable insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Verbalytics AI Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Verbalytics AI",
    description:
      "Choose the perfect plan based on your call volume. Starting at $49/month. Free trial available.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://verbalytics.ai/pricing",
  },
};

export default function Page() {
  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small support teams",
      features: [
        "Up to 500 calls/month",
        "AI transcription",
        "Basic AI analysis",
        "Email notifications",
        "Email support",
        "Slack integration",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$149",
      description: "Ideal for growing support operations",
      features: [
        "Up to 5,000 calls/month",
        "AI transcription",
        "Advanced AI analysis",
        "Multi-channel notifications",
        "Priority support",
        "Slack & Discord integration",
        "Custom agent scripts",
        "API access",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large support organizations",
      features: [
        "Unlimited calls",
        "AI transcription",
        "Enterprise AI analysis",
        "All notification channels",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced security & compliance",
        "SLA guarantee",
        "Dedicated account manager",
      ],
      highlighted: false,
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Call Transcription and Analysis",
    provider: {
      "@type": "Organization",
      name: "Verbalytics AI",
      url: "https://verbalytics.ai",
    },
    areaServed: "Worldwide",
    offers: [
      {
        "@type": "Offer",
        name: "Starter Plan",
        price: "49",
        priceCurrency: "USD",
        description:
          "Up to 500 calls/month with AI transcription and basic analysis",
      },
      {
        "@type": "Offer",
        name: "Professional Plan",
        price: "149",
        priceCurrency: "USD",
        description: "Up to 5,000 calls/month with advanced AI analysis",
      },
      {
        "@type": "Offer",
        name: "Enterprise Plan",
        price: "Custom",
        priceCurrency: "USD",
        description:
          "Unlimited calls with enterprise AI analysis and dedicated support",
      },
    ],
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-background">
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-up">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-(1.5)">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan based on your call volume. All plans
                include AI transcription and analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    plan.highlighted
                      ? "shadow-glow border-primary scale-105 md:scale-110"
                      : "shadow-card"
                  } transition-all duration-300 animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-8 pt-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Link href="/signin">
                      <Button
                        className={`w-full mb-6 ${
                          plan.highlighted
                            ? "bg-gradient-primary shadow-glow"
                            : ""
                        }`}
                        variant={plan.highlighted ? "default" : "outline"}
                      >
                        {plan.price === "Custom"
                          ? "Contact Sales"
                          : "Start Free Trial"}
                      </Button>
                    </Link>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3"
                        >
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                All plans include AI-powered transcription, agent analysis, and
                actionable insights
              </p>
              <Link href="/contact">
                <Button variant="link" className="text-primary">
                  Have questions? Contact our sales team →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
