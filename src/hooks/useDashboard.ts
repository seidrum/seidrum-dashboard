import { useQuery } from '@tanstack/react-query';
import { getOverview, listSkills } from '@/api/dashboard';

export function useOverview() {
  return useQuery({ queryKey: ['dashboard', 'overview'], queryFn: getOverview });
}

export function useSkills() {
  return useQuery({ queryKey: ['dashboard', 'skills'], queryFn: listSkills });
}
