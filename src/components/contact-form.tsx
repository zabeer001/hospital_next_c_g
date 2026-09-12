"use client";

import { FormEvent, useState } from "react";

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const nextErrors: Errors = {};
    if (!String(values.name || "").trim()) nextErrors.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(String(values.email || ""))) nextErrors.email = "Enter a valid email address.";
    if (!String(values.subject || "").trim()) nextErrors.subject = "Please choose a subject.";
    if (String(values.message || "").trim().length < 20) nextErrors.message = "Please add at least 20 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("sent");
    event.currentTarget.reset();
  }

  if (status === "sent") return (
    <div className="grid min-h-[520px] place-items-center rounded-[2rem] bg-white p-8 text-center shadow-soft" role="status">
      <div><span className="mx-auto grid size-16 place-items-center rounded-full bg-sage text-2xl">✓</span><h2 className="mt-6 text-3xl font-medium tracking-tight">Message looks good.</h2><p className="mx-auto mt-4 max-w-md leading-7 text-muted">This is a demonstration form, so no information was transmitted or stored.</p><button type="button" className="button button-dark mt-8" onClick={() => setStatus("idle")}>Send another message</button></div>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] bg-white p-6 shadow-soft sm:p-9">
      <div className="grid gap-6 sm:grid-cols-2"><Field label="Your name" name="name" placeholder="Amina Rahman" error={errors.name} /><Field label="Work email" name="email" type="email" placeholder="amina@clinic.com" error={errors.email} /></div>
      <div className="mt-6"><label className="field-label" htmlFor="subject">What can we help with?</label><select id="subject" name="subject" className={`field-input ${errors.subject ? "field-error" : ""}`} defaultValue="" aria-describedby={errors.subject ? "subject-error" : undefined}><option value="" disabled>Choose a subject</option><option>General question</option><option>Portal access</option><option>Partnership</option><option>Product feedback</option></select>{errors.subject && <p id="subject-error" className="error-message">{errors.subject}</p>}</div>
      <div className="mt-6"><label className="field-label" htmlFor="message">Message</label><textarea id="message" name="message" rows={6} placeholder="Tell us a little about how we can help…" className={`field-input resize-none ${errors.message ? "field-error" : ""}`} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <p id="message-error" className="error-message">{errors.message}</p>}</div>
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xs text-xs leading-5 text-muted">Demo only — your information will not be sent or stored.</p><button type="submit" disabled={status === "sending"} className="button button-coral justify-center disabled:cursor-wait disabled:opacity-70">{status === "sending" ? "Checking message…" : "Send message"} <span aria-hidden="true">→</span></button></div>
    </form>
  );
}

function Field({ label, name, type = "text", placeholder, error }: { label: string; name: "name" | "email"; type?: string; placeholder: string; error?: string }) {
  return <div><label className="field-label" htmlFor={name}>{label}</label><input id={name} name={name} type={type} placeholder={placeholder} className={`field-input ${error ? "field-error" : ""}`} aria-describedby={error ? `${name}-error` : undefined} />{error && <p id={`${name}-error`} className="error-message">{error}</p>}</div>;
}
