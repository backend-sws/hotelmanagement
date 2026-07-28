<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Expense;
use App\Models\MaterialConsumption;
use App\Models\MaterialConsumptionItem;
use App\Models\Payroll;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProfitLossController extends Controller
{
    protected function getBusinessId(Request $request)
    {
        return app()->bound('current_business_id') ? app('current_business_id') : ($request->user() ? ($request->user()->business_id ?? $request->user()->businesses()->first()?->id) : null);
    }

    protected function getDateRange(Request $request)
    {
        $fromDate = $request->input('from_date', Carbon::now()->startOfYear()->toDateString());
        $toDate = $request->input('to_date', Carbon::now()->endOfYear()->toDateString());
        return [$fromDate, $toDate];
    }

    public function index(Request $request)
    {
        $businessId = $this->getBusinessId($request);
        list($fromDate, $toDate) = $this->getDateRange($request);

        // 1. Revenues (Outward Sales - Credit Notes + Debit Notes)
        $sales = Sale::where('business_id', $businessId)
            ->whereIn('invoice_type', ['sales_invoice', 'credit_note', 'debit_note'])
            ->where('status', '!=', 'cancelled')
            ->whereBetween('date', [$fromDate, $toDate])
            ->get();

        $grossSales = 0;
        $creditNotes = 0;
        $debitNotes = 0;

        foreach ($sales as $s) {
            $val = floatval($s->final_amount ?? $s->total_amount ?? 0);
            if ($s->invoice_type === 'sales_invoice') {
                $grossSales += $val;
            } elseif ($s->invoice_type === 'credit_note') {
                $creditNotes += $val;
            } elseif ($s->invoice_type === 'debit_note') {
                $debitNotes += $val;
            }
        }

        $netRevenue = $grossSales - $creditNotes + $debitNotes;

        // 2. Direct Costs (Material Consumptions + Contractor/Labour Wages)
        $consumptionIds = MaterialConsumption::where('business_id', $businessId)
            ->whereBetween('date', [$fromDate, $toDate])
            ->pluck('id');
        $materialCost = floatval(MaterialConsumptionItem::whereIn('consumption_id', $consumptionIds)->sum('amount'));

        $payrollCost = floatval(Payroll::where('business_id', $businessId)
            ->whereBetween('created_at', [$fromDate . ' 00:00:00', $toDate . ' 23:59:59'])
            ->sum('final_salary'));

        $expenses = Expense::where('business_id', $businessId)
            ->whereBetween('expense_date', [$fromDate, $toDate])
            ->get();

        $labourExpenseCost = 0;
        $indirectExpensesMap = [];
        $totalIndirectExpenses = 0;

        foreach ($expenses as $exp) {
            $catName = is_string($exp->category) ? strtolower($exp->category) : ($exp->category ? strtolower($exp->category->name ?? '') : 'general');
            if (empty($catName)) $catName = 'general';

            if (str_contains($catName, 'labour') || str_contains(strtolower($exp->description ?? ''), 'labour') || str_contains(strtolower($exp->description ?? ''), 'wage')) {
                $labourExpenseCost += floatval($exp->amount);
            } else {
                $val = floatval($exp->amount);
                $totalIndirectExpenses += $val;
                $displayCat = ucwords($catName);
                if (!isset($indirectExpensesMap[$displayCat])) {
                    $indirectExpensesMap[$displayCat] = 0;
                }
                $indirectExpensesMap[$displayCat] += $val;
            }
        }

        $totalLabourCost = $payrollCost + $labourExpenseCost;
        $totalDirectCosts = $materialCost + $totalLabourCost;

        // 3. Gross Profit & Margin
        $grossProfit = $netRevenue - $totalDirectCosts;
        $grossMarginPercent = ($netRevenue > 0) ? ($grossProfit / $netRevenue) * 100 : 0;

        // 4. Net Profit & Margin
        $netProfit = $grossProfit - $totalIndirectExpenses;
        $netMarginPercent = ($netRevenue > 0) ? ($netProfit / $netRevenue) * 100 : 0;

        // Format indirect expenses array for chart / tables
        $indirectExpensesList = [];
        foreach ($indirectExpensesMap as $cat => $amt) {
            $indirectExpensesList[] = [
                'category' => $cat,
                'amount' => round($amt, 2),
                'percentage' => ($totalIndirectExpenses > 0) ? round(($amt / $totalIndirectExpenses) * 100, 1) : 0,
            ];
        }

        return response()->json([
            'data' => [
                'revenue' => [
                    'gross_sales' => round($grossSales, 2),
                    'credit_notes' => round($creditNotes, 2),
                    'debit_notes' => round($debitNotes, 2),
                    'net_revenue' => round($netRevenue, 2),
                ],
                'direct_costs' => [
                    'material_consumption' => round($materialCost, 2),
                    'labour_and_wages' => round($totalLabourCost, 2),
                    'total_direct_costs' => round($totalDirectCosts, 2),
                ],
                'gross_profit' => [
                    'amount' => round($grossProfit, 2),
                    'margin_percentage' => round($grossMarginPercent, 2),
                ],
                'indirect_expenses' => [
                    'items' => $indirectExpensesList,
                    'total_amount' => round($totalIndirectExpenses, 2),
                ],
                'net_profit' => [
                    'amount' => round($netProfit, 2),
                    'margin_percentage' => round($netMarginPercent, 2),
                ],
                'from_date' => $fromDate,
                'to_date' => $toDate,
            ]
        ]);
    }
}
