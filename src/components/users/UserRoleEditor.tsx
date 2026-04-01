import type { UserRole } from '@/types';

interface Props {
  role: UserRole;
  disabled?: boolean;
  onChange: (role: UserRole) => void;
}

const roles: UserRole[] = ['admin', 'user', 'viewer'];

export function UserRoleEditor({ role, disabled, onChange }: Props) {
  return (
    <select
      value={role}
      disabled={disabled}
      onChange={e => onChange(e.target.value as UserRole)}
      className="rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-200 disabled:opacity-50"
    >
      {roles.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  );
}
