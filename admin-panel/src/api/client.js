const BASE_URL = 'http://localhost:8080';

// TODO: If multi-tab support is ever needed, credentials would need to move to
// sessionStorage or a shared auth context rather than a module-level variable.
let credentials = null;

export function setCredentials(username, password) {
  credentials = btoa(`${username}:${password}`);
}

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(credentials ? { Authorization: `Basic ${credentials}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}

export async function getCourts() {
  return apiFetch('/api/admin/courts');
}

export async function createCourt(data) {
  return apiFetch('/api/admin/courts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function generateSlots(courtId) {
  return apiFetch(`/api/admin/courts/${courtId}/generate-slots`, {
    method: 'POST',
  });
}

export async function getReservations(courtId) {
  return apiFetch(`/api/admin/courts/${courtId}/reservations`);
}

export async function cancelReservation(reservationId) {
  return apiFetch(`/api/admin/reservations/${reservationId}`, {
    method: 'DELETE',
  });
}

export async function getSlots(courtId, startDate, endDate) {
  return apiFetch(
    `/api/courts/${courtId}/slots?startDate=${startDate}&endDate=${endDate}`
  );
}
