import type { Conversation, Message, PaginatedResponse, PaginationParams } from '@/types';
import { apiFetch } from './client';

export function listConversations(params?: PaginationParams) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.per_page) search.set('per_page', String(params.per_page));
  const qs = search.toString();
  return apiFetch<PaginatedResponse<Conversation>>(`/conversations${qs ? `?${qs}` : ''}`);
}

export function getConversation(id: string) {
  return apiFetch<Conversation & { messages: Message[] }>(`/conversations/${id}`);
}
