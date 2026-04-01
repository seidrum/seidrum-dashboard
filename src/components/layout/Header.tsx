import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-800 bg-gray-950 px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User className="h-4 w-4 text-gray-500" />
          <span>{user?.username}</span>
          {user?.role === 'admin' && (
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
              admin
            </span>
          )}
        </div>
        <button
          onClick={logout}
          className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
