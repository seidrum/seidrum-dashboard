import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { getConversation } from '@/api/conversations';
import { ConversationDetail } from '@/components/conversations/ConversationDetail';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function ConversationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['conversations', id],
    queryFn: () => getConversation(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !data) return <EmptyState title="Conversation not found" />;

  return (
    <div className="space-y-4">
      <Link to="/conversations" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="h-4 w-4" /> Back to conversations
      </Link>
      <ConversationDetail title={data.title} messages={data.messages} />
    </div>
  );
}
