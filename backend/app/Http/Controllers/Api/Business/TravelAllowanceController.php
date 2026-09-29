<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\Business;
use App\Models\TravelAllowance;
use App\Services\WhatsApp\TravelAllowanceService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TravelAllowanceController extends BaseController
{
    protected TravelAllowanceService $travelService;

    public function __construct(TravelAllowanceService $travelService)
    {
        $this->travelService = $travelService;
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
     * List daily TA/DA claims with KPI metrics
     */
    public function index(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $query = TravelAllowance::where('business_id', $businessId)
            ->with(['staff:id,name,phone,email', 'approver:id,name'])
            ->orderBy('date', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('staff_id')) {
            $query->where('staff_id', $request->staff_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('month')) {
            $monthStart = Carbon::parse($request->month . '-01')->startOfMonth()->toDateString();
            $monthEnd   = Carbon::parse($request->month . '-01')->endOfMonth()->toDateString();
            $query->whereBetween('date', [$monthStart, $monthEnd]);
        }

        $claims = $query->paginate($request->input('per_page', 30));

        // Aggregate KPI metrics
        $allClaims = TravelAllowance::where('business_id', $businessId);
        if ($request->filled('month')) {
            $monthStart = Carbon::parse($request->month . '-01')->startOfMonth()->toDateString();
            $monthEnd   = Carbon::parse($request->month . '-01')->endOfMonth()->toDateString();
            $allClaims->whereBetween('date', [$monthStart, $monthEnd]);
        }

        $metrics = [
            'total_km'        => round((float)(clone $allClaims)->sum('total_km'), 2),
            'total_amount'    => round((float)(clone $allClaims)->sum('total_amount'), 2),
            'approved_amount' => round((float)(clone $allClaims)->where('status', 'approved')->sum('total_amount'), 2),
            'pending_count'   => (clone $allClaims)->where('status', 'pending')->count(),
            'active_drivers'  => (clone $allClaims)->distinct('staff_id')->count('staff_id'),
        ];

        return response()->json([
            'success' => true,
            'data'    => $claims,
            'metrics' => $metrics,
        ]);
    }

    /**
     * Approve a travel allowance claim
     */
    public function approve(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $claim = TravelAllowance::where('id', $id)
            ->where('business_id', $businessId)
            ->firstOrFail();

        $approverId = $request->user()?->id ?? 1;
        $claim = $this->travelService->approveClaim($claim->id, $approverId);
        $claim->load(['staff:id,name,phone', 'approver:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Travel allowance claim approved successfully',
            'claim'   => $claim,
        ]);
    }

    /**
     * Reject a travel allowance claim
     */
    public function reject(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $claim = TravelAllowance::where('id', $id)
            ->where('business_id', $businessId)
            ->firstOrFail();

        $notes = $request->input('notes', 'Rejected by manager during audit review.');
        $claim = $this->travelService->rejectClaim($claim->id, $notes);

        return response()->json([
            'success' => true,
            'message' => 'Travel allowance claim marked as rejected',
            'claim'   => $claim,
        ]);
    }

    /**
     * Recalculate daily travel distance from GPS waypoint logs
     */
    public function recalculate(Request $request, int $id): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $claim = TravelAllowance::where('id', $id)
            ->where('business_id', $businessId)
            ->firstOrFail();

        $updatedClaim = $this->travelService->calculateDailyTravel(
            $businessId,
            $claim->staff_id,
            $claim->date->toDateString(),
            $claim->vehicle_type
        );
        $updatedClaim->load(['staff:id,name,phone', 'approver:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Travel distance recalculated from GPS waypoints',
            'claim'   => $updatedClaim,
        ]);
    }

    /**
     * Export approved monthly claims to payroll system
     */
    public function syncPayroll(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);

        $validated = $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $syncedStaff = $this->travelService->syncWithPayroll($businessId, $validated['month']);

        return response()->json([
            'success'      => true,
            'message'      => 'Approved TA/DA claims successfully synced to payroll',
            'month'        => $validated['month'],
            'synced_count' => count($syncedStaff),
            'staff_totals' => $syncedStaff,
        ]);
    }
}
