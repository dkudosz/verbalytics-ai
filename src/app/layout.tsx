import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Navigation from "../components/navigation";
import Footer from "../components/footer";

export const metadata: Metadata = {
  title: "Verbalytics AI",
  description:
    "AI-powered call transcription and agent analysis for customer support teams. Automatically transcribe calls, analyze agent performance, and get actionable insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Navigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
