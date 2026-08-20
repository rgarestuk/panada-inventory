<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_receive_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'user', 'token', 'token_type']);

        $this->assertDatabaseHas('users', ['email' => 'budi@example.com']);
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'user', 'token']);
    }

    public function test_authenticated_user_can_perform_product_crud(): void
    {
        $user = User::factory()->create();
        $category = Category::create(['name' => 'Elektronik', 'slug' => 'elektronik']);

        // 1. Create Product
        $createResponse = $this->actingAs($user)->postJson('/api/products', [
            'sku' => 'TEST-001',
            'name' => 'Laptop Gaming Asus ROG',
            'category_id' => $category->id,
            'purchase_price' => 15000000,
            'selling_price' => 18000000,
            'stock' => 10,
            'min_stock' => 2,
            'unit' => 'unit',
            'description' => 'Laptop gaming performa tinggi',
        ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('data.sku', 'TEST-001')
            ->assertJsonPath('data.stock', 10);

        $productId = $createResponse->json('data.id');

        // 2. Adjust Stock (Out 3 units)
        $adjustResponse = $this->actingAs($user)->postJson("/api/products/{$productId}/stock", [
            'type' => 'out',
            'quantity' => 3,
            'notes' => 'Terjual 3 unit',
        ]);

        $adjustResponse->assertStatus(200)
            ->assertJsonPath('data.stock', 7);

        // 3. Get Products List
        $listResponse = $this->actingAs($user)->getJson('/api/products');
        $listResponse->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // 4. Update Product
        $updateResponse = $this->actingAs($user)->putJson("/api/products/{$productId}", [
            'sku' => 'TEST-001',
            'name' => 'Laptop Gaming Asus ROG Upgraded',
            'category_id' => $category->id,
            'purchase_price' => 16000000,
            'selling_price' => 19500000,
            'min_stock' => 3,
            'unit' => 'unit',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('data.name', 'Laptop Gaming Asus ROG Upgraded');

        // 5. Delete Product
        $deleteResponse = $this->actingAs($user)->deleteJson("/api/products/{$productId}");
        $deleteResponse->assertStatus(200);

        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }
}
