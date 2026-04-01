import { useState, type FormEvent } from 'react';
import type { ApiKey } from '@/types';
import { Copy, Check } from 'lucide-react';

interface Props {
  onSubmit: (name: string, expiresInDays?: number) => Promise<ApiKey>;
}

export function CreateApiKeyForm({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [expires, setExpires] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const key = await onSubmit(name, expires ? Number(expires) : undefined);
      setCreated(key);
      setName('');
      setExpires('');
    } finally {
      setLoading(false);
    }
  }

  function copyKey() {
    if (created?.key) {
      navigator.clipboard.writeText(created.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="key-name" className="mb-1 block text-sm text-gray-400">Name</label>
          <input
            id="key-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-violet-500 focus:outline-none"
            placeholder="My API key"
          />
        </div>
        <div className="w-32">
          <label htmlFor="key-expires" className="mb-1 block text-sm text-gray-400">Expires (days)</label>
          <input
            id="key-expires"
            type="number"
            value={expires}
            onChange={e => setExpires(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-violet-500 focus:outline-none"
            placeholder="90"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          Create
        </button>
      </form>
      {created?.key && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <code className="flex-1 text-sm text-emerald-400">{created.key}</code>
          <button onClick={copyKey} className="rounded p-1 text-gray-400 hover:text-gray-200">
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
