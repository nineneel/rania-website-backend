<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreHajjPackageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->canManageHomeContent() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('hajj_packages', 'slug')],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'color' => ['nullable', 'string', 'max:50'],
            'gallery_images' => ['required', 'array', 'min:4'],
            'gallery_images.*' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'departure' => ['required', 'string', 'max:255'],
            'duration' => ['required', 'string', 'max:50'],
            'departure_schedule' => ['required', 'string', 'max:50'],
            'date' => ['nullable', 'string', 'max:100'],
            'price_idr' => ['nullable', 'numeric', 'min:0'],
            'price_usd' => ['nullable', 'numeric', 'min:0'],
            'price_sar' => ['nullable', 'numeric', 'min:0'],
            'price_quad_idr' => ['nullable', 'numeric', 'min:0'],
            'price_triple_idr' => ['nullable', 'numeric', 'min:0'],
            'price_double_idr' => ['nullable', 'numeric', 'min:0'],
            'price_quad_usd' => ['nullable', 'numeric', 'min:0'],
            'price_triple_usd' => ['nullable', 'numeric', 'min:0'],
            'price_double_usd' => ['nullable', 'numeric', 'min:0'],
            'price_quad_sar' => ['nullable', 'numeric', 'min:0'],
            'price_triple_sar' => ['nullable', 'numeric', 'min:0'],
            'price_double_sar' => ['nullable', 'numeric', 'min:0'],
            'link' => ['nullable', 'string', 'url', 'max:500'],
            'is_active' => ['boolean'],
            'hotel_ids' => ['nullable', 'array'],
            'hotel_ids.*' => ['exists:umrah_hotels,id'],
            'hotel_nights' => ['nullable', 'array'],
            'hotel_nights.*' => ['integer', 'min:1', 'max:365'],
            'airline_ids' => ['nullable', 'array'],
            'airline_ids.*' => ['exists:umrah_airlines,id'],
            'airline_classes' => ['nullable', 'array'],
            'airline_classes.*' => ['nullable', 'string', 'max:50'],
            'airline_meals' => ['nullable', 'array'],
            'airline_meals.*' => ['nullable', 'string', 'max:255'],
            'airline_baggages' => ['nullable', 'array'],
            'airline_baggages.*' => ['nullable', 'string', 'max:255'],
            'transportation_ids' => ['nullable', 'array'],
            'transportation_ids.*' => ['exists:umrah_transportations,id'],
            'itinerary_ids' => ['nullable', 'array'],
            'itinerary_ids.*' => ['exists:umrah_itineraries,id'],
            'additional_service_ids' => ['nullable', 'array'],
            'additional_service_ids.*' => ['exists:umrah_additional_services,id'],
            'package_services' => ['nullable', 'array'],
            'package_services.*.title' => ['required', 'string', 'max:255'],
            'package_services.*.description' => ['nullable', 'string'],
            'package_services.*.is_included' => ['required', 'boolean'],
            'package_beds' => ['nullable', 'array'],
            'package_beds.*.type' => ['required', 'string', 'max:50'],
            'package_beds.*.bed_count' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $slugSource = $this->input('slug') ?: $this->input('title', '');

        $packageServices = collect($this->input('package_services', []))
            ->filter(fn ($item) => is_array($item) && filled($item['title'] ?? null))
            ->map(fn ($item) => [
                'title' => trim((string) $item['title']),
                'description' => filled($item['description'] ?? null)
                    ? trim((string) $item['description'])
                    : null,
                'is_included' => filter_var($item['is_included'] ?? true, FILTER_VALIDATE_BOOLEAN),
            ])
            ->values()
            ->all();

        $packageBeds = collect($this->input('package_beds', []))
            ->filter(fn ($item) => is_array($item) && filled($item['type'] ?? null))
            ->map(fn ($item) => [
                'type' => trim((string) $item['type']),
                'bed_count' => (int) ($item['bed_count'] ?? 0),
            ])
            ->values()
            ->all();

        $this->merge([
            'slug' => Str::slug((string) $slugSource),
            'package_services' => $packageServices,
            'package_beds' => $packageBeds,
        ]);
    }
}
