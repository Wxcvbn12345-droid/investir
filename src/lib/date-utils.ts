/**
 * Compute the number of months between two dates.
 * Returns at least 1 month.
 */
export const computeDurationMonths = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startTime = start.getTime();
  const endTime = end.getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime)) return 1;
  const diffMs = endTime - startTime;
  if (diffMs <= 0) return 1;
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44)));
};

/**
 * Add a number of months to a date string (YYYY-MM-DD).
 */
export const addMonths = (dateStr: string, months: number): string => {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
};