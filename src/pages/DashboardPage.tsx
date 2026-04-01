import { useOverview } from '@/hooks/useDashboard';
import { usePlugins } from '@/hooks/usePlugins';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function DashboardPage() {
  const overview = useOverview();
  const plugins = usePlugins();

  if (overview.isLoading || plugins.isLoading) return <LoadingSpinner />;

  if (overview.error) {
    return <EmptyState title="Failed to load dashboard" description={overview.error.message} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
      {overview.data && <OverviewCards stats={overview.data} />}
      {plugins.data && <SystemHealth plugins={plugins.data} />}
    </div>
  );
}
