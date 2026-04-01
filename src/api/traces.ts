import type { Trace, PaginatedResponse, PaginationParams } from '@/types';
import { apiFetch } from './client';

export function listTraces(params?: PaginationParams & { status?: string }) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.per_page) search.set('per_page', String(params.per_page));
  if (params?.status) search.set('status', params.status);
  const qs = search.toString();
  return apiFetch<PaginatedResponse<Trace>>(`/traces${qs ? `?${qs}` : ''}`);
}

export function getTrace(traceId: string) {
  return apiFetch<Trace>(`/traces/${traceId}`);
}
