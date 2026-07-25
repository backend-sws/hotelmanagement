# Phase 4 — Purchase Bill + Supplier Ledger + Outstanding
> **Duration:** Day 12 – Day 14
> **Goal:** Supplier side complete karo — Purchase Bills, ITC tracking, Supplier Ledger, Outstanding Report (customer + supplier dono).

---

## Day 12 — Backend: Purchase Bill + ITC Tracking

### ✅ Tasks

#### 12.1 Migrations

**Migration: Update `supplier_purchases` table**
```
Add columns:
+ invoice_type      ENUM(purchase_bill) DEFAULT 'purchase_bill'
+ bill_number       VARCHAR(50)  ← supplier's own bill number
+ bill_date         DATE
+ purchase_number   VARCHAR(50)  ← our internal number (PUR-001)
+ taxable_amount    DECIMAL(12,2) DEFAULT 0
+ cgst_amount       DECIMAL(12,2) DEFAULT 0
+ sgst_amount       DECIMAL(12,2) DEFAULT 0
+ igst_amount       DECIMAL(12,2) DEFAULT 0
+ total_tax_amount  DECIMAL(12,2) DEFAULT 0
+ due_date          DATE nullable
+ location_id       BIGINT FK nullable  ← which godown stock added to
+ notes             TEXT nullable
+ status            ENUM(draft, confirmed, paid, partial) DEFAULT 'confirmed'

(Already has: supplier_id, bill_amount, paid_amount, balance_amount, purchase_date)
```

**Migration: Create `supplier_purchase_items` update**
```
Table already exists. Add:
+ hsn_code     VARCHAR(10) nullable
+ unit         VARCHAR(20) nullable
+ gst_rate     DECIMAL(5,2) DEFAULT 0
+ cgst_amount  DECIMAL(12,2) DEFAULT 0
+ sgst_amount  DECIMAL(12,2) DEFAULT 0
+ igst_amount  DECIMAL(12,2) DEFAULT 0
+ taxable_amount DECIMAL(12,2) DEFAULT 0

(Already has: product_id, quantity, rate, total)
```

**Migration: Create `itc_ledger` (Input Tax Credit)**
```sql
id, business_id
purchase_id   BIGINT FK   ← supplier_purchases
month         VARCHAR(7)  ← YYYY-MM
cgst_amount   DECIMAL(12,2)
sgst_amount   DECIMAL(12,2)
igst_amount   DECIMAL(12,2)
total_itc     DECIMAL(12,2)
is_claimed    BOOLEAN DEFAULT false
claimed_at    TIMESTAMP nullable
```

**Migration: Create `ledger_entries`** (universal ledger table)
```sql
id, business_id
party_type    ENUM(customer, supplier)
party_id      BIGINT
entry_type    ENUM(invoice, payment, credit_note, debit_note, opening_balance, adjustment)
reference_type VARCHAR(50)  ← 'invoice', 'purchase', 'payment' etc.
reference_id  BIGINT
date          DATE
debit         DECIMAL(12,2) DEFAULT 0
credit        DECIMAL(12,2) DEFAULT 0
balance       DECIMAL(12,2) DEFAULT 0  ← running balance
narration     TEXT nullable
```

#### 12.2 `PurchaseController`

**File:** `backend/app/Http/Controllers/Api/Business/PurchaseController.php`

```
Methods:

index()
  - Filter: supplier, date_range, status
  - Return with supplier name, bill_amount, paid, balance

store()
  - invoice_type = 'purchase_bill'
  - PUR-001 numbering (via InvoiceNumberService)
  - Call GstCalculationService for tax amounts
  - DB Transaction:
    1. Create supplier_purchase record
    2. Create supplier_purchase_items (with HSN, GST)
    3. Add stock to inventory (per item)
    4. Create ITC ledger entry
    5. Create ledger_entry for supplier (credit)
    6. Log activity

show($id)
  - Full purchase with supplier info, items, payments, ITC

update($id)
  - Only draft status
  - Reverse stock, recalculate

recordPayment($id)
  - POST: amount, mode, date, reference
  - Update paid_amount, balance_amount
  - Create ledger_entry (debit on supplier)

itcSummary()
  - GET /purchases/itc-summary
  - Month-wise ITC breakdown
  - Claimed vs unclaimed

generatePdf($id)
  - Purchase bill PDF
```

#### 12.3 `LedgerController`

**File:** `backend/app/Services/LedgerService.php`

```php
class LedgerService
{
    // Create ledger entry
    public function createEntry(array $data): LedgerEntry

    // Get running balance for a party
    public function getBalance(string $partyType, int $partyId): float

    // Get statement (all entries for a party in date range)
    public function getStatement(string $partyType, int $partyId, Carbon $from, Carbon $to): Collection

    // Get outstanding amount (only unpaid/partial invoices)
    public function getOutstanding(string $partyType, int $partyId): float
}
```

**File:** `backend/app/Http/Controllers/Api/Business/LedgerController.php`

```
Methods:

customerStatement($customerId)
  - GET with date_range filter
  - Returns: entries list + opening balance + closing balance
  - Download as PDF (account statement format)

supplierStatement($supplierId)
  - Same as customer but for supplier

customerBalance($customerId)
  - Quick balance check

supplierBalance($supplierId)
  - Quick balance check
```

#### 12.4 `OutstandingController`

**File:** `backend/app/Http/Controllers/Api/Business/OutstandingController.php`

```
Methods:

customers()
  - All customers with outstanding > 0
  - With aging buckets:
    - current (0-30 days)
    - overdue_30 (31-60 days)
    - overdue_60 (61-90 days)
    - overdue_90 (90+ days)
  - Sort by: total outstanding, days overdue
  - Filter: customer, minimum amount, date range

suppliers()
  - Same but for supplier payables

summary()
  - Total customer receivable
  - Total supplier payable
  - Net position

sendReminder($partyId, $partyType)
  - Generate WhatsApp message with outstanding details
  - Return whatsapp_url
```

#### 12.5 Routes

```php
// Purchases
Route::get('purchases/itc-summary', [PurchaseController::class, 'itcSummary']);
Route::get('purchases/{id}/pdf', [PurchaseController::class, 'generatePdf']);
Route::post('purchases/{id}/payment', [PurchaseController::class, 'recordPayment']);
Route::apiResource('purchases', PurchaseController::class);

// Ledger
Route::get('ledger/customer/{id}', [LedgerController::class, 'customerStatement']);
Route::get('ledger/supplier/{id}', [LedgerController::class, 'supplierStatement']);
Route::get('ledger/customer/{id}/balance', [LedgerController::class, 'customerBalance']);
Route::get('ledger/supplier/{id}/balance', [LedgerController::class, 'supplierBalance']);
Route::get('ledger/customer/{id}/pdf', [LedgerController::class, 'customerStatementPdf']);
Route::get('ledger/supplier/{id}/pdf', [LedgerController::class, 'supplierStatementPdf']);

// Outstanding
Route::get('outstanding/customers', [OutstandingController::class, 'customers']);
Route::get('outstanding/suppliers', [OutstandingController::class, 'suppliers']);
Route::get('outstanding/summary', [OutstandingController::class, 'summary']);
Route::post('outstanding/reminder/{partyType}/{partyId}', [OutstandingController::class, 'sendReminder']);
```

---

## Day 13 — Backend: Ledger Integration + PDF Templates

### ✅ Tasks

#### 13.1 LedgerService Integration with Invoice Save

**Modify:** `InvoiceController::store()` and `PurchaseController::store()`

```
On Sales Invoice save:
  → LedgerService::createEntry({
      party_type: 'customer',
      party_id: customer_id,
      entry_type: 'invoice',
      reference_type: 'invoice',
      reference_id: invoice_id,
      debit: final_amount,  ← customer owes us
      credit: 0,
      date: invoice_date,
      narration: "Invoice #INV-001"
    })

On Payment received:
  → LedgerService::createEntry({
      entry_type: 'payment',
      credit: amount_received,
      narration: "Payment received via UPI"
    })

On Credit Note:
  → LedgerService::createEntry({
      entry_type: 'credit_note',
      credit: credit_note_amount,
    })
```

#### 13.2 Account Statement PDF Template

**File:** `backend/resources/views/pdfs/account_statement.blade.php`

```
Format:
┌─────────────────────────────────────────────────┐
│ ACCOUNT STATEMENT                               │
│ For: Suresh Builder                             │
│ Period: 01/04/2026 to 24/07/2026               │
├─────────────────────────────────────────────────┤
│ Opening Balance: ₹ 0.00                         │
├────────────┬──────────┬─────────┬──────┬────────┤
│ Date       │ Narration│ Invoice │ Dr   │ Cr     │ Balance│
├────────────┼──────────┼─────────┼──────┼────────┤
│ 01/05/2026 │ Invoice  │INV-001  │47,200│   -    │ 47,200 │
│ 05/05/2026 │ Payment  │ -       │  -   │ 20,000 │ 27,200 │
│ 10/06/2026 │ Invoice  │INV-015  │15,000│   -    │ 42,200 │
├────────────┴──────────┴─────────┴──────┴────────┤
│ Closing Balance: ₹ 42,200.00 (Dr)              │
│ (Amount to be received from party)              │
└─────────────────────────────────────────────────┘
```

#### 13.3 Outstanding PDF

**File:** `backend/resources/views/pdfs/outstanding_report.blade.php`

```
Age-wise outstanding table:
Party | 0-30 | 31-60 | 61-90 | 90+ | Total Outstanding
Color code: green → yellow → orange → red
```

---

## Day 14 — Frontend: Purchase, Ledger, Outstanding Pages

### ✅ Tasks

#### 14.1 Purchase Bill Pages

**New files:**
```
frontend/src/features/business/purchase/
  pages/
    PurchaseListPage.tsx
    NewPurchasePage.tsx
    PurchaseDetailPage.tsx
  components/
    PurchaseForm.tsx
  api/
    purchaseService.ts
```

**`NewPurchasePage.tsx`:**
```
Form sections:
- Supplier search (autocomplete)
- Supplier's bill number + bill date
- Our reference number (PUR-xxx, auto)
- Items table (same as invoice but purchase_rate)
- GST/ITC section:
  - Auto-calculate CGST/SGST
  - "ITC Eligible" toggle
- Payment:
  - Paid amount
  - Balance due
  - Due date
- Location: "Received at" (godown selector)
- Actions: Save | PDF | Record Payment
```

**`PurchaseListPage.tsx`:**
```
Table: PUR# | Bill# | Date | Supplier | Taxable | Tax | Total | Paid | Balance | Status
Tabs: All | Unpaid | Partially Paid | Paid
Stats: Total Purchases | Total ITC | Total Payable
```

#### 14.2 Customer Ledger Page

**New files:**
```
frontend/src/features/business/ledger/
  pages/
    CustomerLedgerPage.tsx
    SupplierLedgerPage.tsx
    LedgerDetailPage.tsx
  api/
    ledgerService.ts
```

**`CustomerLedgerPage.tsx`:**
```
Layout:
Left panel:
  - Customer list with search
  - Each customer shows: name, outstanding balance (color coded)

Right panel (on customer select):
  - Customer info: Name, Phone, GSTIN
  - Balance: ₹ XX,XXX (Dr/Cr)
  - Date range picker
  - Statement table:
    | Date | Type | Reference | Dr | Cr | Balance |
    | INV  | #001  | Invoice   |    |    |         |
  - Download PDF button
  - "Send Statement on WhatsApp" button
```

#### 14.3 Outstanding Report Page

**New files:**
```
frontend/src/features/business/outstanding/
  pages/
    OutstandingPage.tsx
  components/
    AgingTable.tsx
    OutstandingSummaryCards.tsx
    ReminderModal.tsx
  api/
    outstandingService.ts
```

**`OutstandingPage.tsx`:**
```
Tabs: Customer Receivables | Supplier Payables

Summary Cards:
  [Total Receivable: ₹X] [Total Payable: ₹X] [Net Position: ₹X]

Table:
  Party | Total Outstanding | 0-30 days | 31-60 | 61-90 | 90+ | Last Invoice | Action

Color coding:
  - 0-30: green
  - 31-60: yellow
  - 61-90: orange
  - 90+: red

Actions per row:
  - View Ledger
  - Send Reminder (WhatsApp link)
  - Record Payment (quick modal)

Bulk action:
  - Select multiple → Send Reminder to All
```

#### 14.4 Routes Update

```typescript
// Purchase
const NewPurchasePage = lazy(() => import('@/features/business/purchase/pages/NewPurchasePage'));
const PurchaseListPage = lazy(() => import('@/features/business/purchase/pages/PurchaseListPage'));
const PurchaseDetailPage = lazy(() => import('@/features/business/purchase/pages/PurchaseDetailPage'));

// Ledger
const CustomerLedgerPage = lazy(() => import('@/features/business/ledger/pages/CustomerLedgerPage'));
const SupplierLedgerPage = lazy(() => import('@/features/business/ledger/pages/SupplierLedgerPage'));

// Outstanding
const OutstandingPage = lazy(() => import('@/features/business/outstanding/pages/OutstandingPage'));

<Route path="/purchases" element={<BusinessRoute><PurchaseListPage /></BusinessRoute>} />
<Route path="/purchases/new" element={<BusinessRoute><NewPurchasePage /></BusinessRoute>} />
<Route path="/purchases/:id" element={<BusinessRoute><PurchaseDetailPage /></BusinessRoute>} />
<Route path="/ledger/customers" element={<BusinessRoute><CustomerLedgerPage /></BusinessRoute>} />
<Route path="/ledger/suppliers" element={<BusinessRoute><SupplierLedgerPage /></BusinessRoute>} />
<Route path="/outstanding" element={<BusinessRoute><OutstandingPage /></BusinessRoute>} />
```

---

## ✅ Phase 4 Done — Checklist

**Database:**
- [ ] supplier_purchases table updated (bill_number, GST fields, status)
- [ ] supplier_purchase_items updated (HSN, GST breakdown)
- [ ] itc_ledger table created
- [ ] ledger_entries table created

**Backend:**
- [ ] PurchaseController: CRUD + payment + ITC + PDF
- [ ] LedgerService: createEntry, getBalance, getStatement
- [ ] LedgerController: customer + supplier statement + PDF
- [ ] OutstandingController: customers + suppliers + aging + reminder
- [ ] LedgerService integrated in InvoiceController (auto-entry on invoice save)
- [ ] Account Statement PDF template
- [ ] Outstanding Report PDF template
- [ ] All routes added

**Frontend:**
- [ ] NewPurchasePage (full form with ITC tracking)
- [ ] PurchaseListPage (tabs + stats)
- [ ] PurchaseDetailPage
- [ ] CustomerLedgerPage (split-panel with statement)
- [ ] SupplierLedgerPage
- [ ] OutstandingPage (aging table + colors + reminder)
- [ ] purchaseService.ts + ledgerService.ts + outstandingService.ts
- [ ] Routes updated

---

## 🔗 Previous → [Phase 3](./phase-03-document-types.md) | Next → [Phase 5](./phase-05-cash-bank-cheques.md)
