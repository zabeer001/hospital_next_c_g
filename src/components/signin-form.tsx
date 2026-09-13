"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/auth/client";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setSubmitting(true);
    setMessage("");
    try {
      await authApi.signIn(String(data.get("email")), String(data.get("password")), data.get("remember") === "on");
      const requested = new URLSearchParams(window.location.search).get("next");
      router.replace(requested?.startsWith("/dashboard") ? requested : "/dashboard");
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-9" aria-describedby={message ? "signin-message" : undefined}>
      <div>
        <label className="field-label" htmlFor="email">Email address</label>
        <input className="field-input" id="email" name="email" type="email" autoComplete="email" placeholder="you@hospital.com" required />
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="field-label" htmlFor="password">Password</label>
          <a href="mailto:hello@doctortracker.health?subject=Portal access help" className="mb-2 text-xs font-semibold text-teal hover:text-coral">Need access help?</a>
        </div>
        <div className="relative">
          <input className="field-input pr-20" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" minLength={6} required />
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted hover:text-forest" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
        </div>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-muted"><input type="checkbox" name="remember" className="size-4 accent-[#173b36]" /> Keep me signed in on this device</label>
      {message && <p id="signin-message" role="alert" className="mt-5 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm leading-6 text-forest">{message}</p>}
      <button type="submit" disabled={submitting} className="button button-coral mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Signing in…" : "Sign in securely"} <span aria-hidden="true">→</span></button>
    </form>
  );
}
