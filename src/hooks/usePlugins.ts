import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listPlugins, getPlugin, deregisterPlugin } from '@/api/plugins';

export function usePlugins() {
  return useQuery({ queryKey: ['plugins'], queryFn: listPlugins });
}

export function usePlugin(id: string) {
  return useQuery({ queryKey: ['plugins', id], queryFn: () => getPlugin(id) });
}

export function useDeregisterPlugin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deregisterPlugin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['plugins'] }),
  });
}
