<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Expense;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\LedgerEntry;
use App\Models\CashBankEntry;
use App\Models\BankAccount;
use App\Models\ChequeRegister;
use App\Models\Project;
use App\Models\MaterialConsumptionItem;
use App\Services\Business\StockService;
use App\Services\Business\PayrollService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    protected function getBusinessId(Request $request)
    {
        return app()->bound('current_business_id') 
            ? app('current_business_id') 
            : ($request->user() ? ($request->user()->business_id ?? $request->user()->businesses()->first()?->id) : null);
    }

    public function stats(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        // 1. Today's Sales
        $todaySales = floatval(Sale::where('business_id', $businessId)
            ->whereDate('date', $today)
            ->where('invoice_number', 'not like', 'UDH-%')
            ->sum('final_amount'));

        // 2. This Month's Revenue
        $monthlyRevenue = floatval(Sale::where('business_id', $businessId)
            ->where('date', '>=', $thisMonth)
            ->where('invoice_number', 'not like', 'UDH-%')
            ->sum('final_amount'));

        // 3. Pending Payments (Expected due on sales)
        $pendingSalesAmount = floatval(Sale::where('business_id', $businessId)
            ->whereIn('status', ['pending', 'partial'])
            ->where('invoice_number', 'not like', 'UDH-%')
            ->sum('final_amount'));
        $paidOnPending = floatval(Sale::where('business_id', $businessId)
            ->whereIn('status', ['pending', 'partial'])
            ->where('invoice_number', 'not like', 'UDH-%')
            ->sum('paid_amount'));
        $pendingPayments = $pendingSalesAmount - $paidOnPending;

        // 4. Staff Attendance (Today)
        $activeStaffCount = User::whereHas('businesses', function ($q) use ($businessId) {
            $q->where('business_id', $businessId);
        })->where('status', 'active')->count();

        $presentToday = Attendance::where('business_id', $businessId)
            ->whereDate('date', $today)
            ->whereIn('status', ['present', 'half_day'])
            ->count();

        // 5. This Month's Expenses
        $monthlyExpenses = floatval(Expense::where('business_id', $businessId)
            ->where('expense_date', '>=', $thisMonth)
            ->sum('amount'));

        // 6. Total Invoices This Month
        $totalInvoices = Sale::where('business_id', $businessId)
            ->where('date', '>=', $thisMonth)
            ->where('invoice_number', 'not like', 'UDH-%')
            ->count();

        // 7. Liquidity: Cash in Hand & Bank Balances
        $cashStats = CashBankEntry::where('business_id', $businessId)
            ->where('account_type', 'cash')
            ->selectRaw("
                SUM(CASE WHEN entry_type = 'cash_receipt' THEN amount ELSE 0 END) as receipts,
                SUM(CASE WHEN entry_type = 'cash_payment' THEN amount ELSE 0 END) as payments
            ")
            ->first();
        $cashInHand = floatval(($cashStats->receipts ?? 0) - ($cashStats->payments ?? 0));

        $totalBankBalance = floatval(BankAccount::where('business_id', $businessId)->sum('current_balance'));

        // 8. Khata Receivables & Payables (Outstanding Ledger Balances)
        $customerIds = Customer::where('business_id', $businessId)->pluck('id')->toArray();
        $totalReceivable = 0.0;
        if (!empty($customerIds)) {
            $latestCustomerEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', 'customer')
                ->whereIn('party_id', $customerIds)
                ->select('party_id', DB::raw('MAX(id) as last_id'))
                ->groupBy('party_id')
                ->pluck('last_id');

            $totalReceivable = floatval(LedgerEntry::whereIn('id', $latestCustomerEntries)
                ->where('balance', '>', 0)
                ->sum('balance'));

            // Fallback to opening balance if no ledger entries
            if ($totalReceivable == 0) {
                $totalReceivable = floatval(Customer::where('business_id', $businessId)->sum('opening_balance'));
            }
        }

        $supplierIds = Supplier::where('business_id', $businessId)->pluck('id')->toArray();
        $totalPayable = 0.0;
        if (!empty($supplierIds)) {
            $latestSupplierEntries = LedgerEntry::where('business_id', $businessId)
                ->where('party_type', 'supplier')
                ->whereIn('party_id', $supplierIds)
                ->select('party_id', DB::raw('MAX(id) as last_id'))
                ->groupBy('party_id')
                ->pluck('last_id');

            $totalPayable = floatval(LedgerEntry::whereIn('id', $latestSupplierEntries)
                ->where('balance', '>', 0)
                ->sum('balance'));

            if ($totalPayable == 0) {
                $totalPayable = floatval(Supplier::where('business_id', $businessId)->sum('opening_balance'));
            }
        }

        // 9. Recent Invoices (Latest 5)
        $recentInvoices = Sale::with(['customer:id,name'])
            ->where('business_id', $businessId)
            ->where('invoice_number', 'not like', 'UDH-%')
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get(['id', 'invoice_number', 'customer_id', 'date', 'final_amount', 'status'])
            ->map(function ($inv) {
                return [
                    'id' => $inv->id,
                    'invoice_number' => $inv->invoice_number,
                    'customer_name' => $inv->customer?->name ?? 'Cash Walk-in',
                    'date' => Carbon::parse($inv->date)->format('Y-m-d'),
                    'amount' => round(floatval($inv->final_amount), 2),
                    'status' => $inv->status,
                ];
            })->values()->toArray();

        // 10. Top 5 Buying Customers This Month
        $topCustomers = Sale::with('customer:id,name,phone')
            ->where('business_id', $businessId)
            ->whereIn('status', ['paid', 'partial', 'pending'])
            ->where('invoice_number', 'not like', 'UDH-%')
            ->whereDate('date', '>=', $thisMonth)
            ->whereNotNull('customer_id')
            ->selectRaw('customer_id, SUM(final_amount) as total_volume, COUNT(id) as invoices_count')
            ->groupBy('customer_id')
            ->orderByDesc('total_volume')
            ->limit(5)
            ->get()
            ->map(function ($row) {
                return [
                    'id' => $row->customer_id,
                    'name' => $row->customer?->name ?? 'Unknown Client',
                    'phone' => $row->customer?->phone ?? '',
                    'total_volume' => round(floatval($row->total_volume), 2),
                    'invoices_count' => intval($row->invoices_count),
                ];
            })->values()->toArray();

        // 11. Low Stock Inventory Alert
        $stockService = app(StockService::class);
        $lowStockItems = $stockService->getLowStockItems($businessId)
            ->take(5)
            ->map(function ($prod) {
                return [
                    'id' => $prod->id,
                    'name' => $prod->name,
                    'unit' => $prod->unit ?? 'pcs',
                    'min_stock_alert' => floatval($prod->min_stock_alert ?? 0),
                    'total_stock' => floatval($prod->total_stock ?? 0),
                ];
            })->values()->toArray();

        // 12. Pending Cheques (Uncleared Issued & Received Cheques)
        $pendingCheques = ChequeRegister::where('business_id', $businessId)
            ->whereIn('status', ['pending', 'deposited'])
            ->orderBy('cheque_date', 'asc')
            ->limit(5)
            ->get(['id', 'cheque_number', 'bank_name', 'party_type', 'party_id', 'cheque_date', 'amount', 'status', 'type'])
            ->map(function ($chk) {
                return [
                    'id' => $chk->id,
                    'cheque_number' => $chk->cheque_number,
                    'bank_name' => $chk->bank_name ?? 'Bank',
                    'party_type' => $chk->party_type,
                    'cheque_date' => Carbon::parse($chk->cheque_date)->format('Y-m-d'),
                    'amount' => round(floatval($chk->amount), 2),
                    'status' => $chk->status,
                    'type' => $chk->type,
                ];
            })->values()->toArray();

        // 13. Active Running Projects
        $activeProjects = Project::where('business_id', $businessId)
            ->where('status', 'in_progress')
            ->limit(5)
            ->get()
            ->map(function ($project) {
                $consumedValue = floatval(MaterialConsumptionItem::whereHas('consumption', function ($q) use ($project) {
                    $q->where('project_id', $project->id);
                })->sum('amount'));
                $expenseValue = floatval($project->expenses()->sum('amount'));
                $totalCost = $consumedValue + $expenseValue;
                $contractValue = floatval($project->contract_value ?? 0);
                $progress = $contractValue > 0 ? min(100, round(($totalCost / $contractValue) * 100)) : 0;
                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'project_code' => $project->project_code ?? ('PRJ-' . $project->id),
                    'client_name' => $project->client_name ?? '',
                    'contract_value' => $contractValue,
                    'total_cost' => round($totalCost, 2),
                    'progress' => $progress,
                ];
            })->values()->toArray();

        // 14. Trend Chart (Last 14 Days Sales vs Expense)
        $fourteenDaysAgo = Carbon::today()->subDays(13)->toDateString();
        $todayDateStr = Carbon::today()->toDateString();

        $salesGrouped = Sale::where('business_id', $businessId)
            ->whereIn('status', ['paid', 'partial', 'pending'])
            ->where('invoice_number', 'not like', 'UDH-%')
            ->whereDate('date', '>=', $fourteenDaysAgo)
            ->whereDate('date', '<=', $todayDateStr)
            ->selectRaw("DATE(date) as dt, SUM(final_amount) as total")
            ->groupBy('dt')
            ->pluck('total', 'dt')
            ->toArray();

        $expensesGrouped = Expense::where('business_id', $businessId)
            ->whereDate('expense_date', '>=', $fourteenDaysAgo)
            ->whereDate('expense_date', '<=', $todayDateStr)
            ->selectRaw("DATE(expense_date) as dt, SUM(amount) as total")
            ->groupBy('dt')
            ->pluck('total', 'dt')
            ->toArray();

        $chartData = [];
        for ($i = 13; $i >= 0; $i--) {
            $dateObj = Carbon::today()->subDays($i);
            $dateStr = $dateObj->toDateString();
            $chartData[] = [
                'date' => $dateStr,
                'label' => $dateObj->format('M d'),
                'revenue' => round(floatval($salesGrouped[$dateStr] ?? 0), 2),
                'expense' => round(floatval($expensesGrouped[$dateStr] ?? 0), 2),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'today_sales' => round($todaySales, 2),
                'monthly_revenue' => round($monthlyRevenue, 2),
                'monthly_expenses' => round($monthlyExpenses, 2),
                'pending_payments' => round($pendingPayments, 2),
                'total_invoices' => intval($totalInvoices),
                'cash_in_hand' => round($cashInHand, 2),
                'bank_balance' => round($totalBankBalance, 2),
                'total_receivables' => round($totalReceivable, 2),
                'total_payables' => round($totalPayable, 2),
                'staff' => [
                    'active' => $activeStaffCount,
                    'present_today' => $presentToday,
                ],
                'recent_sales' => $recentInvoices,
                'recent_invoices' => $recentInvoices,
                'top_customers' => $topCustomers,
                'low_stock_items' => $lowStockItems,
                'pending_cheques' => $pendingCheques,
                'active_projects' => $activeProjects,
                'revenue_chart' => $chartData,
            ]
        ]);
    }

    public function staffEarnings(Request $request)
    {
        $user = $request->user();
        $businessId = $this->getBusinessId($request);
        $month = Carbon::now()->format('Y-m');

        $staffData = DB::table('business_user')
            ->where('business_id', $businessId)
            ->where('user_id', $user->id)
            ->first();

        $salaryType = $staffData->salary_type ?? 'monthly';

        $payrollService = app(PayrollService::class);
        $draftPayroll = $payrollService->generateForEmployee($user->id, $month);

        $today = Carbon::today();
        
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();
            
        $todayCommission = \App\Models\SaleCommission::where('user_id', $user->id)
            ->whereDate('created_at', $today)
            ->sum('commission_amount');

        $todayEarnings = 0;
        if ($todayAttendance && in_array($todayAttendance->status, ['present', 'half_day'])) {
            $multiplier = ($todayAttendance->status === 'half_day') ? 0.5 : 1;
            $todayEarnings = ($draftPayroll->per_day_salary * $multiplier);
        }
        $todayEarnings += $todayCommission;

        if ($salaryType === 'daily') {
            $monthlyEarnings = $draftPayroll->base_salary + $draftPayroll->total_commission;
            $draftDues = $monthlyEarnings - $draftPayroll->advance_deduction;
        } else {
            $effectivePresent = $draftPayroll->present_days + ($draftPayroll->half_days * 0.5) + $draftPayroll->paid_leaves;
            $earnedBaseTillDate = $effectivePresent * $draftPayroll->per_day_salary;
            $monthlyEarnings = $earnedBaseTillDate + $draftPayroll->total_commission;
            $draftDues = $monthlyEarnings - $draftPayroll->advance_deduction;
        }

        $advanceTaken = $draftPayroll->advance_deduction;

        $unpaidPayrolls = \App\Models\Payroll::where('user_id', $user->id)
            ->where('status', 'confirmed')
            ->sum('final_salary');

        $totalDues = $unpaidPayrolls + $draftDues;

        return response()->json([
            'success' => true,
            'data' => [
                'today_earnings' => round($todayEarnings, 2),
                'monthly_earnings' => round($monthlyEarnings, 2),
                'advance_taken' => round($advanceTaken, 2),
                'total_dues' => round($totalDues, 2),
            ]
        ]);
    }
}
