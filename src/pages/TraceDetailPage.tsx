import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTrace } from '@/hooks/useTraces';
import { TraceDetail } from '@/components/traces/TraceDetail';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function TraceDetailPage() {
  const { traceId } = useParams<{ traceId: string }>();
  const { data: trace, isLoading, error } = useTrace(traceId ?? '');

  if (isLoading) return <LoadingSpinner />;
  if (error || !trace) return <EmptyState title="Trace not found" />;

  return (
    <div className="space-y-4">
      <Link to="/traces" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to traces
      </Link>
      <TraceDetail trace={trace} />
    </div>
  );
}
