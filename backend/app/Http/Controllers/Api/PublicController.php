<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use Illuminate\Support\Facades\Validator;

class PublicController extends Controller
{
    /**
     * Submit a new lead from the public landing page.
     */
    public function submitLead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $lead = Lead::create([
                'business_name' => $request->business_name,
                'contact_person' => $request->contact_person,
                'phone' => $request->phone,
                'email' => $request->email,
                'notes' => $request->notes,
                'status' => 'new', // Default status for fresh leads
                // partner_id is left null since this is a direct lead
            ]);

            return response()->json([
                'message' => 'Lead submitted successfully!',
                'data' => $lead
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to submit lead. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
