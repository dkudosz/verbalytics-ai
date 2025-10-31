import { requireRole } from "@/lib/auth/utils";
import { UserRole } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect if user is not admin
  await requireRole([UserRole.admin]);

  return <>{children}</>;
}

