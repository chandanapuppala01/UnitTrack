import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calculator, 
  Lightbulb, 
  BarChart3, 
  User, 
  Zap,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Screen } from '@/src/types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export default function Sidebar({ activeScreen, onScreenChange }: SidebarProps) {
  const { logout } = useAuth();

  const mainNavItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'add-bill', icon: PlusCircle, label: 'Add Bill' },
    { id: 'calculator', icon: Calculator, label: 'Usage Calculator' },
    { id: 'insights', icon: Lightbulb, label: 'Insights' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
  ] as const;

  const bottomNavItems = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 print:hidden transition-colors duration-300">
      {/* Brand */}
      <div className="p-6 flex items-center space-x-3 cursor-pointer" onClick={() => onScreenChange('landing')}>
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Zap size={24} fill="currentColor" />
        </div>
        <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">UnitTrack</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={cn(
                "sidebar-item w-full",
                isActive && "sidebar-item-active"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-6 border-t border-slate-50 dark:border-slate-800/50 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={cn(
                "sidebar-item w-full",
                isActive && "sidebar-item-active"
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={async () => {
            toast.success('Signed out successfully');
            await logout();
            onScreenChange('landing');
          }}
          className="sidebar-item w-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
