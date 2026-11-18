/**
 * Generates an RFC 5545 compliant .ics calendar file for non-sensitive
 * organizational appointment preparation reminders.
 */
export function downloadIcsReminder(params: {
  title: string;
  dateYmd: string; // YYYY-MM-DD
  timeStr: string; // e.g. '10:30 AM'
  location: string;
  description: string;
  filename?: string;
}): void {
  const { title, dateYmd, timeStr, location, description, filename = 'core-visit-reminder.ics' } = params;

  const cleanDate = dateYmd.replace(/-/g, '');
  let hours = 10;
  let minutes = 0;

  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const startLocal = `${cleanDate}T${pad(hours)}${pad(minutes)}00`;
  const endHour = Math.min(23, hours + 1);
  const endLocal = `${cleanDate}T${pad(endHour)}${pad(minutes)}00`;

  const escapeIcs = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CORE Healthcare Accessibility//Visit Reminder//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:core-${cleanDate}-${Date.now()}@core-care.local`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startLocal}`,
    `DTEND:${endLocal}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPlainTextSummary(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
