/**
 * Calendar utility functions in plain JavaScript
 * These functions handle calendar calculations and date manipulations
 */

/**
 * Get the number of days in a month
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Number of days in the month
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the first day of the week for a given month
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @returns {number} Day of the week (0-6, where 0 is Sunday)
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Get all days for a calendar month view (including previous/next month days)
 * @param {number} year - The year
 * @param {number} month - The month (0-11)
 * @param {number} startDay - First day of week (0 = Sunday, 1 = Monday)
 * @returns {Array<Date>} Array of Date objects for the calendar grid
 */
export function getCalendarDays(year, month, startDay = 1) {
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const days = [];

  // Calculate how many days from previous month to show
  const dayOfWeek = firstDay;
  const daysToSubtract =
    startDay === 1
      ? dayOfWeek === 0
        ? 6
        : dayOfWeek - 1 // Monday start
      : dayOfWeek; // Sunday start

  // Add days from previous month
  for (let i = daysToSubtract - 1; i >= 0; i--) {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    days.push(new Date(prevYear, prevMonth, daysInPrevMonth - i));
  }

  // Add days from current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  // Add days from next month to fill the grid
  const remainingDays = 42 - days.length; // 6 weeks * 7 days = 42
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    days.push(new Date(nextYear, nextMonth, day));
  }

  return days;
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  return isSameDay(date, new Date());
}

/**
 * Check if a date is in the current month
 * @param {Date} date - Date to check
 * @param {number} year - Current year
 * @param {number} month - Current month (0-11)
 * @returns {boolean} True if date is in current month
 */
export function isCurrentMonth(date, year, month) {
  return date.getFullYear() === year && date.getMonth() === month;
}

/**
 * Format a date for display
 * @param {Date} date - Date to format
 * @param {string} locale - Locale string (default: 'ru-RU')
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = "ru-RU") {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time for display
 * @param {Date} date - Date to format
 * @param {string} locale - Locale string (default: 'ru-RU')
 * @returns {string} Formatted time string
 */
export function formatTime(date, locale = "ru-RU") {
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get week number for a date
 * @param {Date} date - Date to get week number for
 * @returns {number} Week number
 */
export function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

/**
 * Get the start and end dates of a week containing the given date
 * @param {Date} date - Date within the week
 * @param {number} startDay - First day of week (0 = Sunday, 1 = Monday)
 * @returns {Object} Object with start and end date of the week
 */
export function getWeekBounds(date, startDay = 1) {
  const day = date.getDay();
  const diff = day - startDay;
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - diff);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return { start: startDate, end: endDate };
}

/**
 * Get array of hours for day view
 * @returns {Array<string>} Array of hour strings
 */
export function getDayHours() {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(i.toString().padStart(2, "0") + ":00");
  }
  return hours;
}

/**
 * Calculate event position in day view
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @param {number} hourHeight - Height of one hour in pixels
 * @returns {Object} Object with top position and height
 */
export function calculateEventPosition(startTime, endTime, hourHeight = 60) {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const duration = endMinutes - startMinutes;

  const top = (startMinutes / 60) * hourHeight;
  const height = Math.max((duration / 60) * hourHeight, 30); // Minimum 30px height

  return { top, height };
}

/**
 * Generate recurring event instances
 * @param {Object} event - Base event object
 * @param {Date} startDate - Start date for generation
 * @param {Date} endDate - End date for generation
 * @returns {Array<Object>} Array of event instances
 */
export function generateRecurringEvents(event, startDate, endDate) {
  if (!event.isRecurring || !event.recurrence) {
    return [event];
  }

  const instances = [];
  const { frequency, interval = 1 } = event.recurrence;
  let currentDate = new Date(event.startDate);

  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      const instance = {
        ...event,
        id: `${event.id}-${currentDate.getTime()}`,
        startDate: new Date(currentDate),
        endDate: new Date(
          currentDate.getTime() + (event.endDate - event.startDate),
        ),
      };
      instances.push(instance);
    }

    // Move to next occurrence
    switch (frequency) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7 * interval);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
      default:
        return instances;
    }
  }

  return instances;
}

/**
 * Export all functions as default object for easier importing
 */
export default {
  getDaysInMonth,
  getFirstDayOfMonth,
  getCalendarDays,
  isSameDay,
  isToday,
  isCurrentMonth,
  formatDate,
  formatTime,
  getWeekNumber,
  getWeekBounds,
  getDayHours,
  calculateEventPosition,
  generateRecurringEvents,
};
