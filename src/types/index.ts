export interface User {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role?: UserRole;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  status: PluginStatus;
  capabilities: string[];
  registered_at: string;
  last_heartbeat: string | null;
}

export type PluginStatus = 'healthy' | 'degraded' | 'unreachable' | 'unknown';

export type { PluginFull } from '@/api/pluginsMgmt';

export interface Capability {
  name: string;
  plugin_id: string;
  plugin_name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export interface Trace {
  trace_id: string;
  conversation_id: string | null;
  spans: Span[];
  started_at: string;
  duration_ms: number;
  status: TraceStatus;
}

export type TraceStatus = 'ok' | 'error' | 'timeout';

export interface Span {
  span_id: string;
  parent_span_id: string | null;
  operation: string;
  plugin_id: string | null;
  started_at: string;
  duration_ms: number;
  status: TraceStatus;
  attributes: Record<string, unknown>;
  events: SpanEvent[];
}

export interface SpanEvent {
  name: string;
  timestamp: string;
  attributes: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Entity {
  id: string;
  name: string;
  entity_type: string;
  properties: Record<string, unknown>;
  created_at: string;
}

export interface Fact {
  id: string;
  subject_id: string;
  predicate: string;
  object_id: string;
  confidence: number;
  source: string;
  created_at: string;
}

export interface AuditEntry {
  id: string;
  actor_id: string;
  actor_username: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  key?: string; // only returned on creation
  created_at: string;
  expires_at: string | null;
  last_used_at: string | null;
}

export interface CreateApiKeyRequest {
  name: string;
  expires_in_days?: number;
}

export interface OverviewStats {
  total_plugins: number;
  healthy_plugins: number;
  total_conversations: number;
  total_entities: number;
  total_facts: number;
  total_traces_24h: number;
  error_rate_24h: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface Skill {
  name: string;
  description: string;
  plugin_id: string;
  plugin_name: string;
}

export interface Agent {
  id: string;
  enabled: boolean;
  description: string | null;
  prompt: string;
  tools: string[];
  scope: string;
  additional_scopes: string[];
  subscribe: string[];
}
