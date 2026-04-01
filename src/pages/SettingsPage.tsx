import { useAuth } from '@/hooks/useAuth';

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-200">Profile</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex gap-4">
            <dt className="w-24 text-gray-500">Username</dt>
            <dd className="text-gray-200">{user?.username}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 text-gray-500">Role</dt>
            <dd className="text-gray-200">{user?.role}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-24 text-gray-500">User ID</dt>
            <dd className="font-mono text-xs text-gray-400">{user?.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
