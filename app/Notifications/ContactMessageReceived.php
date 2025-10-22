<?php

namespace App\Notifications;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageReceived extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public ContactMessage $contactMessage
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Contact Message Received - ' . $this->contactMessage->subject)
            ->greeting('New Contact Message!')
            ->line('You have received a new contact message from the RANIA website.')
            ->line('')
            ->line('**From:** ' . $this->contactMessage->name)
            ->line('**Email:** ' . $this->contactMessage->email)
            ->line('**Phone:** ' . $this->contactMessage->phone)
            ->line('**Subject:** ' . $this->contactMessage->subject)
            ->line('')
            ->line('**Message:**')
            ->line($this->contactMessage->message)
            ->line('')
            ->action('View Message', url('/contact-messages/' . $this->contactMessage->id))
            ->line('Please respond to this inquiry as soon as possible.')
            ->salutation('Best Regards, RANIA Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'contact_message_id' => $this->contactMessage->id,
            'name' => $this->contactMessage->name,
            'email' => $this->contactMessage->email,
            'subject' => $this->contactMessage->subject,
        ];
    }
}
