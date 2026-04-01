import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listConversations } from '@/api/conversations';
import { ConversationList } from '@/components/conversations/ConversationList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function ConversationsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery({
    queryKey: ['conversations', page],
    queryFn: () => listConversations({ page, per_page: 25 }),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load conversations" description={(error as Error).message} />;

  const items = data?.items ?? [];
  const totalPages = data ? Math.ceil(data.total / data.per_page) : 1;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Conversations</h1>
      {items.length > 0 ? (
        <ConversationList conversations={items} page={page} totalPages={totalPages} onPageChange={setPage} />
      ) : (
        <EmptyState title="No conversations" description="Conversations will appear here as users interact with agents." />
      )}
    </div>
  );
}
