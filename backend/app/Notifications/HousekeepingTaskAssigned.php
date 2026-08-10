<?php

namespace App\Notifications;

use App\Models\HotelHousekeepingTask;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HousekeepingTaskAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public $task;

    public function __construct(HotelHousekeepingTask $task)
    {
        $this->task = $task;
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
        $roomNo = $this->task->room->room_number ?? 'Unknown Room';
        $type = str_replace('_', ' ', $this->task->task_type);
        
        return (new MailMessage)
                    ->subject("New Housekeeping Task: Room {$roomNo}")
                    ->greeting("Hello {$notifiable->name},")
                    ->line("You have been assigned a new housekeeping task.")
                    ->line("**Room:** {$roomNo}")
                    ->line("**Task Type:** " . ucwords($type))
                    ->line("**Priority:** " . ucfirst($this->task->priority))
                    ->action('View Task', url('/hotel/housekeeping'))
                    ->line('Please complete it as soon as possible.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'room_id' => $this->task->room_id,
            'message' => 'You have been assigned a new housekeeping task.',
        ];
    }
}
