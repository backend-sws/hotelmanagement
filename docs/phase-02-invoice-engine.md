# Phase 2 — Core Invoice Engine (GST Sales Invoice)
> **Duration:** Day 4 – Day 7
> **Goal:** Full GST Sales Invoice system — create, save, PDF, WhatsApp share. Ye sabse important module hai — sab kuch iske upar depend karta hai.

---

## Day 4 — Backend: Invoice Database + Services

### ✅ Tasks

#### 4.1 Migrations

**Migration: Update `sales` table → Full Invoice Table**
```
File: database/migrations/XXXX_update_sales_for_gst_invoice.php

Add columns:
+ invoice_type       ENUM(sales_invoice, proforma, delivery_challan, 
                          quotation, credit_note, debit_note, purchase_bill)
                     DEFAULT 'sales_invoice'
+ tax_type           ENUM(gst, igst, none) DEFAULT 'gst'
+ cgst_amount        DECIMAL(12,2) DEFAULT 0
+ sgst_amount        DECIMAL(12,2) DEFAULT 0
+ igst_amount        DECIMAL(12,2) DEFAULT 0
+ total_tax_amount   DECIMAL(12,2) DEFAULT 0
+ taxable_amount     DECIMAL(12,2) DEFAULT 0
+ place_of_supply    VARCHAR(2) nullable  ← state code
+ due_date           DATE nullable
+ vehicle_number     VARCHAR(20) nullable ← for challan
+ driver_name        VARCHAR(100) nullable← for challan
+ project_id         BIGINT FK nullable
+ location_id        BIGINT FK nullable   ← godown/site
+ is_recurring       BOOLEAN DEFAULT false
+ recurring_freq     ENUM(weekly, monthly, quarterly) nullable
+ recurring_end_date DATE nullable
+ parent_id          BIGINT FK nullable   ← challan→invoice, proforma→invoice
+ converted_at       TIMESTAMP nullable   ← when parent was converted
+ reference_number   VARCHAR(50) nullable ← supplier bill no for purchase
+ terms_conditions   TEXT nullable
+ validity_date      DATE nullable        ← for quotation
+ narration          TEXT nullable
```

**Migration: Update `sale_items` table**
```
Add columns:
+ hsn_code     VARCHAR(10) nullable
+ unit         VARCHAR(20) nullable  (ton/cft/brass etc.)
+ gst_rate     DECIMAL(5,2) DEFAULT 0
+ taxable_amount DECIMAL(12,2) DEFAULT 0
+ cgst_amount  DECIMAL(12,2) DEFAULT 0
+ sgst_amount  DECIMAL(12,2) DEFAULT 0
+ igst_amount  DECIMAL(12,2) DEFAULT 0

Rename/modify:
~ quantity → keep as DECIMAL(10,3) instead of INT (for ton/cft)
~ price → rename to rate (DECIMAL(12,2))
~ total → rename to amount (DECIMAL(12,2))
```

#### 4.2 New Service: `GstCalculationService`

**File:** `backend/app/Services/GstCalculationService.php`

```php
class GstCalculationService
{
    // Determine if CGST+SGST or IGST based on business state vs customer state
    public function getTaxType(string $businessState, ?string $customerState): string
    {
        if (!$customerState || $businessState === $customerState) return 'gst';
        return 'igst';
    }

    // Calculate tax on a single item
    public function calculateItemTax(float $rate, float $qty, float $gstRate, string $taxType): array
    {
        $taxableAmount = $rate * $qty;
        $totalTax = $taxableAmount * ($gstRate / 100);
        return [
            'taxable_amount' => $taxableAmount,
            'cgst_amount'    => $taxType === 'gst' ? $totalTax / 2 : 0,
            'sgst_amount'    => $taxType === 'gst' ? $totalTax / 2 : 0,
            'igst_amount'    => $taxType === 'igst' ? $totalTax : 0,
            'total_tax'      => $totalTax,
            'total_amount'   => $taxableAmount + $totalTax,
        ];
    }

    // Calculate entire invoice
    public function calculateInvoice(array $items, string $taxType, float $discount = 0): array
    // Returns: taxable_total, cgst_total, sgst_total, igst_total, tax_total, grand_total
}
```

#### 4.3 New Service: `InvoiceNumberService`

**File:** `backend/app/Services/InvoiceNumberService.php`

```php
class InvoiceNumberService
{
    // Generate next invoice number for a business
    // Format: INV-001, INV-002 or custom prefix (e.g., BK-001)
    public function generate(int $businessId, string $type = 'sales_invoice'): string
    {
        // Prefix per type:
        // sales_invoice → INV
        // purchase_bill → PUR
        // delivery_challan → DC
        // proforma → PRO
        // quotation → QT
        // credit_note → CN
        // debit_note → DN
        
        // Find last invoice of this type for this business
        // Increment + zero-pad to 4 digits
        // Use DB lock to prevent race conditions
    }
}
```

---

## Day 5 — Backend: Invoice Controller (CRUD + PDF)

### ✅ Tasks

#### 5.1 New `InvoiceController`

**File:** `backend/app/Http/Controllers/Api/Business/InvoiceController.php`

```
Methods:

index()
  - Filter by: invoice_type, date_range, customer_id, status
  - Paginate 20 per page
  - Return: invoice_number, customer, total, tax, status, date, type

store()
  - Validate all fields
  - Call InvoiceNumberService::generate()
  - Call GstCalculationService::calculateInvoice()
  - DB Transaction:
    1. Create sale record
    2. Create sale_items (with HSN, GST breakdown)
    3. Update product stock (if sales_invoice or delivery_challan)
    4. Create customer ledger entry
    5. Log activity
  - Return created invoice with items

show($id)
  - Return full invoice with:
    - customer details (name, address, GSTIN, state)
    - business details (name, address, GSTIN, bank)
    - items (name, HSN, unit, qty, rate, GST breakdown)
    - payment summary
    - payment history

update($id)
  - Only allow if status = draft
  - Reverse previous stock changes, recalculate

destroy($id)
  - Only allow if status = draft or cancelled
  - Reverse stock if already invoiced

generatePdf($id)
  - Use existing dompdf setup
  - New template: GST Invoice PDF (Header, GSTIN, HSN table, tax summary, bank details, QR)

sendWhatsapp($id)
  - Return: whatsapp_url with PDF link pre-filled message

convert($id)
  - Convert proforma → invoice
  - Convert challan → invoice
  - Convert quotation → invoice/order
  - Set parent_id, converted_at on parent record
```

#### 5.2 Update Routes

**File:** `backend/routes/api.php`

```php
// In business middleware group:
Route::get('invoices/stats', [InvoiceController::class, 'stats']);
Route::post('invoices/{id}/convert', [InvoiceController::class, 'convert']);
Route::get('invoices/{id}/pdf', [InvoiceController::class, 'generatePdf']);
Route::get('invoices/{id}/whatsapp', [InvoiceController::class, 'sendWhatsapp']);
Route::apiResource('invoices', InvoiceController::class);

// Keep old sales route temporarily for backwards compat:
Route::apiResource('sales', SaleController::class); // keep existing
```

#### 5.3 GST Invoice PDF Template

**File:** `backend/resources/views/pdfs/gst_invoice.blade.php`

```
PDF Layout:
┌─────────────────────────────────────────────────┐
│ [BUSINESS LOGO]        TAX INVOICE              │
│ Business Name + Address + GSTIN                 │
├─────────────────────────────────────────────────┤
│ Invoice No: INV-001    Date: 24/07/2026         │
│ Customer: Suresh Builder                        │
│ Address: ...                                    │
│ GSTIN: ...  State: Bihar (10)                  │
├─────────────────────────────────────────────────┤
│ # │ Description │ HSN │ Qty │ Unit │Rate│Amount │
│ 1 │ Gitti 20mm  │1506 │ 50  │ Ton  │800 │40,000 │
├─────────────────────────────────────────────────┤
│ Taxable Amount:         ₹ 40,000               │
│ CGST @ 9%:              ₹  3,600               │
│ SGST @ 9%:              ₹  3,600               │
│ Total:                  ₹ 47,200               │
├─────────────────────────────────────────────────┤
│ Amount in Words: Forty Seven Thousand...        │
├─────────────────────────────────────────────────┤
│ Bank Details:                  │ [QR CODE]      │
│ A/C: ...  IFSC: ...           │                │
│ Terms: Payment within 30 days  │                │
└─────────────────────────────────────────────────┘
```

---

## Day 6 — Frontend: Invoice Form (New Invoice Page)

### ✅ Tasks

#### 6.1 New Invoice Page

**File:** `frontend/src/features/business/invoices/pages/NewInvoicePage.tsx`

```
Layout: Full page form with 4 sections

Section A — Invoice Header (top):
  - Invoice Type selector (Sales Invoice / Proforma / Challan / Quotation)
  - Invoice Number (auto-generated, editable)
  - Invoice Date (date picker)
  - Due Date (date picker)
  - Place of Supply (state dropdown)

Section B — Party Details (left column):
  - Customer search (autocomplete)
    → Show existing outstanding on select
    → "Add New Customer" quick button
  - Customer GSTIN (auto-fill from customer)
  - Customer State (auto-fill → determines CGST/IGST)

Section C — Items Table (main area):
  - Add Item row:
    | # | Item (search) | HSN | Qty | Unit | Rate | GST% | CGST | SGST | Amount |
  - Item search autocomplete:
    → Select → auto-fill HSN, unit, rate (from price list if customer has one), GST%
    → Manual edit allowed
  - Add Row button
  - Delete Row button

Section D — Summary (right column):
  - Subtotal (taxable amount)
  - Discount (₹ or %)
  - CGST total / SGST total / IGST total
  - Round off
  - Grand Total (bold)
  - Amount in words (auto)

Section E — Payment (bottom):
  - Received Amount
  - Payment Mode (Cash/UPI/NEFT/Cheque)
  - Balance Due

Section F — Notes:
  - Terms & Conditions (textarea)
  - Notes/Narration
  - Attach Photo (file upload)

Action Buttons:
  - Save as Draft
  - Save & Print PDF
  - Save & Share WhatsApp
```

#### 6.2 Invoice List Page

**File:** `frontend/src/features/business/invoices/pages/InvoicesListPage.tsx`

```
Features:
- Tabs: All | Sales Invoice | Proforma | Challan | Quotation | Credit Note
- Table: Invoice# | Date | Customer | Amount | Tax | Paid | Balance | Status | Actions
- Status badges: Draft / Confirmed / Paid / Partially Paid / Overdue / Cancelled
- Actions: View | PDF | WhatsApp | Edit | Cancel
- Filters: Date range, Customer, Status
- Stats cards: Total Invoiced | Total Collected | Outstanding | This Month
```

#### 6.3 Invoice Detail Page

**File:** `frontend/src/features/business/invoices/pages/InvoiceDetailPage.tsx`

```
Features:
- Full invoice display (same as PDF layout but web)
- Action bar: Edit | Print PDF | WhatsApp | Cancel | Record Payment
- Payment history tab
- Related documents (if this is parent/child of another invoice)
- "Convert to Invoice" button (if Proforma/Challan/Quotation)
```

#### 6.4 API Service Layer

**File:** `frontend/src/features/business/invoices/api/invoiceService.ts`

```typescript
export const invoiceService = {
  list: (params) => api.get('/business/invoices', { params }),
  get: (id) => api.get(`/business/invoices/${id}`),
  create: (data) => api.post('/business/invoices', data),
  update: (id, data) => api.put(`/business/invoices/${id}`, data),
  delete: (id) => api.delete(`/business/invoices/${id}`),
  getPdf: (id) => api.get(`/business/invoices/${id}/pdf`, { responseType: 'blob' }),
  getWhatsappUrl: (id) => api.get(`/business/invoices/${id}/whatsapp`),
  convert: (id, data) => api.post(`/business/invoices/${id}/convert`, data),
  stats: () => api.get('/business/invoices/stats'),
}
```

#### 6.5 Zustand Store

**File:** `frontend/src/features/business/invoices/store/invoiceStore.ts`

```typescript
interface InvoiceStore {
  draftItems: InvoiceItem[];
  customer: Customer | null;
  invoiceType: InvoiceType;
  taxType: 'gst' | 'igst';
  // Actions
  addItem, removeItem, updateItem
  setCustomer
  calculateTotals  // real-time GST calculation
  reset
}
```

---

## Day 7 — Frontend: Invoice Hooks + GST Calculator + Sidebar Update

### ✅ Tasks

#### 7.1 GST Calculation Hook

**File:** `frontend/src/features/business/invoices/hooks/useGstCalculation.ts`

```typescript
// Client-side GST calculator (mirrors backend service)
export function useGstCalculation(items, taxType, discount) {
  return useMemo(() => {
    // Calculate per-item CGST/SGST/IGST
    // Calculate invoice totals
    // Return breakdown object
  }, [items, taxType, discount]);
}
```

#### 7.2 Item Search Component

**File:** `frontend/src/features/business/invoices/components/ItemSearchInput.tsx`

```
Features:
- Debounced search (300ms)
- Shows: name, HSN, current stock, rate
- On select: auto-fill row with item data
- Applies price list rate if customer has price list
- "Low stock" warning if selecting item with low stock
```

#### 7.3 Customer Search Component

**File:** `frontend/src/features/business/invoices/components/CustomerSearchInput.tsx`

```
Features:
- Autocomplete from customer list
- On select: show current outstanding in info box
- GSTIN, state auto-populated
- "Add New" quick form (modal)
```

#### 7.4 Routes Update

**File:** `frontend/src/App.tsx`

```typescript
// Add new invoice routes:
const InvoiceNewPage = lazy(() => import('@/features/business/invoices/pages/NewInvoicePage'));
const InvoiceListPage = lazy(() => import('@/features/business/invoices/pages/InvoicesListPage'));
const InvoiceDetailPage = lazy(() => import('@/features/business/invoices/pages/InvoiceDetailPage'));

// Add routes:
<Route path="/invoices/new" element={<BusinessRoute><InvoiceNewPage /></BusinessRoute>} />
<Route path="/invoices" element={<BusinessRoute><InvoiceListPage /></BusinessRoute>} />
<Route path="/invoices/:id" element={<BusinessRoute><InvoiceDetailPage /></BusinessRoute>} />

// OLD POS route: redirect
<Route path="/pos" element={<Navigate to="/invoices/new" />} />
```

#### 7.5 Sidebar Navigation Update

**File:** `frontend/src/components/layout/AppSidebar.tsx` (ya jo sidebar file hai)

```
New sidebar structure:

🏠 Dashboard

📄 BILLING
  └─ New Invoice              /invoices/new
  └─ All Invoices             /invoices
  └─ Delivery Challan         /challans
  └─ Proforma Invoice         /proforma
  └─ Quotations               /quotations

🛍️ PURCHASES
  └─ Purchase Bills           /purchases

👥 PARTIES
  └─ Customers                /customers
  └─ Suppliers                /suppliers
  └─ Outstanding              /outstanding
  └─ Customer Ledger          /ledger/customers
  └─ Supplier Ledger          /ledger/suppliers

📦 INVENTORY
  └─ Item Master              /items
  └─ Stock Summary            /stock/summary
  └─ Stock Transfer           /stock/transfer
  └─ Godowns                  /godowns
  └─ Price Lists              /price-lists

🏗️ PROJECTS
  └─ Sites & Projects         /projects
  └─ Material Consumption     /projects/consumption

💰 ACCOUNTS
  └─ Cash/Bank Entry          /cashbook
  └─ Cheque Register          /cheques
  └─ Expenses                 /expenses

📊 REPORTS
  └─ GST Reports              /reports/gst
  └─ P&L Report               /reports/pl
  └─ Day Book                 /reports/daybook
  └─ Sales Report             /reports/sales
  └─ Balance Sheet            /reports/balance-sheet

👷 HR
  └─ Staff                    /staff
  └─ Attendance               /attendance
  └─ Payroll                  /payroll
  └─ Labour Payment           /labour
```

---

## ✅ Phase 2 Done — Checklist

- [ ] Migration: sales table updated (invoice_type, GST fields, due_date, project_id)
- [ ] Migration: sale_items table updated (HSN, unit, GST breakdown, DECIMAL qty)
- [ ] Service: GstCalculationService created
- [ ] Service: InvoiceNumberService created
- [ ] InvoiceController: all methods (index, store, show, update, destroy, pdf, whatsapp, convert)
- [ ] Routes: invoice routes added
- [ ] PDF Template: GST invoice blade template
- [ ] Frontend: NewInvoicePage — full form with items, GST calc, payment
- [ ] Frontend: InvoicesListPage — tabs, filters, stats
- [ ] Frontend: InvoiceDetailPage — view + actions
- [ ] Frontend: invoiceService.ts API layer
- [ ] Frontend: invoiceStore.ts Zustand store
- [ ] Frontend: useGstCalculation hook
- [ ] Frontend: ItemSearchInput component
- [ ] Frontend: CustomerSearchInput component
- [ ] Frontend: Routes updated (new invoice routes, pos redirect)
- [ ] Frontend: Sidebar restructured

---

## 🔗 Previous → [Phase 1](./phase-01-foundation.md) | Next → [Phase 3](./phase-03-document-types.md)
