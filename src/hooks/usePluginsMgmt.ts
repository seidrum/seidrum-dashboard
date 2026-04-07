import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listPluginsFull,
  enablePlugin,
  disablePlugin,
  startPlugin,
  stopPlugin,
  type PluginFull,
} from '@/api/pluginsMgmt';

export function usePluginsFull() {
  return useQuery({
    queryKey: ['mgmt', 'plugins'],
    queryFn: listPluginsFull,
    refetchInterval: 5000,
  });
}

export function useEnablePlugin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: enablePlugin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mgmt', 'plugins'] }),
  });
}

export function useDisablePlugin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: disablePlugin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mgmt', 'plugins'] }),
  });
}

export function useStartPlugin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startPlugin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mgmt', 'plugins'] }),
  });
}

export function useStopPlugin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: stopPlugin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mgmt', 'plugins'] }),
  });
}
