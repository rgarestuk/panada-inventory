<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\StockMutationResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMutation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $totalProducts = Product::count();
        $totalCategories = Category::count();

        $totalInventoryValue = Product::select(DB::raw('SUM(stock * purchase_price) as total_val'))
            ->value('total_val') ?? 0;

        $totalSellingPotential = Product::select(DB::raw('SUM(stock * selling_price) as total_sell'))
            ->value('total_sell') ?? 0;

        $lowStockCount = Product::whereColumn('stock', '<=', 'min_stock')
            ->where('stock', '>', 0)
            ->count();

        $outOfStockCount = Product::where('stock', '<=', 0)->count();

        $lowStockItems = Product::with('category')
            ->whereColumn('stock', '<=', 'min_stock')
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get();

        $recentProducts = Product::with('category')
            ->latest()
            ->limit(5)
            ->get();

        $recentMutations = StockMutation::with(['product', 'user'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'overview' => [
                'total_products' => (int) $totalProducts,
                'total_categories' => (int) $totalCategories,
                'total_inventory_value' => (float) $totalInventoryValue,
                'total_selling_potential' => (float) $totalSellingPotential,
                'low_stock_count' => (int) $lowStockCount,
                'out_of_stock_count' => (int) $outOfStockCount,
            ],
            'low_stock_items' => ProductResource::collection($lowStockItems),
            'recent_products' => ProductResource::collection($recentProducts),
            'recent_mutations' => StockMutationResource::collection($recentMutations),
        ]);
    }
}
