# Phase 7 — Projects, Sites, BOQ, Labour Payment
> **Duration:** Day 20 – Day 23
> **Goal:** Construction contractor + interior designer ke liye project management — site-wise stock, material consumption, BOQ, labour payment tracking.

---

## Day 20 — Backend: Projects + Sites + Material Consumption

### ✅ Tasks

#### 20.1 Migrations

**Migration: Create `projects` table**
```sql
id, business_id
name              VARCHAR(100)
project_code      VARCHAR(50) nullable   ← auto: PROJ-001
client_name       VARCHAR(100) nullable
client_phone      VARCHAR(20) nullable
site_address      TEXT nullable
city              VARCHAR(100) nullable
start_date        DATE nullable
end_date          DATE nullable
contract_value    DECIMAL(12,2) DEFAULT 0  ← total project value (from client)
status            ENUM(planning, active, on_hold, completed, cancelled) DEFAULT 'active'
description       TEXT nullable
notes             TEXT nullable
location_id       BIGINT FK nullable   ← linked business_location/site
created_by        BIGINT FK (users)
created_at, updated_at
```

**Migration: Create `material_consumptions` table**
```sql
id, business_id, project_id
consumption_number VARCHAR(50)   ← MC-001
date               DATE
notes              TEXT nullable
entered_by         BIGINT FK (users)
created_at, updated_at
```

**Migration: Create `material_consumption_items` table**
```sql
id, consumption_id
product_id   BIGINT FK
quantity     DECIMAL(10,3)
unit         VARCHAR(20)
rate         DECIMAL(12,2) DEFAULT 0   ← purchase rate at time of consumption
amount       DECIMAL(12,2) DEFAULT 0   ← qty * rate
notes        VARCHAR(255) nullable
```

**Migration: Create `boq_templates` table (Bill of Quantities)**
```sql
id, business_id, project_id
name            VARCHAR(100)
client_name     VARCHAR(100) nullable
project_name    VARCHAR(100) nullable
status          ENUM(draft, sent, approved, rejected) DEFAULT 'draft'
validity_date   DATE nullable
notes           TEXT nullable
total_amount    DECIMAL(12,2) DEFAULT 0
created_at, updated_at
```

**Migration: Create `boq_sections` table (room-wise)**
```sql
id, boq_id
section_name  VARCHAR(100)    ← "Living Room", "Kitchen", "Bedroom 1"
sort_order    INT DEFAULT 0
```

**Migration: Create `boq_items` table**
```sql
id, boq_section_id, boq_id
item_name    VARCHAR(200)   ← "Vitrified Tiles 60x60"
description  TEXT nullable
unit         VARCHAR(20)    ← sqft, nos, rft, lumpsum
quantity     DECIMAL(10,3)
rate         DECIMAL(12,2)
amount       DECIMAL(12,2)  ← qty * rate
product_id   BIGINT FK nullable   ← if linked to actual item
sort_order   INT DEFAULT 0
```

**Migration: Update `projects` — link to invoices + expenses**
```
NOTE: invoices (sales table) already has project_id FK — ✅ done in Phase 2
NOTE: expenses table needs project_id FK:
```

**Migration: Add `project_id` to `expenses` table**
```sql
ALTER TABLE expenses ADD COLUMN project_id BIGINT FK nullable;
```

#### 20.2 `ProjectController`

**File:** `backend/app/Http/Controllers/Api/Business/ProjectController.php`

```
Methods:

index()
  - List all projects
  - With: client_name, status, contract_value, total_invoiced, total_cost, profit/loss
  - Filter: status, date_range, search

store()
  - Create project (PROJ-001 numbering)
  - Optionally create linked business_location

show($id)
  - Full project details
  - Summary: contract_value, invoiced, received, material_cost, labour_cost, expense_cost, profit

update($id) / destroy($id)

stats($id)
  - GET /projects/{id}/stats
  - Detailed P&L:
    - Total invoices raised to client
    - Total payments received
    - Total material consumption (cost)
    - Total labour payments
    - Total expenses linked
    - Net Profit = received - (material + labour + expenses)

invoices($id)
  - GET /projects/{id}/invoices
  - All sales invoices linked to this project

expenses($id)
  - GET /projects/{id}/expenses
  - All expenses linked to this project
```

#### 20.3 `MaterialConsumptionController`

**File:** `backend/app/Http/Controllers/Api/Business/MaterialConsumptionController.php`

```
Methods:

index()
  - Filter: project_id, date_range
  - Return with project name, total items count, total cost

store()
  - MC-001 numbering
  - For each item:
    → auto-fill rate from current purchase_rate of product
    → calculate amount = qty * rate
  - DB Transaction:
    1. Create material_consumption record
    2. Create material_consumption_items
    3. Call StockService::deductStock() for each item
  - Updates project running cost

show($id)
  - Full consumption with items, project, stock changes

generateSlip($id)
  - PDF: Material Consumption slip for site record

projectConsumptionSummary($projectId)
  - GET /projects/{projectId}/consumption-summary
  - Item-wise total consumption for the project
  - = basis of project costing
```

#### 20.4 Routes

```php
// Projects
Route::get('projects/{id}/stats', [ProjectController::class, 'stats']);
Route::get('projects/{id}/invoices', [ProjectController::class, 'invoices']);
Route::get('projects/{id}/expenses', [ProjectController::class, 'expenses']);
Route::apiResource('projects', ProjectController::class);

// Material Consumption
Route::get('material-consumptions/project/{projectId}/summary',
    [MaterialConsumptionController::class, 'projectConsumptionSummary']);
Route::get('material-consumptions/{id}/slip',
    [MaterialConsumptionController::class, 'generateSlip']);
Route::apiResource('material-consumptions', MaterialConsumptionController::class);
```

---

## Day 21 — Backend: BOQ Controller + Labour (Extend Existing)

### ✅ Tasks

#### 21.1 `BoqController`

**File:** `backend/app/Http/Controllers/Api/Business/BoqController.php`

```
Methods:

index()
  - List BOQs: name, client, project, status, total_amount, validity

store()
  - Create BOQ with sections + items
  - Calculate total_amount from items

show($id)
  - Full BOQ: sections → items (room-wise)

update($id) / destroy($id)

updateStatus($id)
  - PATCH: {status: 'sent'/'approved'/'rejected'}

convertToInvoice($id)
  - Convert approved BOQ → Sales Invoice
  - Items become invoice items
  - Set parent_id linkage

generatePdf($id)
  - Professional BOQ PDF layout (room-wise breakdown)

duplicate($id)
  - Clone a BOQ (for similar projects)
```

#### 21.2 BOQ PDF Template

**File:** `backend/resources/views/pdfs/boq.blade.php`

```
BOQ PDF Format:
┌─────────────────────────────────────────────────┐
│ BILL OF QUANTITIES                              │
│ For: Sharma House Renovation                    │
│ Client: Ravi Sharma  Date: 24/07/2026           │
│ Valid upto: 24/08/2026                         │
├─────────────────────────────────────────────────┤
│ LIVING ROOM                                     │
│─────────────────────────────────────────────────│
│ # │ Description  │ Unit  │ Qty │ Rate  │ Amount │
│ 1 │ Tiles 60x60  │ Sqft  │200  │ 120   │ 24,000 │
│ 2 │ Wall Paint   │ Sqft  │400  │ 18    │  7,200 │
│ 3 │ False Ceiling│ Sqft  │200  │ 95    │ 19,000 │
│─────────────────────────────────────────────────│
│ BEDROOM 1                                       │
│─────────────────────────────────────────────────│
│ 1 │ Tiles 60x60  │ Sqft  │ 150 │ 120   │ 18,000 │
│ 2 │ Wall Paint   │ Sqft  │ 300 │ 18    │  5,400 │
├─────────────────────────────────────────────────┤
│ Sub Total (Material):        ₹ 73,600          │
│ Labour Charges:              ₹ 12,000          │
│ Grand Total:                 ₹ 85,600          │
└─────────────────────────────────────────────────┘
```

#### 21.3 Labour Integration (Extend Existing Attendance/Payroll)

**Existing attendance module already has:**
- Worker check-in/out
- Attendance marking (present/absent/half_day)
- Payroll generation

**Extend for billing software context:**

**Migration: Add `project_id` to `attendance` table**
```sql
ALTER TABLE attendance ADD COLUMN project_id BIGINT FK nullable;
```

**Migration: Add `project_id` to `payroll` table**
```sql
ALTER TABLE payroll ADD COLUMN project_id BIGINT FK nullable;
```

**New `LabourPaymentController`** (simplified wrapper):

```php
// GET /labour/summary
// - Project-wise total labour cost
// - Worker-wise attendance + payment summary
// - Week/month filter

// GET /labour/project/{projectId}
// - All attendance records linked to this project
// - Total worker-days, total cost

// POST /labour/payment
// - Quick payment entry for daily labour (not on payroll)
// - party_type: 'labour' (different from staff)
// - Linked to project_id
// - Creates expense entry (category: Labour)
```

#### 21.4 Routes (BOQ + Labour)

```php
// BOQ
Route::patch('boq/{id}/status', [BoqController::class, 'updateStatus']);
Route::post('boq/{id}/convert', [BoqController::class, 'convertToInvoice']);
Route::get('boq/{id}/pdf', [BoqController::class, 'generatePdf']);
Route::post('boq/{id}/duplicate', [BoqController::class, 'duplicate']);
Route::apiResource('boq', BoqController::class);

// Labour
Route::get('labour/summary', [LabourPaymentController::class, 'summary']);
Route::get('labour/project/{projectId}', [LabourPaymentController::class, 'projectLabour']);
Route::post('labour/payment', [LabourPaymentController::class, 'recordPayment']);
```

---

## Day 22 — Frontend: Projects + Material Consumption Pages

### ✅ Tasks

#### 22.1 Projects Pages

**New files:**
```
frontend/src/features/business/projects/
  pages/
    ProjectsListPage.tsx
    NewProjectPage.tsx
    ProjectDetailPage.tsx
    MaterialConsumptionPage.tsx
    NewConsumptionPage.tsx
  components/
    ProjectCard.tsx
    ProjectPnlCard.tsx
    ConsumptionForm.tsx
    ConsumptionItemsTable.tsx
  api/
    projectService.ts
    consumptionService.ts
```

**`ProjectsListPage.tsx`:**
```
Cards view (Kanban-style by status):
  [🔵 Planning: 2] [🟢 Active: 5] [🟡 On Hold: 1] [✅ Completed: 3]

OR Table view:
  Project | Client | Start Date | Contract Value | Invoiced | Cost | Profit | Status | Actions

Stats row:
  [Total Active: 5] [Total Contract Value: ₹X] [Total Profit: ₹X] [Total Loss: ₹X]

Actions per project:
  View | Add Consumption | Add Invoice | Add Expense | P&L Report
```

**`ProjectDetailPage.tsx`:**
```
Tabs: Overview | Invoices | Purchases | Expenses | Material | Labour | P&L

Overview tab:
  Project info card (name, client, dates, address)
  P&L Summary card:
    Contract Value:    ₹ 5,00,000
    Invoiced to Client:₹ 3,50,000
    Received:          ₹ 2,80,000
    ─────────────────────────────
    Material Cost:     ₹ 1,20,000
    Labour Cost:       ₹  45,000
    Other Expenses:    ₹  15,000
    Total Cost:        ₹ 1,80,000
    ─────────────────────────────
    Net Profit:        ₹ 1,00,000 (35.7%)

Material tab:
  List of consumption entries
  "Add Consumption" button → NewConsumptionPage

Labour tab:
  Attendance records linked to project
  Labour payment summary
```

**`NewConsumptionPage.tsx`:**
```
Form:
- Project (pre-selected if came from project page)
- Date (default today)
- Notes

Items table:
  | # | Item (search) | Available Stock | Qty | Unit | Rate (auto) | Amount |
  
  - Item search shows current stock
  - Rate auto-fills from product.purchase_rate
  - Amount = qty × rate (auto-calc)

Total Cost: ₹ XX,XXX
Actions: Save | Print Consumption Slip
```

---

## Day 23 — Frontend: BOQ Page + Labour Summary

### ✅ Tasks

#### 23.1 BOQ Pages

**New files:**
```
frontend/src/features/business/projects/
  pages/
    BoqListPage.tsx
    NewBoqPage.tsx
    BoqDetailPage.tsx
  components/
    BoqSectionBuilder.tsx   ← drag-drop section + items
    BoqItemRow.tsx
    RoomSectionAccordion.tsx
  api/
    boqService.ts
```

**`NewBoqPage.tsx`:**
```
Header:
  - Client Name
  - Project Name
  - Date + Validity date
  - Notes

Sections Builder:
  [+ Add Room/Section] button

Per Section:
  Section Name: [Living Room    ]
  Items table:
    | Description | Unit | Qty | Rate | Amount | Actions |
    | [text]      | [dd] | [n] | [n]  | auto   | [❌]    |
  [+ Add Item] button
  Section subtotal

Summary (right sidebar):
  Room 1 subtotal
  Room 2 subtotal
  Labour Charges (manual input)
  ───────────────
  Grand Total

Actions: Save Draft | Preview PDF | WhatsApp | Approve | Convert to Invoice
```

**`BoqListPage.tsx`:**
```
Table: BOQ# | Client | Project | Date | Total | Status | Actions
Status: Draft / Sent / Approved / Rejected
Filter: Status, Client, Date
"+ New BOQ" button

Click row → BoqDetailPage
Actions: View | PDF | WhatsApp | Duplicate | Convert to Invoice | Delete
```

#### 23.2 Labour Summary (Extend HR)

**Modify:** `frontend/src/features/business/hr/` or create new:

```
frontend/src/features/business/projects/pages/LabourSummaryPage.tsx

Layout:
Filter: Project | Worker | Date Range

Summary Cards:
  [Total Worker Days] [Total Labour Cost] [Avg Daily Cost]

Table:
  Worker | Project | Days Present | Rate/Day | Total Pay | Paid | Balance

Project-wise breakdown:
  Project A: 45 worker-days, ₹ 45,000
  Project B: 30 worker-days, ₹ 27,000

"Record Labour Payment" button → creates expense entry (type: Labour)
```

#### 23.3 Invoice Form → Add Project Link

**Modify:** `frontend/src/features/business/invoices/pages/NewInvoicePage.tsx`

```
Add "Link to Project" optional field:
- Dropdown of active projects
- When selected: project name shows below invoice
- Auto-links in backend (project_id on sale record)
```

#### 23.4 Expense Form → Add Project Link

**Modify:** Existing ExpensesPage expense form:

```
Add "Link to Project" optional field (same pattern)
When expense saved with project_id → auto-shows in Project detail Expenses tab
```

#### 23.5 Routes Update (App.tsx)

```typescript
const ProjectsListPage = lazy(() => import('@/features/business/projects/pages/ProjectsListPage'));
const NewProjectPage = lazy(() => import('@/features/business/projects/pages/NewProjectPage'));
const ProjectDetailPage = lazy(() => import('@/features/business/projects/pages/ProjectDetailPage'));
const NewConsumptionPage = lazy(() => import('@/features/business/projects/pages/NewConsumptionPage'));
const BoqListPage = lazy(() => import('@/features/business/projects/pages/BoqListPage'));
const NewBoqPage = lazy(() => import('@/features/business/projects/pages/NewBoqPage'));
const LabourSummaryPage = lazy(() => import('@/features/business/projects/pages/LabourSummaryPage'));

<Route path="/projects" element={<BusinessRoute><ProjectsListPage /></BusinessRoute>} />
<Route path="/projects/new" element={<BusinessRoute><NewProjectPage /></BusinessRoute>} />
<Route path="/projects/:id" element={<BusinessRoute><ProjectDetailPage /></BusinessRoute>} />
<Route path="/projects/:id/consumption/new" element={<BusinessRoute><NewConsumptionPage /></BusinessRoute>} />
<Route path="/boq" element={<BusinessRoute><BoqListPage /></BusinessRoute>} />
<Route path="/boq/new" element={<BusinessRoute><NewBoqPage /></BusinessRoute>} />
<Route path="/boq/:id" element={<BusinessRoute><BoqDetailPage /></BusinessRoute>} />
<Route path="/labour" element={<BusinessRoute><LabourSummaryPage /></BusinessRoute>} />
```

---

## ✅ Phase 7 Done — Checklist

**Database:**
- [ ] projects table created
- [ ] material_consumptions table created
- [ ] material_consumption_items table created
- [ ] boq_templates table created
- [ ] boq_sections + boq_items tables created
- [ ] expenses.project_id FK added
- [ ] attendance.project_id FK added
- [ ] payroll.project_id FK added

**Backend:**
- [ ] ProjectController: CRUD + stats + invoices + expenses
- [ ] MaterialConsumptionController: CRUD + slip PDF + project summary
- [ ] BoqController: CRUD + status + convert + PDF + duplicate
- [ ] LabourPaymentController: summary + project + record payment
- [ ] BOQ PDF template (room-wise breakdown)
- [ ] Consumption Slip PDF template
- [ ] Routes added

**Frontend:**
- [ ] ProjectsListPage (cards + stats)
- [ ] ProjectDetailPage (tabs: invoices, expenses, material, labour, P&L)
- [ ] NewConsumptionPage (item search + stock check)
- [ ] BoqListPage (with status management)
- [ ] NewBoqPage (section builder + room-wise items)
- [ ] BoqDetailPage
- [ ] LabourSummaryPage
- [ ] Invoice form: project link field
- [ ] Expense form: project link field
- [ ] projectService.ts + consumptionService.ts + boqService.ts
- [ ] Routes updated

---

## 🔗 Previous → [Phase 6](./phase-06-stock-inventory.md) | Next → [Phase 8](./phase-08-reports-gst.md)
