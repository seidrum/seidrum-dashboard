import type { Trace, Span } from '@/types';
import { statusColor, formatDuration, formatDate } from '@/lib/utils';

interface Props {
  trace: Trace;
}

function SpanRow({ span, depth }: { span: Span; depth: number }) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-800/50 py-2" style={{ paddingLeft: `${depth * 24 + 12}px` }}>
      <span className={`h-2 w-2 rounded-full ${span.status === 'ok' ? 'bg-emerald-400' : span.status === 'error' ? 'bg-red-400' : 'bg-amber-400'}`} />
      <span className="flex-1 text-sm text-gray-200">{span.operation}</span>
      <span className="text-xs text-gray-500">{span.plugin_id ?? '—'}</span>
      <span className={`text-xs ${statusColor(span.status)}`}>{formatDuration(span.duration_ms)}</span>
    </div>
  );
}

interface SpanNode {
  span: Span;
  children: SpanNode[];
}

function buildTree(spans: Span[]): SpanNode[] {
  const map = new Map<string, SpanNode>();
  const roots: SpanNode[] = [];

  for (const s of spans) {
    map.set(s.span_id, { span: s, children: [] });
  }
  for (const s of spans) {
    const node = map.get(s.span_id)!;
    if (s.parent_span_id && map.has(s.parent_span_id)) {
      map.get(s.parent_span_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

function renderTree(nodes: SpanNode[], depth: number): React.ReactNode[] {
  return nodes.flatMap(n => [
    <SpanRow key={n.span.span_id} span={n.span} depth={depth} />,
    ...renderTree(n.children, depth + 1),
  ]);
}

export function TraceDetail({ trace }: Props) {
  const tree = buildTree(trace.spans);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-gray-500">Trace ID</p>
          <p className="font-mono text-gray-200">{trace.trace_id}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <p className={statusColor(trace.status)}>{trace.status}</p>
        </div>
        <div>
          <p className="text-gray-500">Duration</p>
          <p className="text-gray-200">{formatDuration(trace.duration_ms)}</p>
        </div>
        <div>
          <p className="text-gray-500">Started</p>
          <p className="text-gray-200">{formatDate(trace.started_at)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/50">
        <div className="border-b border-gray-800 px-4 py-3">
          <h3 className="text-sm font-medium text-gray-300">Span Waterfall ({trace.spans.length} spans)</h3>
        </div>
        <div>{renderTree(tree, 0)}</div>
      </div>
    </div>
  );
}
