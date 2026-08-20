import React from 'react';
import { NavLink } from 'react-router-dom';
import { Boxes, LayoutDashboard, Package, Tags, User, LogOut, X } from 'lucide-react';
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations';
import { useAuth } from '@/app/providers/AuthProvider';
import { cn } from '@/shared/lib/utils';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Katalog Produk', href: '/products', icon: Package },
    { name: 'Kategori Barang', href: '/categories', icon: Tags },
    { name: 'Profil Akun', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">Panada</span>
              <span className="text-xs text-indigo-400 font-semibold block leading-none">Inventory</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 lg:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout button at bottom */}
        <div className="p-3 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/30">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => logoutMutation.mutate()}
              title="Keluar"
              disabled={logoutMutation.isPending}
              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
