<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UmrahHotel extends Model
{
    protected $fillable = [
        'name',
        'stars',
        'location',
        'description',
        'image_path',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'stars' => 'integer',
        ];
    }

    /**
     * Get the packages that include this hotel.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(UmrahPackage::class, 'umrah_package_hotel')
            ->withPivot('order')
            ->orderBy('umrah_package_hotel.order');
    }

    /**
     * Scope a query to only include active hotels.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the full URL for the hotel image.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/' . $this->image_path) : null;
    }
}
