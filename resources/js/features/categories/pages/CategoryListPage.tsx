import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { CategoryFormModal } from '../components/CategoryFormModal';
import { useCategories, useDeleteCategory } from '../hooks/useCategories';
import { Category } from '../types';
import { Plus, Tags, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/shared/utils/formatters';

export const CategoryListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const { data: categories, isLoading, error } = useCategories();
  const deleteMutation = useDeleteCategory();

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!categoryToDelete) return;
    deleteMutation.mutate(categoryToDelete.id, {
      onSuccess: () => setCategoryToDelete(null),
    });
  };

  return (
    <div>
      <PageHeader
        title="Kategori Barang"
        description="Kelola kategori produk untuk pengelompokan dan pelaporan inventaris"
        action={
          <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Kategori
          </Button>
        }
      />

      {isLoading && <LoadingSpinner label="Memuat daftar kategori..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
          Gagal memuat data kategori. Silakan coba muat ulang halaman.
        </div>
      )}

      {!isLoading && !error && categories && (
        <>
          {categories.length === 0 ? (
            <EmptyState
              icon={<Tags className="w-6 h-6" />}
              title="Belum ada kategori"
              description="Buat kategori pertama untuk mulai mengelompokkan stok produk Anda."
              actionLabel="Tambah Kategori Sekarang"
              onAction={handleOpenAdd}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Jumlah Produk</TableHead>
                  <TableHead>Dibuat Pada</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Tags className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{cat.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                        {cat.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-slate-500 max-w-xs truncate">
                      {cat.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cat.products_count && cat.products_count > 0 ? 'primary' : 'neutral'}>
                        {cat.products_count || 0} Produk
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(cat.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit Kategori"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCategoryToDelete(cat)}
                          title="Hapus Kategori"
                          className="hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />

      <ConfirmDialog
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Kategori?"
        message={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Produk yang terkait akan menjadi tanpa kategori.`}
        confirmText="Ya, Hapus"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
