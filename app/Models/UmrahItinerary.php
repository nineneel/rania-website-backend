<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UmrahItinerary extends Model
{
    protected $appends = ['image_url'];

    protected $fillable = [
        'title',
        'location',
        'description',
        'image_path',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Get packages that include this itinerary point.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(UmrahPackage::class, 'umrah_package_itinerary')
            ->withPivot('order')
            ->orderBy('umrah_package_itinerary.order');
    }

    /**
     * Scope a query to only include active itinerary points.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order itinerary points by their order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL for the itinerary image.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/'.$this->image_path) : null;
    }
}
