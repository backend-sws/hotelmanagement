<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Business;
use Illuminate\Support\Facades\DB;

class InvoiceNumberService
{
    /**
     * Generate next invoice number for a business based on type.
     */
    public function generate(int $businessId, string $type = 'sales_invoice'): string
    {
        return DB::transaction(function () use ($businessId, $type) {
            $business = Business::find($businessId);
            $settings = is_string($business->settings) ? json_decode($business->settings, true) : ($business->settings ?? []);
            
            $prefixKey = 'invoice_prefix_' . $type;
            
            $defaultPrefixes = [
                'sales_invoice' => 'INV-',
                'purchase_bill' => 'PUR-',
                'delivery_challan' => 'DC-',
                'proforma' => 'PRO-',
                'quotation' => 'QT-',
                'credit_note' => 'CN-',
                'debit_note' => 'DN-',
            ];
            
            $prefix = $settings[$prefixKey] ?? ($defaultPrefixes[$type] ?? 'DOC-');
            
            // Get the last invoice number of this type for the business using lockForUpdate
            $lastInvoice = Sale::where('business_id', $businessId)
                ->where('invoice_type', $type)
                ->where('invoice_number', 'LIKE', $prefix . '%')
                ->orderBy('id', 'desc')
                ->lockForUpdate()
                ->first();

            $nextNumber = 1;
            
            if ($lastInvoice) {
                // Extract number from the end of the string
                $lastNumberString = str_replace($prefix, '', $lastInvoice->invoice_number);
                if (is_numeric($lastNumberString)) {
                    $nextNumber = intval($lastNumberString) + 1;
                } else {
                    // Try to parse if there's a suffix, though we assume basic zero-padding
                    preg_match('/\d+$/', $lastInvoice->invoice_number, $matches);
                    if (!empty($matches)) {
                        $nextNumber = intval($matches[0]) + 1;
                    }
                }
            }

            return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        });
    }
}
