import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  Puzzle,
  Bot,
  Layers,
  Package,
  Activity,
  Key,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const mainNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/conversations', icon: MessageSquare, label: 'Conversations' },
  { to: '/knowledge', icon: Brain, label: 'Knowledge' },
  { to: '/plugins', icon: Puzzle, label: 'Plugins' },
  { to: '/agents', icon: Bot, label: 'Agents' },
  { to: '/presets', icon: Layers, label: 'Presets' },
  { to: '/packages', icon: Package, label: 'Packages' },
  { to: '/traces', icon: Activity, label: 'Traces' },
  { to: '/api-keys', icon: Key, label: 'API Keys' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const adminNav = [
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/audit', icon: FileText, label: 'Audit' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-violet-500/10 text-violet-400'
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
    }`;

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-800 bg-gray-950 transition-all ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-gray-800 px-4">
        <div className="flex items-center gap-2.5">
          <img src="/seidrum-icon.svg" alt="Seidrum" className="h-7 w-7 shrink-0" />
          {!collapsed && <span className="text-lg font-semibold text-gray-100">Seidrum</span>}
        </div>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {mainNav.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-gray-800" />
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-medium uppercase text-gray-600">Admin</p>
            )}
            {adminNav.map(item => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
