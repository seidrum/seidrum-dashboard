import type { Agent } from '@/types';
import { X } from 'lucide-react';
import { Toggle } from '@/components/common/Toggle';
import { useEnableAgent, useDisableAgent } from '@/hooks/useAgents';
import { useState } from 'react';

interface Props {
  agent: Agent;
  onClose: () => void;
}

export function AgentDetail({ agent, onClose }: Props) {
  const enableMutation = useEnableAgent();
  const disableMutation = useDisableAgent();
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      if (agent.enabled) {
        await disableMutation.mutateAsync(agent.id);
      } else {
        await enableMutation.mutateAsync(agent.id);
      }
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-100">{agent.id}</h2>
          {agent.description && <p className="mt-1 text-sm text-gray-400">{agent.description}</p>}
        </div>
        <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-800">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/30 p-4">
          <div>
            <p className="text-sm font-medium text-gray-200">Agent Status</p>
            <p className="mt-0.5 text-xs text-gray-400">{agent.enabled ? 'Active' : 'Inactive'}</p>
          </div>
          <Toggle checked={agent.enabled} onChange={handleToggle} disabled={toggling} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400">Scope</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300 border border-violet-400/20">
              {agent.scope}
            </span>
            {agent.additional_scopes.map(scope => (
              <span key={scope} className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
                {scope}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400">Tools ({agent.tools.length})</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {agent.tools.length > 0 ? (
              agent.tools.map(tool => (
                <span key={tool} className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
                  {tool}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No tools configured</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400">Subscriptions ({agent.subscribe.length})</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {agent.subscribe.length > 0 ? (
              agent.subscribe.map(sub => (
                <span key={sub} className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300">
                  {sub}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No subscriptions configured</span>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400 mb-2">Prompt File</p>
          <code className="block rounded-lg bg-gray-800 px-3 py-2 text-xs text-gray-300 break-all">
            {agent.prompt}
          </code>
        </div>
      </div>
    </div>
  );
}
