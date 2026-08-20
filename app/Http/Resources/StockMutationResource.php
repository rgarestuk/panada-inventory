<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMutationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'type' => $this->type,
            'quantity' => $this->quantity,
            'previous_stock' => $this->previous_stock,
            'current_stock' => $this->current_stock,
            'notes' => $this->notes,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
