# 🏨 HMS (Hotel Management System) — Master Implementation Plan
> **File:** `HMS_MASTER_PLAN.md` — Project root me save hai, kabhi delete mat karna!
> **Created:** 2026-08-08
> **Project:** BillKaro Billing SaaS → Enterprise Hotel Management System
> **Stack:** Laravel (PHP) + React (TypeScript) + MySQL + Docker

---

## 📌 Vision & Architecture

```
Superadmin (Platform Owner — BillKaro)
   └── Har business ke liye modules ON/OFF toggle kar sakta hai
   
Hotel Owner / Business Admin
   └── Multiple Hotels manage karta hai (existing Business Switch)
       ├── 🏨 Hotel 1 — The Grand Palace, Mumbai
       ├── 🏨 Hotel 2 — Park Inn, Pune
       └── 🏨 Hotel 3 — Riverside Resort, Goa
           ├── Front Desk Staff (reservations, check-in/out)
           ├── Housekeeping Staff (room cleaning)
           ├── Restaurant Staff (POS billing)
           └── Manager (full property access)
```

**Multi-Property Working:**
- Existing `businesses` table + `Business Switch` UI already multi-property support karta hai
- Har hotel ek alag `business_id` hai → saara data scoped rehta hai
- Hotel owner ek login se sabhi hotels ko manage kar sakta hai

---

## 🚦 Progress Tracker

| Phase | Name | Status | Completion |
|---|---|---|---|
| Phase 0 | Superadmin Module Toggle | ✅ Done | 100% |
| Phase 1 | Hotel Rooms & Property Setup | ✅ Done | 100% |
| Phase 2 | Front Desk + Reservations + Guest | ✅ Done | 100% |
| Phase 3 | Hotel POS + Room Service | ✅ Done | 100% |
| Phase 4 | Housekeeping Management | ✅ Done | 100% |
| Phase 5 | Staff Shift Roster + HR | ⬜ Pending | 0% |
| Phase 6 | OTA + Channel Manager Integration | ⬜ Pending | 0% |
| Phase 7 | Night Audit + GST Compliance | ⬜ Pending | 0% |
| Phase 8 | Revenue Reports + Analytics | ⬜ Pending | 0% |
| Phase 9 | Corporate Accounts + City Ledger | ⬜ Pending | 0% |

> Status key: ⬜ Pending | 🔄 In Progress | ✅ Done

---

## 🔧 PHASE 0 — Superadmin Module Toggle System
**Timeline: Day 1-2 | Priority: IMMEDIATE**

### Goal
Superadmin kisi bhi business ke liye Billing ya Hotel modules ek click me ON/OFF kar sake.

### Feature Flags (Complete Registry)

#### Billing/CRM Modules (Jo pehle se hain)
| Feature Key | Module | Route Middleware |
|---|---|---|
| `has_billing` | Invoicing & Sales | Existing |
| `has_inventory` | Inventory Management | Existing |
| `has_expenses` | Expense Tracking | `feature:has_expenses` |
| `has_purchase_bills` | Purchase Bills & ITC | `feature:has_purchase_bills` |
| `has_payroll` | HR & Payroll | `feature:has_payroll` |
| `has_emi` | EMI Finance | Existing |
| `has_khata_ledger` | Khata / Ledger | `feature:has_khata_ledger` |
| `has_cashbook` | Cash & Bank Book | `feature:has_cashbook` |
| `has_cheques` | Cheque Register | `feature:has_cheques` |
| `has_gst_reports` | GST Reports (GSTR1/3B) | `feature:has_gst_reports` |
| `has_financial_reports` | P&L / Balance Sheet | `feature:has_financial_reports` |
| `has_projects` | Projects & BOQ | `feature:has_projects` |
| `has_stock_transfer` | Multi-Godown Transfer | `feature:has_stock_transfer` |
| `has_activity_logs` | Audit Logs | `feature:has_activity_logs` |
| `has_pos` | Point of Sale | Existing |

#### Hotel Management Modules (Naye — OFF by default)
| Feature Key | Module |
|---|---|
| `has_hotel_dashboard` | Hotel Overview Dashboard |
| `has_hotel_rooms` | Room & Category Management |
| `has_hotel_reservations` | Front Desk & Reservations |
| `has_hotel_pos` | Hotel POS & Restaurant Billing |
| `has_hotel_housekeeping` | Housekeeping Management |
| `has_hotel_shift_roster` | Staff Shift Roster |
| `has_hotel_night_audit` | Night Audit & EOD Reports |
| `has_hotel_ota` | OTA Integration (MMT, Goibibo, etc.) |
| `has_hotel_gst_compliance` | Hotel GST & Billing Compliance |
| `has_hotel_reports` | Revenue & Occupancy Reports |
| `has_hotel_corporate` | Corporate Accounts & City Ledger |

### Files to Change

#### Backend
- ✅ `CheckFeatureAccess.php` — Already perfect, koi change nahi
- ✅ `Business::hasFeature()` — Already works
- ✅ `api.php` — Billing routes already gated, Hotel routes baad me add honge

#### Frontend
- `frontend/src/features/superadmin/plans/components/PlanFormModal.tsx`
  - "Hotel Management" section add karo with all 11 hotel feature checkboxes
- `frontend/src/features/superadmin/tenants/components/EditTenantModal.tsx`
  - Feature list ko 2 groups me divide karo: "Billing Modules" + "Hotel Modules"
- `frontend/src/hooks/useFeature.ts` — No change needed
- `frontend/src/components/layout/Sidebar.tsx`
  - Hotel nav items conditionally render: `useFeature('has_hotel_dashboard')` etc.
- `frontend/src/App.tsx`
  - Hotel routes add karo with FeatureGuard wrappers

---

## 🏗️ PHASE 1 — Hotel Core Foundation + Room Management
**Timeline: Day 3-7**

### New Database Tables

#### `hotel_property_settings`
```sql
- id
- business_id              (FK → businesses.id)
- property_type            ENUM: boutique | budget | resort | 3star | 4star | 5star | luxury
- total_rooms              INT
- check_in_time            TIME  default: "14:00"
- check_out_time           TIME  default: "11:00"
- late_checkout_charge     DECIMAL(10,2)
- early_checkin_charge     DECIMAL(10,2)
- default_gst_category     ENUM: ac_room | non_ac_room | luxury
- city_ledger_enabled      BOOLEAN default: false
- footer_for_bills         TEXT
- created_at, updated_at
```

#### `hotel_room_types`
```sql
- id
- business_id
- name                     VARCHAR  e.g. "Deluxe AC", "Suite", "Standard Non-AC"
- short_code               VARCHAR  e.g. "DLX", "STD", "SUT"
- base_price_weekday       DECIMAL(10,2)
- base_price_weekend       DECIMAL(10,2)
- base_price_peak          DECIMAL(10,2)  (festival/season)
- extra_person_charge      DECIMAL(10,2)
- max_occupancy            INT
- amenities                JSON  ["AC", "WiFi", "Mini-Bar", "Bathtub", "TV"]
- description              TEXT
- display_image_url        VARCHAR  (S3 path)
- created_at, updated_at
```

#### `hotel_rooms`
```sql
- id
- business_id
- room_number              VARCHAR  e.g. "101", "201A", "Penthouse"
- floor                    VARCHAR  e.g. "Ground", "1st", "Terrace"
- room_type_id             (FK → hotel_room_types.id)
- is_ac                    BOOLEAN
- current_tariff           DECIMAL(10,2)  (can override room type price)
- status                   ENUM: available | occupied | reserved | dirty | maintenance | blocked
- view_type                ENUM: city | garden | pool | sea | mountain | courtyard
- bed_type                 ENUM: single | double | twin | king | queen
- max_occupancy            INT  (can override room type)
- notes                    TEXT
- created_at, updated_at
```

#### `hotel_rate_plans` (Seasonal / Promotional Pricing)
```sql
- id
- business_id
- name                     e.g. "Summer Special", "Diwali Package", "Corporate Rate"
- start_date               DATE
- end_date                 DATE
- room_type_id             nullable (null = applies to all types)
- modifier_type            ENUM: fixed | percentage
- modifier_value           DECIMAL  e.g. 20 (20% hike) or -500 (flat discount)
- min_stay_nights          INT  (minimum nights required)
- is_active                BOOLEAN
- created_at, updated_at
```

### New Backend Files
```
backend/app/Models/
  ├── HotelPropertySetting.php
  ├── HotelRoomType.php
  ├── HotelRoom.php
  └── HotelRatePlan.php

backend/app/Http/Controllers/Api/Business/
  ├── HotelPropertyController.php     (GET/POST property settings)
  ├── HotelRoomTypeController::class   (CRUD room types)
  ├── HotelRoomController.php          (CRUD rooms + status update)
  └── HotelRatePlanController.php      (CRUD rate plans)

backend/database/migrations/
  ├── create_hotel_property_settings_table.php
  ├── create_hotel_room_types_table.php
  ├── create_hotel_rooms_table.php
  └── create_hotel_rate_plans_table.php
```

### New API Routes (in api.php)
```php
Route::middleware(['tenant', 'feature:has_hotel_rooms'])->prefix('hotel')->group(function () {
    Route::get('/property-settings', [HotelPropertyController::class, 'show']);
    Route::post('/property-settings', [HotelPropertyController::class, 'update']);
    Route::apiResource('room-types', HotelRoomTypeController::class);
    Route::apiResource('rooms', HotelRoomController::class);
    Route::patch('rooms/{room}/status', [HotelRoomController::class, 'updateStatus']);
    Route::apiResource('rate-plans', HotelRatePlanController::class);
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  ├── rooms/
  │   ├── RoomsPage.tsx               (Room list + status board grid)
  │   ├── RoomTypesPage.tsx           (Room type CRUD)
  │   ├── RatePlansPage.tsx           (Seasonal pricing)
  │   └── components/
  │       ├── RoomCard.tsx
  │       ├── RoomStatusBadge.tsx
  │       ├── AddRoomModal.tsx
  │       └── AddRoomTypeModal.tsx
  └── api/
      ├── useHotelRooms.ts
      └── useHotelRoomTypes.ts
```

---

## 🛎️ PHASE 2 — Front Desk + Reservations + Guest Management
**Timeline: Day 8-15**

### New Database Tables

#### `hotel_guests`
```sql
- id
- business_id
- name                     VARCHAR
- phone                    VARCHAR (unique per business)
- email                    VARCHAR nullable
- nationality              VARCHAR default: "Indian"
- id_proof_type            ENUM: aadhaar | pan | passport | driving_license | voter_id
- id_proof_number          VARCHAR
- id_proof_front_url       VARCHAR  (S3)
- id_proof_back_url        VARCHAR  (S3)
- date_of_birth            DATE nullable
- gender                   ENUM: male | female | other
- address, city, state, pincode, country
- company_name             VARCHAR nullable (for corporate guests)
- gst_number               VARCHAR nullable
- total_stays              INT default: 0  (auto-increment on checkout)
- total_spent              DECIMAL(12,2) default: 0  (auto-sum on checkout)
- notes                    TEXT
- is_blacklisted           BOOLEAN default: false
- blacklist_reason         TEXT
- created_at, updated_at
```

#### `hotel_bookings`
```sql
- id
- business_id
- booking_number           VARCHAR UNIQUE  e.g. "BK-20260808-0001"
- booking_source           ENUM: walk_in | phone | website | makemytrip | goibibo | 
                                  agoda | oyo | expedia | booking_com | airbnb | 
                                  corporate | other
- ota_booking_ref          VARCHAR nullable  (OTA ka reference number)
- ota_channel_id           FK nullable → hotel_ota_channels.id
- guest_id                 FK → hotel_guests.id
- room_id                  FK → hotel_rooms.id
- check_in_date            DATE
- check_out_date           DATE
- actual_check_in_at       TIMESTAMP nullable  (actual arrival time)
- actual_check_out_at      TIMESTAMP nullable
- total_nights             INT  (auto-calculated)
- adults                   INT default: 1
- children                 INT default: 0
- room_rate_per_night      DECIMAL(10,2)  (locked at booking time)
- total_room_charges       DECIMAL(10,2)
- extra_charges            DECIMAL(10,2) default: 0  (folio items sum)
- discount_amount          DECIMAL(10,2) default: 0
- discount_reason          VARCHAR nullable
- tax_percent              DECIMAL(5,2)  (auto from GST slab)
- tax_amount               DECIMAL(10,2)
- total_amount             DECIMAL(10,2)
- paid_amount              DECIMAL(10,2) default: 0
- balance_due              DECIMAL(10,2)  (total_amount - paid_amount)
- payment_status           ENUM: pending | partial | paid | refunded
- payment_mode             ENUM: cash | upi | card | bank_transfer | city_ledger | ota_collect
- status                   ENUM: reserved | confirmed | checked_in | checked_out | cancelled | no_show
- cancelled_at             TIMESTAMP nullable
- cancel_reason            TEXT nullable
- special_requests         TEXT  ("Early check-in, extra pillow, vegetarian meal")
- internal_notes           TEXT
- confirmed_by             FK nullable → users.id
- checked_in_by            FK nullable → users.id
- checked_out_by           FK nullable → users.id
- created_at, updated_at
```

#### `hotel_booking_payments` (Payment history)
```sql
- id
- booking_id               FK → hotel_bookings.id
- amount                   DECIMAL(10,2)
- payment_mode             ENUM: cash | upi | card | bank_transfer
- transaction_ref          VARCHAR nullable
- collected_by             FK → users.id
- notes                    VARCHAR nullable
- created_at
```

#### `hotel_folio_charges` (Room bill line items)
```sql
- id
- booking_id               FK → hotel_bookings.id
- charge_type              ENUM: room_rent | room_service | restaurant | laundry | 
                                  minibar | telephone | spa | extra_bed | early_checkin | 
                                  late_checkout | cancellation_fee | other
- hotel_service_id         FK nullable → hotel_services.id
- description              VARCHAR  ("Masala Dosa x2", "Ironing - 3 clothes")
- charge_date              DATE
- qty                      DECIMAL(8,2) default: 1
- unit_price               DECIMAL(10,2)
- total_price              DECIMAL(10,2)
- tax_percent              DECIMAL(5,2) default: 0
- tax_amount               DECIMAL(10,2) default: 0
- posted_by                FK → users.id
- created_at
```

### New Backend Files
```
backend/app/Models/
  ├── HotelGuest.php
  ├── HotelBooking.php
  ├── HotelBookingPayment.php
  └── HotelFolioCharge.php

backend/app/Http/Controllers/Api/Business/
  ├── HotelGuestController.php        (CRUD guests + search + blacklist)
  ├── HotelBookingController.php      (CRUD + checkIn + checkOut + folio)
  ├── HotelAvailabilityController.php (Check room availability for dates)
  └── HotelDashboardController.php    (Room grid, today's arrivals/departures)

backend/app/Services/
  ├── HotelBookingService.php         (Business logic: check-in/out workflow)
  └── HotelGstCalculator.php          (Auto GST slab calculation)
```

### New API Routes
```php
// Dashboard
Route::middleware(['feature:has_hotel_dashboard'])->prefix('hotel')->group(function () {
    Route::get('/dashboard', [HotelDashboardController::class, 'index']);
    Route::get('/dashboard/room-grid', [HotelDashboardController::class, 'roomGrid']);
    Route::get('/dashboard/today-arrivals', [HotelDashboardController::class, 'todayArrivals']);
    Route::get('/dashboard/today-departures', [HotelDashboardController::class, 'todayDepartures']);
});

// Reservations
Route::middleware(['feature:has_hotel_reservations'])->prefix('hotel')->group(function () {
    Route::get('/availability', [HotelAvailabilityController::class, 'check']);
    Route::get('/calendar', [HotelBookingController::class, 'calendar']);  // Gantt data
    Route::apiResource('guests', HotelGuestController::class);
    Route::patch('guests/{guest}/blacklist', [HotelGuestController::class, 'toggleBlacklist']);
    Route::apiResource('bookings', HotelBookingController::class);
    Route::post('bookings/{booking}/check-in', [HotelBookingController::class, 'checkIn']);
    Route::post('bookings/{booking}/check-out', [HotelBookingController::class, 'checkOut']);
    Route::post('bookings/{booking}/cancel', [HotelBookingController::class, 'cancel']);
    Route::post('bookings/{booking}/folio', [HotelBookingController::class, 'addFolioCharge']);
    Route::delete('bookings/{booking}/folio/{charge}', [HotelBookingController::class, 'removeFolioCharge']);
    Route::get('bookings/{booking}/folio', [HotelBookingController::class, 'getFolio']);
    Route::post('bookings/{booking}/payment', [HotelBookingController::class, 'addPayment']);
    Route::get('bookings/{booking}/invoice-pdf', [HotelBookingController::class, 'generateInvoice']);
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  ├── dashboard/
  │   ├── HotelDashboardPage.tsx
  │   └── components/
  │       ├── RoomGrid.tsx             (Color-coded live room status grid)
  │       ├── OccupancyWidget.tsx      (Donut chart — occupancy %)
  │       ├── TodayArrivalsCard.tsx    (Expected check-ins today)
  │       ├── TodayDeparturesCard.tsx  (Expected check-outs today)
  │       └── QuickCheckinModal.tsx
  ├── front-desk/
  │   ├── FrontDeskPage.tsx           (Main view: Reservations list)
  │   ├── BookingCalendarPage.tsx     (Gantt calendar)
  │   ├── GuestsPage.tsx              (Guest directory)
  │   └── components/
  │       ├── NewReservationModal.tsx  (Create booking)
  │       ├── CheckInModal.tsx         (Check-in workflow)
  │       ├── CheckOutModal.tsx        (Check-out + bill settlement)
  │       ├── GuestFolioDrawer.tsx     (Guest bill itemized view)
  │       ├── AddFolioChargeModal.tsx  (Add room service/extra charge)
  │       ├── BookingDetailDrawer.tsx  (Full booking details)
  │       └── GuestSearchBox.tsx       (Quick guest lookup)
  └── api/
      ├── useHotelDashboard.ts
      ├── useHotelBookings.ts
      ├── useHotelGuests.ts
      └── useHotelAvailability.ts
```

### Checkin/Checkout Workflow (Backend Logic)
```
CHECK-IN FLOW:
1. Verify booking status = 'confirmed' or 'reserved'
2. Validate guest ID proof uploaded
3. Update booking: status → 'checked_in', actual_check_in_at = now()
4. Update room: status → 'occupied'
5. Auto-post first day room charge to folio (if advance billing)
6. Log: checked_in_by = current user

CHECK-OUT FLOW:
1. Get guest folio total (room rent + all folio charges + taxes)
2. Calculate balance_due
3. Collect payment (cash/UPI/card/city ledger)
4. Update booking: status → 'checked_out', actual_check_out_at = now(), paid_amount, balance_due = 0
5. Update room: status → 'dirty' (triggers housekeeping)
6. Auto-generate stay invoice PDF
7. Update guest.total_stays++ and guest.total_spent += total_amount
8. Log: checked_out_by = current user
```

---

## 🍽️ PHASE 3 — Hotel POS + Restaurant Billing + Room Service
**Timeline: Day 16-21**

### New Database Tables

#### `hotel_outlets` (Restaurant, Bar, Spa, etc.)
```sql
- id
- business_id
- name                     "Main Restaurant", "Poolside Bar", "Spa", "Coffee Lounge"
- outlet_type              ENUM: restaurant | bar | spa | room_service | banquet | laundry
- is_active                BOOLEAN
- created_at, updated_at
```

#### `hotel_services` (Menu items / services catalog)
```sql
- id
- business_id
- outlet_id                FK → hotel_outlets.id
- name                     "Masala Dosa", "Extra Bed", "Airport Drop", "Deep Tissue Massage"
- category                 ENUM: food | beverage | laundry | transport | spa | minibar | misc
- description              TEXT
- price                    DECIMAL(10,2)
- tax_type                 ENUM: inclusive | exclusive | nil
- tax_percent              DECIMAL(5,2)
- is_available             BOOLEAN
- created_at, updated_at
```

#### `hotel_pos_orders`
```sql
- id
- business_id
- order_number             VARCHAR  e.g. "RST-20260808-001"
- outlet_id                FK → hotel_outlets.id
- booking_id               FK nullable → hotel_bookings.id (null if direct payment)
- table_no                 VARCHAR nullable  "T5", "R101" (room number)
- order_type               ENUM: dine_in | room_service | takeaway | post_to_room
- status                   ENUM: pending | processing | served | billed | cancelled
- subtotal                 DECIMAL(10,2)
- tax_amount               DECIMAL(10,2)
- total                    DECIMAL(10,2)
- payment_mode             ENUM: cash | upi | card | post_to_room | complimentary
- billed_by                FK → users.id
- billed_at                TIMESTAMP
- kot_printed_at           TIMESTAMP nullable
- created_at, updated_at
```

#### `hotel_pos_order_items`
```sql
- id
- order_id                 FK → hotel_pos_orders.id
- service_id               FK → hotel_services.id
- name                     VARCHAR  (snapshot at time of order)
- qty                      DECIMAL(8,2)
- unit_price               DECIMAL(10,2)
- total_price              DECIMAL(10,2)
- notes                    VARCHAR  ("No onion", "Extra spicy")
```

### New API Routes
```php
Route::middleware(['feature:has_hotel_pos'])->prefix('hotel')->group(function () {
    Route::apiResource('outlets', HotelOutletController::class);
    Route::apiResource('services', HotelServiceController::class);
    Route::get('services/by-outlet/{outletId}', [HotelServiceController::class, 'byOutlet']);
    Route::apiResource('pos-orders', HotelPosOrderController::class);
    Route::post('pos-orders/{order}/bill', [HotelPosOrderController::class, 'bill']);
    Route::post('pos-orders/{order}/post-to-room', [HotelPosOrderController::class, 'postToRoom']);
    Route::get('pos-orders/{order}/kot', [HotelPosOrderController::class, 'printKot']);
    Route::patch('pos-orders/{order}/status', [HotelPosOrderController::class, 'updateStatus']);
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  └── pos/
      ├── RestaurantPosPage.tsx      (Table layout + order taking + billing)
      ├── RoomServicePage.tsx        (Select room → add items → post to folio)
      └── components/
          ├── TableLayoutView.tsx    (Visual table grid for dine-in)
          ├── OrderItemsPanel.tsx    (Cart of items for current order)
          ├── KotPrintModal.tsx      (Kitchen Order Ticket print)
          └── PostToRoomModal.tsx    (Select room to post charges)
```

---

## 🧹 PHASE 4 — Housekeeping Management
**Timeline: Day 22-25**

### New Database Tables

#### `hotel_housekeeping_tasks`
```sql
- id
- business_id
- room_id                  FK → hotel_rooms.id
- booking_id               FK nullable → hotel_bookings.id
- task_type                ENUM: daily_cleaning | deep_cleaning | checkout_cleaning | 
                                  turndown_service | maintenance_check | inspect
- assigned_user_id         FK nullable → users.id  (housekeeping staff)
- priority                 ENUM: low | normal | high | urgent
- status                   ENUM: pending | in_progress | completed | skipped | issue_reported
- started_at               TIMESTAMP nullable
- completed_at             TIMESTAMP nullable
- notes                    TEXT
- issue_description        TEXT nullable  ("Broken AC, Leaky tap")
- images                   JSON nullable  (S3 image URLs for proof)
- created_at, updated_at
```

### New API Routes
```php
Route::middleware(['feature:has_hotel_housekeeping'])->prefix('hotel')->group(function () {
    Route::get('housekeeping', [HotelHousekeepingController::class, 'index']);
    Route::post('housekeeping', [HotelHousekeepingController::class, 'store']);
    Route::patch('housekeeping/{task}/status', [HotelHousekeepingController::class, 'updateStatus']);
    Route::patch('housekeeping/{task}/assign', [HotelHousekeepingController::class, 'assign']);
    Route::post('housekeeping/{task}/report-issue', [HotelHousekeepingController::class, 'reportIssue']);
    Route::get('housekeeping/daily-report', [HotelHousekeepingController::class, 'dailyReport']);
    // On task completion with status=completed → auto-update room.status = 'available'
});
```

### Room Status Auto-transition
```
guest checks out → room.status = 'dirty'
housekeeping task created (auto on checkout)
staff starts task → room.status stays 'dirty'
staff marks complete → room.status = 'available' ✅
issue reported → room.status = 'maintenance'
```

### New Frontend Files
```
frontend/src/features/hotel/
  └── housekeeping/
      ├── HousekeepingPage.tsx        (Kanban board — 4 columns)
      └── components/
          ├── HousekeepingTaskCard.tsx
          ├── AssignStaffModal.tsx
          └── ReportIssueModal.tsx
```

**Kanban Columns:**
1. `🔴 Checkout - Needs Cleaning` (priority: urgent)
2. `🟡 In Progress` (staff currently cleaning)
3. `🟢 Cleaned & Inspect` (ready for manager inspection)
4. `🔧 Maintenance Issue` (broken item reported)

---

## 👷 PHASE 5 — Staff Shift Roster + HR Integration
**Timeline: Day 26-32**

### New Database Tables

#### `hotel_departments`
```sql
- id
- business_id
- name         "Front Desk", "Housekeeping", "Restaurant", "Security", 
               "Maintenance", "Management", "Accounts"
- head_user_id FK nullable → users.id  (department head/manager)
- created_at, updated_at
```

#### `hotel_shifts`
```sql
- id
- business_id
- name             "Morning Shift", "Evening Shift", "Night Shift", "Split Shift"
- start_time       TIME  "06:00"
- end_time         TIME  "14:00"
- is_overnight     BOOLEAN  (e.g. 22:00–06:00 crosses midnight)
- color            VARCHAR  "#3B82F6" (for roster display)
- created_at, updated_at
```

#### `hotel_shift_roster`
```sql
- id
- business_id
- user_id           FK → users.id  (staff member)
- department_id     FK → hotel_departments.id
- shift_id          FK → hotel_shifts.id
- roster_date       DATE
- status            ENUM: scheduled | attended | absent | swapped | on_leave | week_off | holiday
- swap_with_user_id FK nullable → users.id  (if shift was swapped)
- swap_reason       TEXT nullable
- approved_by       FK nullable → users.id
- notes             TEXT
- created_at, updated_at

UNIQUE KEY: (business_id, user_id, roster_date)  -- One roster entry per staff per day
```

### New API Routes
```php
Route::middleware(['feature:has_hotel_shift_roster'])->prefix('hotel')->group(function () {
    Route::apiResource('departments', HotelDepartmentController::class);
    Route::apiResource('shifts', HotelShiftController::class);
    Route::get('roster', [HotelRosterController::class, 'index']);            // Weekly/Monthly view
    Route::post('roster', [HotelRosterController::class, 'store']);           // Single assignment
    Route::post('roster/bulk-assign', [HotelRosterController::class, 'bulkAssign']); // Multiple days/staff
    Route::patch('roster/{id}/swap-request', [HotelRosterController::class, 'requestSwap']);
    Route::patch('roster/{id}/approve-swap', [HotelRosterController::class, 'approveSwap']);
    Route::delete('roster/{id}', [HotelRosterController::class, 'destroy']);
    Route::get('roster/export', [HotelRosterController::class, 'export']);    // PDF/Excel
    Route::get('roster/conflicts', [HotelRosterController::class, 'checkConflicts']); // Auto detect
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  └── roster/
      ├── ShiftRosterPage.tsx         (Main roster grid)
      ├── DepartmentsPage.tsx
      ├── ShiftsPage.tsx
      └── components/
          ├── RosterGrid.tsx          (Rows=Staff, Cols=Days, Cells=Shift assigned)
          ├── RosterCell.tsx          (Individual cell with drag-drop)
          ├── BulkAssignModal.tsx     (Assign one shift to multiple staff for a week)
          ├── SwapRequestModal.tsx    (Staff swap shift request)
          └── RosterExportModal.tsx   (PDF/Excel export settings)
```

**Roster Grid Features:**
- Weekly view (default) / Monthly view toggle
- Color-coded cells by shift type
- Click cell → assign/change shift
- Drag cell → copy shift to another day
- ⚠️ Auto conflict warning: same staff in two overlapping shifts
- Export as PDF (printable notice board version)

---

## 📡 PHASE 6 — OTA Integration + Channel Manager
**Timeline: Day 33-42**

### What is OTA Integration?
Online Travel Agencies (Booking.com, MakeMyTrip, Goibibo, Agoda, Expedia) send bookings via API/Webhook. HMS auto-receives and creates a booking — no manual entry needed.

### Integration Strategy

**Recommended: Channel Manager Middleware**
Instead of integrating 6+ OTAs separately, connect to a Channel Manager which handles all OTAs:
- **RateGain** (India's #1, most hotels use this)
- **Staah**
- **SiteMinder**
- **eZee Centrix**

Our HMS exposes:
1. `POST /api/v1/ota/webhook/{channel}` → Receive incoming bookings
2. `GET /api/v1/business/hotel/availability` → Channel manager pulls our inventory
3. Push API → We push rate/availability updates to channel manager

### New Database Tables

#### `hotel_ota_channels`
```sql
- id
- business_id
- channel_name         "MakeMyTrip", "Booking.com", "RateGain" (channel manager)
- channel_type         ENUM: ota_direct | channel_manager
- api_key              VARCHAR encrypted
- api_secret           VARCHAR encrypted
- property_code        VARCHAR  (our property ID in OTA system)
- webhook_secret       VARCHAR  (for signature verification)
- sync_status          ENUM: connected | disconnected | error | pending_setup
- last_sync_at         TIMESTAMP nullable
- created_at, updated_at
```

#### `hotel_ota_rate_sync`
```sql
- id
- business_id
- channel_id           FK → hotel_ota_channels.id
- room_type_id         FK → hotel_room_types.id
- sync_date            DATE
- available_rooms      INT  (inventory pushed to OTA)
- rate                 DECIMAL(10,2)  (rate pushed to OTA)
- restrictions         JSON  {min_stay: 2, closed_to_arrival: false}
- sync_status          ENUM: pending | synced | failed
- synced_at            TIMESTAMP
```

### New API Routes
```php
// Public webhook (no auth, HMAC signature verified)
Route::post('/ota/webhook/{channelName}', [HotelOtaWebhookController::class, 'handle']);

Route::middleware(['feature:has_hotel_ota'])->prefix('hotel')->group(function () {
    Route::apiResource('ota-channels', HotelOtaChannelController::class);
    Route::post('ota/sync-availability', [HotelOtaSyncController::class, 'syncAvailability']);
    Route::post('ota/sync-rates', [HotelOtaSyncController::class, 'syncRates']);
    Route::post('ota/sync-all', [HotelOtaSyncController::class, 'syncAll']);
    Route::get('ota/bookings', [HotelOtaController::class, 'otaBookings']);
    Route::get('ota/rate-parity', [HotelOtaController::class, 'rateParity']);  // Compare rates across OTAs
});
```

### OTA Webhook Processing
```
OTA sends booking → POST /api/v1/ota/webhook/makemytrip
  → Verify HMAC signature using webhook_secret
  → Parse OTA booking format
  → Map to our hotel_bookings format
  → Auto-create HotelGuest if not exists
  → Auto-create HotelBooking (status: confirmed)
  → Send confirmation notification to Front Desk
  → Return 200 OK to OTA
```

### New Frontend Files
```
frontend/src/features/hotel/
  └── ota/
      ├── OtaChannelsPage.tsx        (Connect/manage OTA integrations)
      ├── RateSyncPage.tsx           (Bulk rate & availability push calendar)
      ├── OtaBookingsPage.tsx        (All OTA bookings with original ref numbers)
      └── components/
          ├── OtaChannelCard.tsx     (Connected/disconnected status per channel)
          ├── RatePushCalendar.tsx   (Date-wise availability/rate grid to push)
          └── RateParityTable.tsx    (Compare our rates vs what OTA shows)
```

---

## 🌙 PHASE 7 — Night Audit + GST Compliance + Billing
**Timeline: Day 43-50**

### Night Audit

Night Audit = Daily End-of-Day (EOD) process. Runs automatically at midnight (or manually by front desk manager).

**What Night Audit Does:**
1. Posts all daily room charges to guest folios (for in-house guests)
2. Checks all expected checkouts — marks no-shows
3. Rolls over the business day in system
4. Generates Day Summary Report
5. Archives the day's transactions

#### `hotel_night_audit_log`
```sql
- id
- business_id
- audit_date              DATE
- rooms_occupied          INT
- rooms_available         INT
- occupancy_percent       DECIMAL(5,2)
- total_revenue_room      DECIMAL(12,2)
- total_revenue_pos       DECIMAL(12,2)
- total_revenue_extras    DECIMAL(12,2)
- total_revenue_gross     DECIMAL(12,2)
- total_tax_collected     DECIMAL(12,2)
- total_discount_given    DECIMAL(12,2)
- new_checkins            INT
- checkouts               INT
- no_shows                INT
- cancellations           INT
- status                  ENUM: pending | running | completed | failed
- run_by                  FK → users.id
- run_at                  TIMESTAMP
- report_path             VARCHAR  (S3 path for PDF report)
- created_at
```

### Hotel GST Rules (India)

```
Room Tariff per Night    → GST Rate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Below ₹1,000             → 0% (Nil)
₹1,001 – ₹7,500          → 12% GST
Above ₹7,500             → 18% GST

Restaurant:
Non-AC without liquor    → 5% GST (no ITC)
AC with liquor           → 18% GST

SAC Codes:
Room Accommodation       → 996311
Restaurant Services      → 996331
Laundry                  → 998531
Spa & Massage            → 999721
```

#### `hotel_tax_config`
```sql
- id
- business_id
- room_slab_1_upto        INT  default: 1000 (nil rate upto this tariff)
- room_slab_2_upto        INT  default: 7500 (12% upto this tariff)
- room_slab_3_rate        DECIMAL  default: 18 (above slab_2 limit)
- restaurant_non_ac_rate  DECIMAL  default: 5
- restaurant_ac_rate      DECIMAL  default: 18
- luxury_tax_applicable   BOOLEAN  default: false
- luxury_tax_rate         DECIMAL  default: 0
- is_gst_registered       BOOLEAN  default: true
- gstin                   VARCHAR  (Hotel's GST number)
```

### New API Routes
```php
// Night Audit
Route::middleware(['feature:has_hotel_night_audit'])->prefix('hotel')->group(function () {
    Route::post('night-audit/run', [HotelNightAuditController::class, 'run']);
    Route::get('night-audit', [HotelNightAuditController::class, 'history']);
    Route::get('night-audit/{id}/report', [HotelNightAuditController::class, 'downloadReport']);
    Route::get('night-audit/preview', [HotelNightAuditController::class, 'previewTotals']); // Before running
});

// GST Config & Compliance
Route::middleware(['feature:has_hotel_gst_compliance'])->prefix('hotel')->group(function () {
    Route::get('tax-config', [HotelGstController::class, 'show']);
    Route::post('tax-config', [HotelGstController::class, 'update']);
    Route::get('gst/gstr1', [HotelGstController::class, 'gstr1']);           // Monthly GSTR-1
    Route::get('gst/monthly-summary', [HotelGstController::class, 'monthlySummary']);
    Route::get('gst/sac-wise', [HotelGstController::class, 'sacWiseSummary']); // Per SAC code
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  ├── night-audit/
  │   ├── NightAuditPage.tsx         (Run audit + history)
  │   └── components/
  │       └── AuditSummaryCard.tsx
  └── gst/
      ├── HotelGstConfigPage.tsx     (Tax slab configuration)
      └── HotelGstReportsPage.tsx    (GSTR-1, SAC-wise summary)
```

---

## 📊 PHASE 8 — Revenue Reports + Analytics
**Timeline: Day 51-56**

### Reports to Build

| Report | Description | Key Metrics |
|---|---|---|
| **Occupancy Report** | Date-wise occupancy by room type | Occupancy %, RevPAR, Total Rooms Sold |
| **Room Revenue Report** | Revenue by room type/floor/view | Revenue per room type |
| **ARR/ADR Report** | Average Room Rate & Average Daily Rate | Trend over weeks/months |
| **Channel-wise Revenue** | Which OTA/source generated most | OTA vs Direct split |
| **Guest Nationality Report** | Where guests came from | Required by Tourism Dept |
| **Cancellation Report** | No-shows and cancellations by source | Cancellation % |
| **Housekeeping Efficiency** | Time per room, issues logged | Avg clean time |
| **Night Audit History** | Daily EOD summaries | Daily revenue trends |
| **Staff Productivity** | Check-ins handled per staff member | Best performers |
| **MIS Executive Summary** | All-in-one for hotel owner | Multi-property view |

### Key Hotel KPIs (Automatically calculated)
```
RevPAR = Total Room Revenue / Total Available Rooms
ARR    = Total Room Revenue / Rooms Sold (Average Room Rate)
ADR    = Total Room Revenue / Rooms Occupied (Average Daily Rate)
Occupancy % = Rooms Occupied / Total Rooms × 100
GOPPAR = Gross Operating Profit Per Available Room
```

### New API Routes
```php
Route::middleware(['feature:has_hotel_reports'])->prefix('hotel/reports')->group(function () {
    Route::get('occupancy', [HotelReportController::class, 'occupancy']);
    Route::get('revenue', [HotelReportController::class, 'revenue']);
    Route::get('arr-adr-revpar', [HotelReportController::class, 'arrAdrRevpar']);
    Route::get('channel-wise', [HotelReportController::class, 'channelWise']);
    Route::get('guest-nationality', [HotelReportController::class, 'guestNationality']);
    Route::get('cancellations', [HotelReportController::class, 'cancellations']);
    Route::get('housekeeping-efficiency', [HotelReportController::class, 'housekeepingEfficiency']);
    Route::get('mis-summary', [HotelReportController::class, 'misSummary']);
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  └── reports/
      ├── HotelReportsPage.tsx        (Dashboard with all report widgets)
      └── components/
          ├── OccupancyChart.tsx      (Line chart: occupancy % over time)
          ├── RevenueBarChart.tsx     (Bar: revenue by day/week/month)
          ├── ChannelPieChart.tsx     (Pie: OTA vs Direct)
          └── MisSummaryCard.tsx      (Quick KPI cards)
```

---

## 🏢 PHASE 9 — Corporate Accounts + City Ledger
**Timeline: Day 57-63**

### What is City Ledger?
Corporate clients (e.g., Infosys books 30 rooms/month) get credit — they don't pay per booking. At month end, hotel sends one consolidated invoice for all their stays.

### New Database Tables

#### `hotel_corporate_accounts`
```sql
- id
- business_id
- company_name             VARCHAR
- gst_number               VARCHAR
- address, city, state, pincode
- contact_person           VARCHAR
- contact_phone, contact_email
- credit_limit             DECIMAL(12,2)  (max outstanding allowed)
- billing_cycle            ENUM: weekly | fortnightly | monthly
- credit_days              INT  30/45/60 days
- discount_percent         DECIMAL(5,2)  (negotiated rate)
- contract_start_date      DATE
- contract_end_date        DATE
- current_outstanding      DECIMAL(12,2)  (auto-maintained)
- status                   ENUM: active | suspended | expired
- notes                    TEXT
- created_at, updated_at
```

#### `hotel_corporate_payments`
```sql
- id
- corporate_account_id     FK → hotel_corporate_accounts.id
- amount                   DECIMAL(12,2)
- payment_date             DATE
- payment_mode             ENUM: bank_transfer | cheque | upi | neft | rtgs
- transaction_ref          VARCHAR
- notes                    VARCHAR
- created_at
```

### New API Routes
```php
Route::middleware(['feature:has_hotel_corporate'])->prefix('hotel')->group(function () {
    Route::apiResource('corporate-accounts', HotelCorporateController::class);
    Route::get('corporate-accounts/{id}/statement', [HotelCorporateController::class, 'statement']);
    Route::post('corporate-accounts/{id}/payment', [HotelCorporateController::class, 'recordPayment']);
    Route::post('corporate-accounts/{id}/generate-invoice', [HotelCorporateController::class, 'generateInvoice']);
    Route::get('corporate-accounts/{id}/invoice-pdf', [HotelCorporateController::class, 'invoicePdf']);
});
```

### New Frontend Files
```
frontend/src/features/hotel/
  └── corporate/
      ├── CorporateAccountsPage.tsx  (List all corporate clients)
      ├── CorporateDetailPage.tsx    (Individual account + statement)
      └── components/
          ├── CorporateLedgerTable.tsx
          ├── AddCorporateModal.tsx
          └── RecordPaymentModal.tsx
```

---

## 🧭 Final Sidebar Navigation Structure

```
🏨 HOTEL MANAGEMENT
  ├── 📊 Hotel Dashboard          [has_hotel_dashboard]
  ├── 🛎️ Front Desk              [has_hotel_reservations]
  │    ├── Live Reservations
  │    ├── Booking Calendar
  │    ├── Check In
  │    ├── Check Out
  │    └── Guest Directory
  ├── 🛏️ Rooms                   [has_hotel_rooms]
  │    ├── Room Status Board
  │    ├── Room Types
  │    └── Rate Plans & Seasons
  ├── 🍽️ Hotel POS               [has_hotel_pos]
  │    ├── Restaurant
  │    └── Room Service
  ├── 🧹 Housekeeping            [has_hotel_housekeeping]
  ├── 👷 Staff & Shifts          [has_hotel_shift_roster]
  │    ├── Shift Roster
  │    └── Departments & Shifts
  ├── 🌙 Night Audit             [has_hotel_night_audit]
  ├── 📡 OTA & Channels          [has_hotel_ota]
  ├── 📊 Revenue Reports         [has_hotel_reports]
  ├── 🧾 GST Compliance          [has_hotel_gst_compliance]
  └── 🏢 Corporate Accounts      [has_hotel_corporate]

📦 BILLING & CRM (can be toggled OFF for pure hotel businesses)
  ├── 💰 Invoicing & Sales       [has_billing]
  ├── 📦 Inventory               [has_inventory]
  ├── 💸 Expenses                [has_expenses]
  ├── 📋 HR & Payroll            [has_payroll]
  └── ... (all existing modules)
```

---

## 📁 Complete New Files Summary

### Backend (Laravel)
```
Migrations (9 total):
  create_hotel_property_settings_table
  create_hotel_room_types_table
  create_hotel_rooms_table
  create_hotel_rate_plans_table
  create_hotel_guests_table
  create_hotel_bookings_table + hotel_booking_payments + hotel_folio_charges
  create_hotel_outlets_table + hotel_services + hotel_pos_orders + hotel_pos_order_items
  create_hotel_housekeeping_tasks_table
  create_hotel_departments_table + hotel_shifts + hotel_shift_roster
  create_hotel_ota_channels_table + hotel_ota_rate_sync
  create_hotel_night_audit_log_table + hotel_tax_config
  create_hotel_corporate_accounts_table + hotel_corporate_payments

Models (18):
  HotelPropertySetting, HotelRoomType, HotelRoom, HotelRatePlan
  HotelGuest, HotelBooking, HotelBookingPayment, HotelFolioCharge
  HotelOutlet, HotelService, HotelPosOrder, HotelPosOrderItem
  HotelHousekeepingTask
  HotelDepartment, HotelShift, HotelShiftRoster
  HotelOtaChannel, HotelOtaRateSync
  HotelNightAuditLog, HotelTaxConfig
  HotelCorporateAccount, HotelCorporatePayment

Controllers (16):
  HotelDashboardController, HotelPropertyController
  HotelRoomController, HotelRoomTypeController, HotelRatePlanController
  HotelGuestController, HotelBookingController, HotelAvailabilityController
  HotelOutletController, HotelServiceController, HotelPosOrderController
  HotelHousekeepingController
  HotelDepartmentController, HotelShiftController, HotelRosterController
  HotelOtaChannelController, HotelOtaSyncController, HotelOtaWebhookController
  HotelNightAuditController
  HotelGstController, HotelTaxConfigController
  HotelReportController
  HotelCorporateController

Services (4):
  HotelBookingService (check-in/out business logic)
  HotelGstCalculator (auto GST slab computation)
  HotelOtaWebhookParser (parse different OTA formats)
  HotelNightAuditService (EOD processing)
```

### Frontend (React + TypeScript)
```
New feature folder: frontend/src/features/hotel/
  ├── dashboard/       → 1 page + 5 components
  ├── rooms/           → 3 pages + 4 components
  ├── front-desk/      → 3 pages + 7 components
  ├── pos/             → 2 pages + 4 components
  ├── housekeeping/    → 1 page + 3 components
  ├── roster/          → 3 pages + 4 components
  ├── ota/             → 3 pages + 3 components
  ├── night-audit/     → 1 page + 1 component
  ├── gst/             → 2 pages
  ├── reports/         → 1 page + 4 components
  ├── corporate/       → 2 pages + 3 components
  └── api/             → 10 React Query hook files

Modified files:
  Sidebar.tsx          (add Hotel nav section)
  App.tsx              (add 20+ new routes)
  PlanFormModal.tsx    (add Hotel module feature flags)
  EditTenantModal.tsx  (group billing vs hotel toggles)
```

---

## 🔐 Roles & Permissions Per Hotel

| Role | Access Level |
|---|---|
| `hotel_owner` / `business_admin` | Full access to all modules in their hotel |
| `hotel_manager` | Full access except Superadmin settings |
| `front_desk` | Reservations, Check-in/out, Folio only |
| `housekeeping_staff` | Housekeeping board only |
| `restaurant_staff` | POS (restaurant + room service) only |
| `accountant` | Reports, GST, Night Audit, Corporate |

---

## ❓ Decisions Needed (Before Starting)

- [ ] **Phase shuru**: Kahan se start karein? Phase 0 (Superadmin Toggle) first, phir Phase 1+2?
- [ ] **OTA Integration**: OTA ke liye hotel credentials chahiye — pehle baaki modules complete karein?
- [ ] **Custom subdomain**: Har hotel ke liye alag subdomain ya single domain?
- [ ] **Mobile app**: Kya staff ke liye mobile-friendly PWA chahiye (housekeeping staff ke liye)?
- [ ] **Existing billing**: Pure hotel business ke liye billing modules completely hide karein ya optional rakhein?

---
*Last Updated: 2026-08-08 | Next review: After Phase 0 completion*
