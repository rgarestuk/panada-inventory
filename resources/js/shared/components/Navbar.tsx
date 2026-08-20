import React from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { Link } from 'react-router-dom';

export interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline uppercase tracking-wider">
          Panada Management Suite
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-700"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="text-xs font-semibold hidden md:inline text-slate-800">{user?.name}</span>
        </Link>
      </div>
    </header>
  );
};
