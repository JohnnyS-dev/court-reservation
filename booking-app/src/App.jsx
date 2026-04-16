import { useState, useEffect } from 'react';
import { getSlots } from './api/client.js';
import WeeklyCalendar from './components/WeeklyCalendar.jsx';
import BookingForm from './components/BookingForm.jsx';
import ConfirmationScreen from './components/ConfirmationScreen.jsx';

/** Format a Date as YYYY-MM-DD in local time (not UTC). */
function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const courtId = params.get('courtId');

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courtId) return;

    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + 6);

    const startDate = toLocalDateString(today);
    const endDate = toLocalDateString(end);

    setLoading(true);
    setError(null);

    getSlots(courtId, startDate, endDate)
      .then(setSlots)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [courtId]);

  if (!courtId) {
    return (
      <div style={styles.errorPage}>
        <p style={styles.errorText}>
          No court specified. Please scan the QR code at the facility.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div style={styles.status}>Loading availability…</div>;
  }

  if (error && slots.length === 0) {
    return (
      <div style={styles.errorPage}>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (confirmationCode !== null) {
    return (
      <ConfirmationScreen
        confirmationCode={confirmationCode}
        onDone={() => {
          setConfirmationCode(null);
          setSelectedSlot(null);
        }}
      />
    );
  }

  if (selectedSlot !== null) {
    return (
      <BookingForm
        slot={selectedSlot}
        courtId={courtId}
        onConfirmed={(code) => setConfirmationCode(code)}
        onCancel={() => setSelectedSlot(null)}
      />
    );
  }

  return (
    <>
      {error && <div style={styles.banner}>{error}</div>}
      <WeeklyCalendar slots={slots} onSlotSelected={setSelectedSlot} />
    </>
  );
}

const styles = {
  errorPage: {
    padding: '2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100dvh',
  },
  errorText: {
    fontSize: '1rem',
    color: '#555',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  status: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    color: '#555',
    fontSize: '0.95rem',
  },
  banner: {
    background: '#fef2f2',
    color: '#b91c1c',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    borderBottom: '1px solid #fecaca',
  },
};
