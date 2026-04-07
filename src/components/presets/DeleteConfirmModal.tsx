import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { PresetFull } from '@/api/management';

interface DeleteConfirmModalProps {
  preset: PresetFull;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  preset,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  const hasBundle = preset.bundle && (preset.bundle.agents.length > 0 || preset.bundle.prompts.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-red-900/20 p-2.5">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <button
            onClick={onCancel}
            className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <h2 id="delete-confirm-title" className="text-lg font-semibold text-gray-100">Delete Preset?</h2>
        <p className="mt-2 text-gray-400">
          Are you sure you want to delete <span className="font-medium text-gray-300">{preset.name}</span>? This action
          cannot be undone.
        </p>

        {/* Bundle warning */}
        {hasBundle && (
          <div className="mt-4 rounded-lg border border-yellow-800/50 bg-yellow-900/20 p-3">
            <p className="text-sm font-medium text-yellow-300">This will also remove:</p>
            <ul className="mt-2 space-y-1">
              {preset.bundle!.agents.length > 0 && (
                <li className="text-sm text-yellow-200">
                  {preset.bundle!.agents.length} agent{preset.bundle!.agents.length > 1 ? 's' : ''}
                </li>
              )}
              {preset.bundle!.prompts.length > 0 && (
                <li className="text-sm text-yellow-200">
                  {preset.bundle!.prompts.length} prompt{preset.bundle!.prompts.length > 1 ? 's' : ''}
                </li>
              )}
              {preset.bundle!.plugins.length > 0 && (
                <li className="text-sm text-yellow-200">
                  {preset.bundle!.plugins.length} plugin{preset.bundle!.plugins.length > 1 ? 's' : ''}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-300 hover:border-gray-600 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              'Delete Preset'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
