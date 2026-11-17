// Shared HTTP client for every component (Profile, Feed, Contests, STEM, Notifications).
// - Prefixes the API base URL
// - Attaches the JWT from Auth as "Authorization: Bearer <token>" (Week 3 spec 2H)
// - Turns non-2xx responses into an ApiError with status and field errors

import { config } from './config.js';

let getToken = () => null;

// Auth calls this once so the client can read the current token.
export function setTokenProvider(fn) {
  getToken = fn;
}

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;   // e.g. 401, 404, 422
    this.fields = fields;   // e.g. { skills: 'Add at least one skill.' }
  }
}

async function request(method, path, body) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${config.apiBaseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.message ?? `Request failed (${res.status}).`, res.status, data?.errors);
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};

// Builds "?skill=React&school=..." and skips empty values.
export function toQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}