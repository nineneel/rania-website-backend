<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HajjPackageService extends Model
{
    protected $fillable = [
        'hajj_package_id',
        'title',
        'description',
        'is_included',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_included' => 'boolean',
            'order' => 'integer',
        ];
    }

    /**
     * Get the package that owns this service row.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(HajjPackage::class, 'hajj_package_id');
    }
}
