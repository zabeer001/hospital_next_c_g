"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/auth/auth-provider";
import { useDashboard } from "@/dashboard/dashboard-provider";
import { PatientForm } from "@/dashboard/forms";
import type { Patient } from "@/dashboard/types";
import { ConfirmDialog, EmptyState, Overlay, Pagination } from "@/dashboard/ui";
import { PatientCard } from "./_components/patient-card";
import { PatientsFilters } from "./_components/patients-filters";
import { PatientsHeader } from "./_components/patients-header";
import { PatientsTable } from "./_components/patients-table";
import { matchesPatientDate } from "./_utils/patient-utils";

const PAGE_SIZE = 7;

export default function PatientsPage() {
  const {
    doctors,
    patients,
    doctorName,
    addPatient,
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
  const [createOpen, setCreateOpen] = useState(false);
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
          (date === "All time" || Boolean(patient.admittedAt && matchesPatientDate(patient.admittedAt, date)))
        );
      }),
    [condition, date, doctor, doctorName, patients, query, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };
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
        <PatientsHeader
          patients={patients}
          doctors={doctors}
          canCreate={can("patients.create")}
          onCreate={() => setCreateOpen(true)}
        />
        <PatientsFilters
          query={query}
          condition={condition}
          status={status}
          doctor={doctor}
          date={date}
          conditions={conditions}
          doctors={doctors}
          onQueryChange={changeFilter(setQuery)}
          onConditionChange={changeFilter(setCondition)}
          onStatusChange={changeFilter(setStatus)}
          onDoctorChange={changeFilter(setDoctor)}
          onDateChange={changeFilter(setDate)}
        />
        {visible.length ? (
          <>
            <PatientsTable patients={visible} doctors={doctors} doctorName={doctorName} canUpdate={can("patients.update")} canDelete={can("patients.delete")} onEdit={setEditTarget} onDelete={setDeleteTarget} />
            <div className="grid gap-3 p-4 md:hidden">
              {visible.map((patient) => <PatientCard key={patient.id} patient={patient} doctorName={doctorName} canUpdate={can("patients.update")} canDelete={can("patients.delete")} onEdit={setEditTarget} onDelete={setDeleteTarget} />)}
            </div>
            <div className="flex flex-col items-center justify-between gap-3 border-t border-base-300 p-4 sm:flex-row sm:px-6">
              <p className="text-xs text-base-content/55">Showing {visible.length} of {filtered.length} patients</p>
              <Pagination page={currentPage} pages={pages} onChange={setPage} />
            </div>
          </>
        ) : (
          <EmptyState title="No patients found" text="Try widening your search or clearing the current filters." onReset={reset} />
        )}
      </section>

      <Overlay
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add a new patient"
        description="Create a patient record and book their visit."
        variant="drawer"
      >
        <div className="p-5 sm:p-6">
          <PatientForm
            doctors={doctors}
            onCancel={() => setCreateOpen(false)}
            onSubmit={async (input) => {
              const saved = await addPatient(input);
              if (saved) setCreateOpen(false);
              return saved;
            }}
          />
        </div>
      </Overlay>
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
