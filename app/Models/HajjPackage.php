<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HajjPackage extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'subtitle',
        'description',
        'image_path',
        'color',
        'departure',
        'duration',
        'departure_schedule',
        'date',
        'price_idr',
        'price_usd',
        'price_sar',
        'price_quad_idr',
        'price_triple_idr',
        'price_double_idr',
        'price_quad_usd',
        'price_triple_usd',
        'price_double_usd',
        'price_quad_sar',
        'price_triple_sar',
        'price_double_sar',
        'link',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'order' => 'integer',
            'price_idr' => 'decimal:2',
            'price_usd' => 'decimal:2',
            'price_sar' => 'decimal:2',
            'price_quad_idr' => 'decimal:2',
            'price_triple_idr' => 'decimal:2',
            'price_double_idr' => 'decimal:2',
            'price_quad_usd' => 'decimal:2',
            'price_triple_usd' => 'decimal:2',
            'price_double_usd' => 'decimal:2',
            'price_quad_sar' => 'decimal:2',
            'price_triple_sar' => 'decimal:2',
            'price_double_sar' => 'decimal:2',
        ];
    }

    /**
     * Get the hotels included in this package (shared with umrah).
     */
    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(UmrahHotel::class, 'hajj_package_hotel')
            ->withPivot('order', 'total_nights')
            ->orderBy('hajj_package_hotel.order');
    }

    /**
     * Get the airlines available for this package (shared with umrah).
     */
    public function airlines(): BelongsToMany
    {
        return $this->belongsToMany(UmrahAirline::class, 'hajj_package_airline')
            ->withPivot('class', 'meal', 'baggage');
    }

    /**
     * Get the transportation options available for this package (shared with umrah).
     */
    public function transportations(): BelongsToMany
    {
        return $this->belongsToMany(UmrahTransportation::class, 'hajj_package_transportation')
            ->withPivot('order')
            ->orderBy('hajj_package_transportation.order');
    }

    /**
     * Get itinerary points for this package (shared with umrah).
     */
    public function itineraries(): BelongsToMany
    {
        return $this->belongsToMany(UmrahItinerary::class, 'hajj_package_itinerary')
            ->withPivot('order')
            ->orderBy('hajj_package_itinerary.order');
    }

    /**
     * Get package-level additional service overrides (shared with umrah).
     */
    public function additionalServices(): BelongsToMany
    {
        return $this->belongsToMany(UmrahAdditionalService::class, 'hajj_package_additional_service')
            ->withPivot('order')
            ->orderBy('hajj_package_additional_service.order');
    }

    /**
     * Get package services rows.
     */
    public function services(): HasMany
    {
        return $this->hasMany(HajjPackageService::class, 'hajj_package_id')
            ->orderBy('order');
    }

    /**
     * Get package detail gallery images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(HajjPackageImage::class, 'hajj_package_id')
            ->orderBy('order');
    }

    /**
     * Get bed configuration rows for this package.
     */
    public function beds(): HasMany
    {
        return $this->hasMany(HajjPackageBed::class, 'hajj_package_id')
            ->orderBy('order');
    }

    /**
     * Scope a query to only include active packages.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to order packages by their order field.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL for the package image.
     */
    public function getImageUrlAttribute(): string
    {
        return asset('storage/'.$this->image_path);
    }

    /**
     * Resolve the price and currency code matching the given locale.
     *
     * @return array{price: string|null, currency: string}
     */
    public function priceForLocale(?string $locale): array
    {
        $locale = strtolower((string) $locale);

        $map = [
            'id' => ['field' => 'price_idr', 'currency' => 'IDR'],
            'en' => ['field' => 'price_usd', 'currency' => 'USD'],
            'ar' => ['field' => 'price_sar', 'currency' => 'SAR'],
        ];

        $entry = $map[$locale] ?? $map['id'];

        return [
            'price' => $this->{$entry['field']},
            'currency' => $entry['currency'],
        ];
    }
}
