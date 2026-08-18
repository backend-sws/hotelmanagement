<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Partner\PartnerPortalController;
use App\Http\Controllers\PingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/ping', [PingController::class, 'ping']);
    Route::post('/check-user', [AuthController::class, 'checkUser']);
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/set-password', [AuthController::class, 'setPassword']);
    Route::post('/login', [AuthController::class, 'login']);

    // Public Routes
    Route::get('/public/invoice/{uuid}', [App\Http\Controllers\Api\PublicInvoiceController::class, 'show']);
    Route::get('/invoices/verify/{uuid}', [App\Http\Controllers\Api\PublicInvoiceController::class, 'show']);

    // Partner self-registration (public)
    Route::post('/partner/register', [PartnerPortalController::class, 'register']);

    Route::get('/settings/public', [\App\Http\Controllers\Api\PublicSettingController::class, 'index']);
    Route::get('/plans/public', function () {
        return response()->json(\App\Models\Plan::where('is_active', true)->get());
    });
    
    // Public Signed Route for QR Invoice Verification
    Route::get('/verify/invoice/{sale}', [\App\Http\Controllers\Api\SaleController::class, 'generatePdf'])
        ->name('invoice.verify')
        ->middleware('signed');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        
        Route::post('/upload/presigned-url', [\App\Http\Controllers\Api\UploadController::class, 'getPresignedUrl']);
        
        Route::apiResource('businesses', \App\Http\Controllers\Api\BusinessController::class);

        // CRM Routes (Scoped to Business via TenantMiddleware)
        Route::middleware(['tenant'])->prefix('business')->group(function () {
            // ═══════════════════════════════════════════════════════════════
            // FREE TIER — Available in ALL plans (Starter, Professional, Enterprise)
            // ═══════════════════════════════════════════════════════════════
            Route::get('/dashboard/stats', [\App\Http\Controllers\Api\Business\DashboardController::class, 'stats']);
            Route::get('/dashboard/staff-earnings', [\App\Http\Controllers\Api\Business\DashboardController::class, 'staffEarnings']);

            Route::apiResource('categories', \App\Http\Controllers\Api\Business\CategoryController::class);
            Route::apiResource('brands', \App\Http\Controllers\Api\Business\BrandController::class);
            Route::apiResource('units', \App\Http\Controllers\UnitController::class)->only(['index', 'store']);
            
            Route::post('inventory/direct-inward', [\App\Http\Controllers\Api\Business\InventoryController::class, 'directInward']);
            Route::get('inventory/low-stock', [\App\Http\Controllers\Api\Business\InventoryController::class, 'lowStockAlert']);
            Route::get('inventory/generate-barcode', [\App\Http\Controllers\Api\Business\InventoryController::class, 'generateBarcode']);
            Route::get('inventory/template', [\App\Http\Controllers\Api\Business\InventoryController::class, 'downloadTemplate']);
            Route::post('inventory/import', [\App\Http\Controllers\Api\Business\InventoryController::class, 'import']);
            Route::apiResource('inventory', \App\Http\Controllers\Api\Business\InventoryController::class);
            
            // Price Lists Routes
            Route::apiResource('price-lists', \App\Http\Controllers\Api\Business\PriceListController::class);
            Route::post('price-lists/{priceList}/items', [\App\Http\Controllers\Api\Business\PriceListController::class, 'addItem']);
            Route::delete('price-lists/{priceList}/items/{item}', [\App\Http\Controllers\Api\Business\PriceListController::class, 'removeItem']);
            
            // Invoice Settings
            Route::get('settings/invoice', [\App\Http\Controllers\Api\Business\InvoiceSettingController::class, 'getSettings']);
            Route::post('settings/invoice', [\App\Http\Controllers\Api\Business\InvoiceSettingController::class, 'updateSettings']);
            Route::post('settings/invoice/image/{type}', [\App\Http\Controllers\Api\Business\InvoiceSettingController::class, 'uploadImage']);
            Route::delete('settings/invoice/image/{type}', [\App\Http\Controllers\Api\Business\InvoiceSettingController::class, 'deleteImage']);

            // GST Settings
            Route::get('settings/gst', [\App\Http\Controllers\Api\Business\GstSettingController::class, 'show']);
            Route::post('settings/gst', [\App\Http\Controllers\Api\Business\GstSettingController::class, 'update']);
            
            // Supplier Routes (basic CRUD is free)
            Route::apiResource('suppliers', \App\Http\Controllers\Api\SupplierController::class);
            Route::post('suppliers/{supplier}/payments', [\App\Http\Controllers\Api\SupplierController::class, 'storePayment']);
            
            // Customer Routes
            Route::apiResource('customers', \App\Http\Controllers\Api\CustomerController::class);
            
            // Sales / Invoices (core billing — always free)
            Route::get('sales/{sale}/invoice-pdf', [\App\Http\Controllers\Api\SaleController::class, 'generatePdf']);
            Route::get('invoices/stats', [\App\Http\Controllers\Api\Business\InvoiceController::class, 'stats']);
            Route::post('invoices/{invoice}/convert', [\App\Http\Controllers\Api\Business\InvoiceController::class, 'convert']);
            Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\Api\Business\InvoiceController::class, 'generatePdf']);
            Route::get('invoices/{invoice}/whatsapp', [\App\Http\Controllers\Api\Business\InvoiceController::class, 'sendWhatsapp']);
            Route::apiResource('invoices', \App\Http\Controllers\Api\Business\InvoiceController::class);

            // Document Types (Challans, Proforma, Quotations — free)
            Route::get('challans/pending', [\App\Http\Controllers\Api\Business\ChallanController::class, 'pendingChallans']);
            Route::get('challans/{id}/truck-slip', [\App\Http\Controllers\Api\Business\ChallanController::class, 'generateTruckSlip']);
            Route::post('challans/convert', [\App\Http\Controllers\Api\Business\ChallanController::class, 'convert']);
            Route::apiResource('challans', \App\Http\Controllers\Api\Business\ChallanController::class)->only(['index', 'show']);
            Route::post('proforma/{id}/convert', [\App\Http\Controllers\Api\Business\ProformaController::class, 'convert']);
            Route::apiResource('proforma', \App\Http\Controllers\Api\Business\ProformaController::class)->only(['index', 'show']);
            Route::patch('quotations/{id}/status', [\App\Http\Controllers\Api\Business\QuotationController::class, 'updateStatus']);
            Route::post('quotations/{id}/convert', [\App\Http\Controllers\Api\Business\QuotationController::class, 'convert']);
            Route::apiResource('quotations', \App\Http\Controllers\Api\Business\QuotationController::class)->only(['index', 'show']);
            Route::apiResource('credit-notes', \App\Http\Controllers\Api\Business\CreditNoteController::class)->only(['index', 'store', 'show']);
            Route::apiResource('debit-notes', \App\Http\Controllers\Api\Business\DebitNoteController::class)->only(['index', 'show']);

            // Keep sales as legacy
            Route::apiResource('sales', \App\Http\Controllers\Api\SaleController::class);

            // Staff Management (basic free)
            Route::get('staff/performance', [\App\Http\Controllers\Api\Business\StaffPerformanceController::class, 'index']);
            Route::get('staff/performance/{staff}/products', [\App\Http\Controllers\Api\Business\StaffPerformanceController::class, 'productsSold']);
            Route::get('staff/{id}/sales', [\App\Http\Controllers\Api\Business\StaffController::class, 'salesReport']);
            Route::get('staff/{id}/permissions', [\App\Http\Controllers\Api\Business\StaffController::class, 'getPermissions']);
            Route::put('staff/{id}/permissions', [\App\Http\Controllers\Api\Business\StaffController::class, 'updatePermissions']);
            Route::get('staff/{id}/earnings', [\App\Http\Controllers\Api\Business\StaffController::class, 'earnings']);
            Route::post('staff/{id}/impersonate', [\App\Http\Controllers\Api\Business\StaffController::class, 'impersonate']);
            Route::apiResource('staff', \App\Http\Controllers\Api\Business\StaffController::class);

            // Business Locations (Geo-fence)
            Route::apiResource('locations', \App\Http\Controllers\Api\Business\LocationController::class);

            // Stock Summary (basic read — free)
            Route::get('stock/summary', [\App\Http\Controllers\Api\Business\StockSummaryController::class, 'index']);
            Route::get('stock/movements/{productId}', [\App\Http\Controllers\Api\Business\StockSummaryController::class, 'movements']);
            Route::get('stock/low-stock', [\App\Http\Controllers\Api\Business\StockSummaryController::class, 'lowStock']);
            Route::post('barcode/generate/{productId}', [\App\Http\Controllers\Api\Business\BarcodeController::class, 'generate']);
            Route::post('barcode/scan', [\App\Http\Controllers\Api\Business\BarcodeController::class, 'scan']);

            // ═══════════════════════════════════════════════════════════════
            // PREMIUM TIER — Feature-Gated (Professional / Enterprise only)
            // ═══════════════════════════════════════════════════════════════

            // 🔒 Expenses Module (Professional+)
            Route::middleware(['feature:has_expenses'])->group(function () {
                Route::get('expenses/analytics', [\App\Http\Controllers\Api\Business\ExpenseController::class, 'analytics']);
                Route::get('expenses/categories', [\App\Http\Controllers\Api\Business\ExpenseController::class, 'categories']);
                Route::apiResource('expenses', \App\Http\Controllers\Api\Business\ExpenseController::class);
            });

            // 🔒 Purchase Bills & ITC (Professional+)
            Route::middleware(['feature:has_purchase_bills'])->group(function () {
                Route::get('purchases/itc-summary', [\App\Http\Controllers\Api\Business\PurchaseController::class, 'itcSummary']);
                Route::patch('purchases/itc-summary/{id}/toggle-claim', [\App\Http\Controllers\Api\Business\PurchaseController::class, 'toggleItcClaim']);
                Route::get('purchases/{id}/pdf', [\App\Http\Controllers\Api\Business\PurchaseController::class, 'generatePdf']);
                Route::post('purchases/{id}/payment', [\App\Http\Controllers\Api\Business\PurchaseController::class, 'recordPayment']);
                Route::apiResource('purchases', \App\Http\Controllers\Api\Business\PurchaseController::class);
                Route::apiResource('suppliers', \App\Http\Controllers\Api\SupplierController::class);
        
                // Product Analysis
                Route::get('product-analytics', [\App\Http\Controllers\Api\Business\ProductAnalysisController::class, 'getAnalytics']);
                
                // Marketing
                Route::post('marketing/whatsapp-campaign', [\App\Http\Controllers\Api\Business\MarketingController::class, 'sendWhatsappCampaign']);
                
                Route::post('suppliers/{supplier}/purchases', [\App\Http\Controllers\Api\SupplierController::class, 'storePurchase']);
            });

            // 🔒 Khata / Ledger & Outstanding (Professional+)
            Route::middleware(['feature:has_khata_ledger'])->group(function () {
                Route::get('ledger/customer/{id}', [\App\Http\Controllers\Api\Business\LedgerController::class, 'customerStatement']);
                Route::get('ledger/supplier/{id}', [\App\Http\Controllers\Api\Business\LedgerController::class, 'supplierStatement']);
                Route::get('ledger/customer/{id}/balance', [\App\Http\Controllers\Api\Business\LedgerController::class, 'customerBalance']);
                Route::get('ledger/supplier/{id}/balance', [\App\Http\Controllers\Api\Business\LedgerController::class, 'supplierBalance']);
                Route::get('ledger/customer/{id}/pdf', [\App\Http\Controllers\Api\Business\LedgerController::class, 'customerStatementPdf']);
                Route::get('ledger/supplier/{id}/pdf', [\App\Http\Controllers\Api\Business\LedgerController::class, 'supplierStatementPdf']);
                Route::get('ledger/receipt/{id}/pdf', [\App\Http\Controllers\Api\Business\LedgerController::class, 'paymentReceiptPdf']);
                Route::get('outstanding/customers', [\App\Http\Controllers\Api\Business\OutstandingController::class, 'customers']);
                Route::get('outstanding/suppliers', [\App\Http\Controllers\Api\Business\OutstandingController::class, 'suppliers']);
                Route::get('outstanding/summary', [\App\Http\Controllers\Api\Business\OutstandingController::class, 'summary']);
                Route::post('outstanding/reminder/{partyType}/{partyId}', [\App\Http\Controllers\Api\Business\OutstandingController::class, 'sendReminder']);
            });

            // 🔒 Cash/Bank Book & Day Book (Professional+)
            Route::middleware(['feature:has_cashbook'])->group(function () {
                Route::get('cash-bank/day-book', [\App\Http\Controllers\Api\Business\CashBankController::class, 'dayBook']);
                Route::get('cash-bank/cash-balance', [\App\Http\Controllers\Api\Business\CashBankController::class, 'cashBalance']);
                Route::get('cash-bank/bank-balance/{accountId}', [\App\Http\Controllers\Api\Business\CashBankController::class, 'bankBalance']);
                Route::apiResource('cash-bank', \App\Http\Controllers\Api\Business\CashBankController::class);
                Route::apiResource('bank-accounts', \App\Http\Controllers\Api\Business\BankAccountController::class);
            });

            // 🔒 Cheque Register (Enterprise only)
            Route::middleware(['feature:has_cheques'])->group(function () {
                Route::get('cheques/pending', [\App\Http\Controllers\Api\Business\ChequeController::class, 'pending']);
                Route::get('cheques/upcoming', [\App\Http\Controllers\Api\Business\ChequeController::class, 'upcoming']);
                Route::get('cheques/summary', [\App\Http\Controllers\Api\Business\ChequeController::class, 'summary']);
                Route::patch('cheques/{id}/status', [\App\Http\Controllers\Api\Business\ChequeController::class, 'updateStatus']);
                Route::apiResource('cheques', \App\Http\Controllers\Api\Business\ChequeController::class);
            });

            // 🔒 Multi-Godown Stock Transfers (Professional+)
            Route::middleware(['feature:has_stock_transfer'])->group(function () {
                Route::get('stock/location-wise', [\App\Http\Controllers\Api\Business\StockSummaryController::class, 'locationWise']);
                Route::get('stock-transfers/{id}/slip', [\App\Http\Controllers\Api\Business\StockTransferController::class, 'generateSlip']);
                Route::patch('stock-transfers/{id}/cancel', [\App\Http\Controllers\Api\Business\StockTransferController::class, 'cancel']);
                Route::apiResource('stock-transfers', \App\Http\Controllers\Api\Business\StockTransferController::class)->only(['index', 'store', 'show']);
            });

            // 🔒 Projects, BOQ, Material Consumption & Labour (Enterprise only)
            Route::middleware(['feature:has_projects'])->group(function () {
                Route::get('projects/{id}/stats', [\App\Http\Controllers\Api\Business\ProjectController::class, 'stats']);
                Route::get('projects/{id}/invoices', [\App\Http\Controllers\Api\Business\ProjectController::class, 'invoices']);
                Route::get('projects/{id}/expenses', [\App\Http\Controllers\Api\Business\ProjectController::class, 'expenses']);
                Route::apiResource('projects', \App\Http\Controllers\Api\Business\ProjectController::class);
                Route::get('material-consumptions/project/{projectId}/summary', [\App\Http\Controllers\Api\Business\MaterialConsumptionController::class, 'projectConsumptionSummary']);
                Route::get('material-consumptions/{id}/slip', [\App\Http\Controllers\Api\Business\MaterialConsumptionController::class, 'generateSlip']);
                Route::apiResource('material-consumptions', \App\Http\Controllers\Api\Business\MaterialConsumptionController::class);
                Route::patch('boq/{id}/status', [\App\Http\Controllers\Api\Business\BoqController::class, 'updateStatus']);
                Route::post('boq/{id}/convert', [\App\Http\Controllers\Api\Business\BoqController::class, 'convertToInvoice']);
                Route::get('boq/{id}/pdf', [\App\Http\Controllers\Api\Business\BoqController::class, 'generatePdf']);
                Route::post('boq/{id}/duplicate', [\App\Http\Controllers\Api\Business\BoqController::class, 'duplicate']);
                Route::apiResource('boq', \App\Http\Controllers\Api\Business\BoqController::class);
                Route::get('labour/summary', [\App\Http\Controllers\Api\Business\LabourPaymentController::class, 'summary']);
                Route::get('labour/project/{projectId}', [\App\Http\Controllers\Api\Business\LabourPaymentController::class, 'projectLabour']);
                Route::post('labour/payment', [\App\Http\Controllers\Api\Business\LabourPaymentController::class, 'recordPayment']);
            });

            // 🔒 GST Reports (Professional+)
            Route::middleware(['feature:has_gst_reports'])->prefix('reports')->group(function () {
                Route::get('gst/gstr1', [\App\Http\Controllers\Api\Business\GstReportController::class, 'gstr1']);
                Route::get('gst/gstr3b', [\App\Http\Controllers\Api\Business\GstReportController::class, 'gstr3b']);
                Route::get('gst/hsn', [\App\Http\Controllers\Api\Business\GstReportController::class, 'hsnSummary']);
            });

            // 🔒 Financial Reports — P&L, Balance Sheet, Sales Analysis (Enterprise only)
            Route::middleware(['feature:has_financial_reports'])->prefix('reports')->group(function () {
                Route::get('profit-loss', [\App\Http\Controllers\Api\Business\ProfitLossController::class, 'index']);
                Route::get('balance-sheet', [\App\Http\Controllers\Api\Business\BalanceSheetController::class, 'index']);
                Route::get('sales-analysis', [\App\Http\Controllers\Api\Business\SalesReportController::class, 'index']);
            });

            // 🔒 HR & Payroll Module (Professional+)
            Route::middleware(['feature:has_payroll'])->group(function () {
                Route::post('attendance/import', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'import']);
                Route::get('attendance/today', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'todayStatus']);
                Route::post('attendance/check-in', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'checkIn']);
                Route::post('attendance/check-out', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'checkOut']);
                Route::post('attendance/mark', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'markManual']);
                Route::get('attendance/report', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'monthlyReport']);
                Route::put('attendance/{id}/approve', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'approve']);
                Route::put('attendance/{id}/unapprove', [\App\Http\Controllers\Api\Business\AttendanceController::class, 'unapprove']);
                Route::apiResource('attendance', \App\Http\Controllers\Api\Business\AttendanceController::class)->only(['index']);
                Route::post('payroll/generate', [\App\Http\Controllers\Api\Business\PayrollController::class, 'generate']);
                Route::post('payroll/{payroll}/confirm', [\App\Http\Controllers\Api\Business\PayrollController::class, 'confirm']);
                Route::post('payroll/{payroll}/mark-paid', [\App\Http\Controllers\Api\Business\PayrollController::class, 'markPaid']);
                Route::get('payroll', [\App\Http\Controllers\Api\Business\PayrollController::class, 'index']);
                Route::get('payroll/{payroll}', [\App\Http\Controllers\Api\Business\PayrollController::class, 'show']);
                Route::put('payroll/{payroll}', [\App\Http\Controllers\Api\Business\PayrollController::class, 'update']);
                Route::apiResource('payroll-components', \App\Http\Controllers\Api\Business\PayrollComponentController::class);
                Route::get('leave-policies', [\App\Http\Controllers\Api\Business\PayrollController::class, 'leavePolicies']);
                Route::post('leave-policies', [\App\Http\Controllers\Api\Business\PayrollController::class, 'storeLeavePolicy']);
                Route::put('leave-policies/{leavePolicy}', [\App\Http\Controllers\Api\Business\PayrollController::class, 'updateLeavePolicy']);
                Route::delete('leave-policies/{leavePolicy}', [\App\Http\Controllers\Api\Business\PayrollController::class, 'deleteLeavePolicy']);
                Route::get('salary-advances', [\App\Http\Controllers\Api\Business\PayrollController::class, 'salaryAdvances']);
                Route::post('salary-advances', [\App\Http\Controllers\Api\Business\PayrollController::class, 'storeSalaryAdvance']);
                Route::patch('salary-advances/{salaryAdvance}/status', [\App\Http\Controllers\Api\Business\PayrollController::class, 'updateSalaryAdvanceStatus']);
                Route::apiResource('leave-requests', \App\Http\Controllers\Api\Business\LeaveRequestController::class);
                Route::patch('leave-requests/{leave_request}/status', [\App\Http\Controllers\Api\Business\LeaveRequestController::class, 'updateStatus']);
            });

            // 🔒 System Audit Logs (Professional+)
            Route::middleware(['feature:has_activity_logs'])->group(function () {
                Route::get('activity-logs', [\App\Http\Controllers\Api\Business\ActivityLogController::class, 'index']);
            });

            // ═══════════════════════════════════════════════════════════════
            // 🏨 HOTEL MANAGEMENT MODULE — Phase 1: Property + Rooms
            // ═══════════════════════════════════════════════════════════════

            // 🔒 Hotel Dashboard (feature: has_hotel_dashboard)
            Route::middleware(['feature:has_hotel_dashboard'])->prefix('hotel')->group(function () {
                Route::get('dashboard', [\App\Http\Controllers\Api\Business\HotelDashboardController::class, 'index']);
                Route::get('dashboard/room-grid', [\App\Http\Controllers\Api\Business\HotelDashboardController::class, 'roomGrid']);
                Route::get('dashboard/today-arrivals', [\App\Http\Controllers\Api\Business\HotelDashboardController::class, 'todayArrivals']);
                Route::get('dashboard/today-departures', [\App\Http\Controllers\Api\Business\HotelDashboardController::class, 'todayDepartures']);
            });

            // 🔒 Hotel Rooms & Property (feature: has_hotel_rooms)
            Route::middleware(['feature:has_hotel_rooms'])->prefix('hotel')->group(function () {
                // Property Settings
                Route::get('property-settings', [\App\Http\Controllers\Api\Business\HotelPropertyController::class, 'show']);
                Route::post('property-settings', [\App\Http\Controllers\Api\Business\HotelPropertyController::class, 'update']);

                // Room Types
                Route::apiResource('room-types', \App\Http\Controllers\Api\Business\HotelRoomTypeController::class);

                // Rooms
                Route::patch('rooms/{id}/status', [\App\Http\Controllers\Api\Business\HotelRoomController::class, 'updateStatus']);
                Route::apiResource('rooms', \App\Http\Controllers\Api\Business\HotelRoomController::class);

                // Rate Plans
                Route::apiResource('rate-plans', \App\Http\Controllers\Api\Business\HotelRatePlanController::class);
            });

            // 🔒 Hotel Reservations & Front Desk (feature: has_hotel_reservations)
            Route::middleware(['feature:has_hotel_reservations'])->prefix('hotel')->group(function () {
                // Guests
                Route::apiResource('guests', \App\Http\Controllers\Api\Business\HotelGuestController::class);
                
                // Bookings & Front Desk
                Route::post('bookings/{id}/check-in', [\App\Http\Controllers\Api\Business\HotelBookingController::class, 'checkIn']);
                Route::post('bookings/{id}/check-out', [\App\Http\Controllers\Api\Business\HotelBookingController::class, 'checkOut']);
                Route::post('bookings/{id}/payments', [\App\Http\Controllers\Api\Business\HotelBookingController::class, 'addPayment']);
                Route::apiResource('bookings', \App\Http\Controllers\Api\Business\HotelBookingController::class);
                
                // Folio Charges
                Route::post('bookings/{booking}/folio', [\App\Http\Controllers\Api\Business\HotelFolioController::class, 'store']);
                Route::delete('bookings/{booking}/folio/{charge}', [\App\Http\Controllers\Api\Business\HotelFolioController::class, 'destroy']);
            });

            // 🔒 Hotel POS (feature: has_hotel_pos)
            Route::middleware(['feature:has_hotel_pos'])->prefix('hotel')->group(function () {
                // Outlets (Restaurant, Bar, Spa, etc.)
                Route::get('outlets', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'indexOutlets']);
                Route::post('outlets', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'storeOutlet']);
                Route::put('outlets/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'updateOutlet']);
                Route::delete('outlets/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'destroyOutlet']);

                // Services / Menu Catalog
                Route::get('services', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'indexServices']);
                Route::post('services', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'storeService']);
                Route::put('services/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'updateService']);
                Route::delete('services/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'destroyService']);

                // POS Orders
                Route::get('pos-orders', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'indexOrders']);
                Route::get('pos-orders/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'showOrder']);
                Route::post('pos-orders', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'storeOrder']);
                Route::patch('pos-orders/{id}/status', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'updateStatus']);
                Route::post('pos-orders/{id}/bill', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'bill']);
                Route::post('pos-orders/{id}/post-to-room', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'postToRoom']);
                Route::post('pos-orders/{id}/kot', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'kotPrint']);

                // Tables
                Route::get('tables', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'indexTables']);
                Route::post('tables', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'storeTable']);
                Route::put('tables/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'updateTable']);
                Route::delete('tables/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'destroyTable']);

                // Table Reservations
                Route::get('table-reservations', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'indexReservations']);
                Route::post('table-reservations', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'storeReservation']);
                Route::put('table-reservations/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'updateReservation']);
                Route::delete('table-reservations/{id}', [\App\Http\Controllers\Api\Business\HotelPosController::class, 'destroyReservation']);
            });

            // Subscription & Billing
            Route::get('subscriptions/history', [\App\Http\Controllers\Api\Business\SubscriptionController::class, 'history']);
            Route::post('subscriptions/create-order', [\App\Http\Controllers\Api\Business\SubscriptionController::class, 'createOrder']);
            Route::post('subscriptions/verify-payment', [\App\Http\Controllers\Api\Business\SubscriptionController::class, 'verifyPayment']);
            Route::get('subscriptions/{paymentId}/invoice', [\App\Http\Controllers\Api\Business\SubscriptionController::class, 'invoicePdf']);
            // 🔒 Hotel Housekeeping (feature: has_hotel_housekeeping)
            Route::middleware(['feature:has_hotel_housekeeping'])->prefix('hotel')->group(function () {
                Route::get('housekeeping', [\App\Http\Controllers\Api\Business\HotelHousekeepingController::class, 'index']);
                Route::post('housekeeping', [\App\Http\Controllers\Api\Business\HotelHousekeepingController::class, 'store']);
                Route::patch('housekeeping/{task}/status', [\App\Http\Controllers\Api\Business\HotelHousekeepingController::class, 'updateStatus']);
                Route::patch('housekeeping/{task}/assign', [\App\Http\Controllers\Api\Business\HotelHousekeepingController::class, 'assign']);
                Route::post('housekeeping/{task}/report-issue', [\App\Http\Controllers\Api\Business\HotelHousekeepingController::class, 'reportIssue']);
                Route::get('housekeeping/daily-report', [\App\Http\Controllers\Api\Business\HotelHousekeepingController::class, 'dailyReport']);
            });

            // 🔒 Hotel Shift Roster (feature: has_hotel_shift_roster)
            Route::middleware(['feature:has_hotel_shift_roster'])->prefix('hotel')->group(function () {
                // Departments
                Route::get('departments', [\App\Http\Controllers\Api\Business\HotelDepartmentController::class, 'index']);
                Route::post('departments', [\App\Http\Controllers\Api\Business\HotelDepartmentController::class, 'store']);
                Route::put('departments/{id}', [\App\Http\Controllers\Api\Business\HotelDepartmentController::class, 'update']);
                Route::delete('departments/{id}', [\App\Http\Controllers\Api\Business\HotelDepartmentController::class, 'destroy']);

                // Shifts
                Route::get('shifts', [\App\Http\Controllers\Api\Business\HotelShiftController::class, 'index']);
                Route::post('shifts', [\App\Http\Controllers\Api\Business\HotelShiftController::class, 'store']);
                Route::put('shifts/{id}', [\App\Http\Controllers\Api\Business\HotelShiftController::class, 'update']);
                Route::delete('shifts/{id}', [\App\Http\Controllers\Api\Business\HotelShiftController::class, 'destroy']);

                // Roster
                Route::get('roster/staff-list', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'staffList']);
                Route::get('roster', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'index']);
                Route::post('roster', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'store']);
                Route::post('roster/bulk-assign', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'bulkAssign']);
                Route::patch('roster/{id}/status', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'updateStatus']);
                Route::patch('roster/{id}/swap-request', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'requestSwap']);
                Route::patch('roster/{id}/approve-swap', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'approveSwap']);
                Route::delete('roster/{id}', [\App\Http\Controllers\Api\Business\HotelRosterController::class, 'destroy']);
            });

            // 🔒 Hotel OTA Integration (feature: has_hotel_ota)
            Route::middleware(['feature:has_hotel_ota'])->prefix('hotel')->group(function () {
                Route::apiResource('ota-channels', \App\Http\Controllers\Api\Business\HotelOtaChannelController::class);
                Route::get('ota/sync-history', [\App\Http\Controllers\Api\Business\HotelOtaSyncController::class, 'index']);
                Route::post('ota/sync-all', [\App\Http\Controllers\Api\Business\HotelOtaSyncController::class, 'syncAll']);
                // OTA Bookings will reuse the existing bookings controller or we can create a separate one.
                // We'll filter OTA bookings in the frontend or add a query param.
            });

            // Night Audit
            Route::middleware(['feature:has_hotel_night_audit'])->prefix('hotel')->group(function () {
                Route::post('night-audit/run', [\App\Http\Controllers\Api\Business\HotelNightAuditController::class, 'run']);
                Route::get('night-audit', [\App\Http\Controllers\Api\Business\HotelNightAuditController::class, 'history']);
                Route::get('night-audit/preview', [\App\Http\Controllers\Api\Business\HotelNightAuditController::class, 'previewTotals']);
            });

            // GST Config & Compliance
            Route::middleware(['feature:has_hotel_gst_compliance'])->prefix('hotel')->group(function () {
                Route::get('tax-config', [\App\Http\Controllers\Api\Business\HotelGstController::class, 'show']);
                Route::post('tax-config', [\App\Http\Controllers\Api\Business\HotelGstController::class, 'update']);
            });

            // Reports & Analytics
            Route::middleware(['feature:has_hotel_reports'])->prefix('hotel/reports')->group(function () {
                Route::get('occupancy', [\App\Http\Controllers\Api\Business\HotelReportController::class, 'occupancy']);
                Route::get('revenue', [\App\Http\Controllers\Api\Business\HotelReportController::class, 'revenue']);
                Route::get('channel-wise', [\App\Http\Controllers\Api\Business\HotelReportController::class, 'channelWise']);
                Route::get('mis-summary', [\App\Http\Controllers\Api\Business\HotelReportController::class, 'misSummary']);
            });

            // Corporate Accounts & City Ledger
            Route::middleware(['feature:has_hotel_corporate'])->prefix('hotel')->group(function () {
                Route::apiResource('corporate-accounts', \App\Http\Controllers\Api\Business\HotelCorporateController::class);
                Route::get('corporate-accounts/{id}/statement', [\App\Http\Controllers\Api\Business\HotelCorporateController::class, 'statement']);
                Route::post('corporate-accounts/{id}/payment', [\App\Http\Controllers\Api\Business\HotelCorporateController::class, 'recordPayment']);
            });

        });

        // Public Webhooks for OTA (Outside auth middleware)
        Route::post('/ota/webhook/{channelName}', [\App\Http\Controllers\Api\HotelOtaWebhookController::class, 'handle']);


        // Profile (any authenticated user)
        Route::get('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'show']);
        Route::patch('/profile', [\App\Http\Controllers\Api\ProfileController::class, 'update']);
        Route::post('/profile/avatar', [\App\Http\Controllers\Api\ProfileController::class, 'uploadAvatar']);
        Route::delete('/profile/avatar', [\App\Http\Controllers\Api\ProfileController::class, 'removeAvatar']);
        Route::post('/profile/password', [\App\Http\Controllers\Api\ProfileController::class, 'changePassword']);
        
        // Superadmin Routes
        Route::middleware(['superadmin'])->prefix('superadmin')->group(function () {
            // Dashboard
            Route::get('/dashboard/stats', [\App\Http\Controllers\Api\Superadmin\SuperadminDashboardController::class, 'stats']);

            // Subscriptions
            Route::get('/subscriptions', [\App\Http\Controllers\Api\Superadmin\SuperadminSubscriptionController::class, 'index']);
            
            // Settings
            Route::put('/settings', [\App\Http\Controllers\Api\Superadmin\SettingController::class, 'update']);
            Route::post('/settings/logo', [\App\Http\Controllers\Api\Superadmin\SettingController::class, 'uploadLogo']);
            Route::post('/settings/favicon', [\App\Http\Controllers\Api\Superadmin\SettingController::class, 'uploadFavicon']);

            // Plans
            Route::apiResource('plans', \App\Http\Controllers\Api\Superadmin\PlanController::class);

            // Tenants
            Route::get('/businesses', [\App\Http\Controllers\Api\Superadmin\TenantController::class, 'index']);
            Route::patch('/businesses/{id}', [\App\Http\Controllers\Api\Superadmin\TenantController::class, 'update']);
            Route::patch('/businesses/{id}/status', [\App\Http\Controllers\Api\Superadmin\TenantController::class, 'updateStatus']);
            Route::patch('/businesses/{id}/password', [\App\Http\Controllers\Api\Superadmin\TenantController::class, 'resetPassword']);
            Route::post('/businesses/onboard', [\App\Http\Controllers\Api\Superadmin\TenantController::class, 'onboard']);

            // Partners
            Route::get('/partners/{id}/analytics', [\App\Http\Controllers\Api\Superadmin\PartnerController::class, 'analytics']);
            Route::apiResource('partners', \App\Http\Controllers\Api\Superadmin\PartnerController::class);
            Route::apiResource('partner-resources', \App\Http\Controllers\Api\Superadmin\PartnerResourceController::class);

            // Commissions
            Route::get('/commissions', [\App\Http\Controllers\Api\Superadmin\CommissionController::class, 'index']);
            Route::get('/commissions/{id}', [\App\Http\Controllers\Api\Superadmin\CommissionController::class, 'show']);
            Route::patch('/commissions/{id}/mark-paid', [\App\Http\Controllers\Api\Superadmin\CommissionController::class, 'markAsPaid']);

            // Leads
            Route::get('/leads/stats', [\App\Http\Controllers\Api\Superadmin\LeadController::class, 'stats']);
            Route::post('/leads/import', [\App\Http\Controllers\Api\Superadmin\LeadController::class, 'import']);
            Route::post('/leads/bulk-message', [\App\Http\Controllers\Api\Superadmin\BulkMessageController::class, 'send']);
            Route::apiResource('leads', \App\Http\Controllers\Api\Superadmin\LeadController::class);
            Route::get('/leads/{id}/contacts', [\App\Http\Controllers\Api\Superadmin\LeadController::class, 'contacts']);
            Route::post('/leads/{id}/contacts', [\App\Http\Controllers\Api\Superadmin\LeadController::class, 'logContact']);
            Route::delete('/leads/{leadId}/contacts/{contactId}', [\App\Http\Controllers\Api\Superadmin\LeadController::class, 'deleteContact']);

            // Templates & Logs (Marketing)
            Route::apiResource('templates', \App\Http\Controllers\Api\Superadmin\TemplateController::class);
            Route::get('/message-logs', [\App\Http\Controllers\Api\Superadmin\MessageLogController::class, 'index']);

            // Users
            Route::get('/users/roles', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'roles']);
            Route::get('/users/stats', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'stats']);
            Route::get('/users', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'index']);
            Route::post('/users', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'store']);
            Route::get('/users/{id}', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'show']);
            Route::patch('/users/{id}', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'update']);
            Route::patch('/users/{id}/status', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'updateStatus']);
            Route::delete('/users/{id}', [\App\Http\Controllers\Api\Superadmin\UserController::class, 'destroy']);

            // Roles & Permissions
            Route::apiResource('roles', \App\Http\Controllers\Api\Superadmin\RoleController::class);

            // System Logs & Optimization
            Route::get('/system/logs', [\App\Http\Controllers\Api\Superadmin\SystemController::class, 'getLogs']);
            Route::delete('/system/logs', [\App\Http\Controllers\Api\Superadmin\SystemController::class, 'clearLogs']);
            Route::post('/system/cache/clear', [\App\Http\Controllers\Api\Superadmin\SystemController::class, 'clearCache']);
            Route::post('/system/cache/optimize', [\App\Http\Controllers\Api\Superadmin\SystemController::class, 'optimizeApp']);

            // Payouts Management
            Route::get('/payouts/stats', [\App\Http\Controllers\Api\Superadmin\PayoutController::class, 'stats']);
            Route::get('/payouts', [\App\Http\Controllers\Api\Superadmin\PayoutController::class, 'index']);
            Route::get('/payouts/{id}', [\App\Http\Controllers\Api\Superadmin\PayoutController::class, 'show']);
            Route::patch('/payouts/{id}/approve', [\App\Http\Controllers\Api\Superadmin\PayoutController::class, 'approve']);
            Route::patch('/payouts/{id}/reject', [\App\Http\Controllers\Api\Superadmin\PayoutController::class, 'reject']);
            Route::patch('/payouts/{id}/paid', [\App\Http\Controllers\Api\Superadmin\PayoutController::class, 'markPaid']);
        });



        // ── Partner Portal Routes ──
        Route::middleware(['partner'])->prefix('partner')->group(function () {
            Route::get('/dashboard', [PartnerPortalController::class, 'dashboard']);
            Route::get('/referrals', [PartnerPortalController::class, 'referrals']);
            Route::get('/referrals/{id}', [PartnerPortalController::class, 'referralDetail']);
            Route::get('/referral-link', [PartnerPortalController::class, 'referralLink']);
            Route::get('/commissions', [PartnerPortalController::class, 'commissions']);
            Route::get('/commissions/stats', [PartnerPortalController::class, 'commissionStats']);
            Route::get('/payouts', [PartnerPortalController::class, 'payouts']);
            Route::post('/payouts', [PartnerPortalController::class, 'createPayout']);
            Route::get('/profile', [PartnerPortalController::class, 'profile']);
            Route::patch('/profile', [PartnerPortalController::class, 'updateProfile']);
            Route::patch('/payout-details', [PartnerPortalController::class, 'updatePayoutDetails']);
            Route::post('/change-password', [PartnerPortalController::class, 'changePassword']);

            // Resources (Marketing Assets)
            Route::get('/resources', [\App\Http\Controllers\Api\Partner\ResourceController::class, 'index']);
            Route::get('/resources/{id}/download', [\App\Http\Controllers\Api\Partner\ResourceController::class, 'download']);

            // Direct Client Onboarding
            Route::get('/plans', [PartnerPortalController::class, 'plans']);
            Route::post('/clients/onboard', [PartnerPortalController::class, 'onboardClient']);
        });
    });
});
