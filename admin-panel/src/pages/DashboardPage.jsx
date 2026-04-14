import { useState, useEffect } from 'react';
import { getCourts } from '../api/client';
import CourtCard from '../components/CourtCard';
import CourtForm from '../components/CourtForm';

export default function DashboardPage() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function fetchCourts() {
    setError('');
    try {
      const res = await getCourts();
      if (!res.ok) {
        setError('Failed to load courts.');
        return;
      }
      const data = await res.json();
      setCourts(data);
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourts();
  }, []);

  function handleCourtCreated() {
    setShowForm(false);
    fetchCourts();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Courts</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Court
        </button>
      </div>

      {showForm && (
        <CourtForm
          onSuccess={handleCourtCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <p className="loading-state">Loading courts…</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && courts.length === 0 && (
        <p className="empty-state">No courts yet. Create one to get started.</p>
      )}

      <div className="court-grid">
        {courts.map((court) => (
          <CourtCard
            key={court.id}
            court={court}
            // TODO: onSlotsGenerated could be used to update slot counts on the
            // card if the API ever returns that data.
            onSlotsGenerated={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
