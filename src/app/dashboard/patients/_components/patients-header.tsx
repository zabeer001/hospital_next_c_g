import type { Doctor, Patient } from "@/dashboard/types";

export function PatientsHeader({
  patients,
  doctors,
  canCreate,
  onCreate,
}: {
  patients: Patient[];
  doctors: Doctor[];
  canCreate: boolean;
  onCreate(): void;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h2 className="card-title">All patients</h2>
        <p className="mt-1 text-sm text-base-content/55">{patients.length} patient records across {doctors.length} doctors</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-error badge-sm">{patients.filter((patient) => patient.status === "Active").length} active</span>
        <span className="badge badge-warning badge-sm">{patients.filter((patient) => patient.status === "Monitoring").length} monitoring</span>
        {canCreate && (
          <button
            type="button"
            className="btn btn-primary btn-sm ml-1"
            onClick={onCreate}
          >
            + Add patient
          </button>
        )}
      </div>
    </div>
  );
}
