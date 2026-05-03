# Rania Admin Dashboard

Admin dashboard for managing Rania Travel & Umrah website content. Built with Laravel, Inertia.js, and React.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [License](#license)

## Features

### Content Management
- **Hero Slides** - Manage homepage carousel slides with drag-and-drop ordering
- **Events** - Create and manage events with availability status
- **Testimonials** - Customer testimonials management
- **FAQs** - Frequently asked questions management
- **Social Media** - Manage social media links and icons
- **Linktree** - Manage the bio-link page (links + click analytics)

### Umrah Packages
- **Packages** - Complete Umrah package management
- **Hotels** - Hotel information with star ratings, locations, and a multi-image carousel (up to 5 images per hotel); per-package nights stay
- **Airlines** - Airline management with logos; per-package travel class, meal, and baggage details
- Package-Hotel-Airline relationships

### Communication
- **Contact Messages** - View and manage contact form submissions
- **Newsletter Subscribers** - Manage newsletter subscriptions with instant activation
- Email notifications for new messages
- Message status tracking (new, read, replied)
- Newsletter unsubscribe management

### User Management
- Authentication with Laravel Fortify
- User roles and permissions
- Secure admin access

## Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **PHP 8.2+** - Programming Language
- **MySQL/SQLite** - Database
- **Laravel Fortify** - Authentication

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Inertia.js 2** - Modern Monolith
- **TailwindCSS 4** - Styling
- **Radix UI** - Headless Components
- **Lucide React** - Icons
- **DnD Kit** - Drag and Drop

### Development Tools
- **Vite 7** - Build Tool & Dev Server
- **Laravel Pint** - Code Formatting
- **ESLint** - JavaScript Linting
- **Prettier** - Code Formatting
- **Pest PHP** - Testing Framework

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM or Yarn
- MySQL 8.0+ or SQLite

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rania-admin-dashboard
```

### 2. Install Dependencies

```bash
composer setup
```

This command will:
- Install PHP dependencies
- Copy `.env.example` to `.env`
- Generate application key
- Run database migrations
- Install Node.js dependencies
- Build frontend assets

### 3. Configure Environment

Edit `.env` file and configure your database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rania_admin
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="admin@rania.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 4. Storage Link

Create symbolic link for storage:

```bash
php artisan storage:link
```

### 5. Seed Database (Optional)

```bash
php artisan db:seed
```

## Development

### Start Development Server

Run all services (web server, queue worker, logs, and Vite):

```bash
composer dev
```

This runs:
- Laravel development server on `http://localhost:8000`
- Queue worker for background jobs
- Laravel Pail for real-time logs
- Vite dev server with HMR

### Individual Services

```bash
# Backend only
php artisan serve

# Frontend only
npm run dev

# Queue worker
php artisan queue:listen

# Logs
php artisan pail
```

### SSR Mode (Optional)

For server-side rendering:

```bash
composer dev:ssr
```

## API Documentation

The application provides REST API endpoints for the public website to consume.

**Base URL:** `https://your-domain.com/api`

### Available Endpoints

| Method | Endpoint | Description | Pagination |
|--------|----------|-------------|------------|
| GET | `/api/hero-slides` | Get active hero slides | ✅ |
| GET | `/api/events` | Get all events | ❌ |
| GET | `/api/social-media` | Get active social media links | ❌ |
| GET | `/api/faqs` | Get active FAQs | ❌ |
| GET | `/api/testimonials` | Get active testimonials | ✅ |
| GET | `/api/umrah-packages` | Get active packages list with hotels, airlines & additional services | ✅ |
| GET | `/api/umrah-packages/{slug}` | Get one active package detail by slug | ❌ |
| GET | `/api/umrah-packages/{slug}/other-additional-services` | Get additional services not included in a package | ✅ |
| GET | `/api/linktree` | Get active linktree links and social media | ❌ |
| POST | `/api/linktree/links/{id}/click` | Track a click event on a linktree link | N/A |
| POST | `/api/contact` | Submit contact form | N/A |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter | N/A |

---

### Hero Slides

Get active hero slides with pagination support.

**Endpoint:** `GET /api/hero-slides`

**Query Parameters:**
- `per_page` (optional) - Items per page (default: 10, max: 50)
- `page` (optional) - Page number (default: 1)

**Example:**
```bash
curl "https://your-domain.com/api/hero-slides?per_page=5&page=1"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Welcome to Rania Travel",
      "subtitle": "Your trusted Umrah partner",
      "image_url": "https://example.com/storage/hero-slides/slide1.jpg",
      "order": 1
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 5,
    "total": 12,
    "from": 1,
    "to": 5,
    "has_more": true
  }
}
```

---

### Events

Get all events ordered by their order field.

**Endpoint:** `GET /api/events`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Ramadan Umrah Package 2024",
      "description": "Special package for Ramadan season",
      "image_url": "https://example.com/storage/events/event1.jpg",
      "link": "https://example.com/packages/ramadan-2024",
      "is_available": true,
      "order": 1
    }
  ]
}
```

---

### Social Media

Get all active social media links.

**Endpoint:** `GET /api/social-media`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Facebook",
      "url": "https://facebook.com/raniatravel",
      "icon_url": "https://example.com/storage/icons/facebook.svg"
    }
  ]
}
```

---

### FAQs

Get all active frequently asked questions.

**Endpoint:** `GET /api/faqs`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "What documents do I need for Umrah?",
      "answer": "You need a valid passport, visa, and vaccination certificates."
    }
  ]
}
```

---

### Testimonials

Get active customer testimonials with pagination for lazy loading.

**Endpoint:** `GET /api/testimonials`

**Query Parameters:**
- `per_page` (optional) - Items per page (default: 10, max: 50)
- `page` (optional) - Page number (default: 1)

**Example:**
```bash
curl "https://your-domain.com/api/testimonials?per_page=10&page=1"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ahmad Abdullah",
      "subtitle": "Umrah Pilgrim 2024",
      "text": "Excellent service! The team was very helpful throughout our journey."
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 47,
    "from": 1,
    "to": 10,
    "has_more": true
  }
}
```

**Lazy Loading:** Use `pagination.has_more` to check if there are more items.

---

### Umrah Packages

#### 1) Package List

Get active Umrah packages with hotels, airlines, and additional services for listing cards.

**Endpoint:** `GET /api/umrah-packages`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Premium Ramadan Package",
      "slug": "premium-ramadan-package",
      "subtitle": "Periode Low Season",
      "description": "5-star accommodation near Haram",
      "image_url": "https://example.com/storage/packages/package1.jpg",
      "departure": "Jeddah",
      "duration": "14 days",
      "departure_schedule": "Weekly",
      "date": "15 Mar 2026",
      "price": "12500.00",
      "currency": "SAR",
      "hotels": [
        {
          "id": 1,
          "name": "Hilton Makkah Convention Hotel",
          "stars": 5,
          "location": "Makkah",
          "description": "Located 500m from Haram",
          "image_url": "https://example.com/storage/umrah/hotels/hotel1-1.jpg",
          "images": [
            {
              "id": 11,
              "image_url": "https://example.com/storage/umrah/hotels/hotel1-1.jpg",
              "order": 0
            },
            {
              "id": 12,
              "image_url": "https://example.com/storage/umrah/hotels/hotel1-2.jpg",
              "order": 1
            }
          ],
          "order": 0,
          "total_nights": 4
        }
      ],
      "airlines": [
        {
          "id": 1,
          "name": "Saudia Airlines",
          "logo_url": "https://example.com/storage/airlines/saudia.png",
          "class": "business",
          "meal": "2× Hidangan Premium Selama Penerbangan",
          "baggage": "23 Kg (2Pcs)"
        }
      ],
      "additional_services": [
        {
          "id": 7,
          "title": "Airport Assistance",
          "description": "Assistance during arrival and departure",
          "image_url": "https://example.com/storage/umrah/additional-services/airport.jpg",
          "order": 0
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 10,
    "total": 12
  },
  "links": {
    "first": "https://your-domain.com/api/umrah-packages?page=1",
    "last": "https://your-domain.com/api/umrah-packages?page=2",
    "prev": null,
    "next": "https://your-domain.com/api/umrah-packages?page=2"
  }
}
```

#### 2) Package Detail

Get a single active Umrah package detail by `slug`.

**Endpoint:** `GET /api/umrah-packages/{slug}`

**Example:**
```bash
curl "https://your-domain.com/api/umrah-packages/royal-hilton-signature"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Royal Hilton Signature",
    "slug": "royal-hilton-signature",
    "subtitle": "Periode Low Season",
    "description": "Discover Your Sacred Umrah Journey",
    "image_url": "https://example.com/storage/umrah/packages/example.jpg",
    "departure": "Soekarno-Hatta airport (CGK) Jakarta",
    "duration": "9 Days",
    "departure_schedule": "Weekly",
    "date": "15 Mar 2026",
    "price": "54800000.00",
    "currency": "Rp",
    "link": "https://example.com/package-details",
    "hotels": [
      {
        "id": 10,
        "name": "Hilton Makkah",
        "stars": 5,
        "location": "Makkah",
        "description": "Near Haram",
        "image_url": "https://example.com/storage/umrah/hotels/hotel-1.jpg",
        "images": [
          {
            "id": 101,
            "image_url": "https://example.com/storage/umrah/hotels/hotel-1.jpg",
            "order": 0
          },
          {
            "id": 102,
            "image_url": "https://example.com/storage/umrah/hotels/hotel-2.jpg",
            "order": 1
          }
        ],
        "order": 0,
        "total_nights": 3
      }
    ],
    "airlines": [
      {
        "id": 1,
        "name": "Saudia Airlines",
        "logo_url": "https://example.com/storage/umrah/airlines/saudia.png",
        "class": "economy",
        "meal": "2× Hidangan Premium Selama Penerbangan",
        "baggage": "23 Kg (2Pcs)"
      }
    ],
    "transportations": [
      {
        "id": 3,
        "name": "Private Car",
        "description": "Comfortable airport-hotel transfer",
        "icon_url": "https://example.com/storage/umrah/transportations/private-car.png",
        "order": 0
      }
    ],
    "itineraries": [
      {
        "id": 5,
        "title": "Masjid Nabawi",
        "location": "Madinah",
        "description": "Daily prayer and guided visit",
        "image_url": "https://example.com/storage/umrah/itineraries/nabawi.jpg",
        "order": 0
      }
    ],
    "additional_services": [
      {
        "id": 7,
        "title": "Airport Assistance",
        "description": "Assistance during arrival and departure process",
        "image_url": "https://example.com/storage/umrah/additional-services/airport.jpg",
        "order": 0
      }
    ],
    "package_services": [
      {
        "id": 21,
        "title": "Visa Processing",
        "description": "Handled by our team",
        "order": 0
      }
    ]
  }
}
```

**Additional Services behavior:**
- By default, `additional_services` comes from the global active services list.
- If package-specific overrides are configured in `umrah_package_additional_service`, the detail endpoint returns those overrides instead.

**Date field:**
- `date` — optional free-form string (max 100 chars) representing the package's departure date or date range. Returned as `null` when not configured. Examples: `"15 Mar 2026"`, `"15-20 Mar 2026"`, `"Q1 2026"`. Stored as a string for flexibility — no parsing or validation of the format is performed.

**Hotel fields:**
- `image_url` — thumbnail derived from the first item in `images` (ordered by `order`). `null` when the hotel has no images.
- `images` — full carousel array (max 5 per hotel). Each entry has `id`, `image_url`, `order`. Sorted ascending by `order`.
- `order` — the hotel's position within this package's hotel list (per-package pivot).
- `total_nights` — number of nights spent at this hotel within the package (per-package pivot). Defaults to `3` when not configured.

**Airline fields (per-package pivot):**
- `class` — travel class string. Defaults to `"economy"`. Other common values: `"business"`, `"first"`. Custom strings are allowed (e.g. `"premium economy"`).
- `meal` — optional free-form string describing meal service (e.g. `"2× Hidangan Premium Selama Penerbangan"`). `null` when not configured.
- `baggage` — optional free-form string describing baggage allowance (e.g. `"23 Kg (2Pcs)"`). `null` when not configured.
- These fields are stored on the `umrah_package_airline` pivot, so the same airline can have different values in different packages.

#### 3) Other Additional Services

Get all active additional services that are **not** included in a specific package. Use this to display "Other available add-ons" below the package's selected services.

**Endpoint:** `GET /api/umrah-packages/{slug}/other-additional-services`

**Example:**
```bash
curl "https://your-domain.com/api/umrah-packages/royal-hilton-signature/other-additional-services"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 12,
      "title": "Zam Zam Water Delivery",
      "description": "5 liters of Zam Zam water delivered to your home",
      "image_url": "https://example.com/storage/umrah/additional-services/zamzam.jpg",
      "order": 3
    },
    {
      "id": 15,
      "title": "Photography Service",
      "description": "Professional photography during Umrah journey",
      "image_url": "https://example.com/storage/umrah/additional-services/photo.jpg",
      "order": 5
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 12,
    "total": 2
  },
  "links": {
    "first": "https://your-domain.com/api/umrah-packages/royal-hilton-signature/other-additional-services?page=1",
    "last": "https://your-domain.com/api/umrah-packages/royal-hilton-signature/other-additional-services?page=1",
    "prev": null,
    "next": null
  }
}
```

**Behavior:**
- Returns only active additional services that are **excluded** from the package's selected add-ons.
- Paginated (12 per page) to support future growth of add-on services.
- If the package has no selected additional services, all active services are returned.
- Returns 404 if the package slug is invalid or the package is inactive.

---

### Linktree

Public endpoints that power the bio-link / Linktree page on the main website.

#### 1) Get Linktree Data

Returns all active linktree links along with the site's active social media links in a single response.

**Endpoint:** `GET /api/linktree`

**Example:**
```bash
curl "https://your-domain.com/api/linktree"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": 1,
        "title": "Official Website",
        "url": "https://www.rania.co.id",
        "order": 1
      },
      {
        "id": 2,
        "title": "Hajj Packages",
        "url": "https://www.rania.co.id/hajj",
        "order": 2
      }
    ],
    "social_media": [
      {
        "id": 1,
        "name": "Instagram",
        "url": "https://instagram.com/rania",
        "icon_url": "https://example.com/storage/social-media/instagram.png"
      }
    ]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to fetch linktree data"
}
```

**Behavior:**
- Only returns links with `is_active = true`, sorted by `order` ASC.
- `social_media` is sourced from the same dataset as `/api/social-media` and is embedded here so the Linktree page only needs one request.
- Response is safe to cache client-side for 5–15 minutes.

---

#### 2) Track Link Click

Records a click event for a linktree link. Intended to be called in a fire-and-forget manner from the frontend so it does not block the user's navigation to the target URL.

**Endpoint:** `POST /api/linktree/links/{id}/click`

**Path Parameters:**
- `id` (integer, required) - The linktree link ID.

**Request Body:** None. The server reads the client's `User-Agent`, `Referer` header, and IP address automatically.

**Example:**
```bash
curl -X POST "https://your-domain.com/api/linktree/links/1/click"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Click recorded"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Link not found"
}
```

**Behavior:**
- Inserts a row into `linktree_link_clicks` (IP, user-agent, referer, timestamp) and increments `linktree_links.click_count` atomically.
- Rate-limited to **60 requests per minute per IP** to mitigate abuse.
- Frontend should call this endpoint without awaiting the response, then redirect the user to the target URL.

---

### Contact

Submit a contact form message with email notification.

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+966501234567",
  "subject": "Inquiry about Ramadan Package",
  "message": "I would like to know more about your Ramadan packages."
}
```

**Validation:**
- `name` - Required, max 255 characters
- `email` - Required, valid email, max 255 characters
- `phone` - Required, max 20 characters
- `subject` - Required, max 255 characters
- `message` - Required

**Success Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully. We will contact you soon."
}
```

**Error Response (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

### Newsletter Subscription

Subscribe to the newsletter with instant activation.

**Endpoint:** `POST /api/newsletter/subscribe`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Validation:**
- `email` - Required, valid email, max 255 characters, must be unique

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thank you for subscribing to our newsletter!"
}
```

**Error Response (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["This email is already subscribed to our newsletter."]
  }
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "An error occurred while processing your subscription. Please try again later."
}
```

**Behavior:**
- Creates a subscriber with `active` status immediately
- No verification email required (single opt-in)
- Subscriber is instantly added to the newsletter list
- Duplicate emails are rejected with validation error
- Unsubscribe token is generated for future unsubscribe requests

**Unsubscribe Flow:**
- All emails include unsubscribe link: `GET /newsletter/unsubscribe/{token}`
- One-click unsubscribe without login required
- Status changes to `unsubscribed`

---

### API Response Format

All successful responses include:
- `success` - Boolean indicating success
- `data` - Response data (array or object)
- `pagination` - Pagination metadata (for paginated endpoints)

### Error Handling

**Validation Errors (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

**Server Errors (500):**
```json
{
  "success": false,
  "message": "An error occurred while processing your request."
}
```

### Notes

- All GET endpoints return only active records
- Records are ordered by their `order` field where applicable
- Images return absolute URLs
- `/api/umrah-packages` is paginated and includes `meta` + `links`, with hotels (carousel `images` + per-package `total_nights`), airlines (with `class`, `meal`, `baggage`), and additional services
- `/api/umrah-packages/{slug}` returns complete package detail sections, including hotel `images` carousel, per-package `total_nights`, and per-package airline `class`, `meal`, and `baggage`
- `/api/umrah-packages/{slug}/other-additional-services` returns paginated add-ons not included in the package
- Cancellation policy is currently frontend-managed (not part of Umrah API payload)
- Contact endpoint sends email notifications to admin
- Newsletter subscription uses single opt-in (instant activation)
- Unsubscribe functionality available via unique token
- CORS enabled for all origins (configure for production)

## Project Structure

```
rania-admin-dashboard/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Api/              # API Controllers
│   │       │   ├── ContactApiController.php
│   │       │   ├── FAQApiController.php
│   │       │   ├── HomeContentApiController.php
│   │       │   ├── SocialMediaApiController.php
│   │       │   ├── TestimonialApiController.php
│   │       │   └── UmrahPackageApiController.php
│   │       ├── NewsletterController.php    # Newsletter API & Web
│   │       ├── Admin/            # Admin Controllers
│   │       │   └── NewsletterSubscriberController.php
│   │       └── Web/              # Web Controllers (Admin)
│   ├── Models/                   # Eloquent Models
│   └── Mail/                     # Email Classes
├── database/
│   ├── migrations/               # Database Migrations
│   └── seeders/                  # Database Seeders
├── resources/
│   ├── js/
│   │   ├── components/           # React Components
│   │   ├── pages/                # Inertia Pages
│   │   └── types/                # TypeScript Types
│   └── views/                    # Blade Templates
├── routes/
│   ├── api.php                   # API Routes
│   ├── web.php                   # Web Routes
│   └── console.php               # Console Commands
├── public/
│   └── storage/                  # Public Storage (symlinked)
└── storage/
    └── app/
        └── public/               # File Uploads
```

## Available Scripts

### Composer Scripts

```bash
# Setup project
composer setup

# Start development environment
composer dev

# Start with SSR
composer dev:ssr

# Run tests
composer test
```

### NPM Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Type checking
npm run types
```

### Artisan Commands

```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Create storage link
php artisan storage:link

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Queue worker
php artisan queue:work

# Real-time logs
php artisan pail
```

## Testing

Run the test suite:

```bash
composer test
```

Run specific test file:

```bash
php artisan test --filter TestClassName
```

## Building for Production

### 1. Build Assets

```bash
npm run build
```

### 2. Optimize Laravel

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. Set Permissions

```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### 4. Environment

Ensure `.env` is properly configured for production:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@rania.com or create an issue in the repository.

---

Built with ❤️ by the Rania Team
