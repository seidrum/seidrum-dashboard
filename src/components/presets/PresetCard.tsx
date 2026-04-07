import { Download, Trash2, CheckCircle2, Link as LinkIcon, Loader2 } from 'lucide-react';
import type { PresetFull } from '@/api/management';

interface PresetCardProps {
  preset: PresetFull;
  onApply: () => void;
  onExport: () => void;
  onDelete?: () => void;
  isApplying?: boolean;
  isExporting?: boolean;
  isDeleting?: boolean;
}

export function PresetCard({
  preset,
  onApply,
  onExport,
  onDelete,
  isApplying,
  isExporting,
  isDeleting,
}: PresetCardProps) {
  const isBuiltin = preset.source === 'builtin';
  const pluginCount = preset.bundle?.plugins.length || 0;
  const agentCount = preset.bundle?.agents.length || 0;

  const sourceBadge = {
    builtin: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', label: 'Built-in' },
    imported: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', label: 'Imported' },
    custom: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', label: 'Custom' },
  }[preset.source];

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-all hover:border-gray-600 hover:bg-gray-800/70">
      {/* Header with icon and badge */}
      <div className="mb-4 flex items-start justify-between">
        <div className="text-3xl">{preset.icon}</div>
        <span
          className={`rounded-full border px-2 py-1 text-xs font-medium ${sourceBadge.bg} ${sourceBadge.border} ${sourceBadge.text}`}
        >
          {sourceBadge.label}
        </span>
      </div>

      {/* Title and description */}
      <h3 className="text-lg font-semibold text-gray-100">{preset.name}</h3>
      <p className="mt-2 text-sm text-gray-400">{preset.description}</p>

      {/* Version and author */}
      <div className="mt-4 space-y-1 text-xs text-gray-500">
        {preset.version && <div>Version {preset.version}</div>}
        {preset.author && <div>By {preset.author}</div>}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-900/50 p-3">
        <div>
          <div className="text-xs text-gray-500">Plugins</div>
          <div className="text-sm font-medium text-gray-200">{pluginCount}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Agents</div>
          <div className="text-sm font-medium text-gray-200">{agentCount}</div>
        </div>
      </div>

      {/* Repository link */}
      {preset.repository && (
        <a
          href={preset.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300"
        >
          <LinkIcon className="h-3 w-3" />
          Repository
        </a>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={onApply}
          disabled={isApplying}
          className="flex-1 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isApplying ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Applying...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Apply
            </div>
          )}
        </button>
        <button
          onClick={onExport}
          disabled={isExporting}
          className="rounded-lg border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </button>
        {!isBuiltin && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-900/50 px-3 py-2 text-sm font-medium text-red-400 hover:border-red-800 hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
