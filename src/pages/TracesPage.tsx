import { useState } from 'react';
import { useTraces } from '@/hooks/useTraces';
import { TraceList } from '@/components/traces/TraceList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function TracesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading, error } = useTraces({ page, per_page: 25, status: statusFilter || undefined });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load traces" description={error.message} />;

  const items = data?.items ?? [];
  const totalPages = data ? Math.ceil(data.total / data.per_page) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Traces</h1>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200"
        >
          <option value="">All statuses</option>
          <option value="ok">OK</option>
          <option value="error">Error</option>
          <option value="timeout">Timeout</option>
        </select>
      </div>
      {items.length > 0 ? (
        <TraceList traces={items} page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : (
        <EmptyState title="No traces found" description="Traces will appear here as requests flow through the system." />
      )}
    </div>
  );
}
