"use client";

import { DashboardProvider } from "@/dashboard/dashboard-provider";
import { DashboardShell } from "@/dashboard/dashboard-shell";
import { AuthProvider } from "@/auth/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardProvider>
        <DashboardShell>{children}</DashboardShell>
      </DashboardProvider>
    </AuthProvider>
  );
}
