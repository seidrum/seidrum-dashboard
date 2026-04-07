import { X, Power, Zap, Key, Zap as Capability } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatRelative } from '@/lib/utils';
import type { PluginFull } from '@/api/pluginsMgmt';

interface PluginDetailEnhancedProps {
  plugin: PluginFull;
  onClose: () => void;
  onEnable: () => void;
  onDisable: () => void;
  onStart: () => void;
  onStop: () => void;
  isLoading?: boolean;
}

function getStatusColor(enabled: boolean, running: boolean): string {
  if (!enabled) return 'text-gray-500';
  if (running) return 'text-emerald-400';
  return 'text-amber-400';
}

function getStatusBg(enabled: boolean, running: boolean): string {
  if (!enabled) return 'bg-gray-500/10 border-gray-500/20';
  if (running) return 'bg-emerald-400/10 border-emerald-400/20';
  return 'bg-amber-400/10 border-amber-400/20';
}

function getStatusText(enabled: boolean, running: boolean): string {
  if (!enabled) return 'Disabled';
  if (running) return 'Running';
  return 'Stopped';
}

export function PluginDetailEnhanced({
  plugin,
  onClose,
  onEnable,
  onDisable,
  onStart,
  onStop,
  isLoading,
}: PluginDetailEnhancedProps) {
  const statusColor = getStatusColor(plugin.enabled, plugin.running);
  const statusBg = getStatusBg(plugin.enabled, plugin.running);
  const statusText = getStatusText(plugin.enabled, plugin.running);

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">{plugin.name}</h2>
          {plugin.description && (
            <p className="mt-1 text-sm text-gray-400">{plugin.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:bg-gray-700/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Binary</p>
          <p className="text-gray-200 font-mono">{plugin.binary}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <span className={cn(
            'inline-block rounded-full border px-3 py-1 text-xs font-medium',
            statusColor,
            statusBg
          )}>
            {statusText}
          </span>
        </div>
        {plugin.last_heartbeat && (
          <div>
            <p className="text-gray-500">Last Heartbeat</p>
            <p className="text-gray-200">{formatRelative(plugin.last_heartbeat)}</p>
            <p className="text-xs text-gray-500">{formatDate(plugin.last_heartbeat)}</p>
          </div>
        )}
      </div>

      {plugin.capabilities.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Capability className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-300">Capabilities</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {plugin.capabilities.map(cap => (
              <span
                key={cap}
                className="rounded-full bg-gray-700/50 px-3 py-1 text-xs text-gray-300"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {plugin.env_vars.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-300">Environment Variables</p>
          </div>
          <div className="space-y-2">
            {plugin.env_vars.map(env => (
              <div
                key={env.key}
                className="flex items-center justify-between rounded bg-gray-900/50 px-3 py-2 text-xs"
              >
                <code className="font-mono text-gray-300">{env.key}</code>
                {env.has_value ? (
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
                ) : (
                  <span className="text-xs text-gray-500">not set</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {!plugin.enabled ? (
          <button
            onClick={onEnable}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Zap className="h-4 w-4" />
            Enable Plugin
          </button>
        ) : (
          <>
            {!plugin.running && (
              <button
                onClick={onStart}
                disabled={isLoading}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Power className="h-4 w-4" />
                Start Plugin
              </button>
            )}
            {plugin.running && (
              <button
                onClick={onStop}
                disabled={isLoading}
                className={cn(
                  'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <Power className="h-4 w-4" />
                Stop Plugin
              </button>
            )}
            <button
              onClick={onDisable}
              disabled={isLoading}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                'bg-gray-700/50 text-gray-300 hover:bg-gray-700',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              Disable Plugin
            </button>
          </>
        )}
      </div>
    </div>
  );
}
