import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '../hooks/useAuthMutations';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Boxes, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password !== passwordConfirmation) {
      setFormError('Konfirmasi password tidak cocok dengan password.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password minimal harus 6 karakter.');
      return;
    }

    registerMutation.mutate({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <Boxes className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Buat Akun Baru</h2>
        <p className="text-sm text-slate-500 mt-1">Daftar untuk mulai mencatat inventaris barang</p>
      </div>

      {/* Card container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-8">
        {formError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
            autoComplete="name"
          />

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
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          <Input
            label="Konfirmasi Kata Sandi"
            type="password"
            placeholder="Ulangi kata sandi"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={registerMutation.isPending}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Daftar Akun
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};
