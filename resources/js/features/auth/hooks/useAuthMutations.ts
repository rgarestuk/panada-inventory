import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { LoginCredentials, RegisterCredentials } from '../types';
import { getErrorMessage } from '@/shared/utils/error';
import { useNavigate } from 'react-router-dom';

export function useLoginMutation() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: () => {
      toast.success('Selamat datang kembali di Panada Inventory!', 'Login Berhasil');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Login');
    },
  });
}

export function useRegisterMutation() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: () => {
      toast.success('Akun Anda berhasil dibuat!', 'Registrasi Berhasil');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Registrasi');
    },
  });
}

export function useLogoutMutation() {
  const { logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      toast.info('Sesi Anda telah berakhir.', 'Logout Berhasil');
      navigate('/login');
    },
  });
}
