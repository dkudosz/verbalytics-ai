import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Verbalytics AI | Get in Touch",
  description: "Have questions about Verbalytics AI? Contact our team. We're here to help you improve your customer support operations with AI-powered call transcription and analysis.",
  keywords: [
    "contact Verbalytics AI",
    "customer support software contact",
    "call transcription support",
    "AI analytics support",
    "Verbalytics AI help",
  ],
  authors: [{ name: "Verbalytics AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verbalytics.ai/contact",
    siteName: "Verbalytics AI",
    title: "Contact Us - Verbalytics AI | Get in Touch",
    description: "Have questions about Verbalytics AI? Contact our team. We're here to help you improve your customer support operations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Verbalytics AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Verbalytics AI",
    description: "Have questions about Verbalytics AI? Contact our team. We're here to help.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://verbalytics.ai/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

