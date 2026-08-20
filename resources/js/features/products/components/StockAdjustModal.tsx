import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Product, StockAdjustmentInput } from '../types';
import { useAdjustStock } from '../hooks/useProducts';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';

export interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState<number | string>(1);
  const [notes, setNotes] = useState('');

  const adjustStockMutation = useAdjustStock();

  useEffect(() => {
    if (isOpen) {
      setType('in');
      setQuantity(1);
      setNotes('');
    }
  }, [isOpen]);

  if (!product) return null;

  const currentStock = product.stock;
  const numQty = Number(quantity) || 0;

  let predictedStock = currentStock;
  if (type === 'in') predictedStock = currentStock + numQty;
  else if (type === 'out') predictedStock = Math.max(0, currentStock - numQty);
  else if (type === 'adjustment') predictedStock = numQty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQty <= 0 && type !== 'adjustment') return;

    const payload: StockAdjustmentInput = {
      type,
      quantity: numQty,
      notes: notes.trim() || undefined,
    };

    adjustStockMutation.mutate(
      { id: product.id, data: payload },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Penyesuaian Stok Barang"
      description={`Update mutasi stok untuk produk "${product.name}"`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current stock indicator */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Stok Saat Ini</p>
            <p className="text-xl font-bold text-slate-900">
              {currentStock} <span className="text-xs font-normal text-slate-500">{product.unit}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Perkiraan Stok Akhir</p>
            <p className="text-xl font-bold text-indigo-600">
              {predictedStock} <span className="text-xs font-normal text-slate-500">{product.unit}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setType('in')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              type === 'in'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
            <span>Stok Masuk (+)</span>
          </button>

          <button
            type="button"
            onClick={() => setType('out')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              type === 'out'
                ? 'border-rose-500 bg-rose-50 text-rose-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <ArrowUpCircle className="w-5 h-5 text-rose-500" />
            <span>Stok Keluar (-)</span>
          </button>

          <button
            type="button"
            onClick={() => setType('adjustment')}
            className={`p-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              type === 'adjustment'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <RefreshCw className="w-5 h-5 text-indigo-500" />
            <span>Opname (=)</span>
          </button>
        </div>

        <Input
          label={type === 'adjustment' ? 'Jumlah Stok Hasil Opname Fisik' : 'Jumlah Perubahan Stok'}
          type="number"
          min={type === 'adjustment' ? 0 : 1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Catatan / Keterangan Mutasi"
          placeholder="contoh: Pembelian batch baru, Barang rusak, Penjualan"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={onClose} disabled={adjustStockMutation.isPending}>
            Batal
          </Button>
          <Button type="submit" isLoading={adjustStockMutation.isPending}>
            Simpan Mutasi
          </Button>
        </div>
      </form>
    </Modal>
  );
};
