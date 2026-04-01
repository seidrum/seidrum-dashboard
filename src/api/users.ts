import type { User, UserRole } from '@/types';
import { apiFetch } from './client';

export function getMe() {
  return apiFetch<User>('/users/me');
}

export function listUsers() {
  return apiFetch<User[]>('/users');
}

export function updateRole(userId: string, role: UserRole) {
  return apiFetch<User>(`/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  });
}

export function deleteUser(userId: string) {
  return apiFetch<void>(`/users/${userId}`, { method: 'DELETE' });
}
