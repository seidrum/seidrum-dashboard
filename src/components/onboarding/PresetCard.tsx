import { Check } from 'lucide-react';
import type { Preset } from '@/api/management';

interface Props {
  preset: Preset;
  selected: boolean;
  onSelect: () => void;
}

export function PresetCard({ preset, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-lg border-2 p-4 text-left transition-all ${
        selected
          ? 'border-violet-600 bg-gray-800/50'
          : 'border-gray-700 bg-gray-800/25 hover:border-gray-600'
      }`}
    >
      {selected && (
        <div className="absolute right-4 top-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      <div className="mb-3 text-3xl">{preset.icon}</div>
      <h3 className="font-semibold text-gray-100">{preset.name}</h3>
      <p className="mt-2 text-sm text-gray-400">{preset.description}</p>
      <div className="mt-4 space-y-2 text-xs text-gray-500">
        <div>
          Plugins: {preset.plugins.required.length} required, {preset.plugins.recommended.length} recommended
        </div>
        <div>
          Agents: {preset.agents.required.length} required, {preset.agents.recommended.length} recommended
        </div>
        {preset.llm_provider && <div>LLM: {preset.llm_provider}</div>}
      </div>
    </button>
  );
}
