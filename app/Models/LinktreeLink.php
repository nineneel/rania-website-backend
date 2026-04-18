<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LinktreeLink extends Model
{
    protected $table = 'linktree_links';

    protected $fillable = [
        'title',
        'url',
        'order',
        'is_active',
        'click_count',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
            'click_count' => 'integer',
        ];
    }

    public function clicks(): HasMany
    {
        return $this->hasMany(LinktreeLinkClick::class);
    }

    /**
     * Scope a query to only include active links.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order links by order column.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
