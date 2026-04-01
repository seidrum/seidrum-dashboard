import { useApiKeys, useCreateApiKey, useRevokeApiKey } from '@/hooks/useApiKeys';
import { ApiKeyList } from '@/components/apikeys/ApiKeyList';
import { CreateApiKeyForm } from '@/components/apikeys/CreateApiKeyForm';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function ApiKeysPage() {
  const { data: keys, isLoading, error } = useApiKeys();
  const create = useCreateApiKey();
  const revoke = useRevokeApiKey();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load API keys" description={error.message} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">API Keys</h1>
      <CreateApiKeyForm
        onSubmit={async (name, expiresInDays) => {
          const key = await create.mutateAsync({ name, expires_in_days: expiresInDays });
          return key;
        }}
      />
      {keys && keys.length > 0 ? (
        <ApiKeyList apiKeys={keys} onRevoke={id => revoke.mutate(id)} />
      ) : (
        <EmptyState title="No API keys" description="Create an API key to authenticate external integrations." />
      )}
    </div>
  );
}
