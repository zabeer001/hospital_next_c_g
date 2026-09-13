"use client";

import { useEffect, useId, useRef } from "react";
import type { BookingStatus, PatientStatus } from "./types";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.replace(/^Dr\.\s*/, "").split(" ").slice(0, 2).map((part) => part[0]).join("");
  const sizes = { sm: "w-8 text-[10px]", md: "w-10 text-xs", lg: "w-12 text-sm" };
  return <div className="avatar avatar-placeholder" aria-hidden="true"><div className={`${sizes[size]} rounded-full bg-primary text-primary-content`}><span className="font-bold">{initials}</span></div></div>;
}

export function StatusBadge({ status }: { status: PatientStatus }) {
  const styles: Record<PatientStatus, string> = { Active: "badge-error", Monitoring: "badge-warning", Recovered: "badge-success" };
  return <span className={`badge badge-sm gap-1.5 font-semibold ${styles[status]}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}

export function BookingStatusBadge({ status }: { status?: BookingStatus }) {
  if (!status) return <span className="text-xs text-base-content/45">No booking</span>;
  const styles: Record<BookingStatus, string> = { Pending: "badge-warning", Confirmed: "badge-info", Admitted: "badge-primary", Completed: "badge-success", Cancelled: "badge-error" };
  return <span className={`badge badge-outline badge-sm font-semibold ${styles[status]}`}>{status}</span>;
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange(page: number): void }) {
  if (pages <= 1) return null;
  return <nav className="join" aria-label="Pagination"><button type="button" className="btn join-item btn-sm" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">←</button><span className="btn join-item btn-sm pointer-events-none font-normal">Page <strong>{page}</strong> of {pages}</span><button type="button" className="btn join-item btn-sm" disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">→</button></nav>;
}

export function EmptyState({ title, text, onReset }: { title: string; text: string; onReset?(): void }) {
  return <div className="hero min-h-72 bg-base-100"><div className="hero-content text-center"><div className="max-w-md"><div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/15 text-xl text-primary">⌕</div><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="py-3 text-sm text-base-content/60">{text}</p>{onReset && <button type="button" className="btn btn-primary btn-sm" onClick={onReset}>Clear filters</button>}</div></div></div>;
}

export function Overlay({ open, title, description, variant = "modal", onClose, children }: { open: boolean; title: string; description?: string; variant?: "modal" | "drawer"; onClose(): void; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    window.setTimeout(() => panel.current?.focus(), 0);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", handleKey); };
  }, [onClose, open]);
  if (!open) return null;

  const panelClass = variant === "drawer"
    ? "modal-box ml-auto h-screen max-h-none w-full max-w-xl rounded-none bg-base-200 p-0"
    : "modal-box w-full max-w-lg bg-base-100 p-6";

  return <div className={`modal modal-open ${variant === "drawer" ? "justify-end p-0" : ""}`} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId} className={panelClass}><header className={`flex items-start justify-between gap-4 border-b border-base-300 bg-base-100 ${variant === "drawer" ? "sticky top-0 z-10 p-6" : "-mx-6 -mt-6 mb-6 rounded-t-box p-6"}`}><div><span className="badge badge-secondary badge-sm">Doctor Tracker</span><h2 id={titleId} className="mt-3 text-xl font-bold tracking-tight">{title}</h2>{description && <p className="mt-1 text-sm text-base-content/60">{description}</p>}</div><button type="button" className="btn btn-circle btn-ghost btn-sm" onClick={onClose} aria-label="Close dialog">×</button></header>{children}</div></div>;
}

export function ConfirmDialog({ open, title, text, onCancel, onConfirm, pending = false }: { open: boolean; title: string; text: string; onCancel(): void; onConfirm(): void; pending?: boolean }) {
  return <Overlay open={open} onClose={pending ? () => undefined : onCancel} title={title} description={text}><div className="modal-action"><button type="button" className="btn btn-ghost" onClick={onCancel} disabled={pending}>Cancel</button><button type="button" className="btn btn-error" onClick={onConfirm} disabled={pending}>{pending && <span className="loading loading-spinner loading-xs" />}{pending ? "Deleting…" : "Delete patient"}</button></div></Overlay>;
}
