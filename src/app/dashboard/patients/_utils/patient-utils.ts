export function matchesPatientDate(value: string, filter: string) {
  if (filter === "All time") return true;
  const days = filter === "Last 7 days" ? 7 : filter === "Last 30 days" ? 30 : 365;
  return (new Date("2026-09-12").getTime() - new Date(value).getTime()) / 86400000 <= days;
}

export function formatPatientDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
