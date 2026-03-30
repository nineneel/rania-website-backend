<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UmrahAdditionalService extends Model
{
    protected $fillable = [
        'title',
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
     * Get packages that override with this additional service.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(UmrahPackage::class, 'umrah_package_additional_service')
            ->withPivot('order')
            ->orderBy('umrah_package_additional_service.order');
    }

    /**
     * Scope a query to only include active additional services.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order additional services by their order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL for the additional service image.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? asset('storage/'.$this->image_path) : null;
    }
}
