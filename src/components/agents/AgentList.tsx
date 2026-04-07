import { useState } from 'react';
import type { Agent } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { useEnableAgent, useDisableAgent } from '@/hooks/useAgents';
import { Toggle } from '@/components/common/Toggle';

interface Props {
  agents: Agent[];
  onSelect: (agent: Agent) => void;
}

export function AgentList({ agents, onSelect }: Props) {
  const enableMutation = useEnableAgent();
  const disableMutation = useDisableAgent();
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggle = async (agent: Agent) => {
    setToggling(agent.id);
    try {
      if (agent.enabled) {
        await disableMutation.mutateAsync(agent.id);
      } else {
        await enableMutation.mutateAsync(agent.id);
      }
    } finally {
      setToggling(null);
    }
  };

  const columns: Column<Agent>[] = [
    {
      key: 'id',
      header: 'Agent',
      sortable: true,
      render: a => (
        <button onClick={() => onSelect(a)} className="font-medium text-violet-400 hover:underline">
          {a.id}
        </button>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: a => <span className="text-gray-400">{a.description || '—'}</span>,
    },
    {
      key: 'scope',
      header: 'Scope',
      render: a => <span className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">{a.scope}</span>,
    },
    {
      key: 'tools',
      header: 'Tools',
      render: a => <span className="text-gray-300">{a.tools.length}</span>,
    },
    {
      key: 'subscribe',
      header: 'Subscriptions',
      render: a => <span className="text-gray-300">{a.subscribe.length}</span>,
    },
    {
      key: 'enabled',
      header: 'Enabled',
      render: a => (
        <Toggle
          checked={a.enabled}
          onChange={() => handleToggle(a)}
          disabled={toggling === a.id}
        />
      ),
    },
  ];

  return <DataTable columns={columns} data={agents} keyExtractor={a => a.id} />;
}
