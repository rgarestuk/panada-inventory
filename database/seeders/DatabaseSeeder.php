<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\StockMutation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'admin@panada.com'],
            [
                'name' => 'Administrator Panada',
                'password' => Hash::make('password123'),
            ]
        );

        $categoriesData = [
            [
                'name' => 'Elektronik & Gadget',
                'slug' => 'elektronik-gadget',
                'description' => 'Perangkat elektronik, laptop, smartphone, dan aksesorisnya.',
            ],
            [
                'name' => 'Alat Tulis Kantor (ATK)',
                'slug' => 'alat-tulis-kantor',
                'description' => 'Perlengkapan administrasi dan alat tulis untuk kebutuhan kantor.',
            ],
            [
                'name' => 'Komputer & Aksesoris',
                'slug' => 'komputer-aksesoris',
                'description' => 'Komponen hardware, peripheral, keyboard, dan mouse.',
            ],
            [
                'name' => 'Peralatan Rumah Tangga',
                'slug' => 'peralatan-rumah-tangga',
                'description' => 'Perlengkapan kebersihan dan perkakas rumah tangga.',
            ],
            [
                'name' => 'Makanan & Minuman',
                'slug' => 'makanan-minuman',
                'description' => 'Bahan baku makanan kemasan dan minuman ringan.',
            ],
        ];

        $categories = [];
        foreach ($categoriesData as $cat) {
            $categories[$cat['slug']] = Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $productsData = [
            [
                'sku' => 'ELK-MBP-14',
                'name' => 'MacBook Pro 14" M3 Pro 18GB/512GB',
                'category_id' => $categories['elektronik-gadget']->id,
                'purchase_price' => 28000000,
                'selling_price' => 32500000,
                'stock' => 12,
                'min_stock' => 3,
                'unit' => 'unit',
                'description' => 'Laptop workstation profesional dari Apple dengan chip M3 Pro.',
            ],
            [
                'sku' => 'ELK-IP15-PRO',
                'name' => 'iPhone 15 Pro 256GB Natural Titanium',
                'category_id' => $categories['elektronik-gadget']->id,
                'purchase_price' => 18500000,
                'selling_price' => 21999000,
                'stock' => 8,
                'min_stock' => 5,
                'unit' => 'unit',
                'description' => 'Smartphone flagship Apple dengan bodi titanium dan kamera 48MP.',
            ],
            [
                'sku' => 'KMP-LOGI-MX',
                'name' => 'Logitech MX Master 3S Wireless Mouse',
                'category_id' => $categories['komputer-aksesoris']->id,
                'purchase_price' => 1250000,
                'selling_price' => 1650000,
                'stock' => 25,
                'min_stock' => 8,
                'unit' => 'pcs',
                'description' => 'Mouse ergonomis nirkabel dengan sensor 8000 DPI dan tombol silent click.',
            ],
            [
                'sku' => 'KMP-KEY-K2',
                'name' => 'Keychron K2 Pro Wireless Mechanical Keyboard',
                'category_id' => $categories['komputer-aksesoris']->id,
                'purchase_price' => 1400000,
                'selling_price' => 1890000,
                'stock' => 3,
                'min_stock' => 5,
                'unit' => 'pcs',
                'description' => 'Mechanical keyboard 75% layout dengan QMK/VIA support dan RGB backlight.',
            ],
            [
                'sku' => 'KMP-SSD-1TB',
                'name' => 'Samsung 980 Pro NVMe M.2 SSD 1TB',
                'category_id' => $categories['komputer-aksesoris']->id,
                'purchase_price' => 1350000,
                'selling_price' => 1750000,
                'stock' => 0,
                'min_stock' => 6,
                'unit' => 'pcs',
                'description' => 'Solid State Drive PCIe 4.0 dengan kecepatan baca hingga 7,000 MB/s.',
            ],
            [
                'sku' => 'ATK-PAP-A4',
                'name' => 'Kertas HVS PaperOne A4 80gr (1 Rim)',
                'category_id' => $categories['alat-tulis-kantor']->id,
                'purchase_price' => 45000,
                'selling_price' => 58000,
                'stock' => 150,
                'min_stock' => 30,
                'unit' => 'rim',
                'description' => 'Kertas cetak putih berkualitas tinggi cocok untuk fotokopi dan laser printer.',
            ],
            [
                'sku' => 'ATK-PEN-PIL',
                'name' => 'Pulpen Pilot G2 0.5mm Hitam (Pack 12 pcs)',
                'category_id' => $categories['alat-tulis-kantor']->id,
                'purchase_price' => 180000,
                'selling_price' => 240000,
                'stock' => 4,
                'min_stock' => 10,
                'unit' => 'pack',
                'description' => 'Gel pen berkualitas dengan tinta halus dan pegangan karet nyaman.',
            ],
            [
                'sku' => 'ATK-STP-MAX',
                'name' => 'Stapler MAX HD-10D Original',
                'category_id' => $categories['alat-tulis-kantor']->id,
                'purchase_price' => 22000,
                'selling_price' => 32000,
                'stock' => 45,
                'min_stock' => 10,
                'unit' => 'pcs',
                'description' => 'Stapler standar kantor tahan lama dari Jepang.',
            ],
            [
                'sku' => 'PRT-DISP-WD',
                'name' => 'Dispenser Air Galon Bawah Modena DD-7301L',
                'category_id' => $categories['peralatan-rumah-tangga']->id,
                'purchase_price' => 2100000,
                'selling_price' => 2650000,
                'stock' => 6,
                'min_stock' => 2,
                'unit' => 'unit',
                'description' => 'Water dispenser hemat energi dengan 3 keran air (panas, dingin, normal).',
            ],
            [
                'sku' => 'PRT-VAC-DYS',
                'name' => 'Dyson V12 Detect Slim Fluffy Cordless Vacuum',
                'category_id' => $categories['peralatan-rumah-tangga']->id,
                'purchase_price' => 8500000,
                'selling_price' => 10999000,
                'stock' => 2,
                'min_stock' => 3,
                'unit' => 'unit',
                'description' => 'Penyedot debu nirkabel pintar dengan teknologi laser deteksi partikel mikro.',
            ],
            [
                'sku' => 'FNB-KOP-ARB',
                'name' => 'Kopi Arabika Toraja Roast Beans 1kg',
                'category_id' => $categories['makanan-minuman']->id,
                'purchase_price' => 180000,
                'selling_price' => 250000,
                'stock' => 40,
                'min_stock' => 10,
                'unit' => 'pack',
                'description' => 'Biji kopi sangrai specialty asli Toraja dengan notes floral dan fruity.',
            ],
            [
                'sku' => 'FNB-SIR-MON',
                'name' => 'Monin Syrup Caramel Flavor 700ml',
                'category_id' => $categories['makanan-minuman']->id,
                'purchase_price' => 120000,
                'selling_price' => 165000,
                'stock' => 18,
                'min_stock' => 5,
                'unit' => 'botol',
                'description' => 'Sirup perisa karamel premium untuk campuran kopi dan minuman kafe.',
            ],
        ];

        foreach ($productsData as $prodData) {
            $product = Product::updateOrCreate(['sku' => $prodData['sku']], $prodData);

            if ($product->stock > 0 && $product->stockMutations()->count() === 0) {
                StockMutation::create([
                    'product_id' => $product->id,
                    'user_id' => $user->id,
                    'type' => 'in',
                    'quantity' => $product->stock,
                    'previous_stock' => 0,
                    'current_stock' => $product->stock,
                    'notes' => 'Saldo awal stok pembukaan inventaris',
                ]);
            }
        }
    }
}
