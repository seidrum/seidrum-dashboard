import { useState, useEffect, useCallback } from 'react';
import { Search, Package } from 'lucide-react';
import {
  usePackageSearch,
  useInstalledPackages,
  useInstallPackage,
  useUninstallPackage,
} from '@/hooks/usePackages';
import { PackageCard } from '@/components/packages/PackageCard';
import { InstallConfirmModal } from '@/components/packages/InstallConfirmModal';
import { InstalledTable } from '@/components/packages/InstalledTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import type { InstallPreview, PackageInfo } from '@/api/packages';

const KIND_FILTERS = ['all', 'plugin', 'agent', 'bundle'] as const;

export function PackagesPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'installed'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState<(typeof KIND_FILTERS)[number]>('all');
  const [installPreview, setInstallPreview] = useState<InstallPreview | null>(null);
  const [selectedPackageForInstall, setSelectedPackageForInstall] = useState<PackageInfo | null>(
    null,
  );
  const [installingPackageName, setInstallingPackageName] = useState<string | null>(null);
  const [uninstallingNames, setUninstallingNames] = useState<Set<string>>(new Set());
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const kindFilter = selectedKind === 'all' ? undefined : selectedKind;
  const { data: searchResult, isLoading: isSearching } = usePackageSearch(
    debouncedQuery,
    kindFilter,
  );
  const { data: installedData, isLoading: isLoadingInstalled } = useInstalledPackages();

  const installMutation = useInstallPackage();
  const uninstallMutation = useUninstallPackage();

  const handleInstallClick = useCallback(async (pkg: PackageInfo) => {
    setSelectedPackageForInstall(pkg);
    setInstallingPackageName(pkg.name);
    try {
      const result = await installMutation.mutateAsync({
        pkg: pkg.name,
        confirm: false,
      });

      if ('plugins_to_install' in result) {
        setInstallPreview(result);
      }
    } catch (err) {
      console.error('Failed to get install preview:', err);
      setInstallingPackageName(null);
      setSelectedPackageForInstall(null);
    }
  }, [installMutation]);

  const handleConfirmInstall = useCallback(async () => {
    if (!selectedPackageForInstall) return;

    try {
      await installMutation.mutateAsync({
        pkg: selectedPackageForInstall.name,
        confirm: true,
      });
      setInstallPreview(null);
      setSelectedPackageForInstall(null);
    } catch (err) {
      console.error('Failed to install package:', err);
      throw err;
    } finally {
      setInstallingPackageName(null);
    }
  }, [selectedPackageForInstall, installMutation]);

  const handleUninstall = useCallback(
    async (name: string) => {
      setUninstallingNames(prev => new Set([...prev, name]));
      try {
        await uninstallMutation.mutateAsync(name);
      } catch (err) {
        console.error('Failed to uninstall package:', err);
        throw err;
      } finally {
        setUninstallingNames(prev => {
          const next = new Set(prev);
          next.delete(name);
          return next;
        });
      }
    },
    [uninstallMutation],
  );

  const packages = searchResult?.packages ?? [];
  const installedPackages = installedData?.packages ?? [];
  const installStatus = new Map(installedPackages.map(p => [p.name, p]));

  const searchResults = packages.map(pkg => ({
    ...pkg,
    installed: installStatus.has(pkg.name),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Packages</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'browse'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Browse
        </button>
        <button
          onClick={() => setActiveTab('installed')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'installed'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Installed ({installedPackages.length})
        </button>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2 pl-10 pr-4 text-gray-100 placeholder-gray-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Kind filter pills */}
          <div className="flex flex-wrap gap-2">
            {KIND_FILTERS.map(kind => (
              <button
                key={kind}
                onClick={() => setSelectedKind(kind)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedKind === kind
                    ? 'bg-violet-600 text-white'
                    : 'border border-gray-700 bg-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </button>
            ))}
          </div>

          {/* Results */}
          {isSearching ? (
            <LoadingSpinner />
          ) : searchResults.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map(pkg => (
                <PackageCard
                  key={pkg.name}
                  pkg={pkg}
                  onInstall={() => handleInstallClick(pkg)}
                  isInstalling={installingPackageName === pkg.name}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Package className="h-10 w-10 text-gray-600" />}
              title={
                searchQuery
                  ? `No packages found for "${searchQuery}"`
                  : 'No packages available'
              }
              description={
                searchQuery
                  ? 'Try adjusting your search query'
                  : 'Browse packages from the registry'
              }
            />
          )}
        </div>
      )}

      {/* Installed Tab */}
      {activeTab === 'installed' && (
        <div className="space-y-6">
          {isLoadingInstalled ? (
            <LoadingSpinner />
          ) : installedPackages.length > 0 ? (
            <InstalledTable
              packages={installedPackages}
              onUninstall={handleUninstall}
              uninstallingNames={uninstallingNames}
            />
          ) : (
            <EmptyState
              icon={<Package className="h-10 w-10 text-gray-600" />}
              title="No packages installed"
              description="Install packages from the Browse tab to get started"
            />
          )}
        </div>
      )}

      {/* Install confirmation modal */}
      {installPreview && (
        <InstallConfirmModal
          preview={installPreview}
          onConfirm={handleConfirmInstall}
          onCancel={() => {
            setInstallPreview(null);
            setSelectedPackageForInstall(null);
            setInstallingPackageName(null);
          }}
          isLoading={installingPackageName === selectedPackageForInstall?.name}
        />
      )}
    </div>
  );
}
