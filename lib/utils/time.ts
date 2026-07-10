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