import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Verbalytics AI | Start Your Free Trial",
  description: "Sign in to Verbalytics AI to access AI-powered call transcription and agent analysis. Start your free trial today and transform your customer support operations.",
  keywords: [
    "sign in Verbalytics AI",
    "login",
    "free trial",
    "customer support analytics",
    "call transcription login",
  ],
  authors: [{ name: "Verbalytics AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://verbalytics.ai/signin",
    siteName: "Verbalytics AI",
    title: "Sign In - Verbalytics AI | Start Your Free Trial",
    description: "Sign in to Verbalytics AI to access AI-powered call transcription and agent analysis. Start your free trial today.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sign In to Verbalytics AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In - Verbalytics AI",
    description: "Sign in to Verbalytics AI to access AI-powered call transcription and agent analysis.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://verbalytics.ai/signin",
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

