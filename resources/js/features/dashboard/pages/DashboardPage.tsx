import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { StockAdjustModal } from '@/features/products/components/StockAdjustModal';
import { ProductFormModal } from '@/features/products/components/ProductFormModal';
import { useDashboardStats } from '../hooks/useDashboard';
import { Product } from '@/features/products/types';
import { formatRupiah, formatDate } from '@/shared/utils/formatters';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Layers,
  AlertTriangle,
  DollarSign,
  Plus,
  ArrowUpRight,
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  PackageX,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const overview = stats?.overview;
  const lowStockItems = stats?.low_stock_items || [];
  const recentMutations = stats?.recent_mutations || [];

  return (
    <div>
      <PageHeader
        title="Dashboard Inventaris"
        description="Ringkasan ketersediaan stok, nilai aset inventaris, dan mutasi barang terbaru"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddProductOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Tambah Produk
            </Button>
            <Link to="/products">
              <Button size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                Buka Katalog
              </Button>
            </Link>
          </div>
        }
      />

      {isLoading && <LoadingSpinner label="Menghitung statistik inventaris..." />}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700 mb-6">
          Gagal mengambil data dashboard. Pastikan server backend Laravel berjalan normal.
        </div>
      )}

      {!isLoading && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card hoverable>
              <CardBody className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Produk</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{overview.total_products}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Item tercatat</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Boxes className="w-6 h-6" />
                </div>
              </CardBody>
            </Card>

            <Card hoverable>
              <CardBody className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nilai Aset Stok</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{formatRupiah(overview.total_inventory_value)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Berdasarkan harga pokok</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </CardBody>
            </Card>

            <Card hoverable>
              <CardBody className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Stok Menipis</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{overview.low_stock_count}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Perlu restock segera</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </CardBody>
            </Card>

            <Card hoverable>
              <CardBody className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori Barang</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{overview.total_categories}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Kelompok produk</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
              </CardBody>
            </Card>
          </div>

          {overview.out_of_stock_count > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PackageX className="w-5 h-5 text-rose-600 shrink-0" />
                <p className="text-xs text-rose-800 font-medium">
                  Terdapat <strong className="font-bold">{overview.out_of_stock_count} produk</strong> yang stoknya telah habis (0 unit). Segera lakukan restock agar tidak mengganggu operasional.
                </p>
              </div>
              <Link to="/products">
                <Button variant="danger" size="sm">
                  Cek Produk Habis
                </Button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Perlu Restock Segera
                  </CardTitle>
                  <CardDescription>Produk yang stoknya di bawah batas minimum</CardDescription>
                </div>
                <Link to="/products" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Lihat Semua
                </Link>
              </CardHeader>
              <CardBody className="p-0">
                {lowStockItems.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Semua stok produk saat ini dalam kondisi aman.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{item.sku}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-rose-600">{item.stock} {item.unit}</span>
                            <p className="text-[10px] text-slate-400">Min: {item.min_stock}</p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setAdjustProduct(item)}
                            className="text-xs px-2.5 py-1"
                          >
                            <TrendingUp className="w-3 h-3 text-indigo-600" /> Restock
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" /> Aktivitas Mutasi Terakhir
                  </CardTitle>
                  <CardDescription>Log pencatatan stok masuk, keluar, dan opname</CardDescription>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {recentMutations.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Belum ada aktivitas mutasi stok tercatat.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentMutations.map((m) => (
                      <div key={m.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                            {m.type === 'in' && <ArrowDownCircle className="w-5 h-5 text-emerald-500" />}
                            {m.type === 'out' && <ArrowUpCircle className="w-5 h-5 text-rose-500" />}
                            {m.type === 'adjustment' && <RefreshCw className="w-5 h-5 text-indigo-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {m.product?.name || `Produk #${m.product_id}`}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{m.notes || 'Penyesuaian stok'}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-mono font-bold text-slate-800">
                            {m.type === 'in' ? `+${m.quantity}` : m.type === 'out' ? `-${m.quantity}` : m.quantity}
                          </p>
                          <p className="text-[10px] text-slate-400">{formatDate(m.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      <StockAdjustModal
        isOpen={Boolean(adjustProduct)}
        onClose={() => setAdjustProduct(null)}
        product={adjustProduct}
      />

      <ProductFormModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
    </div>
  );
};
