<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductRequest;
use App\Http\Requests\Product\StockAdjustmentRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\StockMutation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        // Search by keyword
        if ($search = $request->query('search')) {
            $query->search($search);
        }

        // Filter by Category
        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Filter by Stock Status
        $status = $request->query('status');
        if ($status === 'low_stock') {
            $query->whereColumn('stock', '<=', 'min_stock')->where('stock', '>', 0);
        } elseif ($status === 'out_of_stock') {
            $query->where('stock', '<=', 0);
        } elseif ($status === 'in_stock') {
            $query->whereColumn('stock', '>', 'min_stock');
        }

        // Sorting
        $sortBy = $request->query('sort_by', 'created_at');
        $sortOrder = $request->query('sort_order', 'desc');
        $allowedSorts = ['name', 'sku', 'stock', 'purchase_price', 'selling_price', 'created_at'];

        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $perPage = min((int) $request->query('per_page', 10), 100);
        $products = $query->paginate($perPage);

        return response()->json([
            'data' => ProductResource::collection($products->items()),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ],
        ]);
    }

    public function store(ProductRequest $request): JsonResponse
    {
        return DB::transaction(function () use ($request) {
            $initialStock = (int) $request->input('stock', 0);

            $product = Product::create([
                'sku' => strtoupper($request->sku),
                'name' => $request->name,
                'category_id' => $request->category_id,
                'purchase_price' => $request->purchase_price,
                'selling_price' => $request->selling_price,
                'stock' => $initialStock,
                'min_stock' => $request->min_stock,
                'unit' => $request->unit,
                'description' => $request->description,
            ]);

            if ($initialStock > 0) {
                StockMutation::create([
                    'product_id' => $product->id,
                    'user_id' => $request->user()?->id,
                    'type' => 'in',
                    'quantity' => $initialStock,
                    'previous_stock' => 0,
                    'current_stock' => $initialStock,
                    'notes' => 'Stok awal saat pembuatan produk',
                ]);
            }

            return response()->json([
                'message' => 'Produk berhasil ditambahkan.',
                'data' => new ProductResource($product->load('category')),
            ], 201);
        });
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['category', 'stockMutations.user']);

        return response()->json([
            'data' => new ProductResource($product),
        ]);
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $product->update([
            'sku' => strtoupper($request->sku),
            'name' => $request->name,
            'category_id' => $request->category_id,
            'purchase_price' => $request->purchase_price,
            'selling_price' => $request->selling_price,
            'min_stock' => $request->min_stock,
            'unit' => $request->unit,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Data produk berhasil diperbarui.',
            'data' => new ProductResource($product->load('category')),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    public function adjustStock(StockAdjustmentRequest $request, Product $product): JsonResponse
    {
        return DB::transaction(function () use ($request, $product) {
            // Lock row for update
            $product = Product::where('id', $product->id)->lockForUpdate()->firstOrFail();
            $previousStock = $product->stock;
            $qty = (int) $request->quantity;
            $type = $request->type;
            $notes = $request->notes;

            if ($type === 'in') {
                $newStock = $previousStock + $qty;
            } elseif ($type === 'out') {
                if ($previousStock < $qty) {
                    throw ValidationException::withMessages([
                        'quantity' => ["Stok tidak mencukupi. Stok saat ini hanya {$previousStock} {$product->unit}."],
                    ]);
                }
                $newStock = $previousStock - $qty;
            } else { // adjustment / opname setting absolute qty
                $newStock = $qty;
            }

            $product->update(['stock' => $newStock]);

            StockMutation::create([
                'product_id' => $product->id,
                'user_id' => $request->user()?->id,
                'type' => $type,
                'quantity' => $qty,
                'previous_stock' => $previousStock,
                'current_stock' => $newStock,
                'notes' => $notes ?: 'Penyesuaian stok manual',
            ]);

            return response()->json([
                'message' => 'Stok produk berhasil disesuaikan.',
                'data' => new ProductResource($product->load('category')),
            ]);
        });
    }
}
