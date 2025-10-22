<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Event;
use App\Models\FAQ;
use App\Models\HeroSlide;
use App\Models\Testimonial;
use App\Models\UmrahPackage;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index(): Response
    {
        $stats = [
            'faqs' => [
                'total' => FAQ::count(),
                'active' => FAQ::active()->count(),
            ],
            'testimonials' => [
                'total' => Testimonial::count(),
                'active' => Testimonial::active()->count(),
            ],
            'umrahPackages' => [
                'total' => UmrahPackage::count(),
                'active' => UmrahPackage::active()->count(),
            ],
            'contactMessages' => [
                'total' => ContactMessage::count(),
                'new' => ContactMessage::new()->count(),
                'read' => ContactMessage::read()->count(),
                'replied' => ContactMessage::replied()->count(),
            ],
            'heroSlides' => [
                'total' => HeroSlide::count(),
                'active' => HeroSlide::active()->count(),
            ],
            'events' => [
                'total' => Event::count(),
                'available' => Event::available()->count(),
            ],
            'users' => [
                'total' => User::count(),
                'superAdmins' => User::where('role', User::ROLE_SUPER_ADMIN)->count(),
                'admins' => User::where('role', User::ROLE_ADMIN)->count(),
                'editors' => User::where('role', User::ROLE_EDITOR)->count(),
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
