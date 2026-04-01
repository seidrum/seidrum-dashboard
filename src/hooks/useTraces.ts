import { useQuery } from '@tanstack/react-query';
import { listTraces, getTrace } from '@/api/traces';
import type { PaginationParams } from '@/types';

export function useTraces(params?: PaginationParams & { status?: string }) {
  return useQuery({ queryKey: ['traces', params], queryFn: () => listTraces(params) });
}

export function useTrace(traceId: string) {
  return useQuery({ queryKey: ['traces', traceId], queryFn: () => getTrace(traceId), enabled: !!traceId });
}
