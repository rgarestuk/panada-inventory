<?php

use Illuminate\Support\Facades\Route;

// Single Page Application Fallback Route for React Router
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|up).*$');
