import type { Doctor } from "@/dashboard/types";

type Option = string | { value: string; label: string };
type Props = {
  query: string; condition: string; status: string; doctor: string; date: string;
  conditions: string[]; doctors: Doctor[];
  onQueryChange(value: string): void; onConditionChange(value: string): void;
  onStatusChange(value: string): void; onDoctorChange(value: string): void; onDateChange(value: string): void;
};

export function PatientsFilters(props: Props) {
  return (
    <div className="grid gap-3 border-y border-base-300 bg-base-200 p-4 md:grid-cols-[minmax(14rem,1fr)_repeat(4,minmax(7rem,auto))] md:px-6">
      <label className="input input-bordered input-sm flex w-full items-center gap-2 bg-base-100">
        <span>⌕</span>
        <input className="grow" value={props.query} onChange={(event) => props.onQueryChange(event.target.value)} placeholder="Search patients, conditions…" aria-label="Search patients" />
      </label>
      <Filter value={props.condition} onChange={props.onConditionChange} options={["All conditions", ...props.conditions]} label="Condition" />
      <Filter value={props.status} onChange={props.onStatusChange} options={["All statuses", "Active", "Monitoring", "Recovered"]} label="Status" />
      <Filter value={props.doctor} onChange={props.onDoctorChange} options={[{ value: "All doctors", label: "All doctors" }, ...props.doctors.map(({ id, name }) => ({ value: id, label: name }))]} label="Doctor" />
      <Filter value={props.date} onChange={props.onDateChange} options={["All time", "Last 7 days", "Last 30 days", "This year"]} label="Date" />
    </div>
  );
}

function Filter({ value, onChange, options, label }: { value: string; onChange(value: string): void; options: Option[]; label: string }) {
  return (
    <label>
      <span className="sr-only">Filter by {label}</span>
      <select className="select select-bordered select-sm w-full bg-base-100" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => {
          const optionValue = typeof option === "string" ? option : option.value;
          return <option key={optionValue} value={optionValue}>{typeof option === "string" ? option : option.label}</option>;
        })}
      </select>
    </label>
  );
}
