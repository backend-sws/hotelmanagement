<?php

namespace App\Services;

class GstCalculationService
{
    /**
     * Determine if CGST+SGST or IGST based on business state vs customer state.
     * If customer state is missing, assume intra-state (GST).
     */
    public function getTaxType(string $businessState, ?string $customerState): string
    {
        if (!$customerState || strtolower($businessState) === strtolower($customerState)) {
            return 'gst';
        }
        return 'igst';
    }

    /**
     * Calculate tax on a single item
     */
    public function calculateItemTax(float $rate, float $qty, float $gstRate, string $taxType, float $cessRate = 0): array
    {
        $taxableAmount = $rate * $qty;

        if ($taxType === 'exempt') {
            return [
                'taxable_amount' => round($taxableAmount, 2),
                'cgst_amount'    => 0.0,
                'sgst_amount'    => 0.0,
                'igst_amount'    => 0.0,
                'cess_amount'    => 0.0,
                'total_tax'      => 0.0,
                'total_amount'   => round($taxableAmount, 2),
            ];
        }

        $totalTax = $taxableAmount * ($gstRate / 100);
        $cess = $taxableAmount * ($cessRate / 100);

        // FIX BUG-08: Let SGST absorb the rounding difference so CGST+SGST always equals totalTax exactly.
        // e.g. totalTax=1.01 → cgst=0.51, sgst=1.01-0.51=0.50 → sum=1.01 ✓ (old: 0.51+0.51=1.02 ✗)
        $cgst = $taxType === 'gst' ? round($totalTax / 2, 2) : 0;
        $sgst = $taxType === 'gst' ? round($totalTax - $cgst, 2) : 0;
        $igst = $taxType === 'igst' ? round($totalTax, 2) : 0;

        return [
            'taxable_amount' => round($taxableAmount, 2),
            'cgst_amount'    => $cgst,
            'sgst_amount'    => $sgst,
            'igst_amount'    => $igst,
            'cess_amount'    => round($cess, 2),
            'total_tax'      => round($totalTax + $cess, 2),
            'total_amount'   => round($taxableAmount + $totalTax + $cess, 2),
        ];
    }

    /**
     * Calculate totals for the entire invoice
     */
    public function calculateInvoice(array $items, string $taxType, float $discount = 0): array
    {
        $taxableTotal = 0;
        $cgstTotal = 0;
        $sgstTotal = 0;
        $igstTotal = 0;
        $cessTotal = 0;
        $taxTotal = 0;

        foreach ($items as $item) {
            $taxableTotal += $item['taxable_amount'] ?? 0;
            $cgstTotal += $item['cgst_amount'] ?? 0;
            $sgstTotal += $item['sgst_amount'] ?? 0;
            $igstTotal += $item['igst_amount'] ?? 0;
            $cessTotal += $item['cess_amount'] ?? 0;
            $taxTotal += ($item['cgst_amount'] ?? 0) + ($item['sgst_amount'] ?? 0) + ($item['igst_amount'] ?? 0) + ($item['cess_amount'] ?? 0);
        }

        // Apply global discount proportionally to taxable amount (if any)
        // Alternatively, this system might just deduct discount at the end. Let's do it at the end.
        $grandTotal = $taxableTotal + $taxTotal - $discount;

        return [
            'taxable_total' => round($taxableTotal, 2),
            'cgst_total'    => round($cgstTotal, 2),
            'sgst_total'    => round($sgstTotal, 2),
            'igst_total'    => round($igstTotal, 2),
            'cess_total'    => round($cessTotal, 2),
            'tax_total'     => round($taxTotal, 2),
            'grand_total'   => round($grandTotal, 2),
        ];
    }
}
