"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useDashboard } from "@/dashboard/dashboard-provider";
import { Avatar, StatusBadge } from "@/dashboard/ui";

export default function DashboardPage() {
  const { doctors, patients, doctorName, summary } = useDashboard();
  const active = summary?.metrics.activePatients ?? patients.filter((patient) => patient.status === "Active").length;
  const recent = summary?.metrics.newThisMonth ?? 0;
  const counts = useMemo(() => summary ? summary.busiestDoctors.map((doctor) => ({ ...doctor, count: doctor.patientCount })) : doctors.map((doctor) => ({ ...doctor, count: patients.filter((patient) => patient.doctorId === doctor.id).length })).sort((a, b) => b.count - a.count), [doctors, patients, summary]);
  const conditions = useMemo(() => summary ? summary.topConditions.slice(0, 4).map((item) => [item.condition, item.count] as [string, number]) : Object.entries(patients.reduce<Record<string, number>>((all, patient) => ({ ...all, [patient.condition]: (all[patient.condition] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 4), [patients, summary]);
  const topConditionTotal = conditions.reduce((sum, [, count]) => sum + count, 0);
  const recentPatients = summary?.recentPatients ?? [...patients].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);
  const trend = summary?.monthlyAdmissions.map((item) => ({ month: new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(new Date(`${item.month}-01T00:00:00Z`)), value: item.count })) ?? [];
  const maxTrend = Math.max(...trend.map((item) => item.value), 1);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total doctors" value={summary?.metrics.totalDoctors ?? doctors.length} change="Across all care teams" symbol="+" tone="sage" href="/dashboard/doctors" />
        <MetricCard label="Total patients" value={summary?.metrics.totalPatients ?? patients.length} change="Across all care teams" symbol="♙" tone="amber" href="/dashboard/patients" />
        <MetricCard label="Active patients" value={active} change={`${Math.round((active / Math.max(summary?.metrics.totalPatients ?? patients.length, 1)) * 100)}% of total patients`} symbol="↗" tone="coral" />
        <MetricCard label="New this month" value={recent} change="Current month admissions" symbol="◷" tone="lavender" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_.75fr]">
        <article className="card border border-base-300 bg-base-100 shadow-sm"><div className="card-body p-5 sm:p-7">
          <CardHeader title="Patient activity" text="New admissions over the last six months" action="Last 6 months" />
          <div className="dash-chart mt-9" role="img" aria-label="New patient admissions from April through September"><div className="dash-chart-lines" aria-hidden="true"><i /><i /><i /><i /></div>{trend.map((item) => <div key={item.month} className="dash-chart-column"><span className="dash-chart-value">{item.value}</span><div className="dash-chart-bar" style={{ height: `${Math.max(14, (item.value / maxTrend) * 100)}%` }} /><small>{item.month}</small></div>)}</div>
        </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm"><div className="card-body p-5 sm:p-7">
          <CardHeader title="Patient conditions" text="Top recorded conditions" />
          <div className="mt-8 flex items-center gap-7"><div className="condition-donut" role="img" aria-label="Distribution of the four most common patient conditions"><span>{topConditionTotal}<small>records</small></span></div><div className="min-w-0 flex-1 space-y-3">{conditions.map(([name, count], index) => <div key={name} className="flex items-center justify-between gap-2 text-xs"><span className="flex min-w-0 items-center gap-2"><i className={`condition-dot condition-dot-${index}`} /><span className="truncate text-base-content/60">{name}</span></span><strong>{count}</strong></div>)}</div></div>
        </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_.85fr]">
        <article className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm"><div className="p-5 pb-4 sm:p-7 sm:pb-4"><CardHeader title="Recent patients" text="Latest updates across your care team" link={{ href: "/dashboard/patients", label: "View all" }} /></div><div className="overflow-x-auto"><table className="table table-zebra"><thead><tr><th>Patient</th><th>Doctor</th><th>Condition</th><th>Status</th><th>Updated</th></tr></thead><tbody>{recentPatients.map((patient) => <tr key={patient.id}><td><div className="flex items-center gap-3"><Avatar name={patient.name} size="sm" /><strong>{patient.name}</strong></div></td><td>{doctorName(patient.doctorId).replace("Dr. ", "")}</td><td>{patient.condition}</td><td><StatusBadge status={patient.status} /></td><td>{shortDate(patient.updatedAt)}</td></tr>)}</tbody></table></div></article>
        <article className="card border border-base-300 bg-base-100 shadow-sm"><div className="card-body p-5 sm:p-7"><CardHeader title="Busiest doctors" text="Patients currently assigned" link={{ href: "/dashboard/doctors", label: "Directory" }} /><div className="mt-2 space-y-5">{counts.slice(0, 5).map((doctor, index) => <div key={doctor.id} className="flex items-center gap-3"><Avatar name={doctor.name} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><strong className="truncate text-sm">{doctor.name}</strong><span className="text-xs font-bold">{doctor.count}</span></div><p className="mt-1 text-xs text-base-content/55">{doctor.specialization}</p><progress className={`progress mt-2 h-1.5 w-full ${index === 0 ? "progress-secondary" : "progress-primary"}`} value={doctor.count} max={counts[0]?.count || 1} /></div></div>)}</div></div></article>
      </section>
    </div>
  );
}

function MetricCard({ label, value, change, symbol, tone, href }: { label: string; value: number; change: string; symbol: string; tone: string; href?: string }) {
  const tones: Record<string, string> = { sage: "bg-primary text-primary-content", amber: "bg-accent text-accent-content", coral: "bg-secondary text-secondary-content", lavender: "bg-info text-info-content" };
  const content = <div className="stat"><div className="stat-figure"><span className={`grid size-10 place-items-center rounded-box text-lg font-bold ${tones[tone]}`}>{symbol}</span></div><div className="stat-title">{label}</div><div className="stat-value text-3xl">{value.toLocaleString()}</div><div className="stat-desc mt-2">{change}</div></div>;
  const className = "stats border border-base-300 bg-base-100 shadow-sm transition-transform hover:-translate-y-0.5";
  return href ? <Link href={href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}

function CardHeader({ title, text, action, link }: { title: string; text: string; action?: string; link?: { href: string; label: string } }) {
  return <header className="flex items-start justify-between gap-4"><div><h2 className="card-title text-base">{title}</h2><p className="mt-1 text-xs leading-5 text-base-content/55">{text}</p></div>{action && <span className="badge badge-ghost whitespace-nowrap">{action}</span>}{link && <Link href={link.href} className="link link-primary whitespace-nowrap text-xs font-bold no-underline">{link.label} →</Link>}</header>;
}

function shortDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value)); }
