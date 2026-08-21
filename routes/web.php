<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Panada Inventory API',
        'status' => 'online',
        'version' => '1.0.0',
        'docs' => [
            'auth' => '/api/auth/*',
            'products' => '/api/products',
            'categories' => '/api/categories',
            'dashboard' => '/api/dashboard/stats',
        ]
    ]);
});
