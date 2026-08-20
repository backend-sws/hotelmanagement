<?php

namespace App\Docs\Swagger;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "2.0.0",
    title: "Hotel Management & ERP System REST API",
    description: "
## 📱 Mobile & Frontend Developer Integration Guide

Welcome to the **Hotel Management & Multi-Tenant ERP REST API**. This documentation is structured chronologically in business flow order so that you can easily integrate Mobile Apps (iOS/Android/Flutter/React Native) and Web Applications.

---

### 🔑 1. Authentication Flow
- Most endpoints require a **Bearer Token** obtained from `/api/v1/login` or `/api/v1/verify-otp`.
- Pass the token in the HTTP Authorization header:
  `Authorization: Bearer <your_access_token>`

---

### 🏢 2. Multi-Tenancy (`X-Tenant-ID` Header)
- This system is multi-tenant. All `/api/v1/business/*` routes operate on a specific Business/Hotel.
- You **MUST** pass the selected Business ID in the request header:
  `X-Tenant-ID: <business_id>`
- Example: If the user manages hotel with `id = 5`, include header `X-Tenant-ID: 5`.

---

### 📦 3. Standard API Response Structure
All API responses follow a unified envelope format:

#### Success Response (`200 OK` / `201 Created`):
```json
{
  \"status\": \"success\",
  \"message\": \"Resource retrieved or action completed successfully\",
  \"data\": { ... }
}
```

#### Paginated Response:
```json
{
  \"status\": \"success\",
  \"message\": \"Data retrieved\",
  \"data\": [ ... ],
  \"current_page\": 1,
  \"last_page\": 5,
  \"per_page\": 15,
  \"total\": 72
}
```

#### Validation Error (`422 Unprocessable Entity`):
```json
{
  \"status\": \"error\",
  \"message\": \"Validation failed\",
  \"errors\": {
    \"phone\": [\"The phone field is required.\"]
  }
}
```

#### Unauthorized (`401 Unauthorized`):
```json
{
  \"status\": \"error\",
  \"message\": \"Unauthenticated or token expired\"
}
```

#### Forbidden (`403 Forbidden`):
```json
{
  \"status\": \"error\",
  \"message\": \"You do not have permission to perform this action\"
}
```

---

### 🚀 4. Step-by-Step Business Flows
1. **Auth & Onboarding**: Check user ➔ Verify OTP / Login ➔ Get User & Businesses list.
2. **Hotel Flow**: View Live Dashboard ➔ Manage Room Types & Rooms ➔ Create Guest / Booking ➔ Check-In ➔ Folio Billing / Restaurant POS ➔ Check-Out & Settlement ➔ EOD Night Audit.
3. **Billing Flow**: Manage Products ➔ Create Sale Invoice / Challan / Quotation ➔ Customer Khata ➔ Collect Payment (Cash/Bank/Cheque).
4. **Staff & Payroll**: Register Staff ➔ Assign Permissions ➔ Mark Attendance ➔ Generate Monthly Payroll.
"
)]
#[OA\Server(
    url: "/api/v1",
    description: "Current Server (Auto-detect Host / Production / Local)"
)]
#[OA\Server(
    url: "http://localhost:8000/api/v1",
    description: "Localhost (Direct Port 8000)"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter Bearer Token (e.g. `Bearer 1|abcd...`)"
)]
#[OA\Tag(name: "1. Authentication & Onboarding", description: "Login, OTP verification, password setup, user profile, and business switching")]
#[OA\Tag(name: "2. Business & Tenant Profiles", description: "Business details, locations, invoice settings, and GST configuration")]
#[OA\Tag(name: "3. Hotel - Front Desk & Bookings", description: "Live hotel dashboard, guest directory, front-desk bookings, check-in, check-out, and folio billing")]
#[OA\Tag(name: "4. Hotel - Rooms & Pricing Plans", description: "Room types, room status updates (clean/dirty/occupied), and seasonal rate plans")]
#[OA\Tag(name: "5. Hotel - Point of Sale (POS) & Restaurant", description: "F&B Outlets, dining services, tables, reservations, KOT printing, and room folio postings")]
#[OA\Tag(name: "6. Hotel - Housekeeping Operations", description: "Housekeeping task assignment, cleaning status, defect reporting, and daily housekeeping summary")]
#[OA\Tag(name: "7. Hotel - Shifts & Staff Roster", description: "Department setup, work shifts, weekly staff roster, and shift handover records")]
#[OA\Tag(name: "8. Hotel - Night Audit & EOD", description: "End-of-day room posting, no-show processing, revenue roll-over, and audit logs")]
#[OA\Tag(name: "9. Hotel - OTA Channel Integration", description: "OTA Channel Manager, rate syncing, availability updates, and webhook notifications")]
#[OA\Tag(name: "10. Hotel - Corporate Accounts & City Ledger", description: "B2B company accounts, credit limits, invoices, and payment settlements")]
#[OA\Tag(name: "11. Hotel - Reports & Occupancy Analytics", description: "Occupancy rate, ADR, RevPAR, channel breakdown, and MIS summary reports")]
#[OA\Tag(name: "12. Billing & Invoicing (ERP)", description: "Tax Invoices, cash billing, invoice stats, PDF download, and WhatsApp invoice dispatch")]
#[OA\Tag(name: "13. Documents - Challans, Proforma, Quotations", description: "Delivery challans, truck slips, proforma invoices, quotations, and credit/debit notes")]
#[OA\Tag(name: "14. Purchases & Suppliers", description: "Purchase inward bills, vendor profiles, payments, and GST Input Tax Credit (ITC) management")]
#[OA\Tag(name: "15. Inventory, Stock & Godowns", description: "Product catalog, categories, brands, barcode scanning, multi-godown stock transfers, and consumption")]
#[OA\Tag(name: "16. Customers & Khata Ledgers", description: "Customer directory, Khata ledger statements, outstanding aging, and payment reminders")]
#[OA\Tag(name: "17. Cash, Banking & Cheques", description: "Cashbook, Bank accounts, Rozka Daybook, and Cheque Register with clearance & bounce tracking")]
#[OA\Tag(name: "18. Expenses & Petty Cash", description: "Business expenses tracking, category-wise breakdown, and expense analytics")]
#[OA\Tag(name: "19. Projects, BOQ & Labour", description: "Project sites, BOQ estimation, material tracking, and labour daily wage management")]
#[OA\Tag(name: "20. Staff, Attendance & Payroll", description: "Employee management, 40+ granular permissions, attendance tracking, and monthly salary slip generation")]
#[OA\Tag(name: "21. System Audit Logs", description: "Security audit logs, diff trails, and system operational tracking")]
#[OA\Tag(name: "22. Superadmin & Subscriptions", description: "Platform administration, tenant onboarding, subscription plans, platform logs, and system cache")]
#[OA\Tag(name: "23. Partner Portal", description: "Partner referral links, client onboarding, commission tracking, and payout requests")]
class RootSwagger
{
}
