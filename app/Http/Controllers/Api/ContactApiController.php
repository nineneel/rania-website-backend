<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Notifications\ContactMessageReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class ContactApiController extends Controller
{
    /**
     * Store a new contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        // Create contact message with default status 'new'
        $contactMessage = ContactMessage::create($validated);

        // Send email notification to admin
        try {
            $adminEmail = config('mail.admin_email', env('ADMIN_EMAIL', 'admin@rania.com'));
            Notification::route('mail', $adminEmail)
                ->notify(new ContactMessageReceived($contactMessage));
        } catch (\Exception $e) {
            // Log error but don't fail the request
            Log::error('Failed to send contact message notification', [
                'error' => $e->getMessage(),
                'contact_message_id' => $contactMessage->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting us. We will get back to you soon.',
            'data' => [
                'id' => $contactMessage->id,
            ],
        ], 201);
    }
}
