import type { Doctor, Patient } from "@/dashboard/types";

export function PatientsHeader({ patients, doctors }: { patients: Patient[]; doctors: Doctor[] }) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h2 className="card-title">All patients</h2>
        <p className="mt-1 text-sm text-base-content/55">{patients.length} patient records across {doctors.length} doctors</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="badge badge-error badge-sm">{patients.filter((patient) => patient.status === "Active").length} active</span>
        <span className="badge badge-warning badge-sm">{patients.filter((patient) => patient.status === "Monitoring").length} monitoring</span>
      </div>
    </div>
  );
}
