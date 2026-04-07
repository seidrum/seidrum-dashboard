import type { Agent } from '../types';

// Note: management API is on port 3030, not the api-gateway port
const MGMT_BASE = import.meta.env.VITE_MGMT_URL ?? 'http://localhost:3030';

async function mgmtFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${MGMT_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function listAgents(): Promise<Agent[]> {
  return mgmtFetch('/api/mgmt/agents');
}

export async function getAgent(id: string): Promise<Agent> {
  return mgmtFetch(`/api/mgmt/agents/${encodeURIComponent(id)}`);
}

export async function enableAgent(id: string): Promise<Agent> {
  return mgmtFetch(`/api/mgmt/agents/${encodeURIComponent(id)}/enable`, { method: 'PUT' });
}

export async function disableAgent(id: string): Promise<Agent> {
  return mgmtFetch(`/api/mgmt/agents/${encodeURIComponent(id)}/disable`, { method: 'PUT' });
}
