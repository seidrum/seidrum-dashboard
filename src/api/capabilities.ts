import type { Capability } from '@/types';
import { apiFetch } from './client';

export function searchCapabilities(query?: string) {
  const params = query ? `?q=${encodeURIComponent(query)}` : '';
  return apiFetch<Capability[]>(`/capabilities${params}`);
}

export function callCapability(name: string, input: Record<string, unknown>) {
  return apiFetch<unknown>(`/capabilities/${encodeURIComponent(name)}/call`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
