import type { Agent } from '../types';
import { mgmtFetch } from './mgmtClient';

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
