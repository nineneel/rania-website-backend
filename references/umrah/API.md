# Umrah API — Dokumentasi Frontend

Dokumen ini merangkum endpoint publik yang perlu di-fetch oleh frontend (website Rania) setelah update pada fitur umrah:

- Categories (manageable) — daftar kategori umrah
- Multi-currency pricing — `price_idr`, `price_usd`, `price_sar` yang dipilih sesuai bahasa frontend
- Payload baru pada endpoint list & detail package

Semua endpoint bersifat **public** (tanpa autentikasi) dan diprefix `/api`.

---

## 1. Resolusi locale & currency

Frontend mengirim bahasa yang sedang aktif. Backend mapping:

| Locale code | Currency returned |
| ----------- | ----------------- |
| `id`        | `IDR`             |
| `en`        | `USD`             |
| `ar`        | `SAR`             |

**Cara mengirim locale (urutan prioritas):**

1. **Query param `?lang=<code>`** (disarankan) — paling eksplisit, override header.
2. **Header `Accept-Language: <code>`** — otomatis jika pakai `axios` / `fetch` dan sudah set di interceptor.
3. **Fallback** — jika keduanya invalid/kosong, default ke `id` (IDR).

Backend hanya melihat 2 karakter pertama dari header (`en-US` → `en`). Locale yang tidak ter-support akan jatuh ke fallback.

**Contoh:**

```bash
# Paling eksplisit:
GET /api/umrah-packages?lang=en

# Via header (recommended untuk keseluruhan app):
GET /api/umrah-packages
Accept-Language: ar
```

---

## 2. Endpoint

### 2.1 `GET /api/umrah-categories`

Ambil semua kategori yang aktif, urut berdasarkan `order`. Dipakai untuk filter/tab di halaman listing package.

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Umrah Private",
            "slug": "umrah-private",
            "description": null,
            "order": 0,
            "packages_count": 3
        },
        {
            "id": 2,
            "name": "Umrah Corporate",
            "slug": "umrah-corporate",
            "description": null,
            "order": 1,
            "packages_count": 0
        }
    ]
}
```

- `packages_count` hanya menghitung package yang `is_active = true`.
- Pakai `slug` sebagai stable identifier (aman dipakai di URL filter).

---

### 2.2 `GET /api/umrah-packages`

List package aktif, paginated 10 per halaman.

**Query params:**

| Param      | Type     | Contoh              | Keterangan |
| ---------- | -------- | ------------------- | ---------- |
| `lang`     | string   | `id` / `en` / `ar`  | Pilih currency untuk field `price` & `currency`. |
| `category` | string   | `umrah-private`     | Filter berdasarkan **slug** kategori. |
| `page`     | integer  | `2`                 | Halaman pagination standar Laravel. |

**Response (ringkas):**

```json
{
    "success": true,
    "locale": "en",
    "currency": "USD",
    "data": [
        {
            "id": 10,
            "title": "Umrah Regular 5 Star",
            "slug": "umrah-regular-5-star",
            "subtitle": "Low Season",
            "description": "Discover Your Sacred Umrah Journey",
            "image_url": "https://.../storage/umrah/packages/x.jpg",
            "departure": "Soekarno-Hatta airport (CGK) Jakarta",
            "duration": "9 Days",
            "departure_schedule": "Weekly",

            "price": "3500.00",
            "currency": "USD",
            "prices": {
                "idr": "54800000.00",
                "usd": "3500.00",
                "sar": "13125.00"
            },

            "link": "https://...",
            "category": {
                "id": 1,
                "name": "Umrah Private",
                "slug": "umrah-private"
            },

            "hotels": [ /* ... */ ],
            "airlines": [ /* ... */ ],
            "additional_services": [ /* ... */ ]
        }
    ],
    "meta": {
        "current_page": 1,
        "last_page": 2,
        "per_page": 10,
        "total": 13
    },
    "links": {
        "first": "...",
        "last": "...",
        "prev": null,
        "next": "..."
    }
}
```

**Perubahan penting dari versi sebelumnya:**

| Field | Sebelum | Sesudah |
| ----- | ------- | ------- |
| `price` | `"54800000.00"` (selalu IDR) | Nilai sesuai locale yang diminta. |
| `currency` | `"Rp"` (hardcoded) | `"IDR"` \| `"USD"` \| `"SAR"`. |
| `prices` | — (tidak ada) | Object berisi semua 3 currency sekaligus. Boleh dipakai frontend kalau mau custom rendering. |
| `category` | — (tidak ada) | Object atau `null` jika package belum di-assign kategori. |

> **Catatan:** jika admin belum mengisi `price_usd` / `price_sar`, field `price` akan bernilai `null` untuk locale tersebut. Frontend harus fallback ke `prices.idr` atau tampilkan "hubungi kami".

---

### 2.3 `GET /api/umrah-packages/{slug}`

Detail satu package. Response structure sama seperti list item + field tambahan (`transportations`, `itineraries`, `package_services`, `gallery_images`, `category.description`). Query param `?lang=` juga berlaku di sini.

**Contoh fetch:**

```bash
GET /api/umrah-packages/umrah-regular-5-star?lang=ar
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
        "slug": "umrah-regular-5-star",
        "price": "13125.00",
        "currency": "SAR",
        "prices": { "idr": "...", "usd": "...", "sar": "13125.00" },
        "category": {
            "id": 1,
            "name": "Umrah Private",
            "slug": "umrah-private",
            "description": "Deskripsi kategori..."
        },
        "thumbnail_image_url": "...",
        "hotels": [ /* dengan field pivot order */ ],
        "airlines": [ /* ... */ ],
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

### 2.4 `GET /api/umrah-packages/{slug}/other-additional-services`

Tidak berubah — untuk listing additional service yang belum termasuk di package tertentu (paginated 12 per halaman).

---

## 3. Contoh integrasi frontend (React / Axios)

### 3.1 Global axios instance dengan Accept-Language

```ts
// src/lib/api.ts
import axios from 'axios';
import i18n from '@/i18n'; // instance i18next / react-intl kamu

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const lang = i18n.language?.slice(0, 2) || 'id'; // 'id' | 'en' | 'ar'
    config.headers['Accept-Language'] = lang;
    return config;
});
```

Dengan setup di atas, semua fetch ke endpoint umrah otomatis mengirim bahasa yang aktif. Tidak perlu kasih `?lang=` manual tiap pemanggilan.

### 3.2 Fetch list package + filter kategori

```ts
type UmrahCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    packages_count: number;
};

type UmrahPackageListItem = {
    id: number;
    title: string;
    slug: string;
    subtitle?: string | null;
    description: string;
    image_url: string;
    departure: string;
    duration: string;
    departure_schedule: string;
    price: string | null; // sudah sesuai locale
    currency: 'IDR' | 'USD' | 'SAR';
    prices: { idr: string | null; usd: string | null; sar: string | null };
    link: string | null;
    category: { id: number; name: string; slug: string } | null;
    hotels: Array<{ /* ... */ }>;
    airlines: Array<{ /* ... */ }>;
    additional_services: Array<{ /* ... */ }>;
};

async function fetchCategories(): Promise<UmrahCategory[]> {
    const { data } = await api.get('/umrah-categories');
    return data.data;
}

async function fetchPackages(params: { categorySlug?: string; page?: number }) {
    const { data } = await api.get<{
        data: UmrahPackageListItem[];
        meta: { current_page: number; last_page: number; total: number };
    }>('/umrah-packages', {
        params: {
            category: params.categorySlug, // optional filter
            page: params.page ?? 1,
        },
    });
    return data;
}
```

### 3.3 Render price (helper)

```ts
function formatPackagePrice(pkg: UmrahPackageListItem): string {
    if (!pkg.price) {
        // Admin belum isi harga untuk locale ini → fallback ke IDR
        if (pkg.prices.idr) {
            return `IDR ${Number(pkg.prices.idr).toLocaleString('id-ID')}`;
        }
        return 'Contact us';
    }

    const formatter = new Intl.NumberFormat(
        pkg.currency === 'IDR' ? 'id-ID' : pkg.currency === 'SAR' ? 'ar-SA' : 'en-US',
        { style: 'currency', currency: pkg.currency, maximumFractionDigits: 0 },
    );

    return formatter.format(Number(pkg.price));
}
```

### 3.4 Detail fetch

```ts
async function fetchPackageDetail(slug: string) {
    const { data } = await api.get(`/umrah-packages/${slug}`);
    return data.data;
}
```

---

## 4. Migration checklist (untuk frontend dev)

Karena kolom `price` dan `currency` **dihapus** dari database, pastikan update kode frontend yang masih pakai bentuk lama:

- [ ] Replace semua reference `pkg.currency` literal (`"Rp"`) dengan `pkg.currency` dari response yang sudah sesuai locale.
- [ ] Replace `formatPrice(pkg.price)` yang assume single currency — sekarang `pkg.price` sudah string dengan locale yang benar.
- [ ] Tambahkan fallback untuk `pkg.price === null` (admin belum isi harga USD/SAR).
- [ ] Kalau ada halaman listing dengan filter kategori, fetch `/api/umrah-categories` dulu dan teruskan `?category=<slug>` ke `/api/umrah-packages`.
- [ ] Kalau mau tampilkan "price in all currencies" di satu halaman, pakai object `pkg.prices` (tidak perlu fetch 3 kali).

---

## 5. Ringkasan perubahan backend (untuk reference)

- Tabel baru: `umrah_categories` (`id`, `name`, `slug`, `description`, `is_active`, `order`).
- Kolom baru di `umrah_packages`: `umrah_category_id` (FK nullable, onDelete setNull), `price_idr`, `price_usd`, `price_sar`.
- Kolom di-drop dari `umrah_packages`: `price`, `currency`. Data `price` lama otomatis dimigrasikan ke `price_idr` oleh migrasi yang aman (reversible).
- Endpoint baru: `GET /api/umrah-categories`.
- Endpoint existing (`/api/umrah-packages`, `/api/umrah-packages/{slug}`) menambahkan field: `locale`, `currency`, `prices`, `category`, dan query param `lang` + `category`.
