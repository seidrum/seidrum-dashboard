import { useState } from 'react';
import {
  usePluginsFull,
  useEnablePlugin,
  useDisablePlugin,
  useStartPlugin,
  useStopPlugin,
} from '@/hooks/usePluginsMgmt';
import { PluginCard } from '@/components/plugins/PluginCard';
import { PluginDetailEnhanced } from '@/components/plugins/PluginDetailEnhanced';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { PluginFull } from '@/api/pluginsMgmt';

export function PluginsPage() {
  const { data: plugins, isLoading, error } = usePluginsFull();
  const enableMutation = useEnablePlugin();
  const disableMutation = useDisablePlugin();
  const startMutation = useStartPlugin();
  const stopMutation = useStopPlugin();

  const [selectedPlugin, setSelectedPlugin] = useState<PluginFull | null>(null);
  const [loadingPlugin, setLoadingPlugin] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load plugins" description={error.message} />;

  const handleEnable = async (name: string) => {
    setLoadingPlugin(name);
    try {
      await enableMutation.mutateAsync(name);
    } finally {
      setLoadingPlugin(null);
    }
  };

  const handleDisable = async (name: string) => {
    setLoadingPlugin(name);
    try {
      await disableMutation.mutateAsync(name);
    } finally {
      setLoadingPlugin(null);
    }
  };

  const handleStart = async (name: string) => {
    setLoadingPlugin(name);
    try {
      await startMutation.mutateAsync(name);
    } finally {
      setLoadingPlugin(null);
    }
  };

  const handleStop = async (name: string) => {
    setLoadingPlugin(name);
    try {
      await stopMutation.mutateAsync(name);
    } finally {
      setLoadingPlugin(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Plugins</h1>

      {selectedPlugin ? (
        <PluginDetailEnhanced
          plugin={selectedPlugin}
          onClose={() => setSelectedPlugin(null)}
          onEnable={() => {
            handleEnable(selectedPlugin.name);
            const updated = plugins?.find(p => p.name === selectedPlugin.name);
            if (updated) setSelectedPlugin(updated);
          }}
          onDisable={() => {
            handleDisable(selectedPlugin.name);
            const updated = plugins?.find(p => p.name === selectedPlugin.name);
            if (updated) setSelectedPlugin(updated);
          }}
          onStart={() => {
            handleStart(selectedPlugin.name);
            const updated = plugins?.find(p => p.name === selectedPlugin.name);
            if (updated) setSelectedPlugin(updated);
          }}
          onStop={() => {
            handleStop(selectedPlugin.name);
            const updated = plugins?.find(p => p.name === selectedPlugin.name);
            if (updated) setSelectedPlugin(updated);
          }}
          isLoading={loadingPlugin === selectedPlugin.name}
        />
      ) : plugins && plugins.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plugins.map(plugin => (
            <PluginCard
              key={plugin.name}
              plugin={plugin}
              onClick={() => setSelectedPlugin(plugin)}
              onEnable={() => handleEnable(plugin.name)}
              onDisable={() => handleDisable(plugin.name)}
              onStart={() => handleStart(plugin.name)}
              onStop={() => handleStop(plugin.name)}
              isLoading={loadingPlugin === plugin.name}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No plugins available"
          description="Plugins will appear here once they are configured."
        />
      )}
    </div>
  );
}
