<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the activity logs with robust search and filters.
     */
    public function index(Request $request)
    {
        $businessId = app('current_business_id') ?? $request->user()?->business_id;
        $perPage = (int) $request->query('per_page', 20);

        $query = ActivityLog::with('user:id,name,email')
            ->where('tenant_id', $businessId)
            ->orderBy('created_at', 'desc');

        // 1. Text Search across description, action, model_type, and user name/email
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('model_type', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Action Filter (e.g., created, updated, deleted, check_in, check_out, billed, night_audit, etc.)
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // 3. Staff / User Filter
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // 4. Module / Model Type Filter
        if ($request->filled('module')) {
            $module = $request->module;
            if ($module === 'hotel') {
                $query->where('model_type', 'like', '%Hotel%');
            } elseif ($module === 'sales') {
                $query->where(function ($q) {
                    $q->where('model_type', 'like', '%Sale%')
                      ->orWhere('model_type', 'like', '%Customer%');
                });
            } elseif ($module === 'purchases_inventory') {
                $query->where(function ($q) {
                    $q->where('model_type', 'like', '%Supplier%')
                      ->orWhere('model_type', 'like', '%Product%')
                      ->orWhere('model_type', 'like', '%Stock%')
                      ->orWhere('model_type', 'like', '%Material%')
                      ->orWhere('model_type', 'like', '%PriceList%')
                      ->orWhere('model_type', 'like', '%Category%')
                      ->orWhere('model_type', 'like', '%Brand%')
                      ->orWhere('model_type', 'like', '%Unit%');
                });
            } elseif ($module === 'finance') {
                $query->where(function ($q) {
                    $q->where('model_type', 'like', '%CashBank%')
                      ->orWhere('model_type', 'like', '%Bank%')
                      ->orWhere('model_type', 'like', '%Cheque%')
                      ->orWhere('model_type', 'like', '%Ledger%')
                      ->orWhere('model_type', 'like', '%Expense%')
                      ->orWhere('model_type', 'like', '%Emi%')
                      ->orWhere('model_type', 'like', '%BusinessPayment%');
                });
            } elseif ($module === 'hrm') {
                $query->where(function ($q) {
                    $q->where('model_type', 'like', '%User%')
                      ->orWhere('model_type', 'like', '%Payroll%')
                      ->orWhere('model_type', 'like', '%Salary%')
                      ->orWhere('model_type', 'like', '%Leave%')
                      ->orWhere('model_type', 'like', '%Attendance%');
                });
            } elseif ($module === 'settings') {
                $query->where(function ($q) {
                    $q->where('model_type', 'like', '%Setting%')
                      ->orWhere('model_type', 'like', '%GstSetting%')
                      ->orWhere('model_type', 'like', '%BusinessLocation%')
                      ->orWhere('model_type', 'like', '%Business%');
                });
            } else {
                $query->where('model_type', 'like', '%' . $module . '%');
            }
        } elseif ($request->filled('model_type')) {
            $query->where('model_type', 'like', '%' . $request->model_type . '%');
        }

        // 5. Date Range Filtering
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Compute Base Stats
        $baseQuery = ActivityLog::where('tenant_id', $businessId);
        if ($request->filled('from_date')) {
            $baseQuery->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $baseQuery->whereDate('created_at', '<=', $request->to_date);
        }

        $stats = [
            'total'   => (clone $baseQuery)->count(),
            'created' => (clone $baseQuery)->where('action', 'created')->count(),
            'updated' => (clone $baseQuery)->where('action', 'updated')->count(),
            'deleted' => (clone $baseQuery)->where('action', 'deleted')->count(),
            'events'  => (clone $baseQuery)->whereNotIn('action', ['created', 'updated', 'deleted'])->count(),
        ];

        $logs = $query->paginate($perPage);

        $response = $logs->toArray();
        $response['stats'] = $stats;

        return response()->json($response);
    }
}

