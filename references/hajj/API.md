# Hajj API — Dokumentasi Frontend

Dokumen ini merangkum endpoint publik untuk fitur Hajj. Hajj **menggunakan dataset yang sama** dengan Umrah untuk hotels, airlines, transportations, itineraries, dan additional services — tidak ada endpoint terpisah untuk resource pendukung tersebut. Yang membedakan dari Umrah:

- Tidak ada `category` (Hajj package tidak di-grouping per kategori).
- Field tambahan: `color` (warna aksen kartu), `room_prices` (harga per tipe kamar Quad/Triple/Double per locale), dan `beds` (konfigurasi tempat tidur per tipe kamar).

Semua endpoint bersifat **public** (tanpa autentikasi) dan diprefix `/api`.

---

## 1. Resolusi locale & currency

Sama persis dengan Umrah API. Frontend mengirim bahasa yang sedang aktif. Backend mapping:

| Locale code | Currency returned |
| ----------- | ----------------- |
| `id`        | `IDR`             |
| `en`        | `USD`             |
| `ar`        | `SAR`             |

**Cara mengirim locale (urutan prioritas):**

1. **Query param `?lang=<code>`** (override paling eksplisit).
2. **Header `Accept-Language: <code>`**.
3. **Fallback** ke `id` (IDR).

Backend hanya melihat 2 karakter pertama dari header (`en-US` → `en`). Locale invalid akan jatuh ke fallback.

```bash
GET /api/hajj-packages?lang=en
GET /api/hajj-packages
Accept-Language: ar
```

---

## 2. Endpoint

### 2.1 `GET /api/hajj-packages`

List package Hajj aktif, paginated 10 per halaman, urut berdasarkan `order`.

**Query params:**

| Param   | Type    | Contoh             | Keterangan |
| ------- | ------- | ------------------ | ---------- |
| `lang`  | string  | `id` / `en` / `ar` | Pilih currency untuk field `price`, `currency`, dan `room_prices`. |
| `page`  | integer | `2`                | Halaman pagination standar Laravel. |

**Response:**

```json
{
    "success": true,
    "locale": "en",
    "currency": "USD",
    "data": [
        {
            "id": 10,
            "title": "Haji Plus Luxury",
            "slug": "haji-plus-luxury",
            "subtitle": "Discover Your Sacred Hajj Journey",
            "description": "Premium hajj experience",
            "image_url": "https://.../storage/hajj/packages/x.jpg",
            "color": "#d4af37",
            "departure": "Soekarno-Hatta airport (CGK) Jakarta",
            "duration": "21 Days",
            "departure_schedule": "1 Pax",
            "date": "15 Jun 2026",

            "price": "18000.00",
            "currency": "USD",
            "prices": {
                "idr": "180000000.00",
                "usd": "18000.00",
                "sar": "67500.00"
            },

            "room_prices": {
                "quad": "18000.00",
                "triple": "20000.00",
                "double": "21500.00"
            },
            "room_prices_all": {
                "idr": { "quad": "180000000.00", "triple": "200000000.00", "double": "215000000.00" },
                "usd": { "quad": "18000.00", "triple": "20000.00", "double": "21500.00" },
                "sar": { "quad": "67500.00", "triple": "75000.00", "double": "80625.00" }
            },

            "beds": [
                { "id": 1, "type": "Quad", "bed_count": 4, "order": 0 },
                { "id": 2, "type": "Triple", "bed_count": 3, "order": 1 },
                { "id": 3, "type": "Double", "bed_count": 2, "order": 2 }
            ],

            "link": "https://...",

            "hotels": [ /* sama bentuk dengan Umrah */ ],
            "airlines": [ /* sama bentuk dengan Umrah */ ],
            "additional_services": [ /* sama bentuk dengan Umrah */ ]
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 1,
        "per_page": 10,
        "total": 3
    },
    "links": {
        "first": "...",
        "last": "...",
        "prev": null,
        "next": null
    }
}
```

**Catatan field Hajj-specific:**

| Field | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `color` | `string \| null` | Warna kartu (mis. `#d4af37`). Frontend pakai untuk label/aksen. |
| `room_prices` | `object` | Harga per tipe kamar di locale yang diminta. Keys: `quad`, `triple`, `double`. Nilainya `string \| null`. |
| `room_prices_all` | `object` | Semua 3 currency × 3 tipe kamar sekaligus. Berguna kalau frontend mau switch currency tanpa fetch ulang. |
| `beds` | `array` | List konfigurasi `{ id, type, bed_count, order }`. Hajj package biasanya berisi 3 row (Quad/Triple/Double) tapi admin bebas custom. |

> Header `price` / `currency` / `prices` masih ada (sama seperti Umrah) untuk **headline price** (opsional, biasanya null kalau admin hanya isi `room_prices`).

---

### 2.2 `GET /api/hajj-packages/{slug}`

Detail satu Hajj package. Response structure sama dengan list item + field tambahan (`thumbnail_image_url`, `transportations`, `itineraries`, `package_services`, `gallery_images`). Query param `?lang=` juga berlaku.

**Contoh:**

```bash
GET /api/hajj-packages/haji-plus-luxury?lang=ar
Accept-Language: ar
```

**Response tambahan dibanding list:**

```json
{
    "success": true,
    "locale": "ar",
    "currency": "SAR",
    "data": {
        "id": 10,
        "title": "...",
        "slug": "haji-plus-luxury",
        "color": "#d4af37",

        "price": null,
        "currency": "SAR",
        "prices": { "idr": "...", "usd": "...", "sar": null },
        "room_prices": { "quad": "67500.00", "triple": "75000.00", "double": "80625.00" },
        "room_prices_all": { /* lihat list */ },
        "beds": [ /* lihat list */ ],

        "thumbnail_image_url": "...",
        "hotels": [ /* dengan field pivot order, total_nights */ ],
        "airlines": [ /* class, meal, baggage */ ],
        "transportations": [ /* ... */ ],
        "itineraries": [ /* ... */ ],
        "additional_services": [ /* ... */ ],
        "package_services": [ /* { is_included, title } */ ],
        "gallery_images": [ /* min 4 */ ]
    }
}
```

Mengembalikan **404** kalau slug tidak ditemukan atau package inactive.

---

### 2.3 `GET /api/hajj-packages/{slug}/other-additional-services`

Listing additional service yang **belum** termasuk di package tertentu (paginated 12 per halaman). Bentuk response identik dengan endpoint Umrah versi yang sama (mengambil dari `umrah_additional_services` karena dataset di-share).

---

## 3. Endpoint pendukung yang DI-SHARE dengan Umrah

Hajj **tidak punya** endpoint sendiri untuk resource di bawah ini. Frontend harus pakai endpoint Umrah yang sudah ada — datanya sama persis:

| Untuk | Pakai endpoint |
| ----- | -------------- |
| Daftar hotels | (di-include di response package; kalau perlu list global, belum di-expose) |
| Daftar airlines | (di-include di response package) |
| Daftar transportations | (di-include di response detail) |
| Daftar itineraries | (di-include di response detail) |
| Daftar additional services | `GET /api/hajj-packages/{slug}/other-additional-services` (sumber datanya sama dengan umrah additional services) |

**Tidak ada `GET /api/hajj-categories`** — Hajj tidak memiliki konsep kategori.

---

## 4. Contoh integrasi frontend (React / Axios)

### 4.1 Reuse axios instance dari Umrah

```ts
// src/lib/api.ts — sama dengan setup Umrah
import axios from 'axios';
import i18n from '@/i18n';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const lang = i18n.language?.slice(0, 2) || 'id';
    config.headers['Accept-Language'] = lang;
    return config;
});
```

### 4.2 Fetch list Hajj package

```ts
type HajjPackageRoomPrices = {
    quad: string | null;
    triple: string | null;
    double: string | null;
};

type HajjPackageBed = {
    id: number;
    type: string;
    bed_count: number;
    order: number;
};

type HajjPackageListItem = {
    id: number;
    title: string;
    slug: string;
    subtitle?: string | null;
    description: string;
    image_url: string;
    color: string | null;
    departure: string;
    duration: string;
    departure_schedule: string;
    date: string | null;
    price: string | null;
    currency: 'IDR' | 'USD' | 'SAR';
    prices: { idr: string | null; usd: string | null; sar: string | null };
    room_prices: HajjPackageRoomPrices;
    room_prices_all: { idr: HajjPackageRoomPrices; usd: HajjPackageRoomPrices; sar: HajjPackageRoomPrices };
    beds: HajjPackageBed[];
    link: string | null;
    hotels: Array<{ /* ... */ }>;
    airlines: Array<{ /* ... */ }>;
    additional_services: Array<{ /* ... */ }>;
};

async function fetchHajjPackages(params: { page?: number } = {}) {
    const { data } = await api.get<{
        data: HajjPackageListItem[];
        meta: { current_page: number; last_page: number; total: number };
    }>('/hajj-packages', {
        params: { page: params.page ?? 1 },
    });
    return data;
}
```

### 4.3 Render harga kamar (helper)

```ts
function formatRoomPrice(value: string | null, currency: 'IDR' | 'USD' | 'SAR'): string {
    if (!value) return 'Contact us';

    const formatter = new Intl.NumberFormat(
        currency === 'IDR' ? 'id-ID' : currency === 'SAR' ? 'ar-SA' : 'en-US',
        { style: 'currency', currency, maximumFractionDigits: 0 },
    );

    return formatter.format(Number(value));
}

// Dipakai:
formatRoomPrice(pkg.room_prices.quad, pkg.currency);
```

### 4.4 Detail fetch

```ts
async function fetchHajjPackageDetail(slug: string) {
    const { data } = await api.get(`/hajj-packages/${slug}`);
    return data.data;
}
```

---

## 5. Migration checklist (untuk frontend dev)

- [ ] Tambah halaman list Hajj baru yang fetch `GET /api/hajj-packages`. Tidak ada filter kategori (beda dengan Umrah).
- [ ] Render kartu Hajj dengan **3 baris harga kamar** (`room_prices.quad / triple / double`) — bukan single price seperti Umrah. Lihat referensi screenshot kartu di brief design.
- [ ] Render strip warna kartu memakai `color` (kalau `null`, fallback ke warna default brand).
- [ ] Render ikon tempat tidur per tipe kamar memakai `beds[].bed_count`.
- [ ] Halaman detail Hajj reuse layout Umrah detail, **buang** bagian category. Field `transportations`, `itineraries`, `additional_services`, `package_services`, `gallery_images` bentuknya sama persis.
- [ ] Untuk endpoint additional services lainnya, panggil `GET /api/hajj-packages/{slug}/other-additional-services` (bukan endpoint umrah, walaupun datanya sama).

---

## 6. Ringkasan perubahan backend (untuk reference)

- Tabel baru: `hajj_packages`, `hajj_package_services`, `hajj_package_images`, `hajj_package_beds`.
- Tabel pivot baru: `hajj_package_hotel`, `hajj_package_airline`, `hajj_package_transportation`, `hajj_package_itinerary`, `hajj_package_additional_service`. **Pivot menyambungkan `hajj_packages` ke `umrah_*` tables** (tidak ada hajj_hotels/airlines/etc tersendiri).
- Endpoint baru: `GET /api/hajj-packages`, `GET /api/hajj-packages/{slug}`, `GET /api/hajj-packages/{slug}/other-additional-services`.
- Field unik Hajj di `hajj_packages`: `color`, `price_quad_idr|usd|sar`, `price_triple_idr|usd|sar`, `price_double_idr|usd|sar`.
