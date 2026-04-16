const BASE_URL = 'http://localhost:8080';

/**
 * Fetch available/booked slots for a court within a date range.
 * @param {string} courtId
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate   - YYYY-MM-DD
 */
export async function getSlots(courtId, startDate, endDate) {
  const params = new URLSearchParams({ startDate, endDate });
  const res = await fetch(`${BASE_URL}/api/courts/${courtId}/slots?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch slots (${res.status})`);
  return res.json();
}

/**
 * Reserve a specific slot for a booker.
 * @param {string} courtId
 * @param {string|number} slotId
 * @param {string} bookerName
 * @param {string} bookerEmail
 */
export async function reserveSlot(courtId, slotId, bookerName, bookerEmail) {
  const res = await fetch(
    `${BASE_URL}/api/courts/${courtId}/slots/${slotId}/reserve`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookerName, bookerEmail }),
    }
  );
  if (!res.ok) {
    // TODO: parse a structured error body from the backend if one is added later
    const text = await res.text().catch(() => '');
    throw new Error(text || `Reservation failed (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch court details by ID.
 * @param {string} courtId
 */
export async function getCourt(courtId) {
  const res = await fetch(`${BASE_URL}/api/courts/${courtId}`);
  if (!res.ok) throw new Error(`Failed to fetch court (${res.status})`);
  return res.json();
}
