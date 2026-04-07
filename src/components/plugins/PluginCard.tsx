import { Power, Zap, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelative } from '@/lib/utils';
import type { PluginFull } from '@/api/pluginsMgmt';

interface PluginCardProps {
  plugin: PluginFull;
  onEnable: () => void;
  onDisable: () => void;
  onStart: () => void;
  onStop: () => void;
  onClick: () => void;
  isLoading?: boolean;
}

function getStatusColor(enabled: boolean, running: boolean): string {
  if (!enabled) return 'text-gray-500';
  if (running) return 'text-emerald-400';
  return 'text-amber-400';
}

function getStatusText(enabled: boolean, running: boolean): string {
  if (!enabled) return 'Disabled';
  if (running) return 'Running';
  return 'Stopped';
}

export function PluginCard({
  plugin,
  onEnable,
  onDisable,
  onStart,
  onStop,
  onClick,
  isLoading,
}: PluginCardProps) {
  const statusColor = getStatusColor(plugin.enabled, plugin.running);
  const statusText = getStatusText(plugin.enabled, plugin.running);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all duration-200',
        'hover:border-gray-600 hover:bg-gray-800/70 cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-100 truncate">{plugin.name}</h3>
          {plugin.description && (
            <p className="mt-1 text-xs text-gray-400 line-clamp-2">{plugin.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Circle className={`h-2 w-2 fill-current ${statusColor}`} />
        <span className="text-xs font-medium text-gray-300">{statusText}</span>
        {plugin.last_heartbeat && (
          <span className="text-xs text-gray-500">{formatRelative(plugin.last_heartbeat)}</span>
        )}
      </div>

      {plugin.capabilities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {plugin.capabilities.slice(0, 3).map(cap => (
            <span
              key={cap}
              className="inline-block rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-300"
            >
              {cap}
            </span>
          ))}
          {plugin.capabilities.length > 3 && (
            <span className="inline-block px-2 py-0.5 text-xs text-gray-500">
              +{plugin.capabilities.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {!plugin.enabled ? (
          <button
            onClick={e => {
              e.stopPropagation();
              onEnable();
            }}
            disabled={isLoading}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
              'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Zap className="inline h-3 w-3 mr-1" />
            Enable
          </button>
        ) : (
          <>
            {!plugin.running && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onStart();
                }}
                disabled={isLoading}
                className={cn(
                  'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                  'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Power className="inline h-3 w-3 mr-1" />
                Start
              </button>
            )}
            {plugin.running && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onStop();
                }}
                disabled={isLoading}
                className={cn(
                  'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                  'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Power className="inline h-3 w-3 mr-1" />
                Stop
              </button>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                onDisable();
              }}
              disabled={isLoading}
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
                'bg-gray-700/50 text-gray-300 hover:bg-gray-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Disable
            </button>
          </>
        )}
      </div>
    </div>
  );
}
