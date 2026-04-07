import { Loader2 } from 'lucide-react';
import type { Preset } from '@/api/management';

interface Props {
  preset: Preset;
  includeRecommended: boolean;
  onToggleRecommended: () => void;
  onActivate: () => Promise<void>;
  isActivating: boolean;
  error?: string | null;
}

export function ActivationSummary({
  preset,
  includeRecommended,
  onToggleRecommended,
  onActivate,
  isActivating,
  error,
}: Props) {
  const handleActivate = async () => {
    await onActivate();
  };

  const pluginsToEnable = [
    ...preset.plugins.required,
    ...(includeRecommended ? preset.plugins.recommended : []),
  ];

  const agentsToEnable = [
    ...preset.agents.required,
    ...(includeRecommended ? preset.agents.recommended : []),
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
        <h3 className="font-semibold text-gray-100">What will be enabled</h3>
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-sm text-gray-400">Plugins ({pluginsToEnable.length})</div>
            <ul className="mt-2 space-y-1">
              {pluginsToEnable.map(plugin => (
                <li
                  key={plugin}
                  className="text-sm text-gray-300 before:mr-2 before:content-['•']"
                >
                  {plugin}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-sm text-gray-400">Agents ({agentsToEnable.length})</div>
            <ul className="mt-2 space-y-1">
              {agentsToEnable.map(agent => (
                <li
                  key={agent}
                  className="text-sm text-gray-300 before:mr-2 before:content-['•']"
                >
                  {agent}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={includeRecommended}
          onChange={onToggleRecommended}
          className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-violet-600"
        />
        <span className="text-sm text-gray-300">Include recommended plugins and agents</span>
      </label>

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleActivate}
        disabled={isActivating}
        className="w-full rounded-lg bg-violet-600 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {isActivating ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Activating...
          </div>
        ) : (
          'Activate Preset'
        )}
      </button>
    </div>
  );
}
