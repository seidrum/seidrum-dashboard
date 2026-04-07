import type { InstalledPackage } from '@/api/packages';
import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface InstalledTableProps {
  packages: InstalledPackage[];
  onUninstall: (name: string) => Promise<void>;
  uninstallingNames: Set<string>;
}

const kindColors = {
  plugin: 'text-blue-300',
  agent: 'text-green-300',
  bundle: 'text-violet-300',
} as const;

export function InstalledTable({
  packages,
  onUninstall,
  uninstallingNames,
}: InstalledTableProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUninstall = async (name: string) => {
    setError(null);
    try {
      await onUninstall(name);
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uninstall failed');
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700 bg-gray-900/50">
              <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-300">Name</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-300">Version</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-300">Kind</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-300">Source</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold text-gray-300">Installed</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.name} className="border-b border-gray-700 hover:bg-gray-800/30">
                <td className="px-6 py-4 text-gray-100">{pkg.name}</td>
                <td className="px-6 py-4 font-mono text-gray-400">{pkg.version}</td>
                <td className="px-6 py-4">
                  <span
                    className={`font-medium ${kindColors[pkg.kind as keyof typeof kindColors] || 'text-gray-300'}`}
                  >
                    {pkg.kind}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{pkg.source}</td>
                <td className="px-6 py-4 text-gray-500">
                  {pkg.installed_at
                    ? new Date(pkg.installed_at).toLocaleDateString()
                    : 'Unknown'}
                </td>
                <td className="px-6 py-4 text-right">
                  {confirmDelete === pkg.name ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        disabled={uninstallingNames.has(pkg.name)}
                        className="text-xs text-gray-400 hover:text-gray-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUninstall(pkg.name)}
                        disabled={uninstallingNames.has(pkg.name)}
                        className="inline-flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs text-red-300 hover:bg-red-500/30 disabled:opacity-50"
                      >
                        {uninstallingNames.has(pkg.name) ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Removing...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-3 w-3" />
                            Confirm
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(pkg.name)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-gray-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
