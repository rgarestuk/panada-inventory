import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Boxes, Mail, Lock, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@panada.com');
  const [password, setPassword] = useState('password123');

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <Boxes className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Panada Inventory</h2>
        <p className="text-sm text-slate-500 mt-1">Masuk untuk mengelola stok & data inventaris</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Alamat Email"
            type="email"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <Input
            label="Kata Sandi"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loginMutation.isPending}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Masuk Sekarang
            </Button>
          </div>
        </form>

        <div className="mt-6 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
          <p className="font-semibold mb-1">Demo Akun Tersedia:</p>
          <p>Email: <span className="font-mono font-medium text-indigo-700">admin@panada.com</span></p>
          <p>Password: <span className="font-mono font-medium text-indigo-700">password123</span></p>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};
