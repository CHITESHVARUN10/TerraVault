import api from '../lib/api'
import type { UserProfile } from '../lib/types'

/** Shape of the profile returned by the backend (id instead of _id). */
export interface BackendUser extends UserProfile {
  id: string
}

export interface AuthResponse {
  user: BackendUser
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

/** POST /api/auth/register — create account, session cookie is set. */
export async function register(input: RegisterInput): Promise<BackendUser> {
  const { data } = await api.post<AuthResponse>('/auth/register', input)
  return data.user
}

/** POST /api/auth/login — verify credentials, session cookie is set. */
export async function login(email: string, password: string): Promise<BackendUser> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data.user
}

/** POST /api/auth/logout — destroy the session. */
export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

/** GET /api/auth/me — current session user, or throws 401. */
export async function me(): Promise<BackendUser> {
  const { data } = await api.get<AuthResponse>('/auth/me')
  return data.user
}
