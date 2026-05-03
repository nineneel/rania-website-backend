<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HajjPackageBed extends Model
{
    protected $fillable = [
        'hajj_package_id',
        'type',
        'bed_count',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'bed_count' => 'integer',
            'order' => 'integer',
        ];
    }

    /**
     * Get the package that owns this bed configuration row.
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(HajjPackage::class, 'hajj_package_id');
    }
}
