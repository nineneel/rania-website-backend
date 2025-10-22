<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of contact messages.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');

        $messages = ContactMessage::query()
            ->byStatus($status)
            ->latest()
            ->paginate(15);

        $counts = [
            'all' => ContactMessage::count(),
            'new' => ContactMessage::new()->count(),
            'read' => ContactMessage::read()->count(),
            'replied' => ContactMessage::replied()->count(),
        ];

        return Inertia::render('contact-messages/index', [
            'messages' => $messages,
            'counts' => $counts,
            'currentStatus' => $status,
        ]);
    }

    /**
     * Display a single contact message and mark as read if new.
     */
    public function show(ContactMessage $contactMessage)
    {
        // Mark as read if status is 'new'
        if ($contactMessage->status === 'new') {
            $contactMessage->markAsRead();
        }

        return Inertia::render('contact-messages/show', [
            'message' => $contactMessage->fresh(),
        ]);
    }

    /**
     * Update the status of a contact message.
     */
    public function updateStatus(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,read,replied'],
        ]);

        $contactMessage->update(['status' => $validated['status']]);

        return back()->with('success', 'Message status updated successfully.');
    }

    /**
     * Delete a contact message.
     */
    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('contact-messages.index')
            ->with('success', 'Contact message deleted successfully.');
    }
}
