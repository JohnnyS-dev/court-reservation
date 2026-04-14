import { useState } from 'react';
import { cancelReservation } from '../api/client';

export default function ReservationTable({ reservations, onCancelled }) {
  // Track per-row loading state by reservationId to avoid blocking the full table.
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState('');

  async function handleCancel(reservationId) {
    setCancelError('');
    setCancellingId(reservationId);

    try {
      const res = await cancelReservation(reservationId);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setCancelError(body.message || `Failed to cancel reservation ${reservationId}.`);
        return;
      }
      onCancelled();
    } catch {
      setCancelError('Could not reach the server.');
    } finally {
      setCancellingId(null);
    }
  }

  if (reservations.length === 0) {
    return <p className="empty-state">No reservations found for this court.</p>;
  }

  return (
    <div className="table-wrapper">
      {cancelError && <p className="error-message">{cancelError}</p>}
      <table className="reservations-table">
        <thead>
          <tr>
            <th>Booker Name</th>
            <th>Email</th>
            <th>Confirmation Code</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{reservation.bookerName}</td>
              <td>{reservation.email}</td>
              <td className="mono">{reservation.confirmationCode}</td>
              <td>{reservation.date}</td>
              <td>{reservation.startTime}</td>
              <td>
                <span className={`status-badge status-badge--${reservation.status.toLowerCase()}`}>
                  {reservation.status}
                </span>
              </td>
              <td>
                {reservation.status === 'CONFIRMED' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancel(reservation.id)}
                    disabled={cancellingId === reservation.id}
                  >
                    {cancellingId === reservation.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
