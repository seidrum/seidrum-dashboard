import type { Plugin } from '@/types';
import { statusColor, statusBg, formatDate } from '@/lib/utils';
import { X } from 'lucide-react';

interface Props {
  plugin: Plugin;
  onClose: () => void;
  onDeregister: (id: string) => void;
}

export function PluginDetail({ plugin, onClose, onDeregister }: Props) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{plugin.name}</h2>
          <p className="mt-1 text-sm text-gray-400">{plugin.description}</p>
        </div>
        <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-800">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Version</p>
          <p className="text-gray-200">{plugin.version}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${statusColor(plugin.status)} ${statusBg(plugin.status)}`}>
            {plugin.status}
          </span>
        </div>
        <div>
          <p className="text-gray-500">Registered</p>
          <p className="text-gray-200">{formatDate(plugin.registered_at)}</p>
        </div>
        <div>
          <p className="text-gray-500">Last Heartbeat</p>
          <p className="text-gray-200">{plugin.last_heartbeat ? formatDate(plugin.last_heartbeat) : '—'}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Capabilities</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {plugin.capabilities.map(cap => (
            <span key={cap} className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
              {cap}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => onDeregister(plugin.id)}
          className="rounded-md bg-red-500/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20"
        >
          Deregister Plugin
        </button>
      </div>
    </div>
  );
}
