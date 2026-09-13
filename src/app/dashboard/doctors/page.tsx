"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/dashboard/dashboard-provider";
import { DoctorForm, PatientForm } from "@/dashboard/forms";
import {
  Avatar,
  ConfirmDialog,
  EmptyState,
  Overlay,
  Pagination,
  StatusBadge,
} from "@/dashboard/ui";
import type { Doctor, Patient } from "@/dashboard/types";
import { useAuth } from "@/auth/auth-provider";

const PAGE_SIZE = 6;

export default function DoctorsPage() {
  const {
    doctors,
    patients,
    addDoctor,
    addPatient,
    completeVisit,
    deletePatient,
    pending,
  } = useDashboard();
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

  const specializations = [
    ...new Set(doctors.map((doctor) => doctor.specialization)),
  ].sort();
  const hospitals = [
    ...new Set(doctors.map((doctor) => doctor.hospital)),
  ].sort();
  const filtered = useMemo(
    () =>
      doctors.filter((doctor) => {
        const text =
          `${doctor.name} ${doctor.email} ${doctor.hospital} ${doctor.specialization}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (specialization === "All" ||
            doctor.specialization === specialization) &&
          (hospital === "All" || doctor.hospital === hospital) &&
          matchesDate(doctor.createdAt, date)
        );
      }),
    [date, doctors, hospital, query, specialization],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(
    (Math.min(page, pages) - 1) * PAGE_SIZE,
    Math.min(page, pages) * PAGE_SIZE,
  );
  const upcomingPatients = selectedDoctor
    ? patients
        .filter(
          (patient) =>
            patient.doctorId === selectedDoctor.id && isUpcomingVisit(patient),
        )
        .sort((a, b) =>
          (a.appointmentAt || "").localeCompare(b.appointmentAt || ""),
        )
    : [];
  const reset = () => {
    setQuery("");
    setSpecialization("All");
    setHospital("All");
    setDate("All time");
    setPage(1);
  };

  return (
    <>
      <section className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="card-title">Doctor directory</h2>
            <p className="mt-1 text-sm text-base-content/55">
              {doctors.length} doctors across {hospitals.length} locations
            </p>
          </div>
          {can("doctors.create") && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setCreateOpen(true)}
            >
              + Add doctor
            </button>
          )}
        </div>
        <div className="grid gap-3 border-y border-base-300 bg-base-200 p-4 md:grid-cols-[minmax(14rem,1fr)_repeat(3,minmax(8rem,auto))] md:px-6">
          <label className="input input-bordered input-sm flex w-full items-center gap-2 bg-base-100">
            <span>⌕</span>
            <input
              className="grow"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search doctors, hospitals…"
              aria-label="Search doctors"
            />
          </label>
          <Filter
            label="Specialization"
            value={specialization}
            setValue={(value) => {
              setSpecialization(value);
              setPage(1);
            }}
            options={specializations}
          />
          <Filter
            label="Hospital"
            value={hospital}
            setValue={(value) => {
              setHospital(value);
              setPage(1);
            }}
            options={hospitals}
          />
          <Filter
            label="Date"
            value={date}
            setValue={(value) => {
              setDate(value);
              setPage(1);
            }}
            options={["Last 7 days", "Last 30 days", "This year"]}
            allLabel="All time"
          />
        </div>
        {visible.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Hospital</th>
                    <th>Contact</th>
                    <th>Upcoming</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={doctor.name} />
                          <div>
                            <strong className="block text-sm">
                              {doctor.name}
                            </strong>
                            <small className="text-base-content/50">
                              Joined {shortDate(doctor.createdAt)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td>{doctor.hospital}</td>
                      <td>
                        <span className="block">
                          {doctor.email}
                          <small className="block text-base-content/50">
                            {doctor.phone}
                          </small>
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-primary badge-sm">
                          {
                            patients.filter(
                              (patient) =>
                                patient.doctorId === doctor.id &&
                                isUpcomingVisit(patient),
                            ).length
                          }{" "}
                          booked
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-primary"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          View schedule →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {visible.map((doctor) => (
                <button
                  type="button"
                  key={doctor.id}
                  className="card border border-base-300 bg-base-100 text-base-content shadow-sm"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={doctor.name} />
                      <div className="text-left">
                        <strong className="block text-sm">{doctor.name}</strong>
                        <span className="text-xs text-base-content/55">
                          {doctor.specialization}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center justify-between border-t border-base-300 pt-4 text-xs">
                      <span className="text-base-content/55">
                        {doctor.hospital}
                      </span>
                      <b>
                        {
                          patients.filter(
                            (patient) =>
                              patient.doctorId === doctor.id &&
                              isUpcomingVisit(patient),
                          ).length
                        }{" "}
                        upcoming →
                      </b>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 p-4 sm:flex-row sm:px-6">
              <p className="text-xs text-base-content/55">
                Showing {visible.length} of {filtered.length} doctors
              </p>
              <Pagination
                page={Math.min(page, pages)}
                pages={pages}
                onChange={setPage}
              />
            </div>
          </>
        ) : (
          <EmptyState
            title="No doctors found"
            text="Try widening your search or clearing the current filters."
            onReset={reset}
          />
        )}
      </section>

      <Overlay
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add a new doctor"
        description="Create a profile for a member of your care team."
      >
        <DoctorForm
          onCancel={() => setCreateOpen(false)}
          onSubmit={async (input) => {
            const saved = await addDoctor(input);
            if (saved) setCreateOpen(false);
            return saved;
          }}
        />
      </Overlay>

      <Overlay
        open={Boolean(selectedDoctor)}
        onClose={() => {
          setSelectedDoctor(null);
          setAddingPatient(false);
        }}
        title={selectedDoctor?.name || "Doctor"}
        description={
          selectedDoctor
            ? `${selectedDoctor.specialization} · ${selectedDoctor.hospital}`
            : undefined
        }
        variant="drawer"
      >
        {selectedDoctor && (
          <div className="p-5 sm:p-6">
            <div className="alert mb-6 bg-base-100 text-sm">
              <span>{selectedDoctor.email}</span>
              <span>{selectedDoctor.phone}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">Upcoming visits</h3>
                <p className="mt-1 text-xs text-base-content/55">
                  {upcomingPatients.length} patients booked to visit shortly
                </p>
              </div>
              {can("patients.create") && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setAddingPatient((value) => !value)}
                >
                  {addingPatient ? "Close form" : "+ Book patient"}
                </button>
              )}
            </div>
            {addingPatient && can("patients.create") && (
              <div className="card mt-5 border border-base-300 bg-base-100">
                <div className="card-body p-5">
                  <PatientForm
                    doctors={doctors}
                    defaultDoctorId={selectedDoctor.id}
                    onCancel={() => setAddingPatient(false)}
                    onSubmit={async (input) => {
                      const saved = await addPatient(input);
                      if (saved) setAddingPatient(false);
                      return saved;
                    }}
                  />
                </div>
              </div>
            )}
            <div className="mt-6 space-y-3">
              {upcomingPatients.length ? (
                upcomingPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="card border border-base-300 bg-base-100"
                  >
                    <div className="card-body gap-3 p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={patient.name} size="sm" />
                        <div className="min-w-0 flex-1">
                          <strong className="block text-sm">
                            {patient.name}
                          </strong>
                          <span className="block text-xs text-base-content/55">
                            {patient.condition} · {patient.age} years
                          </span>
                        </div>
                        <StatusBadge status={patient.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-base-300 pt-3">
                        <div className="rounded-box bg-base-200 p-3">
                          <span className="block text-[10px] font-semibold uppercase tracking-wider text-base-content/50">
                            Visit date
                          </span>
                          <strong className="mt-1 block text-xs">
                            {formatVisitDate(patient.appointmentAt!)}
                          </strong>
                        </div>
                        <div className="rounded-box bg-primary/10 p-3 text-primary">
                          <span className="block text-[10px] font-semibold uppercase tracking-wider opacity-70">
                            Visit time
                          </span>
                          <strong className="mt-1 block text-sm">
                            ◷ {formatVisitTime(patient.appointmentAt!)}
                          </strong>
                        </div>
                      </div>
                      {(can("patients.complete-visit") ||
                        can("patients.delete")) && (
                        <div className="flex justify-end gap-2">
                          {can("patients.complete-visit") && (
                            <button
                              type="button"
                              className="btn btn-success btn-xs"
                              onClick={() => void completeVisit(patient.id)}
                            >
                              Mark visited
                            </button>
                          )}
                          {can("patients.delete") && (
                            <button
                              type="button"
                              className="btn btn-square btn-ghost btn-xs text-error"
                              onClick={() => setDeleteTarget(patient)}
                              aria-label={`Delete ${patient.name}`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No upcoming visits"
                  text="Patients appear here after a future visit is booked. Completed and past visits are hidden automatically."
                />
              )}
            </div>
          </div>
        )}
      </Overlay>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete patient?"
        text={`${deleteTarget?.name || "This patient"} will be removed from the doctor’s patient list.`}
        pending={pending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget && (await deletePatient(deleteTarget.id)))
            setDeleteTarget(null);
        }}
      />
    </>
  );
}

function Filter({
  label,
  value,
  setValue,
  options,
  allLabel = "All",
}: {
  label: string;
  value: string;
  setValue(value: string): void;
  options: string[];
  allLabel?: string;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        className="select select-bordered select-sm w-full bg-base-100"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        <option>{allLabel}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function matchesDate(value: string, filter: string) {
  if (filter === "All time") return true;
  const days =
    filter === "Last 7 days" ? 7 : filter === "Last 30 days" ? 30 : 365;
  return (
    (new Date("2026-09-12").getTime() - new Date(value).getTime()) / 86400000 <=
    days
  );
}
function shortDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
function isUpcomingVisit(patient: Patient) {
  return (
    Boolean(patient.appointmentAt) &&
    !patient.visitCompletedAt &&
    new Date(patient.appointmentAt!).getTime() >= Date.now()
  );
}
function formatVisitDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
function formatVisitTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
