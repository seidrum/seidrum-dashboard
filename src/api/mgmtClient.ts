const MGMT_BASE = import.meta.env.VITE_MGMT_API_URL || 'http://localhost:3030';

export class MgmtApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`Management API error (${status}): ${body}`);
    this.name = 'MgmtApiError';
    this.status = status;
    this.body = body;
  }
}

export async function mgmtFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${MGMT_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => 'Unknown error');
    throw new MgmtApiError(res.status, body);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json();
}
