import type { Conversation } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { formatRelative } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Props {
  conversations: Conversation[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ConversationList({ conversations, page, totalPages, onPageChange }: Props) {
  const columns: Column<Conversation>[] = [
    {
      key: 'title',
      header: 'Title',
      render: c => (
        <Link to={`/conversations/${c.id}`} className="font-medium text-violet-400 hover:underline">
          {c.title ?? 'Untitled'}
        </Link>
      ),
    },
    { key: 'messages', header: 'Messages', render: c => c.message_count },
    { key: 'updated', header: 'Updated', sortable: true, render: c => formatRelative(c.updated_at) },
  ];

  return (
    <DataTable
      columns={columns}
      data={conversations}
      keyExtractor={c => c.id}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
