<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LinktreeLinkClick extends Model
{
    public $timestamps = false;

    protected $table = 'linktree_link_clicks';

    protected $fillable = [
        'linktree_link_id',
        'ip_address',
        'user_agent',
        'referer',
        'country',
        'clicked_at',
    ];

    protected function casts(): array
    {
        return [
            'clicked_at' => 'datetime',
        ];
    }

    public function link(): BelongsTo
    {
        return $this->belongsTo(LinktreeLink::class, 'linktree_link_id');
    }
}
