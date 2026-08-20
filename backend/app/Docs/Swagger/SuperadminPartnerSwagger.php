<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class SuperadminPartnerSwagger
{
    #[OA\Get(
        path: "/superadmin/dashboard/stats",
        summary: "Superadmin Overview KPI Stats",
        description: "Returns platform-wide metrics: Total Businesses/Hotels, Active Subscriptions, Total Monthly Recurring Revenue (MRR), Total Users, and Leads.",
        tags: ["22. Superadmin & Subscriptions"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Superadmin stats", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function superadminStats() {}

    #[OA\Post(
        path: "/superadmin/businesses/onboard",
        summary: "Onboard New Hotel / Business Tenant",
        description: "Creates a new business tenant and assigns the initial admin user credentials.",
        tags: ["22. Superadmin & Subscriptions"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "admin_name", "admin_phone", "plan_id"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "The Heritage Grand Hotel"),
                    new OA\Property(property: "admin_name", type: "string", example: "Vikram Malhotra"),
                    new OA\Property(property: "admin_phone", type: "string", example: "9876543210"),
                    new OA\Property(property: "admin_email", type: "string", example: "vikram@heritagegrand.com"),
                    new OA\Property(property: "plan_id", type: "integer", example: 3),
                    new OA\Property(property: "initial_password", type: "string", format: "password", example: "HotelAdmin@123")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Tenant onboarded", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function onboardTenant() {}

    #[OA\Get(
        path: "/partner/dashboard",
        summary: "Partner Portal Dashboard",
        description: "Returns partner performance stats: Active Referrals, Total Earned Commissions, Pending Payouts, and Referral Link.",
        tags: ["23. Partner Portal"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Partner dashboard", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function partnerDashboard() {}

    #[OA\Post(
        path: "/partner/clients/onboard",
        summary: "Partner Direct Client Onboarding",
        description: "Allows an authorized partner to onboard a new hotel client with automatic referral attribution and commission tagging.",
        tags: ["23. Partner Portal"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["business_name", "owner_name", "owner_phone", "plan_id"],
                properties: [
                    new OA\Property(property: "business_name", type: "string", example: "Sunrise Valley Resort"),
                    new OA\Property(property: "owner_name", type: "string", example: "Suresh Gupta"),
                    new OA\Property(property: "owner_phone", type: "string", example: "9876512345"),
                    new OA\Property(property: "plan_id", type: "integer", example: 2)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Client onboarded by partner", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function partnerOnboardClient() {}

    #[OA\Post(
        path: "/partner/payouts",
        summary: "Request Commission Payout",
        description: "Submit a request to withdraw accumulated referral commissions to registered bank account/UPI.",
        tags: ["23. Partner Portal"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["amount"],
                properties: [
                    new OA\Property(property: "amount", type: "number", format: "float", example: 15000.00),
                    new OA\Property(property: "payout_method", type: "string", enum: ["bank_transfer", "upi"], example: "upi"),
                    new OA\Property(property: "payout_details", type: "string", example: "partner@okhdfcbank")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Payout request submitted", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function requestPayout() {}
}
