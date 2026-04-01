import type { Plugin } from '@/types';
import { apiFetch } from './client';

export function listPlugins() {
  return apiFetch<Plugin[]>('/plugins');
}

export function getPlugin(id: string) {
  return apiFetch<Plugin>(`/plugins/${id}`);
}

export function deregisterPlugin(id: string) {
  return apiFetch<void>(`/plugins/${id}`, { method: 'DELETE' });
}
