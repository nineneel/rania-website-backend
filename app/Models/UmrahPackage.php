<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UmrahPackage extends Model
{
    protected $fillable = [
        'umrah_category_id',
        'title',
        'slug',
        'subtitle',
        'description',
        'image_path',
        'departure',
        'duration',
        'departure_schedule',
        'price_idr',
        'price_usd',
        'price_sar',
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
        ];
    }

    /**
     * Get the category this package belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(UmrahCategory::class, 'umrah_category_id');
    }

    /**
     * Get the hotels included in this package.
     */
    public function hotels(): BelongsToMany
    {
        return $this->belongsToMany(UmrahHotel::class, 'umrah_package_hotel')
            ->withPivot('order')
            ->orderBy('umrah_package_hotel.order');
    }

    /**
     * Get the airlines available for this package.
     */
    public function airlines(): BelongsToMany
    {
        return $this->belongsToMany(UmrahAirline::class, 'umrah_package_airline');
    }

    /**
     * Get the transportation options available for this package.
     */
    public function transportations(): BelongsToMany
    {
        return $this->belongsToMany(UmrahTransportation::class, 'umrah_package_transportation')
            ->withPivot('order')
            ->orderBy('umrah_package_transportation.order');
    }

    /**
     * Get itinerary points for this package.
     */
    public function itineraries(): BelongsToMany
    {
        return $this->belongsToMany(UmrahItinerary::class, 'umrah_package_itinerary')
            ->withPivot('order')
            ->orderBy('umrah_package_itinerary.order');
    }

    /**
     * Get package-level additional service overrides.
     */
    public function additionalServices(): BelongsToMany
    {
        return $this->belongsToMany(UmrahAdditionalService::class, 'umrah_package_additional_service')
            ->withPivot('order')
            ->orderBy('umrah_package_additional_service.order');
    }

    /**
     * Get package services rows.
     */
    public function services(): HasMany
    {
        return $this->hasMany(UmrahPackageService::class, 'umrah_package_id')
            ->orderBy('order');
    }

    /**
     * Get package detail gallery images.
     */
    public function images(): HasMany
    {
        return $this->hasMany(UmrahPackageImage::class, 'umrah_package_id')
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
