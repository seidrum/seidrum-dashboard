export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatRelative(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '\u2026';
}

export function statusColor(status: string): string {
  switch (status) {
    case 'healthy':
    case 'ok':
      return 'text-emerald-400';
    case 'degraded':
    case 'timeout':
      return 'text-amber-400';
    case 'unreachable':
    case 'error':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

export function statusBg(status: string): string {
  switch (status) {
    case 'healthy':
    case 'ok':
      return 'bg-emerald-400/10 border-emerald-400/20';
    case 'degraded':
    case 'timeout':
      return 'bg-amber-400/10 border-amber-400/20';
    case 'unreachable':
    case 'error':
      return 'bg-red-400/10 border-red-400/20';
    default:
      return 'bg-gray-400/10 border-gray-400/20';
  }
}
