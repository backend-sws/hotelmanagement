<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Receipt</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 14px; color: #333; }
        .receipt-box { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; }
        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        table td { padding: 8px; vertical-align: top; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .header h2 { margin: 0; color: #22c55e; text-transform: uppercase; }
        .company-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .amount-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .amount-box h3 { margin: 0; font-size: 24px; color: #0f172a; }
        .details-table td { border-bottom: 1px dashed #eee; }
        .details-table td:first-child { font-weight: bold; width: 40%; color: #64748b; }
        .right-align { text-align: right; }
    </style>
</head>
<body>
    <div class="receipt-box">
        <div class="header">
            <div class="company-name">{{ $entry->business->name ?? 'Company' }}</div>
            <p style="margin:0; font-size: 12px; color: #666;">{{ $entry->business->address ?? '' }}</p>
            <br>
            <h2>Payment Receipt</h2>
        </div>
        
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <strong>Receipt No:</strong> #{{ str_pad($entry->id, 6, '0', STR_PAD_LEFT) }}<br>
                    <strong>Date:</strong> {{ $entry->date->format('d-m-Y') }}
                </td>
            </tr>
        </table>

        <div class="amount-box">
            <span style="color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Amount Received</span>
            <h3>₹ {{ number_format($entry->credit, 2) }}</h3>
        </div>

        <table class="details-table" cellpadding="0" cellspacing="0">
            <tr>
                <td>Received From:</td>
                <td>{{ $party->name ?? 'Unknown Party' }}</td>
            </tr>
            @if(isset($party->phone))
            <tr>
                <td>Phone:</td>
                <td>{{ $party->phone }}</td>
            </tr>
            @endif
            <tr>
                <td>Payment Mode:</td>
                <td>{{ str_contains(strtolower($entry->narration), 'cash') ? 'Cash' : (str_contains(strtolower($entry->narration), 'upi') ? 'UPI' : 'Bank/Other') }}</td>
            </tr>
            <tr>
                <td>Narration:</td>
                <td>{{ $entry->narration }}</td>
            </tr>
            <tr>
                <td>Current Balance:</td>
                <td>
                    ₹ {{ number_format(abs($entry->balance), 2) }} 
                    {{ $entry->balance > 0 ? ' (Dr)' : ($entry->balance < 0 ? ' (Cr)' : '') }}
                </td>
            </tr>
        </table>

        <div style="margin-top: 50px; text-align: right;">
            <p>For {{ $entry->business->name ?? 'Company' }}</p>
            <br><br>
            <p style="border-top: 1px solid #ddd; display: inline-block; padding-top: 5px;">Authorized Signatory</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8;">
            Thank you for your business!
        </div>
    </div>
</body>
</html>
