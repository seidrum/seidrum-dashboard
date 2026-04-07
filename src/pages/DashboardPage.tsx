import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOverview } from '@/hooks/useDashboard';
import { usePlugins } from '@/hooks/usePlugins';
import { useOnboardingStatus } from '@/hooks/useOnboarding';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { SystemHealth } from '@/components/dashboard/SystemHealth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function DashboardPage() {
  const navigate = useNavigate();
  const overview = useOverview();
  const plugins = usePlugins();
  const { data: onboarding } = useOnboardingStatus();

  useEffect(() => {
    if (onboarding?.first_run && onboarding.plugins_enabled === 0) {
      navigate('/onboarding');
    }
  }, [onboarding, navigate]);

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
