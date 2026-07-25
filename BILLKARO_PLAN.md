# 🧾 BillKaro — Master Transformation Plan Index

> Mobile CRM → BillKaro Billing Software
> Stack: React (Vite + TS) + Laravel + MySQL
> Total: **30 Days | 9 Phases | ~120+ files**

---

## 📋 Phase Overview

| Phase | Name | Days | Key Deliverable | Status |
|---|---|---|---|---|
| [Phase 1](./docs/phase-01-foundation.md) | Foundation — DB + Item Master | Day 1–3 | Item Master with HSN/GST/Units | ⬜ Pending |
| [Phase 2](./docs/phase-02-invoice-engine.md) | Core Invoice Engine (GST Sales Invoice) | Day 4–7 | Full GST Invoice + PDF | ⬜ Pending |
| [Phase 3](./docs/phase-03-document-types.md) | Document Types | Day 8–11 | Challan, Proforma, Quotation, Credit Note | ⬜ Pending |
| [Phase 4](./docs/phase-04-purchase-supplier.md) | Purchase + Ledger | Day 12–14 | Purchase Bill + Customer/Supplier Ledger + Outstanding | ⬜ Pending |
| [Phase 5](./docs/phase-05-cash-bank-cheques.md) | Cash/Bank + Cheques | Day 15–16 | Cash Book + Cheque Register | ⬜ Pending |
| [Phase 6](./docs/phase-06-stock-inventory.md) | Stock + Inventory | Day 17–19 | Stock Summary + Transfer + Barcode | ⬜ Pending |
| [Phase 7](./docs/phase-07-projects-sites.md) | Projects + Sites + BOQ | Day 20–23 | Project P&L + BOQ + Material Consumption | ⬜ Pending |
| [Phase 8](./docs/phase-08-reports-gst.md) | Reports + GST | Day 24–27 | GSTR-1/3B + P&L + Day Book + Balance Sheet | ⬜ Pending |
| [Phase 9](./docs/phase-09-dashboard.md) | Dashboard + Polish | Day 28–30 | BillKaro Dashboard + Final Integration | ⬜ Pending |

---

## 📁 All Planning Docs

```
mobilecrm-main/
├── BILLKARO_PLAN.md                    ← You are here (Master Index)
└── docs/
    ├── FILE_CHANGE_REFERENCE.md        ← All files: modify/create/delete list
    ├── phase-01-foundation.md          ← Day 1-3
    ├── phase-02-invoice-engine.md      ← Day 4-7
    ├── phase-03-document-types.md      ← Day 8-11
    ├── phase-04-purchase-supplier.md   ← Day 12-14
    ├── phase-05-cash-bank-cheques.md   ← Day 15-16
    ├── phase-06-stock-inventory.md     ← Day 17-19
    ├── phase-07-projects-sites.md      ← Day 20-23
    ├── phase-08-reports-gst.md         ← Day 24-27
    └── phase-09-dashboard.md           ← Day 28-30
```

---

## 🏗️ Tech Stack (Reference)

- **Frontend:** React 18 + Vite + TypeScript → `frontend/src/`
- **Backend:** Laravel 11 + Sanctum → `backend/`
- **DB:** MySQL (via Laravel migrations)
- **PDF:** barryvdh/laravel-dompdf (already in project)
- **State:** Zustand stores
- **API:** Axios (existing services pattern)

---

## 📁 Key Folders

```
frontend/src/
  features/business/
    invoices/          ← NEW (Sales Invoice)
    purchase/          ← NEW (Purchase Bill)
    challan/           ← NEW (Delivery Challan)
    quotations/        ← NEW (Quotation)
    ledger/            ← NEW (Party Ledger)
    outstanding/       ← NEW (Outstanding Report)
    stock/             ← NEW (Stock Summary + Transfer)
    projects/          ← NEW (Projects + BOQ)
    cheques/           ← NEW (Cheque Register)
    cashbook/          ← NEW (Cash/Bank Entries)
    gst-reports/       ← NEW (GST Reports)
    pos/               ← REPLACE with Invoice
    finance/           ← REPLACE with Ledger
    inventory/         ← MODIFY (Item Master)

backend/app/
  Http/Controllers/Api/Business/
    InvoiceController.php      ← NEW
    PurchaseController.php     ← NEW
    ChallanController.php      ← NEW
    QuotationController.php    ← NEW
    LedgerController.php       ← NEW
    OutstandingController.php  ← NEW
    StockTransferController.php← NEW
    ProjectController.php      ← NEW
    ChequeController.php       ← NEW
    CashBankController.php     ← NEW
    GstReportController.php    ← NEW
    ProfitLossController.php   ← NEW
  Services/
    GstCalculationService.php  ← NEW
    InvoiceNumberService.php   ← NEW
    LedgerService.php          ← NEW
    StockService.php           ← EXTEND
```

---

## ✅ Progress Tracker

Mark karo jab complete ho:
- [ ] Phase 1 — Foundation
- [ ] Phase 2 — Invoice Engine
- [ ] Phase 3 — Document Types
- [ ] Phase 4 — Purchase + Supplier
- [ ] Phase 5 — Cash/Bank + Cheques
- [ ] Phase 6 — Stock + Inventory
- [ ] Phase 7 — Projects + Sites
- [ ] Phase 8 — Reports + GST
- [ ] Phase 9 — Dashboard
