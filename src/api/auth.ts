import type { AuthTokens, LoginRequest, RegisterRequest } from '@/types';
import { apiFetch } from './client';

export function login(data: LoginRequest) {
  return apiFetch<AuthTokens>('/auth/token', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function register(data: RegisterRequest) {
  return apiFetch<AuthTokens>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function refreshToken(token: string) {
  return apiFetch<AuthTokens>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: token }),
  });
}

export function revokeToken(token: string) {
  return apiFetch<void>('/auth/revoke', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}
