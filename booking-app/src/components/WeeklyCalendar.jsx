/**
 * WeeklyCalendar
 * Renders a vertical list of days for the current week.
 * Each day shows available and unavailable hour blocks.
 *
 * Props:
 *   slots       - array of slot objects from the API
 *   onSlotSelected - callback(slot) when a tappable slot is tapped
 */

/** Format a YYYY-MM-DD string as a human-readable day header. */
function formatDateHeader(dateStr) {
  // TODO: if backend returns dates in UTC, this will be off by one in some timezones
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Format an ISO time string (or HH:MM:SS) as "9:00 AM". */
function formatTime(timeStr) {
  // Handles both "HH:MM:SS" and "HH:MM"
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, '0');
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

/** Group a flat slot array into { date -> [slot, ...] }, sorted by date then startTime. */
function groupSlotsByDate(slots) {
  const map = {};
  for (const slot of slots) {
    const date = slot.date ?? slot.slotDate ?? slot.startDate;
    if (!map[date]) map[date] = [];
    map[date].push(slot);
  }
  for (const date of Object.keys(map)) {
    // Sort by startTime string — works for HH:MM and HH:MM:SS
    map[date].sort((a, b) =>
      (a.startTime ?? '').localeCompare(b.startTime ?? '')
    );
  }
  return map;
}

export default function WeeklyCalendar({ slots, onSlotSelected }) {
  if (!slots || slots.length === 0) {
    return <p style={styles.empty}>No slots available this week.</p>;
  }

  const grouped = groupSlotsByDate(slots);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Reserve a Court</h1>
      {sortedDates.map((date) => (
        <div key={date} style={styles.dayBlock}>
          <h2 style={styles.dayHeader}>{formatDateHeader(date)}</h2>
          <div style={styles.slotRow}>
            {grouped[date].map((slot) => {
              const available = slot.status === 'AVAILABLE';
              return (
                <button
                  key={slot.id ?? slot.slotId}
                  style={{
                    ...styles.slotButton,
                    ...(available ? styles.available : styles.unavailable),
                  }}
                  disabled={!available}
                  onClick={() => available && onSlotSelected(slot)}
                  aria-label={`${formatTime(slot.startTime)} — ${available ? 'available' : 'unavailable'}`}
                >
                  {formatTime(slot.startTime)}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem',
  },
  heading: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: '1.25rem',
    color: '#1a1a1a',
  },
  empty: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: '#888',
    fontSize: '0.95rem',
  },
  dayBlock: {
    marginBottom: '1.5rem',
  },
  dayHeader: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  slotRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  slotButton: {
    padding: '0.5rem 0.75rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    // Minimum tap target
    minHeight: '44px',
    minWidth: '72px',
    transition: 'opacity 0.1s',
  },
  available: {
    background: '#16a34a',
    color: '#ffffff',
  },
  unavailable: {
    background: '#e5e7eb',
    color: '#6b7280',
    cursor: 'default',
  },
};
