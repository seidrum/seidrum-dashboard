import type { Trace } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { statusColor, formatRelative, formatDuration, truncate } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Props {
  traces: Trace[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TraceList({ traces, page, totalPages, onPageChange }: Props) {
  const columns: Column<Trace>[] = [
    {
      key: 'trace_id',
      header: 'Trace ID',
      render: t => (
        <Link to={`/traces/${t.trace_id}`} className="font-mono text-violet-400 hover:underline">
          {truncate(t.trace_id, 12)}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: t => <span className={statusColor(t.status)}>{t.status}</span>,
    },
    { key: 'spans', header: 'Spans', render: t => t.spans.length },
    { key: 'duration', header: 'Duration', sortable: true, render: t => formatDuration(t.duration_ms) },
    { key: 'started_at', header: 'Started', sortable: true, render: t => formatRelative(t.started_at) },
  ];

  return (
    <DataTable
      columns={columns}
      data={traces}
      keyExtractor={t => t.trace_id}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
