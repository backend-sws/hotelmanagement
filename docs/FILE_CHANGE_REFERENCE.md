# BillKaro — File Change Reference (Execution Guide)
> Ye file batati hai: har phase mein exactly kaun si file modify hogi, kaun si nayi banegi, kaun si delete hogi.
> Use this as a quick lookup during coding.

---

## 🔴 FILES TO REMOVE / DEPRECATE

| File | Action | Reason |
|---|---|---|
| `frontend/src/features/business/pos/` | ❌ REDIRECT | Replace with `/invoices/new` |
| `frontend/src/features/business/finance/` | ❌ REDIRECT | Replace with `/outstanding` |
| `backend/app/Http/Controllers/Api/Business/EmiController.php` | ❌ KEEP but disable routes | EMI not needed in billing |

---

## 🟡 FILES TO MODIFY (Existing Files)

### Backend

| File | Phase | What Changes |
|---|---|---|
| `backend/app/Models/Product.php` | 1 | Add: unit, hsn_code, gst_rate, sale_rate, purchase_rate, barcode, min_stock_alert |
| `backend/app/Models/Customer.php` | 1 | Add: gstin, state_code, price_list_id, credit_limit |
| `backend/app/Models/Supplier.php` | 4 | Add: gstin, state_code, opening_balance |
| `backend/app/Models/Sale.php` | 2 | Add: invoice_type, cgst, sgst, igst, vehicle_number, project_id, due_date, parent_id |
| `backend/app/Models/SaleItem.php` | 2 | Add: hsn_code, unit, gst_rate, cgst_amount, sgst_amount; qty → DECIMAL |
| `backend/app/Http/Controllers/Api/Business/InventoryController.php` | 1 | Update store/update for new fields + add lowStockAlert() + generateBarcode() |
| `backend/app/Http/Controllers/Api/Business/DashboardController.php` | 9 | Complete rewrite with billing dashboard data |
| `backend/app/Http/Controllers/Api/SupplierController.php` | 4 | Extend with purchase bill support |
| `backend/app/Services/StockService.php` | 6 | Major extend: location-wise, transfer, consumption |
| `backend/routes/api.php` | ALL | Add new routes per phase (never delete existing) |
| `backend/database/migrations/` | 1-7 | New migration files per phase |

### Frontend

| File | Phase | What Changes |
|---|---|---|
| `frontend/src/App.tsx` | 2,3,4,5,6,7,8,9 | Add new lazy imports + routes per phase |
| `frontend/src/components/layout/AppSidebar.tsx` | 2 | Complete new navigation structure |
| `frontend/src/features/business/inventory/pages/InventoryPage.tsx` | 1 | Rebuild table columns (remove IMEI, add HSN/unit/GST) |
| `frontend/src/features/business/inventory/components/AddProductForm.tsx` | 1 | Rebuild form (remove IMEI/brand, add HSN/unit/barcode) |
| `frontend/src/features/business/inventory/pages/CategoriesPage.tsx` | 1 | Update default category suggestions |
| `frontend/src/features/business/settings/pages/BusinessSettingsPage.tsx` | 1,9 | Add GST Settings tab + Business Type selector |
| `frontend/src/features/business/dashboard/pages/DashboardPage.tsx` | 9 | Complete rebuild — billing dashboard |
| `frontend/src/features/business/expenses/` | 7 | Add project_id field to expense form |
| `frontend/index.html` | 9 | Change title to BillKaro |

---

## 🟢 NEW FILES TO CREATE

### Phase 1 — Foundation

**Backend:**
```
backend/database/migrations/XXXX_update_products_for_billing.php
backend/database/migrations/XXXX_update_customers_for_billing.php
backend/database/migrations/XXXX_update_suppliers_for_billing.php
backend/database/migrations/XXXX_create_price_lists_table.php
backend/database/migrations/XXXX_create_price_list_items_table.php
backend/database/migrations/XXXX_create_gst_settings_table.php
backend/app/Models/PriceList.php
backend/app/Models/PriceListItem.php
backend/app/Models/GstSetting.php
backend/app/Http/Controllers/Api/Business/PriceListController.php
backend/app/Http/Controllers/Api/Business/GstSettingController.php
```

**Frontend:**
```
frontend/src/features/business/inventory/pages/PriceListPage.tsx
```

---

### Phase 2 — Invoice Engine

**Backend:**
```
backend/database/migrations/XXXX_update_sales_for_gst_invoice.php
backend/database/migrations/XXXX_update_sale_items_for_gst.php
backend/app/Services/GstCalculationService.php           ⭐ KEY SERVICE
backend/app/Services/InvoiceNumberService.php             ⭐ KEY SERVICE
backend/app/Http/Controllers/Api/Business/InvoiceController.php
backend/resources/views/pdfs/gst_invoice.blade.php       ⭐ KEY TEMPLATE
```

**Frontend:**
```
frontend/src/features/business/invoices/
  pages/
    NewInvoicePage.tsx                    ⭐ MAIN INVOICE FORM
    InvoicesListPage.tsx
    InvoiceDetailPage.tsx
  components/
    ItemSearchInput.tsx
    CustomerSearchInput.tsx
    InvoiceItemsTable.tsx
    InvoiceSummaryPanel.tsx
    PaymentSection.tsx
  hooks/
    useGstCalculation.ts                  ⭐ CLIENT-SIDE GST CALC
  store/
    invoiceStore.ts
  api/
    invoiceService.ts
```

---

### Phase 3 — Document Types

**Backend:**
```
backend/app/Http/Controllers/Api/Business/ChallanController.php
backend/app/Http/Controllers/Api/Business/ProformaController.php
backend/app/Http/Controllers/Api/Business/QuotationController.php
backend/app/Http/Controllers/Api/Business/CreditNoteController.php
backend/app/Http/Controllers/Api/Business/DebitNoteController.php
backend/resources/views/pdfs/truck_slip.blade.php
```

**Frontend:**
```
frontend/src/features/business/challan/
  pages/ChallanListPage.tsx
  pages/NewChallanPage.tsx
  pages/ChallanDetailPage.tsx
  components/TruckDetailsForm.tsx
  components/ConvertToChallanModal.tsx
  api/challanService.ts

frontend/src/features/business/invoices/pages/ProformaListPage.tsx
frontend/src/features/business/invoices/pages/NewProformaPage.tsx
frontend/src/features/business/invoices/pages/CreditNoteListPage.tsx
frontend/src/features/business/invoices/pages/NewCreditNotePage.tsx

frontend/src/features/business/quotations/
  pages/QuotationListPage.tsx
  pages/NewQuotationPage.tsx
  pages/QuotationDetailPage.tsx
  api/quotationService.ts
```

---

### Phase 4 — Purchase + Supplier

**Backend:**
```
backend/database/migrations/XXXX_update_supplier_purchases_for_billing.php
backend/database/migrations/XXXX_update_supplier_purchase_items_gst.php
backend/database/migrations/XXXX_create_itc_ledger_table.php
backend/database/migrations/XXXX_create_ledger_entries_table.php
backend/app/Models/LedgerEntry.php
backend/app/Models/ItcLedger.php
backend/app/Services/LedgerService.php                    ⭐ KEY SERVICE
backend/app/Http/Controllers/Api/Business/PurchaseController.php
backend/app/Http/Controllers/Api/Business/LedgerController.php
backend/app/Http/Controllers/Api/Business/OutstandingController.php
backend/resources/views/pdfs/account_statement.blade.php
backend/resources/views/pdfs/outstanding_report.blade.php
```

**Frontend:**
```
frontend/src/features/business/purchase/
  pages/PurchaseListPage.tsx
  pages/NewPurchasePage.tsx
  pages/PurchaseDetailPage.tsx
  api/purchaseService.ts

frontend/src/features/business/ledger/
  pages/CustomerLedgerPage.tsx
  pages/SupplierLedgerPage.tsx
  api/ledgerService.ts

frontend/src/features/business/outstanding/
  pages/OutstandingPage.tsx
  components/AgingTable.tsx
  components/ReminderModal.tsx
  api/outstandingService.ts
```

---

### Phase 5 — Cash/Bank + Cheques

**Backend:**
```
backend/database/migrations/XXXX_create_cash_bank_entries_table.php
backend/database/migrations/XXXX_create_cheque_register_table.php
backend/database/migrations/XXXX_create_bank_accounts_table.php
backend/app/Models/CashBankEntry.php
backend/app/Models/ChequeRegister.php
backend/app/Models/BankAccount.php
backend/app/Http/Controllers/Api/Business/CashBankController.php
backend/app/Http/Controllers/Api/Business/ChequeController.php
backend/app/Http/Controllers/Api/Business/BankAccountController.php
```

**Frontend:**
```
frontend/src/features/business/cashbook/
  pages/CashBookPage.tsx
  components/CashEntryForm.tsx
  api/cashbookService.ts

frontend/src/features/business/cheques/
  pages/ChequeRegisterPage.tsx
  components/ChequeForm.tsx
  components/ChequeStatusModal.tsx
  api/chequeService.ts
```

---

### Phase 6 — Stock + Inventory

**Backend:**
```
backend/database/migrations/XXXX_create_stock_transfers_table.php
backend/database/migrations/XXXX_create_stock_transfer_items_table.php
backend/database/migrations/XXXX_create_product_stock_locations_table.php
backend/database/migrations/XXXX_update_inventory_movements_location.php
backend/app/Models/StockTransfer.php
backend/app/Models/StockTransferItem.php
backend/app/Models/ProductStockLocation.php
backend/app/Http/Controllers/Api/Business/StockTransferController.php
backend/app/Http/Controllers/Api/Business/StockSummaryController.php
backend/app/Http/Controllers/Api/Business/BarcodeController.php
backend/resources/views/pdfs/transfer_slip.blade.php
```

**Frontend:**
```
frontend/src/features/business/stock/
  pages/StockSummaryPage.tsx
  pages/StockMovementsPage.tsx
  pages/StockTransferPage.tsx
  pages/NewStockTransferPage.tsx
  pages/GodownPage.tsx
  components/LowStockBanner.tsx
  components/StockTable.tsx
  api/stockService.ts
```

---

### Phase 7 — Projects + BOQ

**Backend:**
```
backend/database/migrations/XXXX_create_projects_table.php
backend/database/migrations/XXXX_create_material_consumptions_table.php
backend/database/migrations/XXXX_create_boq_tables.php
backend/database/migrations/XXXX_add_project_id_to_expenses.php
backend/database/migrations/XXXX_add_project_id_to_attendance.php
backend/app/Models/Project.php
backend/app/Models/MaterialConsumption.php
backend/app/Models/MaterialConsumptionItem.php
backend/app/Models/Boq.php
backend/app/Models/BoqSection.php
backend/app/Models/BoqItem.php
backend/app/Http/Controllers/Api/Business/ProjectController.php
backend/app/Http/Controllers/Api/Business/MaterialConsumptionController.php
backend/app/Http/Controllers/Api/Business/BoqController.php
backend/app/Http/Controllers/Api/Business/LabourPaymentController.php
backend/resources/views/pdfs/boq.blade.php
backend/resources/views/pdfs/consumption_slip.blade.php
```

**Frontend:**
```
frontend/src/features/business/projects/
  pages/ProjectsListPage.tsx
  pages/NewProjectPage.tsx
  pages/ProjectDetailPage.tsx
  pages/NewConsumptionPage.tsx
  pages/BoqListPage.tsx
  pages/NewBoqPage.tsx
  pages/BoqDetailPage.tsx
  pages/LabourSummaryPage.tsx
  components/ProjectCard.tsx
  components/ProjectPnlCard.tsx
  components/BoqSectionBuilder.tsx
  components/ConsumptionForm.tsx
  api/projectService.ts
  api/consumptionService.ts
  api/boqService.ts
```

---

### Phase 8 — Reports + GST

**Backend:**
```
backend/app/Http/Controllers/Api/Business/GstReportController.php
backend/app/Http/Controllers/Api/Business/ProfitLossController.php
backend/app/Http/Controllers/Api/Business/BalanceSheetController.php
backend/app/Http/Controllers/Api/Business/DayBookController.php
backend/app/Http/Controllers/Api/Business/SalesReportController.php
```

**Frontend:**
```
frontend/src/features/business/gst-reports/
  pages/GstReportsPage.tsx
  components/Gstr1Table.tsx
  components/Gstr3bTable.tsx
  components/HsnSummaryTable.tsx
  api/gstReportService.ts

frontend/src/features/business/reports/
  pages/ProfitLossPage.tsx
  pages/BalanceSheetPage.tsx
  pages/DayBookPage.tsx
  pages/SalesReportPage.tsx
  api/reportService.ts
```

---

### Phase 9 — Dashboard + Polish

**Backend:**
- Rewrite: `backend/app/Http/Controllers/Api/Business/DashboardController.php`

**Frontend:**
```
frontend/src/features/business/dashboard/
  components/StatsCard.tsx
  components/SalesChart.tsx
  components/QuickActionsPanel.tsx
  components/RecentInvoicesList.tsx
  components/AgingDonut.tsx
  components/LowStockWidget.tsx
  components/ActiveProjectsWidget.tsx
  components/TopCustomersWidget.tsx
  components/PendingChequesWidget.tsx
  hooks/useDashboardStats.ts
  hooks/useSalesChart.ts
```

---

## 📅 Day-by-Day Quick Reference

| Day | Phase | Backend Focus | Frontend Focus |
|---|---|---|---|
| 1 | P1 | Migrations (products, customers, price_lists) | — |
| 2 | P1 | InventoryController update + PriceListController | — |
| 3 | P1 | — | Item Master UI rebuild + Price List page |
| 4 | P2 | Migrations (sales, sale_items) + GstCalcService + InvoiceNumberService | — |
| 5 | P2 | InvoiceController (CRUD+PDF) + GST Invoice PDF template | — |
| 6 | P2 | — | NewInvoicePage form (full) + InvoicesListPage |
| 7 | P2 | — | GST hook + Item/Customer search + Routes + Sidebar |
| 8 | P3 | ChallanController + StockService + Truck slip PDF | — |
| 9 | P3 | ProformaController + QuotationController + Credit/DebitNote | — |
| 10 | P3 | — | Challan pages + Proforma pages |
| 11 | P3 | — | Quotation pages + Credit Note pages + Routes |
| 12 | P4 | Migrations + PurchaseController + LedgerService | — |
| 13 | P4 | LedgerService integration + Statement PDFs | — |
| 14 | P4 | — | Purchase pages + Ledger pages + Outstanding page |
| 15 | P5 | Migrations + CashBankController + ChequeController | — |
| 16 | P5 | — | CashBook page + Cheque Register page + Routes |
| 17 | P6 | Migrations + StockService extend + StockTransferCtrl | — |
| 18 | P6 | StockSummaryController + BarcodeController | StockSummary + StockTransfer pages |
| 19 | P6 | — | Barcode in ItemForm + LowStockBanner + Routes |
| 20 | P7 | Migrations + ProjectController + MaterialConsumptionCtrl | — |
| 21 | P7 | BoqController + LabourCtrl + BOQ/Consumption PDFs | — |
| 22 | P7 | — | Projects pages + Consumption form |
| 23 | P7 | — | BOQ page builder + Labour summary + Routes |
| 24 | P8 | GstReportController + GSTR data builders | — |
| 25 | P8 | ProfitLossCtrl + BalanceSheetCtrl + DayBookCtrl + SalesReportCtrl | — |
| 26 | P8 | — | GST Reports page (all tabs) |
| 27 | P8 | — | P&L + Balance Sheet + DayBook + SalesReport pages |
| 28 | P9 | Dashboard API rewrite + branding settings | — |
| 29 | P9 | — | Full Dashboard rebuild (all widgets) |
| 30 | P9 | — | Sidebar polish + title/branding + WhatsApp + Final testing |

---

## ⚡ Key Services (Core Logic — Build These First)

```
1. GstCalculationService    → Used everywhere: Invoice, Purchase, Reports
2. InvoiceNumberService     → Used everywhere: all document types
3. LedgerService            → Used everywhere: every financial transaction
4. StockService             → Used everywhere: sale, purchase, challan, transfer
```

> ✅ These 4 services are the backbone. All controllers depend on them.
> Build + test each service independently before wiring to controllers.
