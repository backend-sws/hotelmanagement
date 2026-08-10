<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\HotelHousekeepingTask;
use App\Models\HotelRoom;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Notification;
use App\Notifications\HousekeepingTaskAssigned;

class HotelHousekeepingController extends Controller
{
    public function index(Request $request)
    {
        $business = app('tenant');
        $query = HotelHousekeepingTask::with(['room', 'booking', 'assignee'])
            ->where('business_id', $business->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('assigned_user_id')) {
            $query->where('assigned_user_id', $request->assigned_user_id);
        }

        if ($request->has('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        $date = $request->input('date', now()->toDateString());
        $query->whereDate('created_at', $date);

        $tasks = $query->orderByRaw("FIELD(status, 'pending', 'issue_reported', 'in_progress', 'skipped', 'completed')")
            ->orderByRaw("FIELD(priority, 'urgent', 'high', 'normal', 'low')")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $business = app('tenant');
        $validated = $request->validate([
            'room_id' => ['required', 'exists:hotel_rooms,id'],
            'booking_id' => ['nullable', 'exists:hotel_bookings,id'],
            'task_type' => ['required', 'in:daily_cleaning,deep_cleaning,checkout_cleaning,turndown_service,maintenance_check,inspect'],
            'assigned_user_id' => ['nullable', 'exists:users,id'],
            'priority' => ['required', 'in:low,normal,high,urgent'],
            'notes' => ['nullable', 'string'],
        ]);

        $validated['business_id'] = $business->id;
        $validated['status'] = 'pending';

        $task = HotelHousekeepingTask::create($validated);

        if ($task->assigned_user_id) {
            $user = User::find($task->assigned_user_id);
            // We will create the notification later, for now we will just assume it is sent if possible
            if ($user && class_exists('App\Notifications\HousekeepingTaskAssigned')) {
                $user->notify(new \App\Notifications\HousekeepingTaskAssigned($task));
            }
        }

        return response()->json($task->load(['room', 'assignee']), 201);
    }

    public function updateStatus(Request $request, HotelHousekeepingTask $task)
    {
        $business = app('tenant');
        if ($task->business_id !== $business->id) abort(403);

        $validated = $request->validate([
            'status' => ['required', 'in:pending,in_progress,completed,skipped,issue_reported'],
        ]);

        $task->status = $validated['status'];
        
        if ($validated['status'] === 'in_progress' && !$task->started_at) {
            $task->started_at = now();
        } elseif ($validated['status'] === 'completed') {
            $task->completed_at = now();
            
            // Auto update room status to available if it was dirty
            if ($task->room->status === 'dirty') {
                $task->room->update(['status' => 'available']);
            }
        }

        $task->save();

        return response()->json($task->load(['room', 'assignee']));
    }

    public function assign(Request $request, HotelHousekeepingTask $task)
    {
        $business = app('tenant');
        if ($task->business_id !== $business->id) abort(403);

        $validated = $request->validate([
            'assigned_user_id' => ['nullable', 'exists:users,id'],
        ]);

        $task->assigned_user_id = $validated['assigned_user_id'];
        $task->save();
        
        if ($task->assigned_user_id) {
            $user = User::find($task->assigned_user_id);
            if ($user && class_exists('App\Notifications\HousekeepingTaskAssigned')) {
                $user->notify(new \App\Notifications\HousekeepingTaskAssigned($task));
            }
        }

        return response()->json($task->load(['room', 'assignee']));
    }

    public function reportIssue(Request $request, HotelHousekeepingTask $task)
    {
        $business = app('tenant');
        if ($task->business_id !== $business->id) abort(403);

        $validated = $request->validate([
            'issue_description' => ['required', 'string'],
        ]);

        $task->status = 'issue_reported';
        $task->issue_description = $validated['issue_description'];
        $task->save();

        // Auto update room status to maintenance
        $task->room->update(['status' => 'maintenance']);

        return response()->json($task->load(['room', 'assignee']));
    }

    public function dailyReport(Request $request)
    {
        $business = app('tenant');
        $date = $request->input('date', now()->toDateString());
        
        $stats = [
            'total' => HotelHousekeepingTask::where('business_id', $business->id)->whereDate('created_at', $date)->count(),
            'pending' => HotelHousekeepingTask::where('business_id', $business->id)->whereDate('created_at', $date)->where('status', 'pending')->count(),
            'in_progress' => HotelHousekeepingTask::where('business_id', $business->id)->whereDate('created_at', $date)->where('status', 'in_progress')->count(),
            'completed' => HotelHousekeepingTask::where('business_id', $business->id)->whereDate('created_at', $date)->where('status', 'completed')->count(),
            'issues' => HotelHousekeepingTask::where('business_id', $business->id)->whereDate('created_at', $date)->where('status', 'issue_reported')->count(),
        ];
        
        return response()->json($stats);
    }
}
