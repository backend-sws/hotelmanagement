# Phase 3 — Document Types (Challan, Proforma, Quotation, Credit Note)
> **Duration:** Day 8 – Day 11
> **Goal:** Phase 2 ke invoice engine ke upar baaki document types build karo. Sab Phase 2 ka hi extension hain — alag UI pages + conversion logic.

---

## Day 8 — Backend: Delivery Challan + Conversion Logic

### ✅ Tasks

#### 8.1 `ChallanController`

**File:** `backend/app/Http/Controllers/Api/Business/ChallanController.php`

```
Methods:

index()
  - Filter by: status (open/converted/cancelled), customer, date
  - Return list with truck/driver info

store()
  - invoice_type = 'delivery_challan'
  - Validate: vehicle_number, driver_name (optional but useful)
  - Stock deduct on save (maal godown se gaya)
  - DC number auto-generate (DC-001, DC-002...)

show($id)
  - Full challan with truck slip data

generateTruckSlip($id)
  - PDF: compact format for driver
  - Contains: DC number, date, customer, material, qty, vehicle#, driver

convert($id, Request $request)
  - Convert one or multiple challans to one invoice
  - $request->challan_ids = [1, 2, 3] (multiple challans to one invoice)
  - Merge all items from selected challans
  - Create new invoice, link parent_id on all challans
  - Mark challans as 'converted'
  - Stock NOT deducted again (already deducted on challan save)

pendingChallans()
  - GET: List of unconverted challans (for invoice creation)
  - Filter by customer
```

#### 8.2 Stock Deduction Service Extension

**File:** `backend/app/Services/StockService.php` (extend existing)

```php
// Add method:
public function deductOnChallan(Sale $challan): void
{
    foreach ($challan->items as $item) {
        // Decrement product quantity
        // Create inventory_movement (type = out, reference_type = challan)
    }
}

public function reverseOnChallanCancellation(Sale $challan): void
{
    // Add stock back if challan cancelled
}
```

#### 8.3 Routes

```php
// In business group:
Route::get('challans/pending', [ChallanController::class, 'pendingChallans']);
Route::get('challans/{id}/truck-slip', [ChallanController::class, 'generateTruckSlip']);
Route::post('challans/{id}/convert', [ChallanController::class, 'convert']);
Route::apiResource('challans', ChallanController::class);
```

#### 8.4 Truck Slip PDF Template

**File:** `backend/resources/views/pdfs/truck_slip.blade.php`

```
Compact format (half A4 or thermal):
┌─────────────────────────────┐
│ DELIVERY CHALLAN - DC-001   │
│ Date: 24/07/2026            │
├─────────────────────────────┤
│ From: Ram Gitti Supplier    │
│ To:   Suresh Builder        │
│ Site: Boring Road, Patna    │
├─────────────────────────────┤
│ Material: Gitti 20mm        │
│ Quantity: 50 Ton            │
├─────────────────────────────┤
│ Vehicle: BR-01-AA-1234      │
│ Driver:  Ramesh Kumar       │
├─────────────────────────────┤
│ Authorized Signature        │
└─────────────────────────────┘
```

---

## Day 9 — Backend: Proforma + Quotation + Credit/Debit Note

### ✅ Tasks

#### 9.1 `ProformaController`

**File:** `backend/app/Http/Controllers/Api/Business/ProformaController.php`

```
Methods:

store()
  - invoice_type = 'proforma'
  - PRO-001 numbering
  - NO stock change
  - NO ledger entry
  - validity_date optional

convert($id)
  - Convert proforma → real sales invoice
  - Copy all items, customer, amounts
  - New invoice_number (INV-xxx)
  - Set parent_id = proforma id
  - Mark proforma as 'converted'

index() / show() / update() / destroy()
  - Standard CRUD
```

#### 9.2 `QuotationController`

**File:** `backend/app/Http/Controllers/Api/Business/QuotationController.php`

```
Methods:

store()
  - invoice_type = 'quotation'
  - QT-001 numbering
  - terms_conditions field
  - validity_date (default 30 days)
  - NO stock, NO ledger

convert($id, $type)
  - $type = 'invoice' → create sales invoice
  - $type = 'order'   → mark as accepted (future work order)
  - Copy all data, set parent_id

status update
  - PATCH /quotations/{id}/status
  - Statuses: draft, sent, accepted, rejected, expired
```

#### 9.3 `CreditNoteController` + `DebitNoteController`

**File:** `backend/app/Http/Controllers/Api/Business/CreditNoteController.php`

```
store()
  - invoice_type = 'credit_note'
  - CN-001 numbering
  - Linked to original invoice (parent_id)
  - reason field (damaged/wrong_item/rate_correction/return)
  - Items: what is being returned + quantity
  - On save:
    1. Reduce customer outstanding (ledger credit entry)
    2. Add returned stock back to inventory
    3. GST adjustment (credit)

store() for Debit Note
  - invoice_type = 'debit_note'
  - DN-001 numbering
  - Linked to original purchase bill
  - Supplier balance adjust
```

#### 9.4 Routes

```php
// Proforma
Route::post('proforma/{id}/convert', [ProformaController::class, 'convert']);
Route::apiResource('proforma', ProformaController::class);

// Quotations
Route::patch('quotations/{id}/status', [QuotationController::class, 'updateStatus']);
Route::post('quotations/{id}/convert', [QuotationController::class, 'convert']);
Route::apiResource('quotations', QuotationController::class);

// Credit/Debit Notes
Route::apiResource('credit-notes', CreditNoteController::class);
Route::apiResource('debit-notes', DebitNoteController::class);
```

---

## Day 10 — Frontend: Challan + Proforma Pages

### ✅ Tasks

#### 10.1 Delivery Challan Pages

**New files:**
```
frontend/src/features/business/challan/
  pages/
    ChallanListPage.tsx
    NewChallanPage.tsx
    ChallanDetailPage.tsx
  components/
    ChallanForm.tsx
    TruckDetailsForm.tsx
    ConvertToChallanModal.tsx  ← Select challans to merge into invoice
  api/
    challanService.ts
```

**`NewChallanPage.tsx` — Form:**
```
Similar to Invoice form BUT:
- Add "Transport Details" section:
  - Vehicle/Truck Number
  - Driver Name
  - Driver Phone (optional)
  - Weighbridge Slip Number (optional)
- Remove: GST summary (challan doesn't show GST)
- Remove: Payment received section
- Add: "Site Address" for delivery
- Actions: Save | Print Truck Slip | Convert to Invoice
```

**`ChallanListPage.tsx`:**
```
Tabs: All | Pending (not converted) | Converted | Cancelled
Table: DC# | Date | Customer | Items Summary | Vehicle | Status | Actions
Actions: View | Truck Slip PDF | Convert to Invoice | Cancel

"Pending Challans" badge count in sidebar
```

**`ConvertToChallanModal.tsx`:**
```
Trigger: "Convert to Invoice" button on challan list
Modal flow:
1. Select one or multiple challans (same customer filter)
2. Preview merged items
3. Add any additional charges
4. Generate Invoice button → opens NewInvoicePage prefilled
```

#### 10.2 Proforma Invoice Pages

**New files:**
```
frontend/src/features/business/invoices/pages/
  ProformaListPage.tsx
  NewProformaPage.tsx   ← Reuse InvoiceForm with type=proforma
```

**`ProformaListPage.tsx`:**
```
Table: PRO# | Date | Customer | Amount | Validity | Status | Actions
Status: Draft | Sent | Converted | Expired
Actions: View | PDF | WhatsApp | Convert to Invoice | Edit | Delete
```

**`NewProformaPage.tsx`:**
```
Same as NewInvoicePage with:
- Title: "Proforma Invoice"
- Validity date field added
- Note: "No GST registration / no stock effect" info banner
- Actions: Save | PDF | WhatsApp | Save & Convert to Invoice
```

---

## Day 11 — Frontend: Quotation + Credit Note Pages

### ✅ Tasks

#### 11.1 Quotation Pages

**New files:**
```
frontend/src/features/business/quotations/
  pages/
    QuotationListPage.tsx
    NewQuotationPage.tsx
    QuotationDetailPage.tsx
  api/
    quotationService.ts
```

**`NewQuotationPage.tsx`:**
```
Unique features vs Invoice:
- Title: "Quotation / Estimate"
- Validity date (default +30 days)
- Terms & Conditions text area (rich)
- Optional: breakdown without GST (for B2C estimate)
- Section for labour charges (separate line items)
- Actions: Save | PDF | WhatsApp | Mark Sent | Convert to Invoice
```

**`QuotationDetailPage.tsx`:**
```
Status timeline: Created → Sent → Accepted/Rejected
If accepted → "Convert to Invoice" prominent button
If rejected → "Reason" field, option to revise
```

#### 11.2 Credit Note + Debit Note Pages

**New files:**
```
frontend/src/features/business/invoices/pages/
  CreditNoteListPage.tsx
  NewCreditNotePage.tsx
  DebitNoteListPage.tsx
  NewDebitNotePage.tsx
```

**`NewCreditNotePage.tsx`:**
```
Form:
- Search original invoice (link field)
- Auto-fill customer from invoice
- Items table: select items from original + return qty
- Reason dropdown: Damaged | Wrong Item | Rate Correction | Partial Return | Other
- Auto-calculate: refund amount + GST reversal
- Action: Save → Customer ledger auto-updated
```

#### 11.3 Routes Update (App.tsx)

```typescript
// Add all document type routes:
const ChallanListPage = lazy(() => import('@/features/business/challan/pages/ChallanListPage'));
const NewChallanPage = lazy(() => import('@/features/business/challan/pages/NewChallanPage'));
const ChallanDetailPage = lazy(() => import('@/features/business/challan/pages/ChallanDetailPage'));
const ProformaListPage = lazy(() => import('@/features/business/invoices/pages/ProformaListPage'));
const NewProformaPage = lazy(() => import('@/features/business/invoices/pages/NewProformaPage'));
const QuotationListPage = lazy(() => import('@/features/business/quotations/pages/QuotationListPage'));
const NewQuotationPage = lazy(() => import('@/features/business/quotations/pages/NewQuotationPage'));
const CreditNoteListPage = lazy(() => import('@/features/business/invoices/pages/CreditNoteListPage'));
const NewCreditNotePage = lazy(() => import('@/features/business/invoices/pages/NewCreditNotePage'));

// Routes:
<Route path="/challans" element={<BusinessRoute><ChallanListPage /></BusinessRoute>} />
<Route path="/challans/new" element={<BusinessRoute><NewChallanPage /></BusinessRoute>} />
<Route path="/challans/:id" element={<BusinessRoute><ChallanDetailPage /></BusinessRoute>} />
<Route path="/proforma" element={<BusinessRoute><ProformaListPage /></BusinessRoute>} />
<Route path="/proforma/new" element={<BusinessRoute><NewProformaPage /></BusinessRoute>} />
<Route path="/quotations" element={<BusinessRoute><QuotationListPage /></BusinessRoute>} />
<Route path="/quotations/new" element={<BusinessRoute><NewQuotationPage /></BusinessRoute>} />
<Route path="/credit-notes" element={<BusinessRoute><CreditNoteListPage /></BusinessRoute>} />
<Route path="/credit-notes/new" element={<BusinessRoute><NewCreditNotePage /></BusinessRoute>} />
```

---

## ✅ Phase 3 Done — Checklist

**Delivery Challan:**
- [ ] Backend: ChallanController (CRUD + truck slip PDF + convert)
- [ ] Backend: StockService extension (deduct on challan)
- [ ] Backend: Truck slip PDF blade template
- [ ] Backend: Challan routes
- [ ] Frontend: ChallanListPage (tabs + pending badge)
- [ ] Frontend: NewChallanPage (with transport details)
- [ ] Frontend: ChallanDetailPage
- [ ] Frontend: ConvertToChallanModal (multi-challan merge)

**Proforma Invoice:**
- [ ] Backend: ProformaController (CRUD + convert)
- [ ] Backend: Proforma routes
- [ ] Frontend: ProformaListPage
- [ ] Frontend: NewProformaPage

**Quotation:**
- [ ] Backend: QuotationController (CRUD + status + convert)
- [ ] Backend: Quotation routes
- [ ] Frontend: QuotationListPage (with status timeline)
- [ ] Frontend: NewQuotationPage

**Credit/Debit Note:**
- [ ] Backend: CreditNoteController (with stock restore + ledger adjust)
- [ ] Backend: DebitNoteController
- [ ] Backend: Routes
- [ ] Frontend: NewCreditNotePage (with invoice link)
- [ ] Frontend: CreditNoteListPage

**Routes:**
- [ ] App.tsx updated with all new routes

---

## 🔗 Previous → [Phase 2](./phase-02-invoice-engine.md) | Next → [Phase 4](./phase-04-purchase-supplier.md)
