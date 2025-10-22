<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class UmrahAirline extends Model
{
    protected $fillable = [
        'name',
        'logo_path',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the packages that use this airline.
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(UmrahPackage::class, 'umrah_package_airline');
    }

    /**
     * Scope a query to only include active airlines.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the full URL for the airline logo.
     */
    public function getLogoUrlAttribute(): string
    {
        return asset('storage/' . $this->logo_path);
    }
}
