import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOnboardingStatus,
  completeOnboarding,
  listPresets,
  applyPreset,
  listEnv,
  setEnvVar,
} from '../api/management';
import type { ApplyPresetRequest } from '../api/management';

export function useOnboardingStatus() {
  return useQuery({ queryKey: ['onboarding'], queryFn: getOnboardingStatus });
}

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['onboarding'] }),
  });
}

export function usePresets() {
  return useQuery({ queryKey: ['presets'], queryFn: listPresets });
}

export function useApplyPreset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ApplyPresetRequest }) =>
      applyPreset(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['onboarding'] });
      qc.invalidateQueries({ queryKey: ['plugins'] });
      qc.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

export function useEnvVars() {
  return useQuery({ queryKey: ['env'], queryFn: listEnv });
}

export function useSetEnvVar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      setEnvVar(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['env'] }),
  });
}
