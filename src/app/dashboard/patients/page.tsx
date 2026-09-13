"use client";

import { useMemo, useState } from "react";
import { useDashboard } from "@/dashboard/dashboard-provider";
import { PatientForm } from "@/dashboard/forms";
import {
  Avatar,
  ConfirmDialog,
  EmptyState,
  Overlay,
  Pagination,
  StatusBadge,
} from "@/dashboard/ui";
import type { Patient } from "@/dashboard/types";
import { useAuth } from "@/auth/auth-provider";

const PAGE_SIZE = 7;

export default function PatientsPage() {
  const {
    doctors,
    patients,
    doctorName,
    updatePatient,
    deletePatient,
    pending,
  } = useDashboard();
  const { can } = useAuth();
  const [query, setQuery] = useState("");
  const [condition, setCondition] = useState("All conditions");
  const [status, setStatus] = useState("All statuses");
  const [doctor, setDoctor] = useState("All doctors");
  const [date, setDate] = useState("All time");
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Patient | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);
  const conditions = [
    ...new Set(patients.map((patient) => patient.condition)),
  ].sort();

  const filtered = useMemo(
    () =>
      patients.filter((patient) => {
        const text =
          `${patient.name} ${patient.phone} ${patient.condition} ${doctorName(patient.doctorId)}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) &&
          (condition === "All conditions" || patient.condition === condition) &&
          (status === "All statuses" || patient.status === status) &&
          (doctor === "All doctors" || patient.doctorId === doctor) &&
          matchesDate(patient.admittedAt, date)
        );
      }),
    [condition, date, doctor, doctorName, patients, query, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice(
    (Math.min(page, pages) - 1) * PAGE_SIZE,
    Math.min(page, pages) * PAGE_SIZE,
  );
  const reset = () => {
    setQuery("");
    setCondition("All conditions");
    setStatus("All statuses");
    setDoctor("All doctors");
    setDate("All time");
    setPage(1);
  };

  return (
    <>
      <section className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="card-title">All patients</h2>
            <p className="mt-1 text-sm text-base-content/55">
              {patients.length} patient records across {doctors.length} doctors
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-error badge-sm">
              {patients.filter((item) => item.status === "Active").length}{" "}
              active
            </span>
            <span className="badge badge-warning badge-sm">
              {patients.filter((item) => item.status === "Monitoring").length}{" "}
              monitoring
            </span>
          </div>
        </div>
        <div className="grid gap-3 border-y border-base-300 bg-base-200 p-4 md:grid-cols-[minmax(14rem,1fr)_repeat(4,minmax(7rem,auto))] md:px-6">
          <label className="input input-bordered input-sm flex w-full items-center gap-2 bg-base-100">
            <span>⌕</span>
            <input
              className="grow"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search patients, conditions…"
              aria-label="Search patients"
            />
          </label>
          <Filter
            value={condition}
            setValue={setCondition}
            options={["All conditions", ...conditions]}
            label="Condition"
          />
          <Filter
            value={status}
            setValue={setStatus}
            options={["All statuses", "Active", "Monitoring", "Recovered"]}
            label="Status"
          />
          <Filter
            value={doctor}
            setValue={setDoctor}
            options={[
              { value: "All doctors", label: "All doctors" },
              ...doctors.map((item) => ({ value: item.id, label: item.name })),
            ]}
            label="Doctor"
          />
          <Filter
            value={date}
            setValue={setDate}
            options={["All time", "Last 7 days", "Last 30 days", "This year"]}
            label="Date"
          />
        </div>
        {visible.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Assigned doctor</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Admitted</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.name} />
                          <div>
                            <strong className="block text-sm">
                              {patient.name}
                            </strong>
                            <small className="text-base-content/50">
                              {patient.age} yrs · {patient.gender}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="block">
                          {doctorName(patient.doctorId)}
                          <small className="block text-base-content/50">
                            {
                              doctors.find(
                                (item) => item.id === patient.doctorId,
                              )?.specialization
                            }
                          </small>
                        </span>
                      </td>
                      <td>{patient.condition}</td>
                      <td>
                        <StatusBadge status={patient.status} />
                      </td>
                      <td>{shortDate(patient.admittedAt)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          {can("patients.update") && (
                            <button
                              type="button"
                              className="btn btn-square btn-ghost btn-xs"
                              onClick={() => setEditTarget(patient)}
                              aria-label={`Edit ${patient.name}`}
                            >
                              ✎
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {visible.map((patient) => (
                <article
                  key={patient.id}
                  className="card border border-base-300 bg-base-100 shadow-sm"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={patient.name} />
                        <div className="text-left">
                          <strong className="block text-sm">
                            {patient.name}
                          </strong>
                          <span className="text-xs text-base-content/55">
                            {patient.age} yrs · {patient.gender}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={patient.status} />
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-4 border-t border-base-300 pt-4 text-left">
                      <span>
                        <small className="block text-[10px] text-base-content/50">
                          Condition
                        </small>
                        <b className="text-xs">{patient.condition}</b>
                      </span>
                      <span>
                        <small className="block text-[10px] text-base-content/50">
                          Doctor
                        </small>
                        <b className="text-xs">
                          {doctorName(patient.doctorId).replace("Dr. ", "")}
                        </b>
                      </span>
                    </div>
                    {(can("patients.update") || can("patients.delete")) && (
                      <div className="card-actions justify-end">
                        {can("patients.update") && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={() => setEditTarget(patient)}
                          >
                            Edit
                          </button>
                        )}
                        {can("patients.delete") && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => setDeleteTarget(patient)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 p-4 sm:flex-row sm:px-6">
              <p className="text-xs text-base-content/55">
                Showing {visible.length} of {filtered.length} patients
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
            title="No patients found"
            text="Try widening your search or clearing the current filters."
            onReset={reset}
          />
        )}
      </section>

      <Overlay
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit patient"
        description={
          editTarget
            ? `Update ${editTarget.name}’s care information.`
            : undefined
        }
        variant="drawer"
      >
        {editTarget && (
          <div className="p-5 sm:p-6">
            <PatientForm
              doctors={doctors}
              initial={editTarget}
              label="Save changes"
              onCancel={() => setEditTarget(null)}
              onSubmit={async (input) => {
                const saved = await updatePatient(editTarget.id, input);
                if (saved) setEditTarget(null);
                return saved;
              }}
            />
          </div>
        )}
      </Overlay>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete patient?"
        text={`${deleteTarget?.name || "This patient"} will be permanently removed from the patient list.`}
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

type Option = string | { value: string; label: string };
function Filter({
  value,
  setValue,
  options,
  label,
}: {
  value: string;
  setValue(value: string): void;
  options: Option[];
  label: string;
}) {
  return (
    <label>
      <span className="sr-only">Filter by {label}</span>
      <select
        className="select select-bordered select-sm w-full bg-base-100"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          return (
            <option key={optionValue} value={optionValue}>
              {typeof option === "string" ? option : option.label}
            </option>
          );
        })}
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
