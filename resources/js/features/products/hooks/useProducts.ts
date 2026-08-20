import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productRepository } from '../repository/product.repository';
import { PRODUCT_QUERY_KEYS } from '../constants';
import { Product, ProductFilterParams, ProductInput, StockAdjustmentInput } from '../types';
import { PaginatedResponse } from '@/shared/types/api';
import { useToast } from '@/app/providers/ToastProvider';
import { getErrorMessage } from '@/shared/utils/error';

export function useProducts(params?: ProductFilterParams) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.LIST(params),
    queryFn: () => productRepository.getAll(params),
  });
}

export function useProduct(id?: number | string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.DETAIL(id ?? ''),
    queryFn: () => productRepository.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: ProductInput) => productRepository.create(data),
    onSuccess: (newProd) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Produk "${newProd.name}" berhasil ditambahkan.`, 'Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Menambah Produk');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: ProductInput }) =>
      productRepository.update(id, data),
    onSuccess: (updatedProd) => {
      queryClient.setQueriesData<PaginatedResponse<Product>>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === updatedProd.id ? updatedProd : item
            ),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Produk "${updatedProd.name}" berhasil diperbarui.`, 'Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Memperbarui Produk');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: number | string) => productRepository.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<PaginatedResponse<Product>>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((item) => String(item.id) !== String(deletedId)),
            meta: {
              ...oldData.meta,
              total: Math.max(0, (oldData.meta?.total || 1) - 1),
            },
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Produk berhasil dihapus dari inventaris.', 'Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Menghapus Produk');
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: StockAdjustmentInput }) =>
      productRepository.adjustStock(id, data),
    onSuccess: (product) => {
      queryClient.setQueriesData<PaginatedResponse<Product>>(
        { queryKey: ['products'] },
        (oldData) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((item) =>
              item.id === product.id ? product : item
            ),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Stok "${product.name}" kini ${product.stock} ${product.unit}.`, 'Mutasi Berhasil');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), 'Gagal Menyesuaikan Stok');
    },
  });
}
