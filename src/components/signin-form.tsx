"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setMessage("Signing you in…");
    window.setTimeout(() => router.push("/dashboard"), 450);
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
      {message && <p id="signin-message" role="status" className="mt-5 rounded-xl border border-sage bg-sage/25 px-4 py-3 text-sm leading-6 text-forest">{message}</p>}
      <button type="submit" className="button button-coral mt-7 w-full justify-center">Sign in securely <span aria-hidden="true">→</span></button>
      <p className="mt-5 text-center text-xs leading-5 text-muted">Frontend demonstration only—authentication is not connected yet.</p>
    </form>
  );
}
