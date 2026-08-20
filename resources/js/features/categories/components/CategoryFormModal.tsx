import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Category, CategoryInput } from '../types';
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories';

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isEditing = Boolean(category);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: CategoryInput = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    if (isEditing && category) {
      updateMutation.mutate(
        { id: category.id, data: payload },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      description="Kelompokkan produk inventaris berdasarkan kategori untuk memudahkan pencarian."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Kategori"
          placeholder="contoh: Elektronik, Makanan, ATK"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Deskripsi Kategori (Opsional)
          </label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 text-sm transition-colors py-2 px-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            rows={3}
            placeholder="Keterangan singkat kategori ini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
