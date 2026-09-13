import { DoctorForm } from "@/dashboard/forms";
import type { DoctorInput } from "@/dashboard/types";
import { Overlay } from "@/dashboard/ui";

export function DoctorCreateModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose(): void;
  onSubmit(input: DoctorInput): Promise<boolean>;
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title="Add a new doctor"
      description="Create a profile for a member of your care team."
    >
      <DoctorForm onCancel={onClose} onSubmit={onSubmit} />
    </Overlay>
  );
}
