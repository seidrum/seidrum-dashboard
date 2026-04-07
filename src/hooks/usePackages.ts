import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  searchPackages,
  installPackage,
  uninstallPackage,
  listInstalledPackages,
} from '@/api/packages';

export function usePackageSearch(query: string, kind?: string) {
  return useQuery({
    queryKey: ['packages', 'search', query, kind],
    queryFn: () => searchPackages(query, kind),
    enabled: query.length > 0 || !kind,
  });
}

export function useInstalledPackages() {
  return useQuery({
    queryKey: ['packages', 'installed'],
    queryFn: listInstalledPackages,
  });
}

export function useInstallPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pkg, confirm }: { pkg: string; confirm: boolean }) =>
      installPackage(pkg, confirm),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['packages'] });
      qc.invalidateQueries({ queryKey: ['plugins'] });
      qc.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

export function useUninstallPackage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uninstallPackage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['packages'] });
      qc.invalidateQueries({ queryKey: ['plugins'] });
      qc.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}
