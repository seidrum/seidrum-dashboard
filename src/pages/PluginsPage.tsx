import { useState } from 'react';
import { usePlugins, useDeregisterPlugin } from '@/hooks/usePlugins';
import { PluginList } from '@/components/plugins/PluginList';
import { PluginDetail } from '@/components/plugins/PluginDetail';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { Plugin } from '@/types';

export function PluginsPage() {
  const { data: plugins, isLoading, error } = usePlugins();
  const deregister = useDeregisterPlugin();
  const [selected, setSelected] = useState<Plugin | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load plugins" description={error.message} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Plugins</h1>
      {selected ? (
        <PluginDetail
          plugin={selected}
          onClose={() => setSelected(null)}
          onDeregister={id => {
            deregister.mutate(id);
            setSelected(null);
          }}
        />
      ) : plugins && plugins.length > 0 ? (
        <PluginList plugins={plugins} onSelect={setSelected} />
      ) : (
        <EmptyState title="No plugins registered" description="Plugins will appear here once they connect to the gateway." />
      )}
    </div>
  );
}
