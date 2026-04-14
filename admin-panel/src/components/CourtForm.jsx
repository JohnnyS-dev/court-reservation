import { useState } from 'react';
import { createCourt } from '../api/client';

const EMPTY_FORM = {
  name: '',
  type: '',
  operatingHoursStart: '',
  operatingHoursEnd: '',
  maxDaysOut: '',
};

export default function CourtForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // TODO: Validate that operatingHoursStart < operatingHoursEnd if stricter UX is needed.
    const payload = {
      ...form,
      maxDaysOut: parseInt(form.maxDaysOut, 10),
    };

    try {
      const res = await createCourt(payload);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Failed to create court.');
        return;
      }
      onSuccess();
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>New Court</h2>
        <form onSubmit={handleSubmit} className="court-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              id="type"
              name="type"
              type="text"
              value={form.type}
              onChange={handleChange}
              required
              placeholder="e.g. Tennis, Basketball"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="operatingHoursStart">Opens</label>
              <input
                id="operatingHoursStart"
                name="operatingHoursStart"
                type="time"
                value={form.operatingHoursStart}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="operatingHoursEnd">Closes</label>
              <input
                id="operatingHoursEnd"
                name="operatingHoursEnd"
                type="time"
                value={form.operatingHoursEnd}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="maxDaysOut">Max Days Out</label>
            <input
              id="maxDaysOut"
              name="maxDaysOut"
              type="number"
              min="1"
              value={form.maxDaysOut}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Court'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
