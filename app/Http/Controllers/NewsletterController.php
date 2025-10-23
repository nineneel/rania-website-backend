<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterSubscriptionRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(NewsletterSubscriptionRequest $request): JsonResponse
    {
        try {
            // Create subscriber with active status
            NewsletterSubscriber::create([
                'email' => $request->email,
                'status' => 'active',
                'unsubscribe_token' => NewsletterSubscriber::generateUnsubscribeToken(),
                'ip_address' => $request->ip(),
                'source' => 'website',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for subscribing to our newsletter!',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Newsletter subscription error: ' . $e->getMessage(), [
                'exception' => $e,
                'email' => $request->email ?? 'unknown'
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your subscription. Please try again later.',
            ], 500);
        }
    }

    /**
     * Unsubscribe from newsletter
     */
    public function unsubscribe(string $token)
    {
        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)
            ->where('status', 'active')
            ->first();

        if (!$subscriber) {
            return view('newsletter.unsubscribe-result', [
                'success' => false,
                'message' => 'Invalid unsubscribe link.',
            ]);
        }

        // Unsubscribe
        $subscriber->unsubscribe();

        return view('newsletter.unsubscribe-result', [
            'success' => true,
            'message' => 'You have been successfully unsubscribed from our newsletter.',
        ]);
    }
}
