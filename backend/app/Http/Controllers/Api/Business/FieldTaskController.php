<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\Business;
use App\Models\FieldTask;
use App\Models\TaskProof;
use App\Services\WhatsApp\TaskDispatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class FieldTaskController extends BaseController
{
    protected TaskDispatchService $taskDispatch;

    public function __construct(TaskDispatchService $taskDispatch)
    {
        $this->taskDispatch = $taskDispatch;
    }

    protected function getBusinessId(Request $request): int
    {
        if (app()->bound('current_business_id')) {
            return (int)app('current_business_id');
        }

        $headerId = $request->header('X-Tenant-ID');
        if ($headerId && is_numeric($headerId)) {
            return (int)$headerId;
        }

        $userBizId = $request->user()?->businesses()->first()?->id;
        if ($userBizId) {
            return (int)$userBizId;
        }

        return (int)(Business::value('id') ?? 1);
    }

    /**
     * List all field tasks for current business
     */
    public function index(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $query = FieldTask::where('business_id', $businessId)
            ->with(['staff:id,name,phone,email', 'proofs'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('site_name', 'like', "%{$search}%")
                  ->orWhere('client_name', 'like', "%{$search}%")
                  ->orWhere('client_phone', 'like', "%{$search}%");
            });
        }

        $tasks = $query->paginate($request->input('per_page', 50));

        // Group counts for Kanban view
        $counts = [
            'total'       => FieldTask::where('business_id', $businessId)->count(),
            'assigned'    => FieldTask::where('business_id', $businessId)->where('status', 'assigned')->count(),
            'in_transit'  => FieldTask::where('business_id', $businessId)->where('status', 'in_transit')->count(),
            'reached'     => FieldTask::where('business_id', $businessId)->where('status', 'reached')->count(),
            'awaiting_otp'=> FieldTask::where('business_id', $businessId)->where('status', 'awaiting_otp')->count(),
            'completed'   => FieldTask::where('business_id', $businessId)->where('status', 'completed')->count(),
            'cancelled'   => FieldTask::where('business_id', $businessId)->where('status', 'cancelled')->count(),
        ];

        return response()->json([
            'success' => true,
            'data'    => $tasks,
            'counts'  => $counts,
        ]);
    }

    /**
     * Create and optionally dispatch a new field task
     */
    public function store(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $validated = $request->validate([
            'staff_id'      => 'required|exists:users,id',
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'site_name'     => 'required|string|max:255',
            'site_lat'      => 'nullable|numeric',
            'site_lng'      => 'nullable|numeric',
            'site_address'  => 'nullable|string|max:500',
            'client_name'   => 'nullable|string|max:255',
            'client_phone'  => 'nullable|string|max:30',
            'priority'      => 'nullable|in:low,medium,high,urgent',
            'due_at'        => 'nullable|date',
            'auto_dispatch' => 'nullable|boolean',
        ]);

        $task = FieldTask::create([
            'business_id'   => $businessId,
            'staff_id'      => $validated['staff_id'],
            'title'         => $validated['title'],
            'description'   => $validated['description'] ?? null,
            'site_name'     => $validated['site_name'],
            'site_lat'      => $validated['site_lat'] ?? null,
            'site_lng'      => $validated['site_lng'] ?? null,
            'site_address'  => $validated['site_address'] ?? null,
            'client_name'   => $validated['client_name'] ?? null,
            'client_phone'  => $validated['client_phone'] ?? null,
            'priority'      => $validated['priority'] ?? 'medium',
            'status'        => 'assigned',
            'due_at'        => $validated['due_at'] ?? null,
        ]);

        $task->load('staff:id,name,phone,email');

        // Automatically dispatch WhatsApp notification to employee if requested (default true)
        $dispatched = false;
        $dispatchError = null;
        if ($request->input('auto_dispatch', true)) {
            try {
                $dispatched = $this->taskDispatch->dispatchTask($task);
            } catch (Exception $e) {
                $dispatchError = $e->getMessage();
            }
        }

        return response()->json([
            'success'        => true,
            'message'        => 'Field task created successfully',
            'task'           => $task,
            'dispatched'     => $dispatched,
            'dispatch_error' => $dispatchError,
        ], 201);
    }

    /**
     * Show task details with proof history
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $task = FieldTask::where('id', $id)
            ->where('business_id', $businessId)
            ->with(['staff:id,name,phone,email', 'proofs.staff:id,name'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'task'    => $task,
        ]);
    }

    /**
     * Update task status or details
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $task = FieldTask::where('id', $id)
            ->where('business_id', $businessId)
            ->firstOrFail();

        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'staff_id'     => 'sometimes|required|exists:users,id',
            'site_name'    => 'sometimes|required|string|max:255',
            'site_lat'     => 'nullable|numeric',
            'site_lng'     => 'nullable|numeric',
            'site_address' => 'nullable|string|max:500',
            'client_name'  => 'nullable|string|max:255',
            'client_phone' => 'nullable|string|max:30',
            'priority'     => 'nullable|in:low,medium,high,urgent',
            'status'       => 'sometimes|in:assigned,in_transit,reached,awaiting_otp,completed,cancelled',
            'description'  => 'nullable|string',
            'due_at'       => 'nullable|date',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'completed' && !$task->completed_at) {
            $validated['completed_at'] = now();
        }

        $task->update($validated);
        $task->load('staff:id,name,phone,email');

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully',
            'task'    => $task,
        ]);
    }

    /**
     * Dispatch WhatsApp alert to technician manually
     */
    public function dispatchTask(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $task = FieldTask::where('id', $id)
            ->where('business_id', $businessId)
            ->with('staff')
            ->firstOrFail();

        try {
            $dispatched = $this->taskDispatch->dispatchTask($task);
            return response()->json([
                'success'    => $dispatched,
                'message'    => $dispatched ? 'WhatsApp dispatch sent successfully' : 'Failed to dispatch WhatsApp message',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dispatch error: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete a task
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $task = FieldTask::where('id', $id)
            ->where('business_id', $businessId)
            ->firstOrFail();

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully',
        ]);
    }

    /**
     * Fetch all watermarked task proofs across all business tasks
     */
    public function getProofs(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $query = TaskProof::whereHas('task', function ($q) use ($businessId) {
                $q->where('business_id', $businessId);
            })
            ->with([
                'task:id,title,site_name,status,client_name',
                'staff:id,name,phone'
            ])
            ->orderBy('created_at', 'desc');

        if ($request->filled('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->filled('task_id')) {
            $query->where('task_id', $request->task_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $proofs = $query->paginate($request->input('per_page', 30));

        return response()->json([
            'success' => true,
            'data'    => $proofs,
        ]);
    }

    /**
     * Get list of staff available for field task assignment
     */
    public function getStaffList(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $business = Business::find($businessId);
        
        $staff = $business ? $business->users()->select('users.id', 'users.name', 'users.phone', 'users.email')->get() : collect();
        if ($staff->isEmpty()) {
            $staff = \App\Models\User::select('id', 'name', 'phone', 'email')->take(50)->get();
        }

        return response()->json([
            'success' => true,
            'data'    => $staff,
        ]);
    }
}
