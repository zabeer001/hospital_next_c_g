import Link from "next/link";

export function SiteFooter({ portalUrl }: { portalUrl: string }) {
  return (
    <footer className="bg-forest text-white">
      <div className="site-shell grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-semibold"><span className="brand-mark brand-mark-light" aria-hidden="true">+</span><span>Doctor Tracker</span></Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">A calmer, clearer way for healthcare teams to understand patients and coordinate care.</p>
        </div>
        <div><p className="footer-title">Explore</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/65"><Link href="/">Home</Link><Link href="/blog">Insights</Link><Link href="/contact">Contact</Link></div></div>
        <div><p className="footer-title">Portal</p><div className="mt-5 flex flex-col gap-3 text-sm text-white/65"><a href={portalUrl}>Sign in ↗</a><a href="mailto:hello@doctortracker.health">hello@doctortracker.health</a></div></div>
      </div>
      <div className="site-shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Doctor Tracker. All rights reserved.</p><p>Designed for focused care teams.</p></div>
    </footer>
  );
}
