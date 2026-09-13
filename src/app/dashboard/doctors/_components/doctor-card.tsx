import { Avatar } from "@/dashboard/ui";
import type { Doctor, Patient } from "@/dashboard/types";

export function DoctorCard({
  doctor,
  patients,
  isUpcomingVisit,
  onSelect,
}: {
  doctor: Doctor;
  patients: Patient[];
  isUpcomingVisit(patient: Patient): boolean;
  onSelect(doctor: Doctor): void;
}) {
  const upcoming = patients.filter(
    (patient) => patient.doctorId === doctor.id && isUpcomingVisit(patient),
  ).length;
  return (
    <button
      type="button"
      className="card border border-base-300 bg-base-100 text-base-content shadow-sm"
      onClick={() => onSelect(doctor)}
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
          <span className="text-base-content/55">{doctor.hospital}</span>
          <b>{upcoming} upcoming →</b>
        </div>
      </div>
    </button>
  );
}
