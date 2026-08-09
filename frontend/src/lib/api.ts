import axios from 'axios'

/**
 * Shared axios instance for all backend calls.
 * - baseURL '/api' so the Vite dev proxy forwards to the backend.
 * - withCredentials so the connect.sid session cookie is sent/received.
 * - Response interceptor turns `{ error }` bodies into thrown Errors so
 *   callers can catch a message directly.
 */
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.error ??
      (error?.response?.status ? `Request failed (${error.response.status})` : error?.message) ??
      'Something went wrong.'
    return Promise.reject(new Error(message))
  },
)

/** Read a human-friendly error message from an unknown thrown value. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong.'
}

export default api
