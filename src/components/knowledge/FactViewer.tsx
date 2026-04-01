import type { Fact } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { formatDate } from '@/lib/utils';

interface Props {
  facts: Fact[];
}

export function FactViewer({ facts }: Props) {
  const columns: Column<Fact>[] = [
    { key: 'subject', header: 'Subject', render: f => <span className="font-mono text-xs text-gray-300">{f.subject_id}</span> },
    { key: 'predicate', header: 'Predicate', render: f => <span className="text-violet-400">{f.predicate}</span> },
    { key: 'object', header: 'Object', render: f => <span className="font-mono text-xs text-gray-300">{f.object_id}</span> },
    {
      key: 'confidence',
      header: 'Confidence',
      sortable: true,
      render: f => (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-gray-800">
            <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${f.confidence * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400">{(f.confidence * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    { key: 'source', header: 'Source', render: f => f.source },
    { key: 'created_at', header: 'Created', sortable: true, render: f => formatDate(f.created_at) },
  ];

  return <DataTable columns={columns} data={facts} keyExtractor={f => f.id} />;
}
