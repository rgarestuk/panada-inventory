import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useProduct } from '../hooks/useProducts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatRupiah, formatDate } from '@/shared/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, Clock } from 'lucide-react';

export interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  productId,
}) => {
  const { data: product, isLoading } = useProduct(productId ?? undefined);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail & Riwayat Mutasi Stok"
      description="Informasi lengkap spesifikasi produk dan kartu stok barang"
      maxWidth="xl"
    >
      {isLoading && <LoadingSpinner label="Memuat kartu stok produk..." />}

      {!isLoading && product && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {product.sku}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{product.name}</h4>
              </div>
              <div>
                {product.status === 'in_stock' && <Badge variant="success" dot>Stok Aman ({product.stock} {product.unit})</Badge>}
                {product.status === 'low_stock' && <Badge variant="warning" dot>Stok Menipis ({product.stock} {product.unit})</Badge>}
                {product.status === 'out_of_stock' && <Badge variant="danger" dot>Stok Habis</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
              <div>
                <p className="text-slate-500">Kategori</p>
                <p className="font-semibold text-slate-800">{product.category?.name || 'Tanpa Kategori'}</p>
              </div>
              <div>
                <p className="text-slate-500">Harga Beli</p>
                <p className="font-semibold text-slate-800">{formatRupiah(product.purchase_price)}</p>
              </div>
              <div>
                <p className="text-slate-500">Harga Jual</p>
                <p className="font-semibold text-emerald-600">{formatRupiah(product.selling_price)}</p>
              </div>
              <div>
                <p className="text-slate-500">Total Nilai Stok</p>
                <p className="font-semibold text-slate-800">{formatRupiah(product.total_value)}</p>
              </div>
            </div>

            {product.description && (
              <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 italic">
                "{product.description}"
              </p>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" /> Riwayat Mutasi Stok
            </h4>

            {(!product.stock_mutations || product.stock_mutations.length === 0) ? (
              <div className="text-center py-6 border border-dashed rounded-lg text-xs text-slate-400">
                Belum ada riwayat mutasi stok untuk produk ini.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-600 border-b sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Waktu</th>
                      <th className="px-3 py-2">Jenis</th>
                      <th className="px-3 py-2">Jumlah</th>
                      <th className="px-3 py-2">Stok Akhir</th>
                      <th className="px-3 py-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {product.stock_mutations.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2 whitespace-nowrap text-slate-500">{formatDate(m.created_at)}</td>
                        <td className="px-3 py-2">
                          {m.type === 'in' && (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                              <ArrowDownCircle className="w-3.5 h-3.5" /> Masuk
                            </span>
                          )}
                          {m.type === 'out' && (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                              <ArrowUpCircle className="w-3.5 h-3.5" /> Keluar
                            </span>
                          )}
                          {m.type === 'adjustment' && (
                            <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                              <RefreshCw className="w-3.5 h-3.5" /> Opname
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono font-semibold">
                          {m.type === 'in' ? `+${m.quantity}` : m.type === 'out' ? `-${m.quantity}` : m.quantity} {product.unit}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-900 font-bold">
                          {m.current_stock} {product.unit}
                        </td>
                        <td className="px-3 py-2 text-slate-500 truncate max-w-xs">{m.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
