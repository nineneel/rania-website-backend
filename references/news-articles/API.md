# News & Articles API — Dokumentasi Frontend

Dokumen ini merangkum endpoint publik untuk fitur **News & Articles** yang dipakai oleh frontend (website Rania) untuk menampilkan daftar berita / artikel yang dikurasi admin (mis. Liputan6, Suara.com, Times Indonesia, SindoNews, dll).

Endpoint bersifat **public** (tanpa autentikasi) dan diprefix `/api`.

---

## 1. Endpoint

### 1.1 `GET /api/news-articles`

Ambil semua news article yang aktif (`is_active = true`), urut berdasarkan `order` (ascending), dipaginasi.

**Query params:**

| Param      | Type    | Default | Keterangan                                                   |
| ---------- | ------- | ------- | ------------------------------------------------------------ |
| `per_page` | integer | `12`    | Jumlah item per halaman. Maksimal `50` (clamp di backend).   |
| `page`     | integer | `1`     | Halaman pagination standar Laravel.                          |

**Contoh request:**

```bash
# Default (12 per halaman, halaman 1)
GET /api/news-articles

# Custom pagination
GET /api/news-articles?per_page=8&page=2
```

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Calon Jemaah Bisa Berangkat Haji Lebih Cepat Tanpa Tunggu Antrean Lama",
            "source": "Liputan6",
            "link": "https://www.liputan6.com/islami/read/xxxxx",
            "image_url": "https://admin.example.com/storage/news-articles/abc123.jpg",
            "order": 0
        },
        {
            "id": 2,
            "title": "Lorem ipsum dolor sit amet",
            "source": "Suara.com",
            "link": "https://www.suara.com/news/xxxxx",
            "image_url": "https://admin.example.com/storage/news-articles/def456.jpg",
            "order": 1
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 2,
        "per_page": 12,
        "total": 15,
        "from": 1,
        "to": 12,
        "has_more": true
    }
}
```

**Field reference (`data[]`):**

| Field       | Type             | Keterangan                                                             |
| ----------- | ---------------- | ---------------------------------------------------------------------- |
| `id`        | integer          | Primary key, stable identifier.                                        |
| `title`     | string           | Judul berita / artikel (wajib).                                        |
| `source`    | string \| null   | Nama sumber (mis. `Liputan6`, `Suara.com`). Optional, bisa `null`.     |
| `link`      | string (URL)     | URL eksternal tujuan ketika item di-klik di frontend.                  |
| `image_url` | string (URL)     | URL absolut thumbnail/cover image (sudah resolved dari `image_path`).  |
| `order`     | integer          | Urutan tampilan; sudah dipakai untuk sorting di backend.               |

**Field reference (`pagination`):**

| Field          | Type    | Keterangan                                            |
| -------------- | ------- | ----------------------------------------------------- |
| `current_page` | integer | Halaman saat ini.                                     |
| `last_page`    | integer | Total halaman.                                        |
| `per_page`     | integer | Item per halaman (echo dari query, ter-clamp ke 50).  |
| `total`        | integer | Total item aktif.                                     |
| `from`         | integer | Index item pertama di halaman ini (1-based).          |
| `to`           | integer | Index item terakhir di halaman ini.                   |
| `has_more`     | boolean | `true` jika masih ada halaman berikutnya.             |

---

## 2. Catatan implementasi frontend

- Item **hanya** dikirim jika `is_active = true`. Tidak perlu filter di frontend.
- Sorting sudah ditangani backend (`order` ascending). Tampilkan apa adanya.
- `link` adalah URL eksternal — buka di tab baru (`target="_blank"` + `rel="noopener noreferrer"`).
- `source` opsional. Jika `null`, sembunyikan label sumber atau tampilkan placeholder yang sesuai desain.
- Pakai `image_url` langsung sebagai `<img src>` — sudah berupa absolute URL.
- Untuk infinite scroll / "load more", pakai `pagination.has_more` sebagai indikator stop.

---

## 3. Error response

Endpoint ini tidak mengembalikan error spesifik. Jika terjadi server error, response standar Laravel (`500`) akan dikembalikan tanpa payload `success/data`.
