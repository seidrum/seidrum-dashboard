const MGMT_BASE = import.meta.env.VITE_MGMT_URL ?? 'http://localhost:3030';

async function mgmtFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${MGMT_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface PackageInfo {
  name: string;
  version: string;
  kind: 'plugin' | 'agent' | 'bundle';
  description: string | null;
  author: string | null;
  source: string;
  installed: boolean;
}

export interface SearchResult {
  packages: PackageInfo[];
}

export interface InstallPreview {
  name: string;
  version: string;
  kind: string;
  description: string | null;
  author: string | null;
  plugins_to_install: string[];
  agents_to_install: string[];
  env_required: Array<{ key: string; label: string; help: string; required: boolean }>;
  events_consumed: string[];
  events_produced: string[];
}

export interface InstallResult {
  success: boolean;
  message: string;
  installed: string[];
}

export interface InstalledPackage {
  name: string;
  version: string;
  kind: string;
  source: string;
  installed_at: string | null;
}

export async function searchPackages(query?: string, kind?: string): Promise<SearchResult> {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (kind) params.set('kind', kind);
  return mgmtFetch(`/api/mgmt/pkg/search?${params}`);
}

export async function installPackage(
  pkg: string,
  confirm: boolean,
): Promise<InstallPreview | InstallResult> {
  return mgmtFetch('/api/mgmt/pkg/install', {
    method: 'POST',
    body: JSON.stringify({ package: pkg, confirm }),
  });
}

export async function uninstallPackage(name: string): Promise<void> {
  return mgmtFetch(`/api/mgmt/pkg/${encodeURIComponent(name)}`, { method: 'DELETE' });
}

export async function listInstalledPackages(): Promise<{ packages: InstalledPackage[] }> {
  return mgmtFetch('/api/mgmt/pkg/installed');
}
