import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Product, ProductInput } from '../types';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const isEditing = Boolean(product);

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<number | string>(0);
  const [sellingPrice, setSellingPrice] = useState<number | string>(0);
  const [stock, setStock] = useState<number | string>(0);
  const [minStock, setMinStock] = useState<number | string>(5);
  const [unit, setUnit] = useState('pcs');
  const [description, setDescription] = useState('');

  const { data: categories = [] } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setSku(product.sku);
      setName(product.name);
      setCategoryId(product.category_id ? String(product.category_id) : '');
      setPurchasePrice(product.purchase_price);
      setSellingPrice(product.selling_price);
      setStock(product.stock);
      setMinStock(product.min_stock);
      setUnit(product.unit);
      setDescription(product.description || '');
    } else {
      setSku(`PRD-${Math.floor(1000 + Math.random() * 9000)}`);
      setName('');
      setCategoryId('');
      setPurchasePrice(0);
      setSellingPrice(0);
      setStock(0);
      setMinStock(5);
      setUnit('pcs');
      setDescription('');
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    const payload: ProductInput = {
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      purchase_price: Number(purchasePrice),
      selling_price: Number(sellingPrice),
      stock: isEditing ? undefined : Number(stock),
      min_stock: Number(minStock),
      unit: unit.trim() || 'pcs',
      description: description.trim() || undefined,
    };

    if (isEditing && product) {
      updateMutation.mutate(
        { id: product.id, data: payload },
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
      title={isEditing ? 'Edit Data Produk' : 'Tambah Produk Baru'}
      description="Lengkapi informasi detail produk untuk dicatat ke dalam database inventaris."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Kode SKU Produk"
            placeholder="contoh: ELK-LAPTOP-01"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />

          <Select
            label="Kategori Produk"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Nama Produk"
          placeholder="contoh: MacBook Pro 14 M3 18GB/512GB"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Harga Beli / Pokok (Rp)"
            type="number"
            min={0}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            required
          />

          <Input
            label="Harga Jual (Rp)"
            type="number"
            min={0}
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!isEditing && (
            <Input
              label="Stok Awal"
              type="number"
              min={0}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              helperText="Stok pembukaan"
            />
          )}

          <Input
            label="Batas Minimum Stok"
            type="number"
            min={0}
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            helperText="Pemicu alert low stock"
            required
          />

          <Input
            label="Satuan Unit"
            placeholder="pcs / unit / rim"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Deskripsi / Spesifikasi Produk (Opsional)
          </label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 text-sm transition-colors py-2 px-3 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            rows={3}
            placeholder="Catatan spesifikasi, garansi, kondisi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Simpan Perubahan' : 'Tambah ke Inventaris'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
