"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDashboard } from "./dashboard-provider";
import { useAuth } from "@/auth/auth-provider";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: "⌂", permission: "dashboard.view" },
  { href: "/dashboard/doctors", label: "Doctors", icon: "+", permission: "doctors.index" },
  { href: "/dashboard/patients", label: "Patients", icon: "♙", permission: "patients.index" },
  { href: "/dashboard/roles", label: "Roles", icon: "⚿", permission: "roles.manage" },
];

const pageDetails: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Wednesday, September 12", title: "Good morning, Samira" },
  "/dashboard/doctors": { eyebrow: "Care team directory", title: "Doctors" },
  "/dashboard/patients": { eyebrow: "Patient records", title: "Patients" },
  "/dashboard/roles": { eyebrow: "Access control", title: "Roles" },
};

const themes = ["forest", "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset", "caramellatte", "abyss", "silk"];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { error, loading, refresh } = useDashboard();
  const { user, can, signOut, changePassword } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("forest");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(localStorage.getItem("doctor-tracker-theme") || "forest");
  }, []);
  useEffect(() => { localStorage.setItem("doctor-tracker-theme", theme); }, [theme]);

  const details = pageDetails[pathname] || pageDetails["/dashboard"];
  const initials = user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    setChangingPassword(true);
    setPasswordError("");
    try {
      await changePassword(String(data.get("currentPassword")), String(data.get("password")), String(data.get("passwordConfirmation")));
    } catch (caught) {
      setPasswordError(caught instanceof Error ? caught.message : "Password could not be changed");
      setChangingPassword(false);
    }
  }

  return (
    <div className="drawer min-h-screen bg-base-200 font-sans text-base-content lg:drawer-open" data-theme={theme}>
      <input id="dashboard-navigation" type="checkbox" className="drawer-toggle" checked={menuOpen} onChange={(event) => setMenuOpen(event.target.checked)} />
      <div className="drawer-content flex min-h-screen min-w-0 flex-col">
        <header className="navbar sticky top-0 z-40 min-h-20 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur lg:px-8">
          <div className="navbar-start gap-3">
            <label htmlFor="dashboard-navigation" className="btn btn-square btn-ghost lg:hidden" aria-label="Open navigation">☰</label>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-base-content/55">{details.eyebrow}</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{pathname === "/dashboard" ? `Welcome, ${user.name.split(" ")[0]}` : details.title}</h1>
            </div>
          </div>
          <div className="navbar-end gap-2 sm:gap-3">
            <label className="form-control">
              <span className="sr-only">Dashboard theme</span>
              <select className="select select-bordered select-sm w-28 bg-base-100 sm:w-36" value={theme} onChange={(event) => setTheme(event.target.value)} aria-label="Dashboard theme">
                {themes.map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}
              </select>
            </label>
            <button type="button" className="indicator btn btn-circle btn-ghost btn-sm" aria-label="Notifications"><span className="indicator-item badge badge-secondary badge-xs" />♢</button>
            <div className="hidden text-right md:block"><p className="text-xs font-semibold">Central Medical Centre</p><span className="text-[10px] text-base-content/55">Dhaka, Bangladesh</span></div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{error && !loading && <div className="alert alert-error mb-6"><span>{error}</span><button type="button" className="btn btn-sm" onClick={() => void refresh()}>Retry</button></div>}{children}</main>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="dashboard-navigation" aria-label="Close navigation" className="drawer-overlay" />
        <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-100 p-4 text-base-content">
          <div className="card mb-6 border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs uppercase tracking-[0.18em] text-base-content/60">Care control center</p><h2 className="mt-1 text-xl font-extrabold">Doctor Tracker</h2></div>
                <label htmlFor="dashboard-navigation" className="btn btn-circle btn-ghost btn-sm lg:hidden" aria-label="Close navigation">×</label>
              </div>
              <div className="mt-2 flex items-center gap-2"><span className="badge badge-success badge-xs" /> <span className="text-xs text-base-content/60">System ready</span></div>
            </div>
          </div>

          <ul className="menu w-full gap-1 rounded-box p-0" aria-label="Dashboard navigation">
            <li className="menu-title px-3 pb-2 text-[10px] uppercase tracking-widest">Workspace</li>
            {navigation.filter((item) => can(item.permission)).map((item) => {
              const active = pathname === item.href;
              return <li key={item.href} className="w-full"><Link href={item.href} onClick={() => setMenuOpen(false)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 ${active ? "menu-active" : ""}`}><span className={`flex size-9 items-center justify-center rounded-lg text-base font-bold ${active ? "bg-base-100/30" : "bg-base-200 text-base-content/70"}`}>{item.icon}</span><span className="text-sm font-medium tracking-[0.01em]">{item.label}</span>{active && <span className="badge badge-primary badge-xs ml-auto">Now</span>}</Link></li>;
            })}
          </ul>

          <div className="mt-auto space-y-3 pt-8">
            <div className="card border border-primary/20 bg-primary/5"><div className="card-body gap-2 p-4"><h2 className="card-title text-sm">Need a hand?</h2><p className="text-xs leading-5 text-base-content/60">Find answers or talk to our support team.</p><div className="card-actions"><Link href="/contact" className="btn btn-primary btn-sm">Contact support</Link></div></div></div>
            <div className="dropdown dropdown-top w-full">
              <button type="button" tabIndex={0} className="btn h-auto w-full justify-start border-base-300 bg-base-100 px-3 py-3 text-left shadow-sm"><div className="avatar avatar-placeholder"><div className="w-9 rounded-full bg-secondary text-secondary-content"><span className="text-xs font-bold">{initials}</span></div></div><span className="min-w-0 flex-1 normal-case"><strong className="block truncate text-xs">{user.name}</strong><small className="block truncate text-[10px] font-normal text-base-content/50">{user.roleNames.join(", ") || user.email}</small></span><span aria-hidden="true">⌃</span></button>
              <ul tabIndex={0} className="menu dropdown-content z-10 mb-2 w-full rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"><li><Link href="/">Back to public site</Link></li><li><Link href="/contact">Contact support</Link></li><li><button type="button" onClick={() => setPasswordOpen(true)}>Change password</button></li><li><button type="button" onClick={() => void signOut()}>Sign out</button></li></ul>
            </div>
          </div>
        </aside>
      </div>
      {passwordOpen && <div className="modal modal-open" role="presentation"><div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="change-password-title"><h2 id="change-password-title" className="text-xl font-bold">Change password</h2><p className="mt-2 text-sm text-base-content/60">You’ll be signed out on every device after this change.</p><form className="mt-6 space-y-4" onSubmit={submitPassword}><label className="form-control"><span className="label-text mb-2">Current password</span><input className="input input-bordered" name="currentPassword" type="password" autoComplete="current-password" required /></label><label className="form-control"><span className="label-text mb-2">New password</span><input className="input input-bordered" name="password" type="password" autoComplete="new-password" minLength={8} required /></label><label className="form-control"><span className="label-text mb-2">Confirm new password</span><input className="input input-bordered" name="passwordConfirmation" type="password" autoComplete="new-password" minLength={8} required /></label>{passwordError && <div className="alert alert-error py-3 text-sm" role="alert">{passwordError}</div>}<div className="modal-action"><button type="button" className="btn btn-ghost" disabled={changingPassword} onClick={() => { setPasswordOpen(false); setPasswordError(""); }}>Cancel</button><button type="submit" className="btn btn-primary" disabled={changingPassword}>{changingPassword ? "Updating…" : "Update password"}</button></div></form></div><button type="button" className="modal-backdrop" aria-label="Close change password dialog" onClick={() => setPasswordOpen(false)}>close</button></div>}
    </div>
  );
}
