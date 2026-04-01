import { useState } from 'react';
import { useAuditLog } from '@/hooks/useAudit';
import { AuditLog } from '@/components/audit/AuditLog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function AuditPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useAuditLog({ page, per_page: 50 });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load audit log" description={error.message} />;

  const items = data?.items ?? [];
  const totalPages = data ? Math.ceil(data.total / data.per_page) : 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Audit Log</h1>
      {items.length > 0 ? (
        <AuditLog entries={items} page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : (
        <EmptyState title="No audit entries" description="Activity will be logged here." />
      )}
    </div>
  );
}
