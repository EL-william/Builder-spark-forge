export interface TimezoneInfo {
  id: string;
  name: string;
  offset: string;
  label: string;
}

export const COMMON_TIMEZONES: TimezoneInfo[] = [
  {
    id: "Europe/Moscow",
    name: "Москва",
    offset: "+03:00",
    label: "Москва (UTC+3)",
  },
  {
    id: "Europe/London",
    name: "Лондон",
    offset: "+00:00",
    label: "Лондон (UTC+0)",
  },
  {
    id: "America/New_York",
    name: "Нью-Йорк",
    offset: "-05:00",
    label: "Нью-Йорк (UTC-5)",
  },
  {
    id: "America/Los_Angeles",
    name: "Лос-Анджелес",
    offset: "-08:00",
    label: "Лос-Анджелес (UTC-8)",
  },
  {
    id: "Asia/Tokyo",
    name: "Токио",
    offset: "+09:00",
    label: "Токио (UTC+9)",
  },
  {
    id: "Europe/Paris",
    name: "Париж",
    offset: "+01:00",
    label: "Париж (UTC+1)",
  },
  {
    id: "Asia/Dubai",
    name: "Дубай",
    offset: "+04:00",
    label: "Дубай (UTC+4)",
  },
  {
    id: "Australia/Sydney",
    name: "Сидней",
    offset: "+11:00",
    label: "Сидней (UTC+11)",
  },
];

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatDateInTimezone(
  date: Date,
  timezone: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat("ru-RU", {
    ...options,
    timeZone: timezone,
  }).format(date);
}

export function convertToTimezone(date: Date, timezone: string): Date {
  // This is a simplified conversion - in production you'd use a library like date-fns-tz
  const userTimezone = getUserTimezone();
  if (userTimezone === timezone) return date;

  // Basic offset calculation (in a real app, use proper timezone libraries)
  const userOffset = new Date().getTimezoneOffset();
  const targetTimezoneInfo = COMMON_TIMEZONES.find((tz) => tz.id === timezone);

  if (!targetTimezoneInfo) return date;

  const offsetHours = parseInt(targetTimezoneInfo.offset.substring(1, 3));
  const offsetMinutes = parseInt(targetTimezoneInfo.offset.substring(4, 6));
  const totalOffsetMinutes =
    (targetTimezoneInfo.offset.startsWith("+") ? 1 : -1) *
    (offsetHours * 60 + offsetMinutes);

  const adjustedDate = new Date(date);
  adjustedDate.setMinutes(
    adjustedDate.getMinutes() + totalOffsetMinutes + userOffset,
  );

  return adjustedDate;
}

export function getTimezoneOffset(timezone: string): string {
  const targetTimezoneInfo = COMMON_TIMEZONES.find((tz) => tz.id === timezone);
  return targetTimezoneInfo?.offset || "+00:00";
}
