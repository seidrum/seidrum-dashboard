import { Puzzle, MessageSquare, Brain, Activity, AlertTriangle, BookOpen } from 'lucide-react';
import type { OverviewStats } from '@/types';

interface Props {
  stats: OverviewStats;
}

export function OverviewCards({ stats }: Props) {
  const cards = [
    { label: 'Plugins', value: `${stats.healthy_plugins}/${stats.total_plugins}`, sub: 'healthy', icon: Puzzle, color: 'text-violet-400' },
    { label: 'Conversations', value: stats.total_conversations, icon: MessageSquare, color: 'text-blue-400' },
    { label: 'Entities', value: stats.total_entities, icon: Brain, color: 'text-emerald-400' },
    { label: 'Facts', value: stats.total_facts, icon: BookOpen, color: 'text-cyan-400' },
    { label: 'Traces (24h)', value: stats.total_traces_24h, icon: Activity, color: 'text-amber-400' },
    { label: 'Error rate (24h)', value: `${(stats.error_rate_24h * 100).toFixed(1)}%`, icon: AlertTriangle, color: stats.error_rate_24h > 0.05 ? 'text-red-400' : 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(card => (
        <div key={card.label} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{card.label}</p>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-100">{card.value}</p>
          {card.sub && <p className="mt-1 text-xs text-gray-500">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
}
