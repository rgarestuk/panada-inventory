import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { ProductFormModal } from '../components/ProductFormModal';
import { StockAdjustModal } from '../components/StockAdjustModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { Product, ProductFilterParams } from '../types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatRupiah } from '@/shared/utils/formatters';
import {
  Plus,
  Search,
  Package,
  Layers,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const ProductListPage: React.FC = () => {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [stockStatus, setStockStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);

  // Debounce search query
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [detailProductId, setDetailProductId] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // TanStack Queries
  const filterParams: ProductFilterParams = {
    page,
    per_page: 10,
    search: debouncedSearch || undefined,
    category_id: categoryId || undefined,
    status: stockStatus || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  const { data: response, isLoading, isFetching, error } = useProducts(filterParams);
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const products = response?.data || [];
  const meta = response?.meta;

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setSelectedProduct(p);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    deleteMutation.mutate(productToDelete.id, {
      onSuccess: () => setProductToDelete(null),
    });
  };

  return (
    <div>
      <PageHeader
        title="Inventaris & Produk"
        description="Kelola seluruh katalog barang, harga jual/beli, dan pantau ketersediaan stok barang"
        action={
          <Button onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
            Tambah Produk
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 mb-6 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <Input
            placeholder="Cari SKU, nama produk..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />

          {/* Category Filter */}
          <Select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          {/* Stock Status Filter */}
          <Select
            value={stockStatus}
            onChange={(e) => {
              setStockStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status Stok</option>
            <option value="in_stock">Stok Aman</option>
            <option value="low_stock">Stok Menipis (Low Stock)</option>
            <option value="out_of_stock">Stok Habis (Out of Stock)</option>
          </Select>

          {/* Sort Filter */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so as 'asc' | 'desc');
            }}
          >
            <option value="created_at-desc">Terbaru Ditambahkan</option>
            <option value="name-asc">Nama Produk (A-Z)</option>
            <option value="stock-asc">Stok Terkecil</option>
            <option value="stock-desc">Stok Terbanyak</option>
            <option value="selling_price-desc">Harga Jual Tertinggi</option>
          </Select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && <LoadingSpinner label="Memuat katalog inventaris..." />}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
          Gagal mengambil data produk dari server. Pastikan backend Laravel berjalan.
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !error && (
        <>
          {products.length === 0 ? (
            <EmptyState
              icon={<Package className="w-6 h-6" />}
              title="Tidak ada produk ditemukan"
              description="Coba ubah kata kunci pencarian atau buat produk baru ke dalam inventaris."
              actionLabel="Tambah Produk Baru"
              onAction={handleOpenAdd}
            />
          ) : (
            <div className="space-y-4">
              <Table className={isFetching ? 'opacity-70 transition-opacity' : ''}>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU & Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga Beli / Jual</TableHead>
                    <TableHead>Stok Tersedia</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Nilai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      {/* Product Name & SKU */}
                      <TableCell>
                        <div>
                          <span className="font-mono text-xs text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            {p.sku}
                          </span>
                          <p className="font-semibold text-slate-900 mt-1">{p.name}</p>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {p.category ? (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                            <Layers className="w-3 h-3 text-slate-400" />
                            {p.category.name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Tanpa Kategori</span>
                        )}
                      </TableCell>

                      {/* Prices */}
                      <TableCell>
                        <div className="text-xs">
                          <p className="text-slate-500">Beli: {formatRupiah(p.purchase_price)}</p>
                          <p className="font-semibold text-slate-900">Jual: {formatRupiah(p.selling_price)}</p>
                        </div>
                      </TableCell>

                      {/* Stock */}
                      <TableCell>
                        <div className="font-mono">
                          <span className="text-sm font-bold text-slate-900">{p.stock}</span>{' '}
                          <span className="text-xs text-slate-500">{p.unit}</span>
                          <p className="text-xs text-slate-400">Min: {p.min_stock}</p>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {p.status === 'in_stock' && (
                          <Badge variant="success" dot>
                            Aman
                          </Badge>
                        )}
                        {p.status === 'low_stock' && (
                          <Badge variant="warning" dot>
                            Menipis
                          </Badge>
                        )}
                        {p.status === 'out_of_stock' && (
                          <Badge variant="danger" dot>
                            Habis
                          </Badge>
                        )}
                      </TableCell>

                      {/* Total Value */}
                      <TableCell className="font-mono text-xs font-semibold text-slate-800">
                        {formatRupiah(p.total_value)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setAdjustProduct(p)}
                            title="Mutasi / Ubah Stok"
                            className="text-xs px-2.5 py-1"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="hidden sm:inline">Stok</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailProductId(p.id)}
                            title="Lihat Riwayat & Detail"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Produk"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProductToDelete(p)}
                            title="Hapus Produk"
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

              {/* Pagination Controls */}
              {meta && meta.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-slate-500">
                    Menampilkan <span className="font-semibold text-slate-700">{meta.from || 0}</span> sampai{' '}
                    <span className="font-semibold text-slate-700">{meta.to || 0}</span> dari total{' '}
                    <span className="font-semibold text-slate-700">{meta.total}</span> produk
                  </p>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={meta.current_page === 1}
                      leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                    >
                      Sebelumnya
                    </Button>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
                      Hal {meta.current_page} / {meta.last_page}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                      disabled={meta.current_page === meta.last_page}
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Berikutnya
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustModal
        isOpen={Boolean(adjustProduct)}
        onClose={() => setAdjustProduct(null)}
        product={adjustProduct}
      />

      {/* Product Detail & Mutation History Modal */}
      <ProductDetailModal
        isOpen={Boolean(detailProductId)}
        onClose={() => setDetailProductId(null)}
        productId={detailProductId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Produk?"
        message={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.name}" (${productToDelete?.sku}) dari sistem inventaris? Riwayat mutasi terkait juga akan terhapus.`}
        confirmText="Ya, Hapus Produk"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
