import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Doctor Tracker team.",
};

export default function ContactPage() {
  return (
    <main className="overflow-hidden">
      <section className="site-shell grid gap-14 py-16 sm:py-24 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
        <div className="relative">
          <p className="eyebrow">Start a conversation</p>
          <h1 className="display-title mt-6">We’re here to help.</h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-muted">
            Questions about Doctor Tracker, portal access, or how the product
            fits your team? Leave us a note.
          </p>
          <div className="mt-12 space-y-8">
            <div className="contact-detail">
              <span aria-hidden="true">@</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-muted">
                  Email
                </p>
                <a
                  href="mailto:hello@doctortracker.health"
                  className="mt-1 block font-semibold hover:text-coral"
                >
                  hello@doctortracker.health
                </a>
              </div>
            </div>
            <div className="contact-detail">
              <span aria-hidden="true">⌂</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-muted">
                  Office hours
                </p>
                <p className="mt-1 font-semibold">
                  Sunday–Thursday, 9:00–17:00
                </p>
                <p className="mt-1 text-sm text-muted">Asia/Dhaka</p>
              </div>
            </div>
          </div>
          <div className="contact-orbit" aria-hidden="true">
            <div />
            <span>+</span>
          </div>
        </div>
        <ContactForm />
      </section>
      <section className="border-t border-forest/10 bg-white py-14">
        <div className="site-shell grid gap-6 text-center sm:grid-cols-3 sm:text-left">
          <div>
            <p className="text-2xl font-medium">Clear questions</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Tell us what you need without navigating a complicated support
              system.
            </p>
          </div>
          <div>
            <p className="text-2xl font-medium">Human answers</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Every message is treated as a conversation, not another ticket
              number.
            </p>
          </div>
          <div>
            <p className="text-2xl font-medium">No data captured</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              This portfolio demonstration does not send or store form
              submissions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
