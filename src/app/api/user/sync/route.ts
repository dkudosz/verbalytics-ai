import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/utils";
import { syncUserToDatabase } from "@/lib/auth/utils";

export async function POST() {
  try {
    // Get authenticated Supabase user
    const supabaseUser = await getUser();
    
    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sync user to database
    const syncedUser = await syncUserToDatabase(supabaseUser);

    return NextResponse.json({
      message: "User synced successfully",
      user: {
        id: syncedUser.id,
        email: syncedUser.email,
        name: syncedUser.name,
        role: syncedUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { 
        error: "Failed to sync user",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

