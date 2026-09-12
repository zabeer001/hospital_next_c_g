"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function AppFrame({ children, portalUrl }: { children: React.ReactNode; portalUrl: string }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/dashboard") || pathname === "/signin";
  if (isPortal) return <>{children}</>;
  return <><SiteHeader portalUrl={portalUrl} /><div id="main-content">{children}</div><SiteFooter portalUrl={portalUrl} /></>;
}
