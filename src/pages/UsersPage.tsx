import { useUsers, useUpdateRole, useDeleteUser } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { UserList } from '@/components/users/UserList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const updateRole = useUpdateRole();
  const deleteUser = useDeleteUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Failed to load users" description={error.message} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Users</h1>
      {users && users.length > 0 ? (
        <UserList
          users={users}
          currentUserId={currentUser?.id ?? ''}
          onRoleChange={(userId, role) => updateRole.mutate({ userId, role })}
          onDelete={id => deleteUser.mutate(id)}
        />
      ) : (
        <EmptyState title="No users found" />
      )}
    </div>
  );
}
