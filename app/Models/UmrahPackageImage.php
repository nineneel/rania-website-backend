<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UmrahPackageImage extends Model
{
    protected $fillable = [
        'umrah_package_id',
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
     * Get package that owns this image.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(UmrahPackage::class, 'umrah_package_id');
    }

    /**
     * Get full image URL.
     */
    public function getImageUrlAttribute(): string
    {
        return asset('storage/'.$this->image_path);
    }
}
