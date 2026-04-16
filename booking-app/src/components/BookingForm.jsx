import { useState } from 'react';
import { reserveSlot } from '../api/client.js';

/**
 * BookingForm
 * Collects booker name + email and submits the reservation.
 *
 * Props:
 *   slot        - the slot object selected in WeeklyCalendar
 *   courtId     - string, passed down from App
 *   onConfirmed - callback(confirmationCode: string)
 *   onCancel    - callback()
 */

function formatDateHeader(dateStr) {
  // TODO: duplicated from WeeklyCalendar — consider a shared utils file if this grows
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr.padStart(2, '0');
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

export default function BookingForm({ slot, courtId, onConfirmed, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const slotDate = slot.date ?? slot.slotDate ?? slot.startDate;
  const slotId = slot.id ?? slot.slotId;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await reserveSlot(courtId, slotId, name.trim(), email.trim());
      // TODO: confirm the exact field name for the confirmation code in the API response
      const code = result.confirmationCode ?? result.code ?? result.id;
      onConfirmed(String(code));
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.slotSummary}>
        <span style={styles.slotDate}>{formatDateHeader(slotDate)}</span>
        <span style={styles.slotTime}>{formatTime(slot.startTime)}</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        <label style={styles.label} htmlFor="booker-name">
          Name
        </label>
        <input
          id="booker-name"
          type="text"
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
          autoComplete="name"
          disabled={submitting}
        />

        <label style={styles.label} htmlFor="booker-email">
          Email
        </label>
        <input
          id="booker-email"
          type="email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={submitting}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...styles.submitButton,
            opacity: submitting ? 0.6 : 1,
          }}
          disabled={submitting || !name.trim() || !email.trim()}
        >
          {submitting ? 'Reserving…' : 'Reserve Slot'}
        </button>

        <button
          type="button"
          style={{ ...styles.button, ...styles.cancelButton }}
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.25rem 1rem',
  },
  slotSummary: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '0.875rem 1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  slotDate: {
    fontSize: '0.875rem',
    color: '#15803d',
    fontWeight: 500,
  },
  slotTime: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#14532d',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    marginTop: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.875rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    color: '#1a1a1a',
    background: '#fff',
    outline: 'none',
    // Prevents iOS zoom on focus (font-size must be >= 16px)
    // TODO: revisit if design changes input font size
  },
  error: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '0.625rem 0.875rem',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  button: {
    width: '100%',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '48px',
    marginTop: '0.5rem',
    transition: 'opacity 0.15s',
  },
  submitButton: {
    background: '#16a34a',
    color: '#ffffff',
  },
  cancelButton: {
    background: '#f3f4f6',
    color: '#374151',
  },
};
