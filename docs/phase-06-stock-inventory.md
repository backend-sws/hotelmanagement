# Phase 6 — Stock & Inventory (Summary, Transfer, Godowns, Barcode)
> **Duration:** Day 17 – Day 19
> **Goal:** Real-time stock management — stock summary, site-to-site transfer, multi-location godown, barcode system.

---

## Day 17 — Backend: Stock Transfer + Godown + Barcode

### ✅ Tasks

#### 17.1 Migrations

**Migration: Create `stock_transfers` table**
```sql
id, business_id
transfer_number  VARCHAR(50)    ← ST-001
from_location_id BIGINT FK (business_locations)
to_location_id   BIGINT FK (business_locations)
transfer_date    DATE
notes            TEXT nullable
status           ENUM(draft, completed, cancelled) DEFAULT 'completed'
transferred_by   BIGINT FK (users)
created_at, updated_at
```

**Migration: Create `stock_transfer_items` table**
```sql
id, stock_transfer_id
product_id   BIGINT FK
quantity     DECIMAL(10,3)
unit         VARCHAR(20)
notes        VARCHAR(255) nullable
```

**Migration: Update `inventory_movements` table**
```
Add:
+ location_id     BIGINT FK nullable   ← which godown
+ reference_type  update to include: transfer_in, transfer_out, material_consumption, opening
+ notes           TEXT nullable

Existing: product_id, type (in/out), quantity, reference_type, reference_id, created_at
```

**Migration: Update `products` table**
```
Add:
+ track_by_location  BOOLEAN DEFAULT false
  ← if true, separate stock per godown
```

**Migration: Create `product_stock_locations` (per-godown stock)**
```sql
id, business_id, product_id, location_id
quantity DECIMAL(10,3) DEFAULT 0
```

#### 17.2 `StockService` (Major Extend)

**File:** `backend/app/Services/StockService.php`

```php
class StockService
{
    // Add stock to product (on purchase, opening)
    public function addStock(int $productId, float $qty, string $referenceType, int $referenceId, ?int $locationId = null): void

    // Deduct stock from product (on invoice, challan, consumption)
    public function deductStock(int $productId, float $qty, string $referenceType, int $referenceId, ?int $locationId = null): void

    // Transfer stock between locations
    public function transfer(int $productId, float $qty, int $fromLocationId, int $toLocationId, int $transferId): void

    // Check if sufficient stock available
    public function checkAvailability(int $productId, float $qty, ?int $locationId = null): bool

    // Get stock at a specific location
    public function getStockAtLocation(int $productId, int $locationId): float

    // Get total stock across all locations
    public function getTotalStock(int $productId): float

    // Get stock summary (all products with quantities)
    public function getSummary(int $businessId, ?int $locationId = null): Collection

    // Get low stock items
    public function getLowStockItems(int $businessId): Collection
}
```

#### 17.3 `StockTransferController`

**File:** `backend/app/Http/Controllers/Api/Business/StockTransferController.php`

```
Methods:

index()
  - List transfers with from/to location names
  - Filter: date, location, product

store()
  - Validate: from_location, to_location, items
  - Check stock availability at from_location per item
  - DB Transaction:
    1. Create stock_transfer record (ST-001)
    2. Create stock_transfer_items
    3. Call StockService::transfer() for each item
  - Return transfer with slip data

show($id)
  - Full transfer with items, locations, quantities

generateSlip($id)
  - PDF: Transfer slip for physical record
```

#### 17.4 `StockSummaryController`

**File:** `backend/app/Http/Controllers/Api/Business/StockSummaryController.php`

```
Methods:

index()
  - GET /stock/summary
  - All products with:
    - Current quantity (total)
    - Per-location breakdown if track_by_location
    - min_stock_alert (highlight if below)
    - Last movement date
    - Average purchase rate, average sale rate
  - Filters: category, location, low_stock_only

locationWise()
  - GET /stock/location-wise
  - Each location → products + quantities

movements($productId)
  - GET /stock/movements/{product}
  - All in/out movements for a product
  - With reference (which invoice/purchase/transfer)
  - Date-wise running balance
```

#### 17.5 `BarcodeController`

**File:** `backend/app/Http/Controllers/Api/Business/BarcodeController.php`

```
Methods:

generate($productId)
  - Generate unique barcode for product
  - Save to products.barcode
  - Return barcode image (base64 PNG)
  - Uses: "picqer/php-barcode-generator" package

scan($barcode)
  - POST: {barcode: "1234567890"}
  - Return product info (name, rate, stock, unit)
  - Used by invoice form for quick scan-to-add
```

#### 17.6 Routes

```php
// Stock
Route::get('stock/summary', [StockSummaryController::class, 'index']);
Route::get('stock/location-wise', [StockSummaryController::class, 'locationWise']);
Route::get('stock/movements/{productId}', [StockSummaryController::class, 'movements']);
Route::get('stock/low-stock', [StockSummaryController::class, 'lowStock']);

// Stock Transfer
Route::get('stock-transfers/{id}/slip', [StockTransferController::class, 'generateSlip']);
Route::apiResource('stock-transfers', StockTransferController::class);

// Barcode
Route::post('barcode/generate/{productId}', [BarcodeController::class, 'generate']);
Route::post('barcode/scan', [BarcodeController::class, 'scan']);

// Update existing locations:
// business_locations already exists — just extend with location_type
```

---

## Day 18 — Frontend: Stock Summary + Stock Transfer Pages

### ✅ Tasks

#### 18.1 Stock Summary Page

**New files:**
```
frontend/src/features/business/stock/
  pages/
    StockSummaryPage.tsx
    StockMovementsPage.tsx
  components/
    StockTable.tsx
    LowStockAlert.tsx
    StockByLocationView.tsx
  api/
    stockService.ts
```

**`StockSummaryPage.tsx`:**
```
Header:
  [Total Items: 45] [Low Stock: 3] [Total Stock Value: ₹X,XX,XXX]

View Toggle: All Items | Low Stock Only | By Location

Filter: Category | Location (godown)

Table (All Items view):
  Item Name | Category | Unit | Current Stock | Min Alert | Last In | Last Out | Value | Status
  Status badge: ✅ OK | ⚠️ Low | 🚫 Out of Stock
  Row color: red if stock < min_alert

Table (By Location view):
  Item Name | Main Yard | Site A | Site B | Total
  Side-scrollable for many locations

Click on item → opens StockMovementsPage

"Export to Excel" button
```

**`StockMovementsPage.tsx`:**
```
Header: [Item Name] - Stock Ledger

Summary Cards: [Total In] [Total Out] [Current Stock]

Table: Date | Type | Reference | In | Out | Balance
  - Type: Purchase IN / Invoice OUT / Transfer IN / Transfer OUT / Opening
  - Reference: linked to invoice/purchase/transfer (clickable)
  - Running balance column

Date range filter
```

#### 18.2 Stock Transfer Page

**New files:**
```
frontend/src/features/business/stock/
  pages/
    StockTransferPage.tsx
    NewStockTransferPage.tsx
```

**`NewStockTransferPage.tsx`:**
```
Form:
- From Location (dropdown: Main Yard / Site A / etc.)
- To Location (dropdown)
- Transfer Date (default today)
- Notes

Items Table:
  | # | Item (search) | Available at Source | Transfer Qty | Unit |
  - Item search shows stock at selected from_location
  - Warning if qty > available
  - Add/Remove rows

Actions: Save | Print Transfer Slip
```

**`StockTransferPage.tsx`:**
```
List of all transfers:
ST# | Date | From → To | Items (count) | Transferred By | Actions
Click → view transfer details
"+ New Transfer" button
```

#### 18.3 Godown Management Update

**Modify:** Existing locations page or create new:
```
frontend/src/features/business/stock/pages/GodownPage.tsx

List of all locations with:
- Name | Type (Godown/Site/Yard) | Stock Items Count | Total Stock Value
- "View Stock" → goes to StockSummaryPage filtered by location
- Add / Edit / Delete location (extend existing LocationController)
```

---

## Day 19 — Frontend: Barcode + Low Stock + Integration

### ✅ Tasks

#### 19.1 Barcode Feature in Item Master

**Modify:** `frontend/src/features/business/inventory/components/AddProductForm.tsx`

```
Barcode section:
- Barcode input field
- "Generate Barcode" button → calls API → shows barcode image preview
- "Print Barcode" button → opens print dialog with barcode

Barcode display in Item list table:
- Small barcode icon if barcode assigned
- Click to view/print barcode
```

#### 19.2 Barcode Scanner in Invoice Form

**Modify:** `frontend/src/features/business/invoices/components/ItemSearchInput.tsx`

```
Add "Scan Barcode" button next to item search:
- Opens camera (mobile) or text input (desktop)
- On scan → call POST /barcode/scan → auto-add item to invoice
- Works for: Invoice, Purchase Bill, Challan, Delivery forms

Note: For desktop, use manual text entry of barcode number
      For mobile browser, use camera API (future enhancement)
```

#### 19.3 Low Stock Alert System

**New component:** `frontend/src/features/business/stock/components/LowStockBanner.tsx`

```
Global alert (appears in dashboard + stock page):
"⚠️ 3 items below minimum stock: [Gitti 20mm: 45 Ton], [OPC Cement: 12 Bag]..."
Click → goes to Stock Summary filtered to low stock

In Sidebar: Stock Summary menu item shows badge count
```

**Modify Dashboard:**
```
Add "Low Stock Alerts" widget to dashboard
```

#### 19.4 Routes Update (App.tsx)

```typescript
const StockSummaryPage = lazy(() => import('@/features/business/stock/pages/StockSummaryPage'));
const StockTransferPage = lazy(() => import('@/features/business/stock/pages/StockTransferPage'));
const NewStockTransferPage = lazy(() => import('@/features/business/stock/pages/NewStockTransferPage'));
const StockMovementsPage = lazy(() => import('@/features/business/stock/pages/StockMovementsPage'));
const GodownPage = lazy(() => import('@/features/business/stock/pages/GodownPage'));

<Route path="/stock/summary" element={<BusinessRoute><StockSummaryPage /></BusinessRoute>} />
<Route path="/stock/summary/:productId/movements" element={<BusinessRoute><StockMovementsPage /></BusinessRoute>} />
<Route path="/stock/transfer" element={<BusinessRoute><StockTransferPage /></BusinessRoute>} />
<Route path="/stock/transfer/new" element={<BusinessRoute><NewStockTransferPage /></BusinessRoute>} />
<Route path="/godowns" element={<BusinessRoute><GodownPage /></BusinessRoute>} />
```

---

## ✅ Phase 6 Done — Checklist

**Database:**
- [ ] stock_transfers table created
- [ ] stock_transfer_items table created
- [ ] inventory_movements updated (location_id, notes)
- [ ] products updated (track_by_location)
- [ ] product_stock_locations table created (per-godown stock)

**Backend:**
- [ ] StockService: major extension (add, deduct, transfer, availability check, location-wise)
- [ ] StockTransferController: CRUD + transfer slip PDF
- [ ] StockSummaryController: summary + location-wise + movements + low-stock
- [ ] BarcodeController: generate + scan
- [ ] Routes added
- [ ] picqer/php-barcode-generator package added

**Frontend:**
- [ ] StockSummaryPage (with low stock highlight + location filter)
- [ ] StockMovementsPage (running balance per item)
- [ ] NewStockTransferPage (form with from/to + items)
- [ ] StockTransferPage (list)
- [ ] GodownPage (extend existing locations)
- [ ] Barcode generate + print in Item form
- [ ] Barcode scan input in Invoice form
- [ ] LowStockBanner component (global alert)
- [ ] stockService.ts
- [ ] Routes updated

---

## 🔗 Previous → [Phase 5](./phase-05-cash-bank-cheques.md) | Next → [Phase 7](./phase-07-projects-sites.md)
