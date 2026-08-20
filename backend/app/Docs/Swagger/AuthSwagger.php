<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

class AuthSwagger
{
    #[OA\Get(
        path: "/ping",
        summary: "Health Check / Ping",
        description: "Verify backend API availability and server time.",
        tags: ["1. Authentication & Onboarding"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Server is healthy",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "ok"),
                        new OA\Property(property: "message", type: "string", example: "pong"),
                        new OA\Property(property: "timestamp", type: "string", format: "date-time")
                    ]
                )
            )
        ]
    )]
    public function ping() {}

    #[OA\Post(
        path: "/check-user",
        summary: "Check if user exists by phone/email",
        description: "Mobile App First Step: Checks whether a user exists with the given phone or email to determine whether to prompt for Login or Registration OTP.",
        tags: ["1. Authentication & Onboarding"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["login"],
                properties: [
                    new OA\Property(property: "login", type: "string", example: "9876543210", description: "Mobile number or Email address")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "User existence status",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(property: "exists", type: "boolean", example: true),
                                new OA\Property(property: "has_password", type: "boolean", example: true)
                            ]
                        )
                    ]
                )
            ),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function checkUser() {}

    #[OA\Post(
        path: "/send-otp",
        summary: "Send Login / Verification OTP",
        description: "Sends a 6-digit SMS/WhatsApp verification OTP to the user's mobile number.",
        tags: ["1. Authentication & Onboarding"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["phone"],
                properties: [
                    new OA\Property(property: "phone", type: "string", example: "9876543210")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "OTP sent successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "message", type: "string", example: "OTP sent successfully to your mobile.")
                    ]
                )
            ),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function sendOtp() {}

    #[OA\Post(
        path: "/verify-otp",
        summary: "Verify OTP & Authenticate",
        description: "Verifies the received OTP code. Returns a Sanctum Bearer access token and associated business accounts.",
        tags: ["1. Authentication & Onboarding"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["phone", "otp"],
                properties: [
                    new OA\Property(property: "phone", type: "string", example: "9876543210"),
                    new OA\Property(property: "otp", type: "string", example: "123456")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Authentication successful",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "token", type: "string", example: "1|3hKj910..."),
                        new OA\Property(property: "user", ref: "#/components/schemas/UserSchema"),
                        new OA\Property(
                            property: "businesses",
                            type: "array",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: "id", type: "integer", example: 1),
                                    new OA\Property(property: "name", type: "string", example: "Grand Hotel & Suites"),
                                    new OA\Property(property: "role", type: "string", example: "admin")
                                ]
                            )
                        )
                    ]
                )
            ),
            new OA\Response(response: 422, ref: "#/components/schemas/ValidationErrorResponse")
        ]
    )]
    public function verifyOtp() {}

    #[OA\Post(
        path: "/login",
        summary: "Password Login",
        description: "Authenticate with Email/Phone and Password to receive a Bearer Token.",
        tags: ["1. Authentication & Onboarding"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["login", "password"],
                properties: [
                    new OA\Property(property: "login", type: "string", example: "admin@hotelroyal.com", description: "Email or Phone"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "secret123")
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Login successful",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "token", type: "string", example: "2|99aBcd..."),
                        new OA\Property(property: "user", ref: "#/components/schemas/UserSchema")
                    ]
                )
            ),
            new OA\Response(response: 401, ref: "#/components/schemas/ErrorResponse")
        ]
    )]
    public function login() {}

    #[OA\Post(
        path: "/logout",
        summary: "Logout",
        description: "Revoke the current Bearer Token.",
        tags: ["1. Authentication & Onboarding"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Logged out successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(property: "message", type: "string", example: "Successfully logged out.")
                    ]
                )
            )
        ]
    )]
    public function logout() {}

    #[OA\Get(
        path: "/user",
        summary: "Get Authenticated User",
        description: "Returns the current authenticated user's profile, roles, and tenant businesses.",
        tags: ["1. Authentication & Onboarding"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "User details",
                content: new OA\JsonContent(ref: "#/components/schemas/UserSchema")
            ),
            new OA\Response(response: 401, ref: "#/components/schemas/ErrorResponse")
        ]
    )]
    public function user() {}

    #[OA\Get(
        path: "/profile",
        summary: "Get Profile Details",
        description: "Fetch comprehensive profile information including notification preferences.",
        tags: ["1. Authentication & Onboarding"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(response: 200, description: "Profile details", content: new OA\JsonContent(ref: "#/components/schemas/UserSchema"))
        ]
    )]
    public function getProfile() {}

    #[OA\Patch(
        path: "/profile",
        summary: "Update Profile",
        description: "Update user's name, email, or phone.",
        tags: ["1. Authentication & Onboarding"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Rajesh Kumar"),
                    new OA\Property(property: "email", type: "string", example: "rajesh.new@example.com")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Profile updated", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function updateProfile() {}

    #[OA\Post(
        path: "/profile/password",
        summary: "Change Password",
        description: "Change the current user's password.",
        tags: ["1. Authentication & Onboarding"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["current_password", "new_password", "new_password_confirmation"],
                properties: [
                    new OA\Property(property: "current_password", type: "string", format: "password", example: "oldpass123"),
                    new OA\Property(property: "new_password", type: "string", format: "password", example: "newSecurePass456"),
                    new OA\Property(property: "new_password_confirmation", type: "string", format: "password", example: "newSecurePass456")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Password changed", content: new OA\JsonContent(ref: "#/components/schemas/SuccessResponse"))
        ]
    )]
    public function changePassword() {}

    #[OA\Get(
        path: "/businesses",
        summary: "List User Businesses / Hotels",
        description: "Get all hotels/business entities associated with the current user. Use the returned business `id` in the `X-Tenant-ID` header for subsequent requests.",
        tags: ["2. Business & Tenant Profiles"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of businesses",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "success"),
                        new OA\Property(
                            property: "data",
                            type: "array",
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: "id", type: "integer", example: 1),
                                    new OA\Property(property: "name", type: "string", example: "Grand Hotel & Resort"),
                                    new OA\Property(property: "role", type: "string", example: "admin"),
                                    new OA\Property(property: "currency", type: "string", example: "INR"),
                                    new OA\Property(property: "plan", type: "string", example: "Enterprise")
                                ]
                            )
                        )
                    ]
                )
            )
        ]
    )]
    public function listBusinesses() {}
}
