import { mgmtFetch } from './mgmtClient';

export interface PluginFull {
  name: string;
  binary: string;
  enabled: boolean;
  running: boolean;
  description: string | null;
  capabilities: string[];
  env_vars: Array<{ key: string; has_value: boolean }>;
  last_heartbeat: string | null;
}

export async function listPluginsFull(): Promise<PluginFull[]> {
  return mgmtFetch('/api/mgmt/plugins');
}

export async function enablePlugin(name: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/plugins/${encodeURIComponent(name)}/enable`, { method: 'PUT' });
}

export async function disablePlugin(name: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/plugins/${encodeURIComponent(name)}/disable`, { method: 'PUT' });
}

export async function startPlugin(name: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/plugins/${encodeURIComponent(name)}/start`, { method: 'POST' });
}

export async function stopPlugin(name: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/plugins/${encodeURIComponent(name)}/stop`, { method: 'POST' });
}
