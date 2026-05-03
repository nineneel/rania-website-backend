<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UmrahTransportation extends Model
{
    protected $appends = ['icon_url'];

    protected $fillable = [
        'name',
        'subtitle',
        'description',
        'icon_path',
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
     * Get packages that include this transportation option.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(UmrahPackage::class, 'umrah_package_transportation')
            ->withPivot('order')
            ->orderBy('umrah_package_transportation.order');
    }

    /**
     * Scope a query to only include active transportations.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order transportations by their order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL for the transportation icon.
     */
    public function getIconUrlAttribute(): ?string
    {
        return $this->icon_path ? asset('storage/'.$this->icon_path) : null;
    }
}
