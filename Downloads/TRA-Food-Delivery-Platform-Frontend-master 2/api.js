// api.js — single source of truth for talking to the backend.
// Every page includes this file so base URL, JSON parsing and error
// handling all live in exactly one place.

const BASE = 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors || null;
  }
}

async function api(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError('Could not reach the server. Please check your connection.', 0);
  }

  if (res.status === 204) return null; // No Content

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // The backend's GlobalExceptionHandler returns a consistent error shape:
    // timestamp, status, message, path, and (for validation) fieldErrors.
    throw new ApiError(
      (data && data.message) || `Request failed (${res.status})`,
      res.status,
      data && data.fieldErrors
    );
  }

  return data; // Response DTO(s)
}

const Api = {
  get: (path) => api(path, { method: 'GET' }),
  post: (path, body) => api(path, { method: 'POST', body }),
  put: (path, body) => api(path, { method: 'PUT', body }),
  del: (path) => api(path, { method: 'DELETE' }),
  ApiError,
};
