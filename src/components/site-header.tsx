"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ portalUrl }: { portalUrl: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/90 backdrop-blur-xl">
      <div className="site-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">+</span>
          <span>Doctor Tracker</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "nav-link-active" : ""}`}>{link.label}</Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <a href={portalUrl} className="button button-dark">Sign in <span aria-hidden="true">↗</span></a>
        </div>

        <button type="button" className="menu-button md:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
          <span className={open ? "rotate-45 translate-y-[5px]" : ""} />
          <span className={open ? "-rotate-45 -translate-y-[5px]" : ""} />
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-forest/10 bg-cream px-6 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 font-medium hover:bg-white" onClick={() => setOpen(false)}>{link.label}</Link>)}
            <a href={portalUrl} className="button button-dark mt-3 justify-center">Sign in <span aria-hidden="true">↗</span></a>
          </div>
        </nav>
      )}
    </header>
  );
}
