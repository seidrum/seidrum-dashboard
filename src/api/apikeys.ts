import type { ApiKey, CreateApiKeyRequest } from '@/types';
import { apiFetch } from './client';

export function listApiKeys() {
  return apiFetch<ApiKey[]>('/api-keys');
}

export function createApiKey(data: CreateApiKeyRequest) {
  return apiFetch<ApiKey>('/api-keys', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function revokeApiKey(id: string) {
  return apiFetch<void>(`/api-keys/${id}`, { method: 'DELETE' });
}
