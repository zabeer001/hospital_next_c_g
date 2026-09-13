"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { useDashboard } from "@/dashboard/dashboard-provider";
import type { Doctor, Patient } from "@/dashboard/types";
import { ConfirmDialog, EmptyState, Pagination } from "@/dashboard/ui";
import { DoctorCard } from "./_components/doctor-card";
import { DoctorCreateModal } from "./_components/doctor-create-modal";
import { DoctorScheduleDrawer, isUpcomingVisit } from "./_components/doctor-schedule-drawer";
import { DoctorsFilters } from "./_components/doctors-filters";
import { DoctorsHeader } from "./_components/doctors-header";
import { DoctorsTable } from "./_components/doctors-table";

const PAGE_SIZE = 6;

export default function DoctorsPage() {
  const { doctors, patients, addDoctor, addPatient, completeVisit, deletePatient, pending } = useDashboard();
  const { can } = useAuth();
  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [hospital, setHospital] = useState("All");
  const [date, setDate] = useState("All time");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [addingPatient, setAddingPatient] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))].sort();
  const hospitals = [...new Set(doctors.map((doctor) => doctor.hospital))].sort();
  const filtered = useMemo(() => doctors.filter((doctor) => {
    const text = `${doctor.name} ${doctor.email} ${doctor.hospital} ${doctor.specialization}`.toLowerCase();
    return text.includes(query.toLowerCase())
      && (specialization === "All" || doctor.specialization === specialization)
      && (hospital === "All" || doctor.hospital === hospital)
      && matchesDate(doctor.createdAt, date);
  }), [date, doctors, hospital, query, specialization]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changeFilter = (setter: (value: string) => void) => (value: string) => { setter(value); setPage(1); };
  const reset = () => { setQuery(""); setSpecialization("All"); setHospital("All"); setDate("All time"); setPage(1); };
  const closeSchedule = () => { setSelectedDoctor(null); setAddingPatient(false); };

  return <>
    <section className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
      <DoctorsHeader doctorCount={doctors.length} hospitalCount={hospitals.length} canCreate={can("doctors.create")} onCreate={() => setCreateOpen(true)} />
      <DoctorsFilters query={query} specialization={specialization} hospital={hospital} date={date} specializations={specializations} hospitals={hospitals} onQueryChange={changeFilter(setQuery)} onSpecializationChange={changeFilter(setSpecialization)} onHospitalChange={changeFilter(setHospital)} onDateChange={changeFilter(setDate)} />
      {visible.length ? <>
        <DoctorsTable doctors={visible} patients={patients} isUpcomingVisit={isUpcomingVisit} onSelect={setSelectedDoctor} />
        <div className="grid gap-3 p-4 md:hidden">{visible.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} patients={patients} isUpcomingVisit={isUpcomingVisit} onSelect={setSelectedDoctor} />)}</div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 p-4 sm:flex-row sm:px-6"><p className="text-xs text-base-content/55">Showing {visible.length} of {filtered.length} doctors</p><Pagination page={currentPage} pages={pages} onChange={setPage} /></div>
      </> : <EmptyState title="No doctors found" text="Try widening your search or clearing the current filters." onReset={reset} />}
    </section>

    <DoctorCreateModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={async (input) => { const saved = await addDoctor(input); if (saved) setCreateOpen(false); return saved; }} />
    <DoctorScheduleDrawer doctor={selectedDoctor} doctors={doctors} patients={patients} addingPatient={addingPatient} canCreatePatient={can("patients.create")} canCompleteVisit={can("patients.complete-visit")} canDeletePatient={can("patients.delete")} onClose={closeSchedule} onTogglePatientForm={() => setAddingPatient((value) => !value)} onClosePatientForm={() => setAddingPatient(false)} onAddPatient={async (input) => { const saved = await addPatient(input); if (saved) setAddingPatient(false); return saved; }} onCompleteVisit={(id) => void completeVisit(id)} onDeletePatient={setDeleteTarget} />
    <ConfirmDialog open={Boolean(deleteTarget)} title="Delete patient?" text={`${deleteTarget?.name || "This patient"} will be removed from the doctor’s patient list.`} pending={pending} onCancel={() => setDeleteTarget(null)} onConfirm={async () => { if (deleteTarget && await deletePatient(deleteTarget.id)) setDeleteTarget(null); }} />
  </>;
}

function matchesDate(value: string, filter: string) {
  if (filter === "All time") return true;
  const days = filter === "Last 7 days" ? 7 : filter === "Last 30 days" ? 30 : 365;
  return (new Date("2026-09-12").getTime() - new Date(value).getTime()) / 86400000 <= days;
}
