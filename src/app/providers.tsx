"use client";

import { PropsWithChildren } from "react";
import { Toaster as ShadToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoogleReCaptchaProvider
          reCaptchaKey={recaptchaSiteKey}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          <ShadToaster />
          <Sonner />
          {children}
        </GoogleReCaptchaProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}


