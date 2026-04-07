import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { EnvRequirement } from '@/api/management';

interface Props {
  requirements: EnvRequirement[];
  onSave: (values: Record<string, string>) => Promise<void>;
}

export function ConfigForm({ requirements, onSave }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    requirements.reduce((acc, req) => ({ ...acc, [req.key]: '' }), {}),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      await onSave(values);
      setValues(requirements.reduce((acc: Record<string, string>, req: any) => ({ ...acc, [req.key]: '' }), {}));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const isValid = requirements.every(req => values[req.key]?.trim());

  return (
    <div className="space-y-6">
      {requirements.map(req => (
        <div key={req.key}>
          <label htmlFor={`env-${req.key}`} className="block text-sm font-medium text-gray-300">
            {req.label}
            {req.auto_generate && (
              <span className="ml-2 text-xs text-gray-500">(can be auto-generated)</span>
            )}
          </label>
          <input
            id={`env-${req.key}`}
            type="password"
            value={values[req.key] || ''}
            onChange={e => handleChange(req.key, e.target.value)}
            placeholder={req.key}
            className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 placeholder-gray-600 focus:border-violet-600 focus:outline-none"
          />
          {req.help && <p className="mt-1 text-xs text-gray-500">{req.help}</p>}
        </div>
      ))}

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!isValid || loading}
        className="w-full rounded-lg bg-violet-600 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        ) : (
          'Save Configuration'
        )}
      </button>
    </div>
  );
}
