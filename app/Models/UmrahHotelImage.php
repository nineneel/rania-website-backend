<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UmrahHotelImage extends Model
{
    protected $fillable = [
        'umrah_hotel_id',
        'image_path',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * Get the hotel that owns this image.
     */
    public function hotel(): BelongsTo
    {
        return $this->belongsTo(UmrahHotel::class, 'umrah_hotel_id');
    }

    /**
     * Get full image URL.
     */
    public function getImageUrlAttribute(): string
    {
        return asset('storage/'.$this->image_path);
    }
}
