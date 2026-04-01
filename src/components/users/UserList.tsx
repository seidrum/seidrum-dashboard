import type { User, UserRole } from '@/types';
import { DataTable, type Column } from '@/components/common/DataTable';
import { formatDate } from '@/lib/utils';
import { UserRoleEditor } from './UserRoleEditor';

interface Props {
  users: User[];
  onRoleChange: (userId: string, role: UserRole) => void;
  onDelete: (userId: string) => void;
  currentUserId: string;
}

export function UserList({ users, onRoleChange, onDelete, currentUserId }: Props) {
  const columns: Column<User>[] = [
    { key: 'username', header: 'Username', sortable: true, render: u => <span className="font-medium text-gray-200">{u.username}</span> },
    {
      key: 'role',
      header: 'Role',
      render: u => (
        <UserRoleEditor
          role={u.role}
          disabled={u.id === currentUserId}
          onChange={role => onRoleChange(u.id, role)}
        />
      ),
    },
    { key: 'created_at', header: 'Created', sortable: true, render: u => formatDate(u.created_at) },
    {
      key: 'actions',
      header: '',
      render: u =>
        u.id !== currentUserId ? (
          <button
            onClick={() => onDelete(u.id)}
            className="text-xs text-red-400 hover:underline"
          >
            Delete
          </button>
        ) : null,
    },
  ];

  return <DataTable columns={columns} data={users} keyExtractor={u => u.id} />;
}
