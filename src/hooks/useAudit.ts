import { useQuery } from '@tanstack/react-query';
import { getAuditLog } from '@/api/audit';
import type { PaginationParams } from '@/types';

export function useAuditLog(params?: PaginationParams) {
  return useQuery({ queryKey: ['audit', params], queryFn: () => getAuditLog(params) });
}
