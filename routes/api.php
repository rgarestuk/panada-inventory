<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Panada Inventory
|--------------------------------------------------------------------------
*/

// Public Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Routes (Requires Bearer Personal Access Token)
Route::middleware('auth:sanctum')->group(function () {
    // Auth info & logout
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Categories CRUD
    Route::apiResource('categories', CategoryController::class);

    // Products CRUD & Stock Adjustment
    Route::post('products/{product}/stock', [ProductController::class, 'adjustStock']);
    Route::apiResource('products', ProductController::class);
});
