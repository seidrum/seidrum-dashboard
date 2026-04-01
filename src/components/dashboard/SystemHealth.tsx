import type { Plugin } from '@/types';
import { statusColor, statusBg, formatRelative } from '@/lib/utils';

interface Props {
  plugins: Plugin[];
}

export function SystemHealth({ plugins }: Props) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
      <h3 className="mb-4 text-sm font-medium text-gray-300">Plugin Health</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map(p => (
          <div key={p.id} className={`flex items-center justify-between rounded-lg border p-3 ${statusBg(p.status)}`}>
            <div>
              <p className="text-sm font-medium text-gray-200">{p.name}</p>
              <p className="text-xs text-gray-500">
                {p.last_heartbeat ? formatRelative(p.last_heartbeat) : 'no heartbeat'}
              </p>
            </div>
            <span className={`text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
