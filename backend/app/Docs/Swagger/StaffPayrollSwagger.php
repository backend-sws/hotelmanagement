<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class StaffPayrollSwagger
{
    #[OA\Get(
        path: "/business/staff",
        summary: "List Staff Members",
        description: "Fetch all staff employees with role, salary type, status, and active permission counts.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        responses: [
            new OA\Response(response: 200, description: "Staff members list", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function listStaff() {}

    #[OA\Post(
        path: "/business/staff",
        summary: "Create Staff Member with Permissions & Salary Structure",
        description: "Registers a staff member with role (`staff` or `manager`), salary components, commission rate, and direct module permissions.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "phone"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Amit Verma"),
                    new OA\Property(property: "phone", type: "string", example: "9812345678"),
                    new OA\Property(property: "email", type: "string", example: "amit.frontdesk@hotelroyal.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "StaffPass123"),
                    new OA\Property(property: "role", type: "string", enum: ["staff", "manager"], example: "staff"),
                    new OA\Property(property: "salary_type", type: "string", enum: ["monthly", "daily"], example: "monthly"),
                    new OA\Property(property: "monthly_salary", type: "number", format: "float", example: 22000.00),
                    new OA\Property(property: "commission_rate", type: "number", format: "float", example: 1.5),
                    new OA\Property(property: "join_date", type: "string", format: "date", example: "2026-08-01"),
                    new OA\Property(
                        property: "permissions",
                        type: "array",
                        items: new OA\Items(type: "string"),
                        example: ["manage_hotel_dashboard", "manage_hotel_bookings", "manage_hotel_rooms", "manage_customers"]
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Staff created successfully", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse")),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function createStaff() {}

    #[OA\Get(
        path: "/business/staff/{id}/permissions",
        summary: "Get Assigned Staff Permissions",
        description: "Returns an array of all active permission slugs assigned to this staff member in this tenant business.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 4))
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of permission strings",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "string", example: "manage_hotel_bookings"))
                    ]
                )
            )
        ]
    )]
    public function getStaffPermissions() {}

    #[OA\Put(
        path: "/business/staff/{id}/permissions",
        summary: "Update Staff Permissions",
        description: "Syncs fine-grained module access permissions for a staff member.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1)),
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer", example: 4))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["permissions"],
                properties: [
                    new OA\Property(
                        property: "permissions",
                        type: "array",
                        items: new OA\Items(type: "string"),
                        example: ["view_dashboard", "manage_hotel_bookings", "manage_hotel_rooms", "manage_hotel_pos", "manage_customers"]
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Permissions synced successfully", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function updateStaffPermissions() {}

    #[OA\Post(
        path: "/business/attendance/check-in",
        summary: "Staff Daily Attendance Check-In",
        description: "Staff self-service check-in with GPS location coordinates and selfie photo.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "latitude", type: "number", format: "float", example: 28.6139),
                    new OA\Property(property: "longitude", type: "number", format: "float", example: 77.2090),
                    new OA\Property(property: "photo_url", type: "string", example: "https://s3.../checkin.jpg")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Checked in successfully", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function attendanceCheckIn() {}

    #[OA\Post(
        path: "/business/attendance/check-out",
        summary: "Staff Daily Attendance Check-Out",
        description: "Staff self-service check-out with GPS coordinates.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "latitude", type: "number", format: "float", example: 28.6139),
                    new OA\Property(property: "longitude", type: "number", format: "float", example: 77.2090)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Checked out successfully", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function attendanceCheckOut() {}

    #[OA\Post(
        path: "/business/payroll/generate",
        summary: "Generate Monthly Payroll",
        description: "Calculates monthly salary for all active staff based on attendance (present days, half days, paid leaves, unpaid leaves), salary components, commissions, and advance deductions.",
        tags: ["20. Staff, Attendance & Payroll"],
        security: [["sanctum" => []]],
        parameters: [
            new OA\Parameter(name: "X-Tenant-ID", in: "header", required: true, schema: new OA\Schema(type: "integer", example: 1))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["month", "year"],
                properties: [
                    new OA\Property(property: "month", type: "integer", minimum: 1, maximum: 12, example: 8),
                    new OA\Property(property: "year", type: "integer", example: 2026)
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Payroll calculated", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function generatePayroll() {}
}
