const ARGENTINA_UTC_OFFSET_HOURS = -3;

export function getTodayUTC(): Date {
  const now = new Date();
  const argentinaNow = new Date(now.getTime() + ARGENTINA_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  return new Date(Date.UTC(argentinaNow.getUTCFullYear(), argentinaNow.getUTCMonth(), argentinaNow.getUTCDate()));
}