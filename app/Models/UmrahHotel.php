<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UmrahHotel extends Model
{
    public const MAX_IMAGES = 5;

    protected $appends = ['image_url'];

    protected $fillable = [
        'name',
        'stars',
        'location',
        'description',
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
     * Get hotel carousel images, ordered.
     */
    public function images(): HasMany
    {
        return $this->hasMany(UmrahHotelImage::class, 'umrah_hotel_id')
            ->orderBy('order');
    }

    /**
     * Scope a query to only include active hotels.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the thumbnail URL — derived from the first carousel image.
     */
    public function getImageUrlAttribute(): ?string
    {
        $first = $this->images->first() ?? $this->images()->orderBy('order')->first();

        return $first ? asset('storage/'.$first->image_path) : null;
    }
}
