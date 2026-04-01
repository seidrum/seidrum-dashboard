import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PluginsPage } from '@/pages/PluginsPage';
import { TracesPage } from '@/pages/TracesPage';
import { TraceDetailPage } from '@/pages/TraceDetailPage';
import { UsersPage } from '@/pages/UsersPage';
import { AuditPage } from '@/pages/AuditPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { ConversationsPage } from '@/pages/ConversationsPage';
import { ConversationDetailPage } from '@/pages/ConversationDetailPage';
import { ApiKeysPage } from '@/pages/ApiKeysPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="conversations" element={<ConversationsPage />} />
                  <Route path="conversations/:id" element={<ConversationDetailPage />} />
                  <Route path="knowledge" element={<KnowledgePage />} />
                  <Route path="plugins" element={<PluginsPage />} />
                  <Route path="traces" element={<TracesPage />} />
                  <Route path="traces/:traceId" element={<TraceDetailPage />} />
                  <Route path="api-keys" element={<ApiKeysPage />} />
                  <Route path="settings" element={<SettingsPage />} />

                  <Route element={<ProtectedRoute requireAdmin />}>
                    <Route path="users" element={<UsersPage />} />
                    <Route path="audit" element={<AuditPage />} />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
