import {
  format,
  formatDistanceToNow,
  addMinutes as dateFnsAddMinutes,
  addHours as dateFnsAddHours,
  isPast,
  parseISO,
} from 'date-fns';

// Parse date input to Date object
const toDate = (date: Date | number | string): Date =>
  typeof date === 'string' ? parseISO(date) : new Date(date);

// Format a date with pattern (default: 'MMM d, yyyy')
export function formatDate(
  date: Date | number | string,
  pattern: string = 'MMM d, yyyy'
): string {
  return format(toDate(date), pattern);
}

// Format as relative time (e.g., "2 hours ago")
export function formatRelativeTime(
  date: Date | number | string,
  addSuffix: boolean = true
): string {
  return formatDistanceToNow(toDate(date), { addSuffix });
}

// Check if date has passed
export function isExpired(date: Date | number | string): boolean {
  return isPast(toDate(date));
}

// Add minutes to date
export function addMinutes(date: Date | number, minutes: number): Date {
  return dateFnsAddMinutes(new Date(date), minutes);
}

// Add hours to date
export function addHours(date: Date | number, hours: number): Date {
  return dateFnsAddHours(new Date(date), hours);
}

// Format with date and time
export function formatDateTime(date: Date | number | string): string {
  return formatDate(date, 'MMM d, yyyy h:mm a');
}

// Format time only
export function formatTime(date: Date | number | string): string {
  return formatDate(date, 'h:mm a');
}
