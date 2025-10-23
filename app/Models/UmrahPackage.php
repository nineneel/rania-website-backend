<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UmrahPackage extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'departure',
        'duration',
        'frequency',
        'price',
        'currency',
        'link',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
            'price' => 'decimal:2',
        ];
    }

    /**
     * Get the hotels included in this package.
     */
    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(UmrahHotel::class, 'umrah_package_hotel')
            ->withPivot('order')
            ->orderBy('umrah_package_hotel.order');
    }

    /**
     * Get the airlines available for this package.
     */
    public function airlines(): BelongsToMany
    {
        return $this->belongsToMany(UmrahAirline::class, 'umrah_package_airline');
    }

    /**
     * Scope a query to only include active packages.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order packages by their order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL for the package image.
     */
    public function getImageUrlAttribute(): string
    {
        return asset('storage/' . $this->image_path);
    }
}
