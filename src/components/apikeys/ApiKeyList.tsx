import type { ApiKey } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { formatDate, formatRelative } from '@/lib/utils';

interface Props {
  apiKeys: ApiKey[];
  onRevoke: (id: string) => void;
}

export function ApiKeyList({ apiKeys, onRevoke }: Props) {
  const columns: Column<ApiKey>[] = [
    { key: 'name', header: 'Name', render: k => <span className="font-medium text-gray-200">{k.name}</span> },
    { key: 'prefix', header: 'Key', render: k => <span className="font-mono text-xs text-gray-400">{k.prefix}...</span> },
    { key: 'created', header: 'Created', sortable: true, render: k => formatDate(k.created_at) },
    { key: 'last_used', header: 'Last Used', render: k => (k.last_used_at ? formatRelative(k.last_used_at) : 'Never') },
    { key: 'expires', header: 'Expires', render: k => (k.expires_at ? formatDate(k.expires_at) : 'Never') },
    {
      key: 'actions',
      header: '',
      render: k => (
        <button onClick={() => onRevoke(k.id)} className="text-xs text-red-400 hover:underline">
          Revoke
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} data={apiKeys} keyExtractor={k => k.id} />;
}
