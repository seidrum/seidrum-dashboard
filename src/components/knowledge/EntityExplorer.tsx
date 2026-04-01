import type { Entity } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { formatDate } from '@/lib/utils';

interface Props {
  entities: Entity[];
}

export function EntityExplorer({ entities }: Props) {
  const columns: Column<Entity>[] = [
    { key: 'name', header: 'Name', sortable: true, render: e => <span className="font-medium text-gray-200">{e.name}</span> },
    { key: 'type', header: 'Type', render: e => <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300">{e.entity_type}</span> },
    {
      key: 'properties',
      header: 'Properties',
      render: e => <span className="text-gray-400">{Object.keys(e.properties).length} fields</span>,
    },
    { key: 'created_at', header: 'Created', sortable: true, render: e => formatDate(e.created_at) },
  ];

  return <DataTable columns={columns} data={entities} keyExtractor={e => e.id} />;
}
