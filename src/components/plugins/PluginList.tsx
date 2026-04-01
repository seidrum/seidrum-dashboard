import type { Plugin } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { statusColor, formatRelative } from '@/lib/utils';

interface Props {
  plugins: Plugin[];
  onSelect: (plugin: Plugin) => void;
}

export function PluginList({ plugins, onSelect }: Props) {
  const columns: Column<Plugin>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: p => (
        <button onClick={() => onSelect(p)} className="font-medium text-violet-400 hover:underline">
          {p.name}
        </button>
      ),
    },
    { key: 'version', header: 'Version', render: p => p.version },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: p => <span className={statusColor(p.status)}>{p.status}</span>,
    },
    { key: 'capabilities', header: 'Capabilities', render: p => p.capabilities.length },
    {
      key: 'heartbeat',
      header: 'Last Heartbeat',
      render: p => (p.last_heartbeat ? formatRelative(p.last_heartbeat) : '—'),
    },
  ];

  return <DataTable columns={columns} data={plugins} keyExtractor={p => p.id} />;
}
