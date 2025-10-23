<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'email',
        'status',
        'unsubscribe_token',
        'ip_address',
        'source',
    ];

    /**
     * Generate unique unsubscribe token
     */
    public static function generateUnsubscribeToken(): string
    {
        return Str::random(64);
    }

    /**
     * Unsubscribe the subscriber
     */
    public function unsubscribe(): void
    {
        $this->update([
            'status' => 'unsubscribed',
        ]);
    }
}
