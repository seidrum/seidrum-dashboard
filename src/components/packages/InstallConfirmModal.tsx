import { InstallPreview } from '@/api/packages';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface InstallConfirmModalProps {
  preview: InstallPreview;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function InstallConfirmModal({
  preview,
  onConfirm,
  onCancel,
  isLoading,
}: InstallConfirmModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Installation failed');
    }
  };

  const kindColor = {
    plugin: 'text-blue-300',
    agent: 'text-green-300',
    bundle: 'text-violet-300',
  }[preview.kind as keyof typeof kindColor] || 'text-blue-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="install-confirm-title">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="install-confirm-title" className="text-lg font-semibold text-gray-100">Install Package</h2>
            <p className="mt-1 text-sm text-gray-500">Review and confirm installation details</p>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-300 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 border-t border-b border-gray-700 py-5">
          {/* Package info */}
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-semibold text-gray-100">{preview.name}</h3>
              <span className={`text-sm font-medium ${kindColor}`}>{preview.kind}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{preview.version}</p>
            {preview.author && <p className="mt-1 text-sm text-gray-500">by {preview.author}</p>}
            {preview.description && (
              <p className="mt-2 text-sm text-gray-400">{preview.description}</p>
            )}
          </div>

          {/* Components to install */}
          {(preview.plugins_to_install.length > 0 || preview.agents_to_install.length > 0) && (
            <div>
              <p className="mb-2 text-sm font-medium text-gray-300">Will Install:</p>
              <div className="space-y-2">
                {preview.plugins_to_install.length > 0 && (
                  <div className="text-sm">
                    <span className="text-blue-300">Plugins:</span>
                    <ul className="mt-1 ml-4 space-y-1">
                      {preview.plugins_to_install.map(p => (
                        <li key={p} className="text-gray-400">
                          • {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {preview.agents_to_install.length > 0 && (
                  <div className="text-sm">
                    <span className="text-green-300">Agents:</span>
                    <ul className="mt-1 ml-4 space-y-1">
                      {preview.agents_to_install.map(a => (
                        <li key={a} className="text-gray-400">
                          • {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Required environment variables */}
          {preview.env_required.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-medium text-amber-300">Environment Variables Required</p>
              </div>
              <div className="space-y-2">
                {preview.env_required.map(env => (
                  <div key={env.key} className="rounded bg-gray-800/50 p-3">
                    <p className="text-xs font-mono text-gray-300">{env.key}</p>
                    <p className="mt-1 text-xs text-gray-500">{env.label}</p>
                    {env.help && <p className="mt-1 text-xs text-gray-600">{env.help}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events info */}
          {(preview.events_consumed.length > 0 || preview.events_produced.length > 0) && (
            <div className="space-y-2 text-xs text-gray-500">
              {preview.events_consumed.length > 0 && (
                <p>Consumes {preview.events_consumed.length} event type(s)</p>
              )}
              {preview.events_produced.length > 0 && (
                <p>Produces {preview.events_produced.length} event type(s)</p>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Installing...
              </>
            ) : (
              'Install Package'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
