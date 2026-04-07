import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listPresetsDetailed,
  importPreset,
  exportPreset,
  deletePreset,
  applyPreset,
} from '../api/management';
import type { ImportPresetRequest, ApplyPresetRequest } from '../api/management';

export function usePresetsAll() {
  return useQuery({ queryKey: ['presets', 'detailed'], queryFn: listPresetsDetailed });
}

export function useImportPreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: importPreset,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['presets'] }),
  });
}

export function useExportPreset() {
  return useMutation({ mutationFn: exportPreset });
}

export function useDeletePreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePreset,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['presets'] }),
  });
}

export function useApplyPresetMgmt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ApplyPresetRequest }) =>
      applyPreset(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['presets'] });
      qc.invalidateQueries({ queryKey: ['plugins'] });
      qc.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
