import { Filter } from "./filter";

type Props = {
  query: string;
  specialization: string;
  hospital: string;
  date: string;
  specializations: string[];
  hospitals: string[];
  onQueryChange(value: string): void;
  onSpecializationChange(value: string): void;
  onHospitalChange(value: string): void;
  onDateChange(value: string): void;
};

export function DoctorsFilters(props: Props) {
  return (
    <div className="grid gap-3 border-y border-base-300 bg-base-200 p-4 md:grid-cols-[minmax(14rem,1fr)_repeat(3,minmax(8rem,auto))] md:px-6">
      <label className="input input-bordered input-sm flex w-full items-center gap-2 bg-base-100">
        <span>⌕</span>
        <input
          className="grow"
          value={props.query}
          onChange={(event) => props.onQueryChange(event.target.value)}
          placeholder="Search doctors, hospitals…"
          aria-label="Search doctors"
        />
      </label>
      <Filter
        label="Specialization"
        value={props.specialization}
        onChange={props.onSpecializationChange}
        options={props.specializations}
      />
      <Filter
        label="Hospital"
        value={props.hospital}
        onChange={props.onHospitalChange}
        options={props.hospitals}
      />
      <Filter
        label="Date"
        value={props.date}
        onChange={props.onDateChange}
        options={["Last 7 days", "Last 30 days", "This year"]}
        allLabel="All time"
      />
    </div>
  );
}
