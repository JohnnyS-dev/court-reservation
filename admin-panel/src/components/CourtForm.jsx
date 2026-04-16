import { useState } from 'react';
import { createCourt } from '../api/client';

const HOUR_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour24 = i + 6;
  const label = hour24 < 12
    ? `${hour24} AM`
    : hour24 === 12
    ? '12 PM'
    : `${hour24 - 12} PM`;
  return { label, value: String(hour24).padStart(2, '0') };
});

const MINUTE_OPTIONS = [
  { label: '00', value: '00' },
  { label: '15', value: '15' },
  { label: '30', value: '30' },
  { label: '45', value: '45' },
];

const EMPTY_FORM = {
  name: '',
  type: '',
  startHour: '',
  startMinute: '00',
  endHour: '',
  endMinute: '00',
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

    const payload = {
      name: form.name,
      type: form.type,
      operatingHoursStart: `${form.startHour}:${form.startMinute}:00`,
      operatingHoursEnd: `${form.endHour}:${form.endMinute}:00`,
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
              <label>Opens</label>
              <div className="time-selects">
                <select
                  name="startHour"
                  value={form.startHour}
                  onChange={handleChange}
                  required
                >
                  <option value="">Hour</option>
                  {HOUR_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  name="startMinute"
                  value={form.startMinute}
                  onChange={handleChange}
                  required
                >
                  {MINUTE_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Closes</label>
              <div className="time-selects">
                <select
                  name="endHour"
                  value={form.endHour}
                  onChange={handleChange}
                  required
                >
                  <option value="">Hour</option>
                  {HOUR_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  name="endMinute"
                  value={form.endMinute}
                  onChange={handleChange}
                  required
                >
                  {MINUTE_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
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
