const BASE = 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('dasig_token');
}

function headers(extra = {}) {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: headers(), ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (body) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
  },
  events: {
    list: (category) => request(`/events${category && category !== 'All' ? `?category=${category}` : ''}`),
    get: (id) => request(`/events/${id}`),
    register: (id) => request(`/events/${id}/register`, { method: 'POST' }),
    unregister: (id) => request(`/events/${id}/register`, { method: 'DELETE' }),
    // Admin
    adminAll: () => request('/events/admin/all'),
    create: (body) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  },
  news: {
    list: () => request('/news'),
  },
  training: {
    list: () => request('/training'),
    enroll: (id) => request(`/training/${id}/enroll`, { method: 'POST' }),
  },
  members: {
    list: () => request('/members'),
  },
  membership: {
    status: () => request('/membership/status'),
    apply: (body) => request('/membership/apply', { method: 'POST', body: JSON.stringify(body) }),
    applications: () => request('/membership/applications'),
    approve: (id) => request(`/membership/applications/${id}/approve`, { method: 'PATCH' }),
    reject: (id) => request(`/membership/applications/${id}/reject`, { method: 'PATCH' }),
  },
  chatbot: {
    send: (message) => request('/chatbot/message', { method: 'POST', body: JSON.stringify({ message }) }),
  },
};
