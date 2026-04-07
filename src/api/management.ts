import { mgmtFetch } from './mgmtClient';

// Onboarding
export interface OnboardingStatus {
  first_run: boolean;
  plugins_enabled: number;
  agents_enabled: number;
  channels_active: number;
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  return mgmtFetch('/api/mgmt/onboarding/status');
}

export async function completeOnboarding(): Promise<void> {
  return mgmtFetch('/api/mgmt/onboarding/complete', { method: 'POST' });
}

// Presets
export interface EnvRequirement {
  key: string;
  label: string;
  help: string;
  auto_generate?: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  plugins: { required: string[]; recommended: string[] };
  agents: { required: string[]; recommended: string[] };
  env_required: EnvRequirement[];
  llm_provider: string | null;
  test_instruction?: string;
}

export interface PresetFull extends Preset {
  version?: string;
  author?: string;
  repository?: string;
  source: 'builtin' | 'imported' | 'custom';
  bundle?: {
    agents: string[];
    prompts: string[];
    plugins: Array<{ name: string; binary: string; env: Record<string, string> }>;
  };
}

export async function listPresets(): Promise<Preset[]> {
  return mgmtFetch('/api/mgmt/presets');
}

export async function listPresetsDetailed(): Promise<PresetFull[]> {
  return mgmtFetch('/api/mgmt/presets?detailed=true');
}

export interface ApplyPresetRequest {
  include_recommended: boolean;
}

export interface ApplyPresetResponse {
  plugins_enabled: string[];
  agents_enabled: string[];
  missing_env: string[];
}

export async function applyPreset(
  id: string,
  body: ApplyPresetRequest,
): Promise<ApplyPresetResponse> {
  return mgmtFetch(`/api/mgmt/presets/${encodeURIComponent(id)}/apply`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export interface ImportPresetRequest {
  source: 'url' | 'inline';
  url?: string;
  preset_yaml?: string;
  agents?: Record<string, string>;
  prompts?: Record<string, string>;
}

export interface ImportResult {
  preset_id: string;
  installed_agents: string[];
  installed_prompts: string[];
  installed_plugins: string[];
}

export async function importPreset(req: ImportPresetRequest): Promise<ImportResult> {
  return mgmtFetch('/api/mgmt/presets/import', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export interface PresetExport {
  preset: PresetFull;
  agents: Record<string, string>;
  prompts: Record<string, string>;
}

export async function exportPreset(id: string): Promise<PresetExport> {
  return mgmtFetch(`/api/mgmt/presets/${encodeURIComponent(id)}/export`);
}

export async function deletePreset(id: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/presets/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// Environment config
export interface EnvVar {
  key: string;
  has_value: boolean;
}

export async function listEnv(): Promise<EnvVar[]> {
  return mgmtFetch('/api/mgmt/config/env');
}

export async function setEnvVar(key: string, value: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/config/env/${encodeURIComponent(key)}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
}

// System health
export interface SystemHealth {
  status: string;
  nats_connected: boolean;
  uptime_seconds: number;
}

export async function getHealth(): Promise<SystemHealth> {
  return mgmtFetch('/api/mgmt/health');
}
