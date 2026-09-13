import type { Patient } from "@/dashboard/types";

type Props = {
  patient: Patient;
  canUpdate: boolean;
  canDelete: boolean;
  compact?: boolean;
  onEdit(patient: Patient): void;
  onDelete(patient: Patient): void;
};

export function PatientActions({ patient, canUpdate, canDelete, compact = false, onEdit, onDelete }: Props) {
  if (!canUpdate && !canDelete) return null;

  return (
    <div className={compact ? "flex items-center gap-1" : "card-actions justify-end"}>
      {canUpdate && <button type="button" className={compact ? "btn btn-square btn-ghost btn-xs" : "btn btn-ghost btn-xs"} onClick={() => onEdit(patient)} aria-label={compact ? `Edit ${patient.name}` : undefined}>{compact ? "✎" : "Edit"}</button>}
      {canDelete && <button type="button" className={compact ? "btn btn-square btn-ghost btn-xs text-error" : "btn btn-ghost btn-xs text-error"} onClick={() => onDelete(patient)} aria-label={compact ? `Delete ${patient.name}` : undefined}>{compact ? "×" : "Delete"}</button>}
    </div>
  );
}
