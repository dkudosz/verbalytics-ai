import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { syncUserToDatabase } from "@/lib/auth/utils";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Sync user to database
      await syncUserToDatabase(data.user);
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return to sign in page on error
  return NextResponse.redirect(new URL("/signin", request.url));
}

