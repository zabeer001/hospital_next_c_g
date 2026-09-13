import { Avatar } from "@/dashboard/ui";
import type { Doctor, Patient } from "@/dashboard/types";

export function DoctorsTable({
  doctors,
  patients,
  isUpcomingVisit,
  onSelect,
}: {
  doctors: Doctor[];
  patients: Patient[];
  isUpcomingVisit(patient: Patient): boolean;
  onSelect(doctor: Doctor): void;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Hospital</th>
            <th>Contact</th>
            <th>Upcoming</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>
                <div className="flex items-center gap-3">
                  <Avatar name={doctor.name} />
                  <div>
                    <strong className="block text-sm">{doctor.name}</strong>
                    <small className="text-base-content/50">
                      Joined {shortDate(doctor.createdAt)}
                    </small>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge badge-ghost badge-sm">
                  {doctor.specialization}
                </span>
              </td>
              <td>{doctor.hospital}</td>
              <td>
                <span className="block">
                  {doctor.email}
                  <small className="block text-base-content/50">
                    {doctor.phone}
                  </small>
                </span>
              </td>
              <td>
                <span className="badge badge-primary badge-sm">
                  {
                    patients.filter(
                      (patient) =>
                        patient.doctorId === doctor.id &&
                        isUpcomingVisit(patient),
                    ).length
                  }{" "}
                  booked
                </span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-primary"
                  onClick={() => onSelect(doctor)}
                >
                  View schedule →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function shortDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
