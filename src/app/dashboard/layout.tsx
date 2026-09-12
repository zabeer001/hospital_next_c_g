"use client";

import { DashboardProvider } from "@/dashboard/dashboard-provider";
import { DashboardShell } from "@/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardProvider><DashboardShell>{children}</DashboardShell></DashboardProvider>;
}
