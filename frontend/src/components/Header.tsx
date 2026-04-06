import React from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-64 z-40 px-8 flex items-center justify-end print:hidden transition-colors duration-300">

      {/* Actions */}
      <div className="flex items-center space-x-6">
        {/* Current Month */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-100 dark:border-slate-700/50 group cursor-pointer" onClick={logout}>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">{user?.displayName || 'User'}</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center justify-end space-x-1 group-hover:text-rose-400 transition-colors">
              <span>Logout</span>
              <LogOut size={10} />
            </p>
          </div>
          <div className="w-9 h-9 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 font-bold bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:border-rose-200 transition-all">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
