import { getAccessToken } from './client';

const MGMT_BASE = import.meta.env.VITE_MGMT_URL ?? 'http://localhost:3030';

async function mgmtFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(`${MGMT_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

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
