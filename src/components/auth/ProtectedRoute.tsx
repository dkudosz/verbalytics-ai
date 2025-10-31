"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/hooks";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ("subscriber" | "admin")[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
      return;
    }

    if (user && allowedRoles) {
      // Fetch user role from API
      fetch("/api/auth/user-role")
        .then((res) => res.json())
        .then((data) => {
          setRole(data.role);
          setRoleLoading(false);

          if (!allowedRoles.includes(data.role)) {
            router.push("/dashboard");
          }
        })
        .catch(() => {
          setRoleLoading(false);
        });
    } else {
      setRoleLoading(false);
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role as "subscriber" | "admin")) {
    return null;
  }

  return <>{children}</>;
}

