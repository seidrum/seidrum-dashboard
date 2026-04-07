import { useState } from 'react';
import { useAgents } from '@/hooks/useAgents';
import { AgentList } from '@/components/agents/AgentList';
import { AgentDetail } from '@/components/agents/AgentDetail';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { Agent } from '@/types';

export function AgentsPage() {
  const { data: agents, isLoading, error } = useAgents();
  const [selected, setSelected] = useState<Agent | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load agents" description={error.message} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Agents</h1>
      {selected ? (
        <AgentDetail agent={selected} onClose={() => setSelected(null)} />
      ) : agents && agents.length > 0 ? (
        <AgentList agents={agents} onSelect={setSelected} />
      ) : (
        <EmptyState title="No agents configured" description="Agents will appear here once they are added to the platform." />
      )}
    </div>
  );
}
