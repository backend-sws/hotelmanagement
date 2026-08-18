<?php

namespace App\Services;

class AmountInWordsService
{
    /**
     * Convert a numeric amount to Indian currency words format.
     * e.g., 3545518.00 -> "Thirty Five Lakh Forty Five Thousand Five Hundred Eighteen Rupees Only"
     * e.g., 8260.50 -> "Eight Thousand Two Hundred Sixty Rupees and Fifty Paise Only"
     */
    public static function numberToIndianWords($number): string
    {
        $number = round((float) $number, 2);
        if ($number <= 0) {
            return 'Zero Rupees Only';
        }

        $parts = explode('.', number_format($number, 2, '.', ''));
        $rupees = (int) $parts[0];
        $paise = isset($parts[1]) ? (int) $parts[1] : 0;

        $words = self::convertNumberToWords($rupees);
        $result = $words . ' Rupees';

        if ($paise > 0) {
            $paiseWords = self::convertNumberToWords($paise);
            $result .= ' and ' . $paiseWords . ' Paise';
        }

        return ucwords(trim($result)) . ' Only';
    }

    private static function convertNumberToWords(int $num): string
    {
        if ($num === 0) {
            return 'Zero';
        }

        $units = [
            '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
            'Seventeen', 'Eighteen', 'Nineteen'
        ];

        $tens = [
            '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
        ];

        $result = '';

        // Crores (10,000,000)
        if ($num >= 10000000) {
            $crores = intdiv($num, 10000000);
            $result .= self::convertNumberToWords($crores) . ' Crore ';
            $num %= 10000000;
        }

        // Lakhs (100,000)
        if ($num >= 100000) {
            $lakhs = intdiv($num, 100000);
            $result .= self::convertNumberToWords($lakhs) . ' Lakh ';
            $num %= 100000;
        }

        // Thousands (1,000)
        if ($num >= 1000) {
            $thousands = intdiv($num, 1000);
            $result .= self::convertNumberToWords($thousands) . ' Thousand ';
            $num %= 1000;
        }

        // Hundreds (100)
        if ($num >= 100) {
            $hundreds = intdiv($num, 100);
            $result .= $units[$hundreds] . ' Hundred ';
            $num %= 100;
        }

        // Tens & Units (< 100)
        if ($num > 0) {
            if ($num < 20) {
                $result .= $units[$num] . ' ';
            } else {
                $result .= $tens[intdiv($num, 10)] . ' ';
                if ($num % 10 > 0) {
                    $result .= $units[$num % 10] . ' ';
                }
            }
        }

        return trim($result);
    }
}
