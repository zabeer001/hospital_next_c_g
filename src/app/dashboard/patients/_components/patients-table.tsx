import { Avatar, BookingStatusBadge, StatusBadge } from "@/dashboard/ui";
import type { Doctor, Patient } from "@/dashboard/types";
import { formatPatientDate } from "../_utils/patient-utils";
import { PatientActions } from "./patient-actions";

type Props = {
  patients: Patient[]; doctors: Doctor[]; doctorName(doctorId: string): string;
  canUpdate: boolean; canDelete: boolean;
  onEdit(patient: Patient): void; onDelete(patient: Patient): void;
};

export function PatientsTable({ patients, doctors, doctorName, ...actions }: Props) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="table table-zebra">
        <thead><tr><th>Patient</th><th>Assigned doctor</th><th>Condition</th><th>Patient status</th><th>Booking</th><th>Admitted</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{patients.map((patient) => (
          <tr key={patient.id}>
            <td><div className="flex items-center gap-3"><Avatar name={patient.name} /><div><strong className="block text-sm">{patient.name}</strong><small className="text-base-content/50">{patient.age} yrs · {patient.gender}</small></div></div></td>
            <td><span className="block">{doctorName(patient.doctorId)}<small className="block text-base-content/50">{doctors.find((doctor) => doctor.id === patient.doctorId)?.specialization}</small></span></td>
            <td>{patient.condition}</td>
            <td><StatusBadge status={patient.status} /></td>
            <td><div className="space-y-1"><BookingStatusBadge status={patient.bookingStatus} />{patient.bookingId && <small className="block text-base-content/50">#{patient.bookingId}</small>}</div></td>
            <td>{patient.admittedAt ? formatPatientDate(patient.admittedAt) : "—"}</td>
            <td><PatientActions patient={patient} compact {...actions} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
