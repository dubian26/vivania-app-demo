// Formats an ISO date (YYYY-MM-DD) using the "es-CO" locale.
// UTC is forced so server and client render the same value.
export function formatDate(value: string) {
  if (!value) return "-"

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value))
}
