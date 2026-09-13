export function DoctorsHeader({
  doctorCount,
  hospitalCount,
  canCreate,
  onCreate,
}: {
  doctorCount: number;
  hospitalCount: number;
  canCreate: boolean;
  onCreate(): void;
}) {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h2 className="card-title">Doctor directory</h2>
        <p className="mt-1 text-sm text-base-content/55">
          {doctorCount} doctors across {hospitalCount} locations
        </p>
      </div>
      {canCreate && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onCreate}
        >
          + Add doctor
        </button>
      )}
    </div>
  );
}
