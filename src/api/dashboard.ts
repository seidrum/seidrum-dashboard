import type { OverviewStats, Skill } from '@/types';
import { apiFetch } from './client';

export function getOverview() {
  return apiFetch<OverviewStats>('/dashboard/overview');
}

export function listSkills() {
  return apiFetch<Skill[]>('/dashboard/skills');
}

export function getSkill(name: string) {
  return apiFetch<Skill>(`/dashboard/skills/${encodeURIComponent(name)}`);
}
