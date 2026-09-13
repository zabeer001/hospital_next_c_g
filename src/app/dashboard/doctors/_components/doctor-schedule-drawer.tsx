import { PatientForm } from "@/dashboard/forms";
import type { Doctor, Patient, PatientInput } from "@/dashboard/types";
import { EmptyState, Overlay } from "@/dashboard/ui";
import { UpcomingVisitCard } from "./upcoming-visit-card";

type Props = {
  doctor: Doctor | null;
  doctors: Doctor[];
  patients: Patient[];
  addingPatient: boolean;
  canCreatePatient: boolean;
  canCompleteVisit: boolean;
  canDeletePatient: boolean;
  onClose(): void;
  onTogglePatientForm(): void;
  onClosePatientForm(): void;
  onAddPatient(input: PatientInput): Promise<boolean>;
  onCompleteVisit(id: string): void;
  onDeletePatient(patient: Patient): void;
};

export function DoctorScheduleDrawer(props: Props) {
  const upcoming = props.doctor
    ? props.patients
        .filter(
          (patient) =>
            patient.doctorId === props.doctor!.id && isUpcomingVisit(patient),
        )
        .sort((a, b) =>
          (a.appointmentAt || "").localeCompare(b.appointmentAt || ""),
        )
    : [];
  return (
    <Overlay
      open={Boolean(props.doctor)}
      onClose={props.onClose}
      title={props.doctor?.name || "Doctor"}
      description={
        props.doctor
          ? `${props.doctor.specialization} · ${props.doctor.hospital}`
          : undefined
      }
      variant="drawer"
    >
      {props.doctor && (
        <div className="p-5 sm:p-6">
          <div className="alert mb-6 bg-base-100 text-sm">
            <span>{props.doctor.email}</span>
            <span>{props.doctor.phone}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">Upcoming visits</h3>
              <p className="mt-1 text-xs text-base-content/55">
                {upcoming.length} patients booked to visit shortly
              </p>
            </div>
            {props.canCreatePatient && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={props.onTogglePatientForm}
              >
                {props.addingPatient ? "Close form" : "+ Book patient"}
              </button>
            )}
          </div>
          {props.addingPatient && props.canCreatePatient && (
            <div className="card mt-5 border border-base-300 bg-base-100">
              <div className="card-body p-5">
                <PatientForm
                  doctors={props.doctors}
                  defaultDoctorId={props.doctor.id}
                  onCancel={props.onClosePatientForm}
                  onSubmit={props.onAddPatient}
                />
              </div>
            </div>
          )}
          <div className="mt-6 space-y-3">
            {upcoming.length ? (
              upcoming.map((patient) => (
                <UpcomingVisitCard
                  key={patient.id}
                  patient={patient}
                  canComplete={props.canCompleteVisit}
                  canDelete={props.canDeletePatient}
                  onComplete={props.onCompleteVisit}
                  onDelete={props.onDeletePatient}
                />
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
  );
}

export function isUpcomingVisit(patient: Patient) {
  return (
    Boolean(patient.appointmentAt) &&
    patient.bookingStatus !== "Completed" &&
    patient.bookingStatus !== "Cancelled" &&
    !patient.visitCompletedAt &&
    new Date(patient.appointmentAt!).getTime() >= Date.now()
  );
}
