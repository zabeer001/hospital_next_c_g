import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/signin-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Doctor Tracker portal.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="signin-page">
      <div className="signin-orb signin-orb-one" aria-hidden="true" />
      <div className="signin-orb signin-orb-two" aria-hidden="true" />
      <section className="site-shell relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-12 py-14 lg:grid-cols-[1fr_.82fr] lg:py-20">
        <div className="hidden max-w-xl lg:block">
          <p className="eyebrow">Your care workspace</p>
          <h1 className="section-title mt-6">A clear start to every clinical day.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">Return to the people, relationships, and insights your team needs—all in one focused place.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-[1.5rem] bg-sage p-6"><p className="text-3xl font-semibold">One view</p><p className="mt-2 text-sm leading-6 text-forest/65">Connected doctors, patients, and care context.</p></div>
            <div className="rounded-[1.5rem] bg-amber p-6"><p className="text-3xl font-semibold">Less noise</p><p className="mt-2 text-sm leading-6 text-forest/65">A calm workspace designed around attention.</p></div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-forest/10 bg-white p-7 shadow-soft sm:p-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-coral">← Back to website</Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[.17em] text-coral">Doctor Tracker portal</p>
          <h1 className="mt-3 font-serif text-4xl font-normal tracking-[-.04em]">Welcome back.</h1>
          <p className="mt-3 leading-7 text-muted">Use the credentials provided by your administrator.</p>
          <SignInForm />
        </div>
      </section>
    </main>
  );
}
