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
    public function calculateItemTax(float $rate, float $qty, float $gstRate, string $taxType): array
    {
        $taxableAmount = $rate * $qty;
        $totalTax = $taxableAmount * ($gstRate / 100);

        return [
            'taxable_amount' => round($taxableAmount, 2),
            'cgst_amount'    => $taxType === 'gst' ? round($totalTax / 2, 2) : 0,
            'sgst_amount'    => $taxType === 'gst' ? round($totalTax / 2, 2) : 0,
            'igst_amount'    => $taxType === 'igst' ? round($totalTax, 2) : 0,
            'total_tax'      => round($totalTax, 2),
            'total_amount'   => round($taxableAmount + $totalTax, 2),
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
        $taxTotal = 0;

        foreach ($items as $item) {
            $taxableTotal += $item['taxable_amount'] ?? 0;
            $cgstTotal += $item['cgst_amount'] ?? 0;
            $sgstTotal += $item['sgst_amount'] ?? 0;
            $igstTotal += $item['igst_amount'] ?? 0;
            $taxTotal += ($item['cgst_amount'] ?? 0) + ($item['sgst_amount'] ?? 0) + ($item['igst_amount'] ?? 0);
        }

        // Apply global discount proportionally to taxable amount (if any)
        // Alternatively, this system might just deduct discount at the end. Let's do it at the end.
        $grandTotal = $taxableTotal + $taxTotal - $discount;

        return [
            'taxable_total' => round($taxableTotal, 2),
            'cgst_total'    => round($cgstTotal, 2),
            'sgst_total'    => round($sgstTotal, 2),
            'igst_total'    => round($igstTotal, 2),
            'tax_total'     => round($taxTotal, 2),
            'grand_total'   => round($grandTotal, 2),
        ];
    }
}
