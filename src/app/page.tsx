import Link from "next/link";
import { PortalCta } from "@/components/portal-cta";
import { getFeaturedPosts } from "@/content/posts";

const features = [
  { number: "01", title: "One connected view", text: "Bring doctor profiles and patient relationships together, so the right context is always close at hand.", tone: "sage" },
  { number: "02", title: "Find answers quickly", text: "Focused search and filters help teams move through growing records without losing their place or momentum.", tone: "amber" },
  { number: "03", title: "See the bigger picture", text: "Clear visual summaries turn everyday activity into useful signals for planning and better care coordination.", tone: "coral" },
];

const steps = [
  { step: "01", title: "Bring your team together", text: "Give authorized staff one dependable place to begin each day." },
  { step: "02", title: "Keep care organized", text: "Connect patients to their doctors and maintain the details that matter." },
  { step: "03", title: "Act with context", text: "Use clear, timely insight to support every operational decision." },
];

export default function Home() {
  const portalUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL || "/dashboard";
  const featuredPosts = getFeaturedPosts().slice(0, 2);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="site-shell grid gap-14 pb-24 pt-16 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:pb-32 lg:pt-24">
          <div className="relative z-10">
            <p className="eyebrow">Healthcare, clearly connected</p>
            <h1 className="display-title mt-7 max-w-3xl">Better care starts with a clearer picture.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted sm:text-xl">Doctor Tracker brings clinical teams, patient relationships, and meaningful insights into one calm, organized workspace.</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={portalUrl} className="button button-coral">Open your portal <span aria-hidden="true">→</span></a>
              <Link href="#features" className="button button-outline">Explore the platform</Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-forest/10 pt-6 text-sm text-muted"><span>✓ Built for care teams</span><span>✓ Focused by design</span><span>✓ Responsive everywhere</span></div>
          </div>

          <div className="dashboard-art" aria-label="Illustration of the Doctor Tracker portal">
            <div className="dashboard-backdrop" />
            <div className="dashboard-panel">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">Wednesday overview</p><p className="mt-1 text-xl font-medium">Good morning, Samira</p></div>
                <span className="avatar">SH</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="metric-card bg-white text-forest"><p className="text-sm text-muted">Active patients</p><p className="mt-5 text-3xl font-semibold sm:text-4xl">1,248</p><p className="mt-2 text-xs font-medium text-teal">↑ 8.4% this month</p></div>
                <div className="metric-card bg-amber text-forest"><p className="text-sm">Care team</p><p className="mt-5 text-3xl font-semibold sm:text-4xl">42</p><p className="mt-2 text-xs">Across 8 specialties</p></div>
              </div>
              <div className="mt-4 rounded-[1.5rem] bg-white/10 p-5">
                <div className="mb-5 flex items-center justify-between"><p className="text-sm font-medium">Patient activity</p><p className="text-xs text-white/50">Last 7 days</p></div>
                <div className="flex h-24 items-end justify-between gap-2" aria-hidden="true">{[38, 54, 44, 72, 62, 85, 76, 94].map((height, i) => <span key={i} className={`w-full rounded-t-lg ${i === 7 ? "bg-coral" : "bg-sage"}`} style={{ height: `${height}%` }} />)}</div>
                <div className="mt-3 flex justify-between text-[10px] text-white/40"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div>
              </div>
              <div className="floating-patient-card"><span className="grid size-9 place-items-center rounded-full bg-sage font-semibold">AM</span><div><p className="text-xs text-muted">Next patient</p><p className="text-sm font-semibold">Amina M. · 10:30</p></div><span className="ml-auto text-teal">●</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-forest/10 bg-white py-7">
        <div className="site-shell flex flex-wrap items-center justify-center gap-x-14 gap-y-4 text-sm font-semibold text-forest/40"><span className="w-full text-center text-[10px] uppercase tracking-[.2em] sm:w-auto">Designed for modern care</span><span>Community clinics</span><span>Specialist centers</span><span>Growing hospitals</span></div>
      </section>

      <section id="features" className="section-space">
        <div className="site-shell">
          <div className="section-heading"><div><p className="eyebrow">Clarity where it counts</p><h2 className="section-title mt-5 max-w-3xl">Less time piecing things together. More time moving care forward.</h2></div><p className="max-w-md text-base leading-7 text-muted">Healthcare work is complex enough. Doctor Tracker is designed to make the information around it feel simple, dependable, and genuinely useful.</p></div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">{features.map((feature) => <article key={feature.number} className={`feature-card feature-${feature.tone}`}><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.15em]">{feature.number}</span><span className="feature-icon" aria-hidden="true">{feature.number === "01" ? "◎" : feature.number === "02" ? "⌕" : "↗"}</span></div><h3 className="mt-16 text-2xl font-medium tracking-tight">{feature.title}</h3><p className="mt-4 leading-7 text-forest/65">{feature.text}</p></article>)}</div>
        </div>
      </section>

      <section className="overflow-hidden bg-forest text-white section-space">
        <div className="site-shell grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><p className="eyebrow eyebrow-light">Thoughtful by default</p><h2 className="section-title mt-5">A workspace that keeps the noise out.</h2><p className="mt-6 max-w-lg text-lg leading-8 text-white/60">Built around the rhythm of real healthcare teams: focused, fast, and always respectful of the person behind every record.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2"><div><p className="text-4xl font-medium">3×</p><p className="mt-2 text-sm leading-6 text-white/50">Faster access to the context teams use most</p></div><div><p className="text-4xl font-medium">100%</p><p className="mt-2 text-sm leading-6 text-white/50">Responsive from reception desk to rounds</p></div></div>
          </div>
          <div className="care-stack">
            <div className="care-card care-card-one"><p className="text-xs font-bold uppercase tracking-[.15em] text-forest/50">Care teams</p><div className="mt-6 flex -space-x-3">{["NR", "AK", "JM", "+9"].map((name, i) => <span key={name} className={`team-avatar team-avatar-${i}`}>{name}</span>)}</div><p className="mt-7 text-xl font-medium">Everyone aligned around the same clear view.</p></div>
            <div className="care-card care-card-two"><p className="text-xs font-bold uppercase tracking-[.15em] text-forest/50">Weekly trend</p><div className="trend-line" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div><p className="mt-5 flex items-center justify-between text-sm"><span>Follow-up completion</span><strong>92%</strong></p></div>
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="site-shell"><p className="eyebrow">Simple from the start</p><div className="section-heading mt-5"><h2 className="section-title max-w-2xl">A clearer workflow in three steady steps.</h2><p className="max-w-md text-base leading-7 text-muted">No maze of menus. Just a logical path from team setup to better-informed action.</p></div>
          <div className="mt-14 border-t border-forest/15">{steps.map((item) => <div key={item.step} className="grid gap-5 border-b border-forest/15 py-8 sm:grid-cols-[80px_1fr_1fr] sm:items-center"><span className="text-sm font-semibold text-coral">{item.step}</span><h3 className="text-2xl font-medium tracking-tight">{item.title}</h3><p className="leading-7 text-muted">{item.text}</p></div>)}</div>
        </div>
      </section>

      <section className="bg-white section-space">
        <div className="site-shell"><div className="mx-auto max-w-4xl text-center"><p className="text-5xl text-coral" aria-hidden="true">“</p><blockquote className="mt-4 text-3xl font-medium leading-tight tracking-[-.035em] sm:text-5xl">Doctor Tracker gives our team the confidence that everyone is working from the same picture.</blockquote><p className="mt-8 text-sm font-semibold">Dr. Samira Hasan <span className="font-normal text-muted">· Clinical Operations Lead</span></p></div></div>
      </section>

      <section className="section-space">
        <div className="site-shell"><div className="flex items-end justify-between gap-6"><div><p className="eyebrow">From the journal</p><h2 className="section-title mt-5">Ideas for calmer, smarter care.</h2></div><Link href="/blog" className="hidden font-semibold text-coral sm:block">View all insights →</Link></div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">{featuredPosts.map((post, index) => <Link href={`/blog/${post.slug}`} key={post.slug} className="article-card group"><div className={`article-visual visual-${index + 1}`}><span>{post.category}</span><div className="visual-ring" /></div><div className="p-7 sm:p-8"><p className="text-xs font-bold uppercase tracking-[.14em] text-muted">{formatDate(post.publishedAt)} · {post.readingTime}</p><h3 className="mt-4 text-2xl font-medium tracking-tight group-hover:text-coral">{post.title}</h3><p className="mt-3 leading-7 text-muted">{post.excerpt}</p><span className="mt-6 inline-block font-semibold">Read article →</span></div></Link>)}</div>
          <Link href="/blog" className="button button-outline mt-8 sm:hidden">View all insights</Link>
        </div>
      </section>

      <PortalCta portalUrl={portalUrl} />
    </main>
  );
}

function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date)); }
