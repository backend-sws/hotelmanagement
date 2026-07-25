# Phase 8 — Reports & GST (GSTR-1, P&L, Day Book, Balance Sheet, Sales Report)
> **Duration:** Day 24 – Day 27
> **Goal:** Saare major reports complete karo — GST filing data, financial reports (P&L, Balance Sheet), Day Book, aur business analytics.

---

## Day 24 — Backend: GST Reports + GSTR Data

### ✅ Tasks

#### 24.1 `GstReportController`

**File:** `backend/app/Http/Controllers/Api/Business/GstReportController.php`

```
Methods:

gstr1($month, $year)
  - GET /reports/gst/gstr1?month=07&year=2026
  - GSTR-1 = Outward Supplies (Sales Invoice data)

  Response structure:
  {
    b2b: [          ← B2B sales (GST registered customers)
      { gstin, invoice_no, date, taxable, igst, cgst, sgst, cess }
    ],
    b2c_large: [    ← B2C sales > ₹2.5 lakh (unregistered, state-wise)
      { state_code, taxable, igst, cgst, sgst }
    ],
    b2c_small: [    ← B2C sales < ₹2.5 lakh (consolidated)
      { taxable, igst, cgst, sgst }
    ],
    credit_notes: [ ← CDN (Credit/Debit Notes issued)
      { gstin, cn_number, date, type, taxable, igst, cgst, sgst }
    ],
    hsn_summary: [  ← HSN-wise summary (mandatory)
      { hsn_code, description, unit, total_qty, taxable, igst, cgst, sgst }
    ],
    summary: {
      total_taxable, total_cgst, total_sgst, total_igst, total_tax, grand_total
    }
  }

gstr3b($month, $year)
  - GET /reports/gst/gstr3b?month=07&year=2026
  - GSTR-3B = Monthly return summary

  Response:
  {
    table31: {      ← Outward taxable supplies
      taxable_inter_state, taxable_intra_state,
      tax_inter_state_igst, tax_intra_cgst, tax_intra_sgst
    },
    table4: {       ← ITC (Input Tax Credit)
      itc_igst, itc_cgst, itc_sgst
    },
    liability: {    ← Net tax liability
      igst_liability, cgst_liability, sgst_liability,
      itc_adjusted_igst, itc_adjusted_cgst, itc_adjusted_sgst,
      net_igst, net_cgst, net_sgst, total_payable
    }
  }

hsnSummary($month, $year)
  - HSN code wise quantity + tax summary
  - Used for HSN Annex in GSTR-1

downloadExcel($type, $month, $year)
  - POST /reports/gst/download
  - type: gstr1, gstr3b, hsn
  - Returns: downloadable Excel file
  - Format: compatible with GST portal upload

taxLiabilitySummary($financial_year)
  - Month-wise tax liability for full year
  - Shows ITC vs liability

itcReport($month, $year)
  - Input Tax Credit available this month
  - From purchase bills (supplier GST invoices)
  - Claimed vs pending
```

#### 24.2 `GstCalculationService` Extension

**File:** `backend/app/Services/GstCalculationService.php` (extend from Phase 2)

```php
// Add methods:

// Get all outward supplies for GSTR-1
public function getOutwardSupplies(int $businessId, int $month, int $year): array

// Categorize: B2B vs B2C based on customer GSTIN
public function categorizeSupply(Sale $invoice): string  // b2b, b2c_large, b2c_small

// Build HSN summary from invoice items
public function buildHsnSummary(int $businessId, int $month, int $year): array

// Get ITC from purchase bills
public function getItcAvailable(int $businessId, int $month, int $year): array
```

#### 24.3 GST Report Routes

```php
Route::prefix('reports')->group(function () {
    // GST Reports
    Route::get('gst/gstr1', [GstReportController::class, 'gstr1']);
    Route::get('gst/gstr3b', [GstReportController::class, 'gstr3b']);
    Route::get('gst/hsn-summary', [GstReportController::class, 'hsnSummary']);
    Route::get('gst/itc', [GstReportController::class, 'itcReport']);
    Route::get('gst/tax-liability', [GstReportController::class, 'taxLiabilitySummary']);
    Route::post('gst/download', [GstReportController::class, 'downloadExcel']);
});
```

---

## Day 25 — Backend: P&L + Balance Sheet + Day Book

### ✅ Tasks

#### 25.1 `ProfitLossController`

**File:** `backend/app/Http/Controllers/Api/Business/ProfitLossController.php`

```
Methods:

report($from, $to)
  - GET /reports/pl?from=2026-04-01&to=2026-07-24

  Calculation:
  REVENUE:
    Total Sales (all confirmed invoices in period)
    Less: Credit Notes issued
    Net Revenue

  COST OF GOODS:
    Total Purchase Bills (in period)
    Opening Stock Value
    Closing Stock Value
    Cost of Goods Sold (COGS) = Opening + Purchase - Closing

  GROSS PROFIT = Net Revenue - COGS

  EXPENSES (from expenses table):
    Labour: ₹ XX,XXX
    Transport: ₹ XX,XXX
    Fuel: ₹ XX,XXX
    Office: ₹ XX,XXX
    Other: ₹ XX,XXX
    Total Expenses

  NET PROFIT = Gross Profit - Total Expenses

  GST INFO (not part of P&L but useful):
    Tax Collected (GST on sales)
    ITC Available (GST on purchases)
    Net GST Liability

projectWise($from, $to)
  - P&L broken down per project
  - Each project: revenue, material cost, labour, expenses, profit

monthWise($year)
  - Month-wise P&L for the year
  - For chart data

categoryWise($from, $to)
  - Expense breakdown by category
```

#### 25.2 `BalanceSheetController`

**File:** `backend/app/Http/Controllers/Api/Business/BalanceSheetController.php`

```
Methods:

report($date)
  - GET /reports/balance-sheet?date=2026-07-24

  ASSETS:
    Current Assets:
      Cash in Hand (from cash_bank_entries balance)
      Bank Balance (sum of all bank accounts)
      Accounts Receivable (total customer outstanding)
      Stock Value (current stock × purchase_rate)
    Fixed Assets:
      (User-defined — editable fields for now)
    TOTAL ASSETS

  LIABILITIES:
    Current Liabilities:
      Accounts Payable (total supplier outstanding)
      GST Payable (collected - ITC)
    Long-term Liabilities:
      (User-defined)
    TOTAL LIABILITIES

  EQUITY:
    Capital (user input)
    Retained Earnings (cumulative P&L)
    TOTAL EQUITY

  Balance Check: Assets = Liabilities + Equity
```

#### 25.3 `DayBookController`

**File:** `backend/app/Http/Controllers/Api/Business/DayBookController.php`

```
Methods:

report($date)
  - GET /reports/day-book?date=2026-07-24
  
  Returns ALL transactions of the day:
    Sales Invoices created
    Purchase Bills entered
    Payments received (from customers)
    Payments made (to suppliers)
    Cash/Bank entries
    Expenses recorded
    Credit/Debit notes
  
  Summary:
    Opening Cash Balance: ₹ X
    Cash Received today: ₹ X
    Cash Paid today: ₹ X
    Closing Cash Balance: ₹ X
    
    Total Sales today: ₹ X
    Total Purchase today: ₹ X

  Generate PDF for day book
```

#### 25.4 `SalesReportController`

**File:** `backend/app/Http/Controllers/Api/Business/SalesReportController.php`

```
Methods:

summary($from, $to)
  - Total sales, by date range
  - Filters: customer_id, item_id, category_id

partyWise($from, $to)
  - Sales grouped by customer
  - Customer name | Total Sales | Total Tax | Invoices Count

itemWise($from, $to)
  - Sales grouped by item/product
  - Item | Qty Sold | Unit | Revenue | Tax | Net

categoryWise($from, $to)
  - Sales grouped by item category

dayWise($month, $year)
  - Daily sales for a month (for bar chart)

topCustomers($from, $to, $limit = 10)
  - Top N customers by purchase value

downloadExcel($type, $from, $to)
  - Export any of the above as Excel
```

#### 25.5 All Report Routes

```php
Route::prefix('reports')->group(function () {
    // P&L
    Route::get('pl', [ProfitLossController::class, 'report']);
    Route::get('pl/project-wise', [ProfitLossController::class, 'projectWise']);
    Route::get('pl/month-wise', [ProfitLossController::class, 'monthWise']);
    Route::get('pl/category-wise', [ProfitLossController::class, 'categoryWise']);
    Route::get('pl/pdf', [ProfitLossController::class, 'generatePdf']);

    // Balance Sheet
    Route::get('balance-sheet', [BalanceSheetController::class, 'report']);
    Route::get('balance-sheet/pdf', [BalanceSheetController::class, 'generatePdf']);

    // Day Book
    Route::get('day-book', [DayBookController::class, 'report']);
    Route::get('day-book/pdf', [DayBookController::class, 'generatePdf']);

    // Sales Report
    Route::get('sales/summary', [SalesReportController::class, 'summary']);
    Route::get('sales/party-wise', [SalesReportController::class, 'partyWise']);
    Route::get('sales/item-wise', [SalesReportController::class, 'itemWise']);
    Route::get('sales/category-wise', [SalesReportController::class, 'categoryWise']);
    Route::get('sales/day-wise', [SalesReportController::class, 'dayWise']);
    Route::get('sales/top-customers', [SalesReportController::class, 'topCustomers']);
    Route::post('sales/download', [SalesReportController::class, 'downloadExcel']);
});
```

---

## Day 26 — Frontend: GST Reports Page

### ✅ Tasks

#### 26.1 GST Reports Pages

**New files:**
```
frontend/src/features/business/gst-reports/
  pages/
    GstReportsPage.tsx
  components/
    Gstr1Table.tsx
    Gstr3bTable.tsx
    HsnSummaryTable.tsx
    ItcReportTable.tsx
    TaxLiabilityChart.tsx
  api/
    gstReportService.ts
```

**`GstReportsPage.tsx`:**
```
Month/Year picker (top)

Tabs: GSTR-1 | GSTR-3B | HSN Summary | ITC Report | Tax Liability

─── GSTR-1 Tab ───
  Sub-tabs: B2B Sales | B2C Sales | Credit Notes | HSN Summary

  B2B Sales table:
    GSTIN | Invoice# | Date | Taxable | IGST | CGST | SGST | Total
    
  B2C summary:
    State | Taxable | IGST (inter-state) | CGST+SGST (intra)
    
  Summary card:
    Total Taxable: ₹ X
    Total Tax: ₹ X
    Grand Total: ₹ X
  
  Actions: Download JSON (for GST portal) | Download Excel | Print

─── GSTR-3B Tab ───
  Table 3.1 — Outward Supplies:
    Nature | Taxable Value | IGST | CGST | SGST
    
  Table 4 — ITC Available:
    Category | IGST | CGST | SGST
    
  Tax Liability Summary:
    Gross Liability | ITC Adjusted | Net Payable
  
  Action: Download | Print | "Share with CA" (WhatsApp)

─── ITC Report Tab ───
  Month | Purchase Bills | IGST | CGST | SGST | Total ITC | Claimed | Pending
  
─── Tax Liability Chart ───
  Bar chart: Monthly Tax Collected vs ITC vs Net Payable
```

---

## Day 27 — Frontend: P&L + Balance Sheet + Day Book + Sales Report

### ✅ Tasks

#### 27.1 P&L Report Page

**New files:**
```
frontend/src/features/business/reports/
  pages/
    ProfitLossPage.tsx
    BalanceSheetPage.tsx
    DayBookPage.tsx   ← Move from cashbook
    SalesReportPage.tsx
  api/
    reportService.ts
```

**`ProfitLossPage.tsx`:**
```
Date range picker (default: current month)

View Toggle: Summary | Project-wise | Month-wise

─── Summary View ───
  INCOME STATEMENT style cards:

  ┌─ REVENUE ─────────────────────────────────┐
  │ Gross Sales:               ₹ 5,20,000     │
  │ Less: Credit Notes:        ₹   8,000      │
  │ Net Revenue:               ₹ 5,12,000     │
  └───────────────────────────────────────────┘
  ┌─ COST OF GOODS ────────────────────────────┐
  │ Opening Stock:             ₹ 85,000        │
  │ Purchases:                 ₹ 2,10,000      │
  │ Less: Closing Stock:       ₹ 75,000        │
  │ Cost of Goods Sold:        ₹ 2,20,000      │
  └────────────────────────────────────────────┘
  ┌─ GROSS PROFIT ─────────────────────────────┐
  │                            ₹ 2,92,000 (57%)│
  └────────────────────────────────────────────┘
  ┌─ EXPENSES ─────────────────────────────────┐
  │ Labour:                    ₹  45,000       │
  │ Transport:                 ₹  12,000       │
  │ Fuel:                      ₹   8,000       │
  │ Office:                    ₹   5,000       │
  │ Total Expenses:            ₹  70,000       │
  └────────────────────────────────────────────┘
  ┌─ NET PROFIT ───────────────────────────────┐
  │                ₹ 2,22,000 (43.4%)          │
  │ [████████████████░░░░] Profit bar          │
  └────────────────────────────────────────────┘

  Actions: Download PDF | Share with CA (WhatsApp)

─── Project-wise tab ───
  Project | Revenue | Material | Labour | Expenses | Profit | Margin%

─── Month-wise tab ───
  Bar chart: Revenue vs Expenses per month
  Table: Month | Revenue | Purchases | Expenses | Profit
```

**`BalanceSheetPage.tsx`:**
```
Date picker (default: today)

Two-column layout:

LEFT — ASSETS                   RIGHT — LIABILITIES
─────────────────               ──────────────────────────
Current Assets:                 Current Liabilities:
  Cash in Hand: ₹X              Accounts Payable: ₹X
  Bank Balance: ₹X              GST Payable: ₹X
  Receivables: ₹X               
  Stock Value: ₹X               Long-term Liabilities:
                                 (manual entries)
Fixed Assets:
  (manual entries)              EQUITY:
                                 Capital: ₹X
                                 Retained Earnings: ₹X

TOTAL ASSETS: ₹X               TOTAL LIABILITIES + EQUITY: ₹X

Balance Status: ✅ Balanced / ⚠️ Out of balance

Note: "Manual adjustments needed for Fixed Assets & Capital"

Actions: Download PDF | Print
```

**`SalesReportPage.tsx`:**
```
Date range filter + quick: Today/Week/Month/Quarter/Year

Tabs: Summary | By Customer | By Item | By Category

─── Summary tab ───
  Stats cards: Total Invoices | Total Amount | Average Invoice | Total Tax Collected
  Bar chart: Daily sales for selected period

─── By Customer tab ───
  Table: Customer | Invoices | Taxable | Tax | Total | Paid | Outstanding
  Sort: by total, by outstanding
  Export Excel

─── By Item tab ───
  Table: Item | Unit | Total Qty | Revenue | Avg Rate
  "Top Sellers" highlight

─── By Category tab ───
  Donut chart + table
  Category | Sales Amount | % of total
  
Actions: Export Excel | Print
```

**`DayBookPage.tsx`** (from Phase 5 cashbook, move here):
```
Date picker

Morning Summary: Opening Cash Balance: ₹ X,XXX

Transactions timeline (grouped by type):
  📄 INVOICES CREATED (4):
    INV-045 | Suresh Builder | ₹ 47,200
    INV-046 | Ramesh Contractor | ₹ 23,600

  💰 PAYMENTS RECEIVED (2):
    Suresh Builder → ₹ 20,000 (UPI)
    Sharma Construction → ₹ 15,000 (Cash)

  🛒 PURCHASES ENTERED (1):
    Mahavir Gitti Depot → PUR-012 → ₹ 85,000

  💸 EXPENSES (3):
    Labour Wages → ₹ 4,500
    Diesel → ₹ 2,000

  🏦 CASH/BANK ENTRIES (1):
    Cash deposited to HDFC → ₹ 30,000

Evening Summary:
  Closing Cash Balance: ₹ X,XXX
  Total Received: ₹ X,XXX
  Total Paid: ₹ X,XXX

Actions: Print Day Book | Download PDF
```

#### 27.2 Routes Update (App.tsx)

```typescript
const GstReportsPage = lazy(() => import('@/features/business/gst-reports/pages/GstReportsPage'));
const ProfitLossPage = lazy(() => import('@/features/business/reports/pages/ProfitLossPage'));
const BalanceSheetPage = lazy(() => import('@/features/business/reports/pages/BalanceSheetPage'));
const DayBookPage = lazy(() => import('@/features/business/reports/pages/DayBookPage'));
const SalesReportPage = lazy(() => import('@/features/business/reports/pages/SalesReportPage'));

<Route path="/reports/gst" element={<BusinessRoute><GstReportsPage /></BusinessRoute>} />
<Route path="/reports/pl" element={<BusinessRoute><ProfitLossPage /></BusinessRoute>} />
<Route path="/reports/balance-sheet" element={<BusinessRoute><BalanceSheetPage /></BusinessRoute>} />
<Route path="/reports/daybook" element={<BusinessRoute><DayBookPage /></BusinessRoute>} />
<Route path="/reports/sales" element={<BusinessRoute><SalesReportPage /></BusinessRoute>} />

// Old audit logs route: keep as-is
// Old staff performance route: keep as-is
```

---

## ✅ Phase 8 Done — Checklist

**Backend:**
- [ ] GstReportController: gstr1 + gstr3b + hsn + itc + download
- [ ] GstCalculationService: extended with GSTR-1 data builders
- [ ] ProfitLossController: summary + project-wise + month-wise + PDF
- [ ] BalanceSheetController: assets/liabilities + PDF
- [ ] DayBookController: day transactions + PDF
- [ ] SalesReportController: summary + party + item + category + excel
- [ ] All routes added under /reports prefix

**Frontend:**
- [ ] GstReportsPage: GSTR-1 + GSTR-3B + HSN + ITC tabs
- [ ] ProfitLossPage: Income statement view + project-wise + month chart
- [ ] BalanceSheetPage: two-column balance sheet layout
- [ ] DayBookPage: timeline view with opening/closing cash
- [ ] SalesReportPage: summary + by customer + by item tabs
- [ ] gstReportService.ts + reportService.ts
- [ ] Routes updated

---

## 🔗 Previous → [Phase 7](./phase-07-projects-sites.md) | Next → [Phase 9](./phase-09-dashboard.md)
