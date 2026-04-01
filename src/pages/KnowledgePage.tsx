import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/api/client';
import type { Entity, Fact, PaginatedResponse } from '@/types';
import { EntityExplorer } from '@/components/knowledge/EntityExplorer';
import { FactViewer } from '@/components/knowledge/FactViewer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

type Tab = 'entities' | 'facts';

export function KnowledgePage() {
  const [tab, setTab] = useState<Tab>('entities');

  const entities = useQuery({
    queryKey: ['knowledge', 'entities'],
    queryFn: () => apiFetch<PaginatedResponse<Entity>>('/knowledge/entities'),
    enabled: tab === 'entities',
  });

  const facts = useQuery({
    queryKey: ['knowledge', 'facts'],
    queryFn: () => apiFetch<PaginatedResponse<Fact>>('/knowledge/facts'),
    enabled: tab === 'facts',
  });

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      tab === t ? 'bg-violet-500/10 text-violet-400' : 'text-gray-400 hover:text-gray-200'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">Knowledge Graph</h1>
        <div className="flex gap-1 rounded-lg border border-gray-800 p-1">
          <button className={tabClass('entities')} onClick={() => setTab('entities')}>Entities</button>
          <button className={tabClass('facts')} onClick={() => setTab('facts')}>Facts</button>
        </div>
      </div>

      {tab === 'entities' && (
        entities.isLoading ? <LoadingSpinner /> :
        entities.error ? <EmptyState title="Failed to load entities" /> :
        entities.data && entities.data.items.length > 0 ? (
          <EntityExplorer entities={entities.data.items} />
        ) : (
          <EmptyState title="No entities found" description="Entities will appear here as the knowledge graph is built." />
        )
      )}

      {tab === 'facts' && (
        facts.isLoading ? <LoadingSpinner /> :
        facts.error ? <EmptyState title="Failed to load facts" /> :
        facts.data && facts.data.items.length > 0 ? (
          <FactViewer facts={facts.data.items} />
        ) : (
          <EmptyState title="No facts found" description="Facts will appear here as the knowledge graph is built." />
        )
      )}
    </div>
  );
}
