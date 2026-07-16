/**
 * Formatea una cantidad de segundos como texto relativo legible en español.
 * Ej: 45 -> "hace 45s", 180 -> "hace 3m", 7200 -> "hace 2h", 172800 -> "hace 2d"
 */
export function formatRelativeTime(seconds: number): string {
  if (seconds < 60) {
    return `hace ${seconds}s`;
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `hace ${minutes}m`;
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `hace ${hours}h`;
  }

  const days = Math.floor(seconds / 86400);
  return `hace ${days}d`;
}

/**
 * Formatea una fecha ISO como fecha corta en zona horaria Argentina.
 * Ej: "2026-07-15T23:30:00.000Z" -> "15/07/2026"
 */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
}