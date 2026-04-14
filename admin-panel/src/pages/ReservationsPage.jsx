import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReservations } from '../api/client';
import ReservationTable from '../components/ReservationTable';

export default function ReservationsPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchReservations() {
    setError('');
    try {
      const res = await getReservations(courtId);
      if (!res.ok) {
        setError('Failed to load reservations.');
        return;
      }
      const data = await res.json();
      setReservations(data);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
    // TODO: If real-time updates are needed, replace this with a polling
    // interval or WebSocket subscription.
  }, [courtId]);

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h2>Reservations</h2>
      </div>

      {loading && <p className="loading-state">Loading reservations…</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <ReservationTable
          reservations={reservations}
          onCancelled={fetchReservations}
        />
      )}
    </div>
  );
}
