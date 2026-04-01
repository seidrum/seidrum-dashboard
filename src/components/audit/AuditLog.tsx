import type { AuditEntry } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { formatRelative } from '@/lib/utils';

interface Props {
  entries: AuditEntry[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AuditLog({ entries, page, totalPages, onPageChange }: Props) {
  const columns: Column<AuditEntry>[] = [
    { key: 'timestamp', header: 'Time', sortable: true, render: e => formatRelative(e.timestamp) },
    { key: 'actor', header: 'Actor', render: e => <span className="text-gray-200">{e.actor_username}</span> },
    { key: 'action', header: 'Action', render: e => <span className="font-mono text-xs">{e.action}</span> },
    { key: 'resource', header: 'Resource', render: e => `${e.resource_type}/${e.resource_id}` },
  ];

  return (
    <DataTable
      columns={columns}
      data={entries}
      keyExtractor={e => e.id}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
