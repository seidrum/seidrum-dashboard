import type { AuditEntry, PaginatedResponse, PaginationParams } from '@/types';
import { apiFetch } from './client';

export function getAuditLog(params?: PaginationParams) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.per_page) search.set('per_page', String(params.per_page));
  const qs = search.toString();
  return apiFetch<PaginatedResponse<AuditEntry>>(`/audit${qs ? `?${qs}` : ''}`);
}
