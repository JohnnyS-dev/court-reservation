import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateSlots } from '../api/client';

export default function CourtCard({ court, onSlotsGenerated }) {
  const [slotMessage, setSlotMessage] = useState('');
  const [slotError, setSlotError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleGenerateSlots() {
    setSlotMessage('');
    setSlotError('');
    setLoading(true);

    try {
      const res = await generateSlots(court.id);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setSlotError(body.message || 'Failed to generate slots.');
        return;
      }
      setSlotMessage('Slots generated successfully.');
      if (onSlotsGenerated) onSlotsGenerated(court.id);
    } catch {
      setSlotError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  function handleViewReservations() {
    navigate(`/reservations/${court.id}`);
  }

  return (
    <div className={`court-card ${court.active ? '' : 'court-card--inactive'}`}>
      <div className="court-card-header">
        <h3 className="court-card-name">{court.name}</h3>
        <span className={`badge ${court.active ? 'badge--active' : 'badge--inactive'}`}>
          {court.active ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="court-card-body">
        {/* TODO: If more court types are added, type could become a badge/icon. */}
        <p><span className="label">Type:</span> {court.type}</p>
        <p>
          <span className="label">Hours:</span>{' '}
          {court.operatingHoursStart} – {court.operatingHoursEnd}
        </p>
        <p><span className="label">Max days out:</span> {court.maxDaysOut}</p>
      </div>
      {slotMessage && <p className="success-message">{slotMessage}</p>}
      {slotError && <p className="error-message">{slotError}</p>}
      <div className="court-card-actions">
        <button
          className="btn btn-secondary"
          onClick={handleGenerateSlots}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate Slots'}
        </button>
        <button className="btn btn-primary" onClick={handleViewReservations}>
          View Reservations
        </button>
      </div>
    </div>
  );
}
