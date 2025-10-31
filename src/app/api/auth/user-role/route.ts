import { getUserWithRole } from "@/lib/auth/utils";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserWithRole();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ role: user.role });
}

