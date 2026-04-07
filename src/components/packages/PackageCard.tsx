import type { PackageInfo } from '@/api/packages';
import { Loader2 } from 'lucide-react';

interface PackageCardProps {
  pkg: PackageInfo;
  onInstall: () => void;
  isInstalling: boolean;
}

const kindColors = {
  plugin: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30' },
  agent: { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-500/30' },
  bundle: { bg: 'bg-violet-500/10', text: 'text-violet-300', border: 'border-violet-500/30' },
};

export function PackageCard({ pkg, onInstall, isInstalling }: PackageCardProps) {
  const colors = kindColors[pkg.kind as keyof typeof kindColors] || kindColors.plugin;

  return (
    <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 p-5 transition-all hover:border-gray-600 hover:bg-gray-800/80">
      {/* Header with kind badge */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">{pkg.name}</h3>
          <p className="text-xs text-gray-500">{pkg.version}</p>
        </div>
        <span
          className={`ml-2 shrink-0 rounded border px-2.5 py-1 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
        >
          {pkg.kind}
        </span>
      </div>

      {/* Author */}
      {pkg.author && <p className="mb-2 text-sm text-gray-400">by {pkg.author}</p>}

      {/* Description */}
      {pkg.description && (
        <p className="mb-4 flex-1 text-sm text-gray-400 line-clamp-3">{pkg.description}</p>
      )}

      {/* Source */}
      <p className="mb-4 text-xs text-gray-600">{pkg.source}</p>

      {/* Install button */}
      <button
        onClick={onInstall}
        disabled={pkg.installed || isInstalling}
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          pkg.installed
            ? 'bg-gray-700 text-gray-500 cursor-default'
            : isInstalling
              ? 'bg-violet-600 text-white'
              : 'bg-violet-600 text-white hover:bg-violet-700'
        }`}
      >
        {isInstalling ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Installing...
          </>
        ) : pkg.installed ? (
          <>
            <span className="mr-1">✓</span>
            Installed
          </>
        ) : (
          'Install'
        )}
      </button>
    </div>
  );
}
