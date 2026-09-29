<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\BaseController;
use App\Models\Business;
use App\Services\WhatsApp\RadarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FieldOpsRadarController extends BaseController
{
    protected RadarService $radarService;

    public function __construct(RadarService $radarService)
    {
        $this->radarService = $radarService;
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
     * Get real-time live staff positions for the radar map
     */
    public function livePositions(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $data = $this->radarService->getLivePositions($businessId);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }

    /**
     * Get route trail coordinates for drawing journey paths
     */
    public function routeTrail(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $staffId = (int)$request->input('staff_id');
        $date = $request->input('date');

        if (!$staffId) {
            return response()->json(['success' => false, 'message' => 'staff_id parameter required'], 422);
        }

        $trail = $this->radarService->getRouteTrail($businessId, $staffId, $date);

        return response()->json([
            'success' => true,
            'data'    => $trail,
        ]);
    }

    /**
     * Get executive field operations analytics & metrics
     */
    public function analytics(Request $request): JsonResponse
    {
        $businessId = $this->getBusinessId($request);
        $data = $this->radarService->getAnalytics($businessId);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
