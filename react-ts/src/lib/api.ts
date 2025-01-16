import { Event } from '../types/database';


//const PORT = import.meta.env.VITE_PORT;
const API_URL = `http://localhost:3000/api`;

console.log(API_URL)
console.log("hello")

let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

// Auth API
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const register = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

// Events API
export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`, {
    headers: headers(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const createEvent = async (eventData: Partial<Event>) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(eventData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(eventData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const deleteEvent = async (id: string) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};

export const toggleAttendance = async (eventId: string) => {
  const response = await fetch(`${API_URL}/events/${eventId}/attend`, {
    method: 'POST',
    headers: headers(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};