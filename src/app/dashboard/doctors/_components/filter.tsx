export function Filter({
  label,
  value,
  onChange,
  options,
  allLabel = "All",
}: {
  label: string;
  value: string;
  onChange(value: string): void;
  options: string[];
  allLabel?: string;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        className="select select-bordered select-sm w-full bg-base-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option>{allLabel}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
