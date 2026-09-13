import { Avatar, BookingStatusBadge, StatusBadge } from "@/dashboard/ui";
import type { Patient } from "@/dashboard/types";
import { PatientActions } from "./patient-actions";

type Props = {
  patient: Patient; doctorName(doctorId: string): string;
  canUpdate: boolean; canDelete: boolean;
  onEdit(patient: Patient): void; onDelete(patient: Patient): void;
};

export function PatientCard({ patient, doctorName, ...actions }: Props) {
  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3"><Avatar name={patient.name} /><div className="text-left"><strong className="block text-sm">{patient.name}</strong><span className="text-xs text-base-content/55">{patient.age} yrs · {patient.gender}</span></div></div>
          <StatusBadge status={patient.status} />
        </div>
        <div className="mt-1 grid grid-cols-2 gap-4 border-t border-base-300 pt-4 text-left">
          <span><small className="block text-[10px] text-base-content/50">Condition</small><b className="text-xs">{patient.condition}</b></span>
          <span><small className="block text-[10px] text-base-content/50">Doctor</small><b className="text-xs">{doctorName(patient.doctorId).replace("Dr. ", "")}</b></span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-base-300 pt-3">
          <span className="text-[10px] uppercase tracking-wider text-base-content/50">Booking {patient.bookingId ? `#${patient.bookingId}` : ""}</span>
          <BookingStatusBadge status={patient.bookingStatus} />
        </div>
        <PatientActions patient={patient} {...actions} />
      </div>
    </article>
  );
}
