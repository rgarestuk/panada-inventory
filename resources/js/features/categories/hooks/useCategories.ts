import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryRepository } from '../repository/category.repository';
import { CATEGORY_QUERY_KEYS } from '../constants';
import { Category, CategoryInput } from '../types';
import { useToast } from '@/app/providers/ToastProvider';
import { getErrorMessage } from '@/shared/utils/error';

export function useCategories() {
  return useQuery({
    queryKey: CATEGORY_QUERY_KEYS.LIST(),
    queryFn: () => categoryRepository.getAll(),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: CategoryInput) => categoryRepository.create(data),
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.ALL });
      toast.success(`Kategori "${newCat.name}" berhasil dibuat.`, 'Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Membuat Kategori');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: CategoryInput }) =>
      categoryRepository.update(id, data),
    onSuccess: (updatedCat) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.ALL });
      toast.success(`Kategori "${updatedCat.name}" berhasil diperbarui.`, 'Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Memperbarui Kategori');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number | string) => categoryRepository.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<Category[]>(
        { queryKey: CATEGORY_QUERY_KEYS.LIST() },
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((c) => String(c.id) !== String(deletedId));
        }
      );

      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.ALL });
      toast.success('Kategori berhasil dihapus.', 'Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Menghapus Kategori');
    },
  });
}
