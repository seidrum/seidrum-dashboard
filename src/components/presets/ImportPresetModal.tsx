import { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { useImportPreset } from '@/hooks/usePresetsMgmt';
import type { ImportPresetRequest } from '@/api/management';

interface ImportPresetModalProps {
  onClose: () => void;
}

export function ImportPresetModal({ onClose }: ImportPresetModalProps) {
  const [tab, setTab] = useState<'url' | 'yaml'>('url');
  const [url, setUrl] = useState('');
  const [yamlContent, setYamlContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const importMutation = useImportPreset();

  const handleImportUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setError(null);
      await importMutation.mutateAsync({
        source: 'url',
        url: url.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import preset');
    }
  };

  const handleImportYaml = async () => {
    if (!yamlContent.trim()) {
      setError('Please enter YAML content');
      return;
    }

    try {
      setError(null);
      await importMutation.mutateAsync({
        source: 'inline',
        preset_yaml: yamlContent.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import preset');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
        setError('Please drop a .yaml or .yml file');
        return;
      }

      try {
        const text = await file.text();
        setYamlContent(text);
        setTab('yaml');
        setError(null);
      } catch (err) {
        setError('Failed to read file');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="import-preset-title">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 id="import-preset-title" className="text-xl font-semibold text-gray-100">Import Preset</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setTab('url')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'url'
                ? 'border-b-2 border-violet-600 text-violet-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            From URL
          </button>
          <button
            onClick={() => setTab('yaml')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'yaml'
                ? 'border-b-2 border-violet-600 text-violet-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            From YAML
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {tab === 'url' && (
            <>
              <div>
                <label htmlFor="preset-url" className="block text-sm font-medium text-gray-300">Preset URL</label>
                <input
                  id="preset-url"
                  type="url"
                  value={url}
                  onChange={e => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://example.com/preset.yaml"
                  className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 placeholder-gray-600 focus:border-violet-600 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL must point to a public YAML preset file
                </p>
              </div>
            </>
          )}

          {tab === 'yaml' && (
            <>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`rounded-lg border-2 border-dashed p-6 transition-colors ${
                  dragActive
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-500" />
                  <p className="text-sm font-medium text-gray-300">Drag and drop YAML file here</p>
                  <p className="text-xs text-gray-500">or paste content below</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">YAML Content</label>
                <textarea
                  value={yamlContent}
                  onChange={e => {
                    setYamlContent(e.target.value);
                    setError(null);
                  }}
                  placeholder="Paste your preset YAML content here..."
                  rows={8}
                  className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-600 focus:border-violet-600 focus:outline-none"
                />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-700 px-4 py-2 font-medium text-gray-300 hover:border-gray-600 hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={tab === 'url' ? handleImportUrl : handleImportYaml}
            disabled={importMutation.isPending || (!url && tab === 'url') || (!yamlContent && tab === 'yaml')}
            className="flex-1 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {importMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing...
              </div>
            ) : (
              'Import Preset'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
