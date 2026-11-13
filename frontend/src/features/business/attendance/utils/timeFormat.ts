/**
 * Formats a 24-hour SQL time string (e.g. '09:30:00', '18:30', '10:29:15')
 * or ISO timestamp into standard Indian enterprise 12-hour AM/PM format (e.g. '09:30 AM', '06:30 PM').
 */
export function formatTime12Hour(timeStr?: string | null): string {
  if (!timeStr) return 'N/A';
  const trimmed = timeStr.trim();
  if (!trimmed) return 'N/A';

  // Already contains AM or PM
  if (trimmed.toUpperCase().includes('AM') || trimmed.toUpperCase().includes('PM')) {
    return trimmed;
  }

  // Handle time format 'HH:MM:SS' or 'HH:MM'
  const parts = trimmed.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    if (isNaN(hours)) return trimmed;

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  return trimmed;
}

