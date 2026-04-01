import type { Message } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
  title: string | null;
  messages: Message[];
}

export function ConversationDetail({ title, messages }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-100">{title ?? 'Untitled Conversation'}</h2>
      <div className="space-y-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`rounded-lg border p-4 ${
              msg.role === 'user'
                ? 'border-gray-700 bg-gray-800/50'
                : msg.role === 'assistant'
                  ? 'border-violet-500/20 bg-violet-500/5'
                  : 'border-gray-800 bg-gray-900/50'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className={`text-xs font-medium uppercase ${
                msg.role === 'user' ? 'text-blue-400' : msg.role === 'assistant' ? 'text-violet-400' : 'text-gray-500'
              }`}>
                {msg.role}
              </span>
              <span className="text-xs text-gray-500">{formatDate(msg.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-gray-200">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
