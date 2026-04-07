import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAgents, getAgent, enableAgent, disableAgent } from '@/api/agents';

export function useAgents() {
  return useQuery({ queryKey: ['agents'], queryFn: listAgents });
}

export function useAgent(id: string) {
  return useQuery({ queryKey: ['agents', id], queryFn: () => getAgent(id), enabled: !!id });
}

export function useEnableAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enableAgent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents'] }),
  });
}

export function useDisableAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: disableAgent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents'] }),
  });
}
