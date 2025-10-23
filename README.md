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

### Umrah Packages
- **Packages** - Complete Umrah package management
- **Hotels** - Hotel information with star ratings and locations
- **Airlines** - Airline management with logos
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
| GET | `/api/umrah-packages` | Get packages with hotels & airlines | ❌ |
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

Get all active Umrah packages with associated hotels and airlines.

**Endpoint:** `GET /api/umrah-packages`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Premium Ramadan Package",
      "description": "5-star accommodation near Haram",
      "image_url": "https://example.com/storage/packages/package1.jpg",
      "departure": "Jeddah",
      "duration": "14 days",
      "frequency": "Weekly",
      "price": "12500.00",
      "currency": "SAR",
      "hotels": [
        {
          "id": 1,
          "name": "Hilton Makkah Convention Hotel",
          "stars": 5,
          "location": "Makkah",
          "description": "Located 500m from Haram",
          "image_url": "https://example.com/storage/hotels/hotel1.jpg",
          "order": 1
        }
      ],
      "airlines": [
        {
          "id": 1,
          "name": "Saudia Airlines",
          "logo_url": "https://example.com/storage/airlines/saudia.png"
        }
      ]
    }
  ]
}
```

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
