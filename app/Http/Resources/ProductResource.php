<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = 'in_stock';
        if ($this->stock <= 0) {
            $status = 'out_of_stock';
        } elseif ($this->stock <= $this->min_stock) {
            $status = 'low_stock';
        }

        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'purchase_price' => (float) $this->purchase_price,
            'selling_price' => (float) $this->selling_price,
            'stock' => (int) $this->stock,
            'min_stock' => (int) $this->min_stock,
            'unit' => $this->unit,
            'description' => $this->description,
            'status' => $status,
            'total_value' => (float) ($this->stock * $this->purchase_price),
            'stock_mutations' => StockMutationResource::collection($this->whenLoaded('stockMutations')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
