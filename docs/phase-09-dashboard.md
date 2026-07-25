# Phase 9 — Dashboard Overhaul + Final Polish
> **Duration:** Day 28 – Day 30
> **Goal:** BillKaro ka naya dashboard build karo — sab modules ka data ek jagah dikhao. App name, branding, UI polish, aur final testing bhi isi phase mein.

---

## Day 28 — Backend: Dashboard API + Branding

### ✅ Tasks

#### 28.1 Dashboard Stats API (Rewrite)

**File:** `backend/app/Http/Controllers/Api/Business/DashboardController.php` (rewrite existing)

```
Methods:

stats()
  - GET /business/dashboard/stats
  
  Response:
  {
    today: {
      sales_count: 5,
      sales_amount: 47200,
      purchases_count: 1,
      purchases_amount: 85000,
      cash_receipts: 35000,
      cash_payments: 12000,
      new_customers: 2
    },
    this_month: {
      sales_amount: 520000,
      purchase_amount: 210000,
      expenses: 70000,
      gross_profit: 240000,
      net_profit: 170000,
      profit_margin: 32.7
    },
    outstanding: {
      customer_receivable: 180000,
      supplier_payable: 95000,
      net_position: 85000
    },
    stock: {
      total_items: 45,
      low_stock_count: 3,
      out_of_stock_count: 1,
      total_stock_value: 380000,
      low_stock_items: [
        { name: "Gitti 20mm", current: 45, min: 100, unit: "ton" }
      ]
    },
    cheques: {
      pending_deposit_count: 3,
      pending_deposit_amount: 75000,
      due_this_week: 2
    },
    recent_invoices: [...],     ← Last 5 invoices
    recent_payments: [...],     ← Last 5 payments
    top_customers: [...],       ← Top 5 by this month sales
    overdue_invoices: [...]     ← Invoices past due_date
  }

salesChart($period)
  - GET /business/dashboard/sales-chart?period=monthly
  - period: daily (last 30 days) | monthly (last 12 months)
  - Returns: { labels: [...], sales: [...], purchases: [...] }

outstandingAgingSummary()
  - GET /business/dashboard/aging
  - Quick aging: 0-30, 31-60, 61-90, 90+
  - Total amounts per bracket

projectsSummary()
  - GET /business/dashboard/projects
  - Active projects count + total contract value + total profit
```

#### 28.2 App Branding + Name Update

**File:** `backend/app/Models/Business.php` — check settings field

```
Settings JSON ka structure update:
{
  "whitelabel_name": "BillKaro",        ← app name per business (existing)
  "app_display_name": "BillKaro",
  "business_type": "dealer",            ← NEW: dealer | contractor | interior
  "currency": "INR",
  "date_format": "DD/MM/YYYY",
  "invoice_prefix": "INV",             ← custom invoice prefix
  "financial_year_start": "04",        ← April = Indian FY
  "theme_color": "orange"
}
```

**File:** `backend/app/Http/Controllers/Api/Business/GstSettingController.php`

```
Add to show/update:
- business_type (dealer/contractor/interior)
- Enable/disable modules based on type:
  dealer → hide BOQ, show weight billing + delivery challan
  contractor → show everything
  interior → show BOQ, hide weight billing
```

---

## Day 29 — Frontend: New BillKaro Dashboard

### ✅ Tasks

#### 29.1 Dashboard Page Complete Rebuild

**File:** `frontend/src/features/business/dashboard/pages/DashboardPage.tsx` (rewrite)

```
Layout: 3-column grid (responsive)

─── TOP ROW — Key Stats (4 cards) ───────────────────

[📈 Today's Sales]    [💰 Outstanding]    [📦 Low Stock]    [⚠️ Pending Cheques]
₹ 47,200              ₹ 1,80,000          3 items           ₹ 75,000
5 invoices            from 12 customers   Gitti 20mm low    3 cheques pending

─── SECOND ROW — This Month Summary ─────────────────

[Revenue: ₹5.2L]  [Purchases: ₹2.1L]  [Expenses: ₹70K]  [Net Profit: ₹1.7L ▲32%]
All with sparkline mini-charts

─── THIRD ROW — Main Chart + Quick Actions ───────────

LEFT (2/3):
  Sales vs Purchases Chart
  Toggle: Daily (30 days) | Monthly (12 months)
  Line chart: Sales = orange, Purchases = blue
  X-axis: dates/months, Y-axis: ₹ amount

RIGHT (1/3):
  Quick Actions Panel:
  ┌─────────────────────────┐
  │ [+ New Invoice]         │
  │ [+ Purchase Bill]       │
  │ [+ Delivery Challan]    │
  │ [+ Expense]             │
  │ [+ Customer Payment]    │
  │ [View Outstanding]      │
  └─────────────────────────┘

─── FOURTH ROW — Three columns ───────────────────────

LEFT: Recent Invoices
  Last 5 invoices
  INV-045 | Suresh Builder | ₹47,200 | Pending
  INV-044 | Ramesh Const.  | ₹23,600 | Paid
  [View All →]

CENTER: Outstanding Aging
  Donut chart:
    0-30 days: ₹ 80,000 (green)
    31-60 days: ₹ 60,000 (yellow)
    61-90 days: ₹ 25,000 (orange)
    90+ days: ₹ 15,000 (red)
  [View All Outstanding →]

RIGHT: Low Stock Alerts
  ⚠️ Gitti 20mm: 45 ton (min: 100)
  ⚠️ OPC Cement: 12 bags (min: 50)
  ✅ Sand Fine: 200 ton (OK)
  [View Stock →]

─── FIFTH ROW — Projects + Top Customers ─────────────

LEFT: Active Projects (if any)
  Project | Client | % Complete (fake) | Profit
  Sharma House | Ravi Sharma | Active | ₹ 45,000
  [View Projects →]

RIGHT: Top Customers (this month)
  Rank | Customer | Amount | Invoices
  1 | Suresh Builder | ₹ 1,20,000 | 5
  [View All →]
```

#### 29.2 Dashboard Components

**New files:**
```
frontend/src/features/business/dashboard/
  components/
    StatsCard.tsx          ← Reusable stat card with icon + trend
    SalesChart.tsx         ← Line/bar chart (recharts)
    QuickActionsPanel.tsx  ← Quick links panel
    RecentInvoicesList.tsx ← Last 5 invoices
    AgingDonut.tsx         ← Outstanding aging donut
    LowStockWidget.tsx     ← Low stock alert list
    ActiveProjectsWidget.tsx
    TopCustomersWidget.tsx
    PendingChequesWidget.tsx
  hooks/
    useDashboardStats.ts   ← API call hook
    useSalesChart.ts       ← Chart data hook
```

**`StatsCard.tsx`:**
```typescript
interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  onClick?: () => void;  // navigate to detail page
}
```

**`SalesChart.tsx`:**
```typescript
// Uses recharts (already likely in project)
// Toggle: Daily | Monthly
// Animated on load
// Tooltip with formatted ₹ amounts
// Responsive (full width)
```

#### 29.3 Dashboard API Hook

**File:** `frontend/src/features/business/dashboard/hooks/useDashboardStats.ts`

```typescript
export function useDashboardStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.stats(),
    refetchInterval: 5 * 60 * 1000,  // Refresh every 5 min
    staleTime: 2 * 60 * 1000,
  });
  return { stats: data, isLoading };
}
```

---

## Day 30 — Polish, Testing, Sidebar Final, App Title

### ✅ Tasks

#### 30.1 Sidebar Final Polish

**File:** `frontend/src/components/layout/AppSidebar.tsx` (or equivalent)

```
Final sidebar structure (from Phase 2 plan):
Confirm all new routes are correctly linked
Add active state highlight for current route
Add pending badges:
  - Invoices → pending/overdue count
  - Outstanding → customer count
  - Cheques → pending deposit count
  - Low Stock → item count
```

#### 30.2 App Name + Title Changes

**File:** `frontend/src/App.tsx`

```typescript
// Change app title from 'MobilePhoneCRM' to 'BillKaro':
document.title = activeBusiness?.settings?.whitelabel_name 
  || appName 
  || 'BillKaro';  // ← changed from 'MobilePhoneCRM'
```

**File:** `frontend/index.html`

```html
<!-- Change: -->
<title>BillKaro - Billing Software</title>
<meta name="description" content="BillKaro - Complete billing software for dealers, contractors and interior designers" />
```

**File:** `frontend/src/components/layout/AppLayout.tsx` (or logo area)

```
Replace "MobileCRM" text/logo with "BillKaro" in sidebar header
```

#### 30.3 Navigation Updates — Remove Old CRM items

```
Review sidebar — remove:
- "Brands" route (deactivate/redirect)
- Old EMI/Finance link (redirect → /outstanding)
- Old "POS" link (redirect → /invoices/new)

Confirm all new routes navigate correctly:
- /invoices/new ✓
- /challans ✓
- /proforma ✓
- /quotations ✓
- /purchases ✓
- /outstanding ✓
- /ledger/customers ✓
- /stock/summary ✓
- /stock/transfer ✓
- /projects ✓
- /boq ✓
- /cashbook ✓
- /cheques ✓
- /reports/gst ✓
- /reports/pl ✓
- /reports/daybook ✓
- /reports/sales ✓
- /reports/balance-sheet ✓
```

#### 30.4 Business Settings — Business Type

**Modify:** `frontend/src/features/business/settings/pages/BusinessSettingsPage.tsx`

```
Add "Business Type" section in General settings:

Business Type (affects which modules are highlighted):
○ Gitti/Ballu Dealer
○ Construction Contractor
○ Interior Designer
○ Mixed (all modules)

→ Save → affects sidebar module ordering + dashboard widgets
→ Dealer: highlight Challan, Stock, Weight billing
→ Contractor: highlight Projects, Labour, BOQ
→ Interior: highlight BOQ, Photo attach, Quotation
```

#### 30.5 Photo Attach Feature (Bonus)

**Modify:** Invoice + Challan form

```
"Attach Photo" button:
- File input (image/*) → upload to S3/storage
- Show thumbnail preview
- Multiple photos allowed
- On PDF → photos shown at bottom of invoice

Backend:
- sales.attachments JSON column (or separate table)
- Upload via existing UploadController
```

#### 30.6 WhatsApp Share Integration

**Modify:** All document forms (Invoice, Challan, Proforma, Statement)

```
"Share on WhatsApp" button flow:
1. Save document
2. Generate PDF URL (signed URL from backend)
3. Build WhatsApp URL:
   wa.me/{phone}?text=Dear {Name}, ...Invoice #{no} ...PDF: {url}
4. Open in new tab

Template message examples:
- Invoice: "Dear {name}, aapka invoice #{no} ₹{amount} ka attached hai. Due date: {date}"
- Reminder: "Dear {name}, aapka {amount} ka payment {days} din se pending hai."
- Statement: "Dear {name}, aapka account statement attached hai."
```

---

## ✅ Phase 9 Done — Final Checklist

**Backend:**
- [ ] DashboardController: complete rewrite with all widgets data
- [ ] Sales chart endpoint: daily + monthly data
- [ ] Aging summary endpoint
- [ ] Projects summary endpoint
- [ ] Business settings: business_type field + module toggle
- [ ] App name: 'BillKaro' in all relevant places

**Frontend:**
- [ ] DashboardPage: complete rebuild (all 5 rows of widgets)
- [ ] StatsCard component
- [ ] SalesChart component (recharts, animated)
- [ ] QuickActionsPanel
- [ ] RecentInvoicesList widget
- [ ] AgingDonut widget
- [ ] LowStockWidget
- [ ] ActiveProjectsWidget
- [ ] TopCustomersWidget
- [ ] PendingChequesWidget
- [ ] useDashboardStats hook (with 5-min auto-refresh)
- [ ] Sidebar: all routes linked + pending badges
- [ ] App title: 'BillKaro' (index.html + App.tsx)
- [ ] Logo/branding in sidebar header changed
- [ ] Old CRM routes: Brands/POS/Finance redirected
- [ ] Business Type selector in settings
- [ ] Photo attach feature on Invoice/Challan
- [ ] WhatsApp share on all documents
- [ ] Final route audit (all 30+ routes working)

---

## 🏁 Full Project Complete — Final Verification

### Run Tests
```bash
# Backend
cd backend
php artisan test

# Frontend build check
cd frontend
npm run build
```

### Manual Test Checklist

**Critical Path 1 — Gitti Dealer:**
- [ ] Create Item (Gitti 20mm, 800/ton, 18% GST, HSN: 2517)
- [ ] Create Customer (Suresh Builder, GSTIN)
- [ ] Create Delivery Challan (50 ton, truck BR-01)
- [ ] Convert Challan → Sales Invoice (INV-001)
- [ ] PDF download — check GST amounts correct
- [ ] Record payment (₹20,000 UPI)
- [ ] Check Customer Ledger — correct balance
- [ ] Check Outstanding Report — Suresh shows as receivable

**Critical Path 2 — Contractor:**
- [ ] Create Project (Sharma House, contract ₹5L)
- [ ] Create Purchase Bill (cement + rod, supplier)
- [ ] Record Material Consumption for project
- [ ] Create Invoice to client → link to project
- [ ] View Project P&L → shows correct profit

**Critical Path 3 — Interior Designer:**
- [ ] Create BOQ (room-wise: Living, Bedroom, Kitchen)
- [ ] Share BOQ PDF with client
- [ ] Mark as Approved → Convert to Invoice
- [ ] Invoice shows correct amounts

**Critical Path 4 — Accounts:**
- [ ] Cash entry (receipt from customer)
- [ ] Cheque received → deposit → cleared
- [ ] Day Book for today → all transactions visible
- [ ] P&L for this month → correct numbers
- [ ] GST GSTR-1 for this month → correct B2B data

---

## 🔗 Previous → [Phase 8](./phase-08-reports-gst.md) | [← Back to Master Plan](../BILLKARO_PLAN.md)
