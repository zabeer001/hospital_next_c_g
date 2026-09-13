import { Avatar, BookingStatusBadge, StatusBadge } from "@/dashboard/ui";
import type { Patient } from "@/dashboard/types";

export function UpcomingVisitCard({
  patient,
  canComplete,
  canDelete,
  onComplete,
  onDelete,
}: {
  patient: Patient;
  canComplete: boolean;
  canDelete: boolean;
  onComplete(id: string): void;
  onDelete(patient: Patient): void;
}) {
  return (
    <div className="card border border-base-300 bg-base-100">
      <div className="card-body gap-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={patient.name} size="sm" />
          <div className="min-w-0 flex-1">
            <strong className="block text-sm">{patient.name}</strong>
            <span className="block text-xs text-base-content/55">
              {patient.condition} · {patient.age} years
            </span>
          </div>
          <StatusBadge status={patient.status} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-base-content/50">Booking {patient.bookingId ? `#${patient.bookingId}` : ""}</span>
          <BookingStatusBadge status={patient.bookingStatus} />
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
        {(canComplete || canDelete) && (
          <div className="flex justify-end gap-2">
            {canComplete && (
              <button
                type="button"
                className="btn btn-success btn-xs"
                onClick={() => onComplete(patient.id)}
              >
                Mark visited
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="btn btn-square btn-ghost btn-xs text-error"
                onClick={() => onDelete(patient)}
                aria-label={`Delete ${patient.name}`}
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>
    </div>
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
