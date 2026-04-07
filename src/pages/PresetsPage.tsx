import { useState } from 'react';
import { Upload } from 'lucide-react';
import { usePresetsAll, useApplyPresetMgmt, useExportPreset, useDeletePreset } from '@/hooks/usePresetsMgmt';
import { PresetCard } from '@/components/presets/PresetCard';
import { ImportPresetModal } from '@/components/presets/ImportPresetModal';
import { ExportPresetModal } from '@/components/presets/ExportPresetModal';
import { DeleteConfirmModal } from '@/components/presets/DeleteConfirmModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { PresetFull, PresetExport } from '@/api/management';

export function PresetsPage() {
  const { data: presets, isLoading, error } = usePresetsAll();
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportData, setExportData] = useState<PresetExport | null>(null);
  const [presetToDelete, setPresetToDelete] = useState<PresetFull | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const applyMutation = useApplyPresetMgmt();
  const exportMutation = useExportPreset();
  const deleteMutation = useDeletePreset();

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <EmptyState title="Failed to load presets" description={error.message} />;

  const handleApplyPreset = async (preset: PresetFull) => {
    setApplyingId(preset.id);
    try {
      await applyMutation.mutateAsync({
        id: preset.id,
        body: { include_recommended: true },
      });
    } catch (err) {
      console.error('Failed to apply preset:', err);
    } finally {
      setApplyingId(null);
    }
  };

  const handleExportPreset = async (preset: PresetFull) => {
    setExportingId(preset.id);
    try {
      const data = await exportMutation.mutateAsync(preset.id);
      setExportData(data);
    } catch (err) {
      console.error('Failed to export preset:', err);
    } finally {
      setExportingId(null);
    }
  };

  const handleDeletePreset = async () => {
    if (!presetToDelete) return;
    setDeletingId(presetToDelete.id);
    try {
      await deleteMutation.mutateAsync(presetToDelete.id);
      setPresetToDelete(null);
    } catch (err) {
      console.error('Failed to delete preset:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Presets</h1>
        <button
          onClick={() => setShowImportModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Import Preset
        </button>
      </div>

      {/* Presets grid */}
      {presets && presets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {presets.map(preset => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onApply={() => handleApplyPreset(preset)}
              onExport={() => handleExportPreset(preset)}
              onDelete={() => setPresetToDelete(preset)}
              isApplying={applyingId === preset.id}
              isExporting={exportingId === preset.id}
              isDeleting={deletingId === preset.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No presets available"
          description="Import or create your first preset to get started."
        />
      )}

      {/* Modals */}
      {showImportModal && <ImportPresetModal onClose={() => setShowImportModal(false)} />}
      {exportData && (
        <ExportPresetModal data={exportData} onClose={() => setExportData(null)} />
      )}
      {presetToDelete && (
        <DeleteConfirmModal
          preset={presetToDelete}
          onConfirm={handleDeletePreset}
          onCancel={() => setPresetToDelete(null)}
          isDeleting={deletingId === presetToDelete.id}
        />
      )}
    </div>
  );
}
