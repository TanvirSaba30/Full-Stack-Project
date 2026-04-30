// API helper — attaches JWT token to all requests
const API_BASE = '/api';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(API_BASE + url, { ...options, headers: getHeaders() });
  } catch (err) {
    throw new Error('Cannot connect to server. Make sure the backend is running.');
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error('Server returned an invalid response. Is the backend running on port 5001?');
  }
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Auth
export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const register = (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const getMe = () => request('/auth/me');
export const getFacultyList = () => request('/auth/faculty');

// Slots
export const createSlot = (body) => request('/slots', { method: 'POST', body: JSON.stringify(body) });
export const getMySlots = () => request('/slots');
export const getAvailableSlots = (facultyId) => request(`/slots/available/${facultyId}`);

// Appointments
export const bookAppointment = (slotId, purpose) => request('/appointments', { method: 'POST', body: JSON.stringify({ slotId, purpose }) });
export const getMyAppointments = () => request('/appointments');
export const updateAppointmentStatus = (id, status) => request(`/appointments/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

// Notifications
export const getNotifications = () => request('/notifications');
