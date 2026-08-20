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
            if ($type === 'sales_invoice' && !empty($settings['sale_invoice_prefix'])) {
                $rawPattern = $settings['sale_invoice_prefix'];
            } elseif ($type === 'purchase_bill' && !empty($settings['purchase_invoice_prefix'])) {
                $rawPattern = $settings['purchase_invoice_prefix'];
            } else {
                $rawPattern = $settings[$prefixKey] ?? null;
            }

            $defaultPrefixes = [
                'sales_invoice' => 'INV-',
                'purchase_bill' => 'PUR-',
                'delivery_challan' => 'DC-',
                'proforma' => 'PRO-',
                'quotation' => 'QT-',
                'credit_note' => 'CN-',
                'debit_note' => 'DN-',
            ];
            
            $pattern = $rawPattern ?? ($defaultPrefixes[$type] ?? 'DOC-');
            
            // Replace date placeholders (support composite and single tokens, case-insensitive)
            $date = now();
            $replacements = [
                '{YYYYMMDD}' => $date->format('Ymd'),
                '{yyyymmdd}' => $date->format('Ymd'),
                '{YYMMDD}'   => $date->format('ymd'),
                '{yymmdd}'   => $date->format('ymd'),
                '{YYYYMM}'   => $date->format('Ym'),
                '{yyyymm}'   => $date->format('Ym'),
                '{YYMM}'     => $date->format('ym'),
                '{yymm}'     => $date->format('ym'),
                '{YYYY}'     => $date->format('Y'),
                '{yyyy}'     => $date->format('Y'),
                '{YY}'       => $date->format('y'),
                '{yy}'       => $date->format('y'),
                '{MM}'       => $date->format('m'),
                '{mm}'       => $date->format('m'),
                '{DD}'       => $date->format('d'),
                '{dd}'       => $date->format('d'),
            ];
            $pattern = str_replace(array_keys($replacements), array_values($replacements), $pattern);
            
            // Find {SEQ:n} or default sequence length
            $seqLength = 4;
            if (preg_match('/\{SEQ:(\d+)\}/i', $pattern, $matches)) {
                $seqLength = (int) $matches[1];
                $pattern = str_replace($matches[0], '{SEQ}', $pattern);
            } elseif (preg_match('/\{SEQ\}/i', $pattern)) {
                $seqLength = 4;
                $pattern = preg_replace('/\{SEQ\}/i', '{SEQ}', $pattern);
            } else {
                // If it's a simple prefix like "INV-", append {SEQ}
                $pattern .= '{SEQ}';
            }
            
            $parts = explode('{SEQ}', $pattern);
            $prefix = $parts[0];
            $suffix = $parts[1] ?? '';

            // Get the last number of this type for the business using lockForUpdate and withTrashed
            if ($type === 'purchase_bill') {
                $lastDoc = \App\Models\SupplierPurchase::where('business_id', $businessId)
                    ->where('purchase_number', 'LIKE', $prefix . '%' . $suffix)
                    ->orderBy('id', 'desc')
                    ->lockForUpdate()
                    ->first();
                $lastNumberValue = $lastDoc ? $lastDoc->purchase_number : null;
            } else {
                $lastDoc = Sale::withTrashed()
                    ->where('business_id', $businessId)
                    ->where('invoice_number', 'LIKE', $prefix . '%' . $suffix)
                    ->where('invoice_number', 'not like', 'UDH-%')
                    ->orderBy('id', 'desc')
                    ->lockForUpdate()
                    ->first();
                $lastNumberValue = $lastDoc ? $lastDoc->invoice_number : null;
            }

            $nextNumber = 1;
            
            if ($lastNumberValue) {
                // Extract sequence between prefix and suffix
                $seqStr = substr($lastNumberValue, strlen($prefix));
                if ($suffix !== '') {
                    $seqStr = substr($seqStr, 0, -strlen($suffix));
                }
                if (is_numeric($seqStr)) {
                    $nextNumber = intval($seqStr) + 1;
                } else {
                    preg_match('/(\d+)/', $seqStr, $matches);
                    if (!empty($matches)) {
                        $nextNumber = intval($matches[1]) + 1;
                    }
                }
            }

            // Loop to guarantee no collision with any existing records (including soft-deleted)
            if ($type === 'purchase_bill') {
                do {
                    $candidate = $prefix . str_pad($nextNumber, $seqLength, '0', STR_PAD_LEFT) . $suffix;
                    $exists = \App\Models\SupplierPurchase::where('business_id', $businessId)
                        ->where('purchase_number', $candidate)
                        ->exists();
                    if ($exists) {
                        $nextNumber++;
                    }
                } while ($exists);
            } else {
                do {
                    $candidate = $prefix . str_pad($nextNumber, $seqLength, '0', STR_PAD_LEFT) . $suffix;
                    $exists = Sale::withTrashed()
                        ->where('business_id', $businessId)
                        ->where('invoice_number', $candidate)
                        ->exists();
                    if ($exists) {
                        $nextNumber++;
                    }
                } while ($exists);
            }

            return $candidate;
        });
    }
}
