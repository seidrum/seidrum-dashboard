import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-12 text-center">
      <div className="text-gray-500">{icon ?? <Inbox className="h-10 w-10" />}</div>
      <h3 className="text-lg font-medium text-gray-300">{title}</h3>
      {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
