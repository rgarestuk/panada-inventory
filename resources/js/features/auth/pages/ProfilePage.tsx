import React from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate } from '@/shared/utils/formatters';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="Profil Pengguna"
        description="Informasi akun pengguna dan hak akses di Panada Inventory"
      />

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <CardTitle>{user?.name}</CardTitle>
                <span className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                </span>
              </div>
            </div>
          </CardHeader>

          <CardBody className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <User className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Nama Lengkap</p>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Email Terdaftar</p>
                <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Terdaftar Sejak</p>
                <p className="text-sm font-semibold text-slate-800">{formatDate(user?.created_at)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
