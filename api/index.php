<?php

// Ensure /tmp writable directories for Vercel Serverless execution
$tmpDirs = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/cache',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($tmpDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

// Fix: Override SCRIPT_NAME so Laravel does not strip the /api/ prefix
// from REQUEST_URI. Without this, /api/auth/login becomes auth/login
// and matches the web catch-all route instead of the API route.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';
$_SERVER['PHP_SELF'] = '/index.php';

// Forward request to Laravel public entrypoint
require __DIR__ . '/../public/index.php';
