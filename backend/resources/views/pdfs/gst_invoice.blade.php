<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tax Invoice</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; }
        .invoice-box { max-width: 800px; margin: auto; padding: 10px; }
        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        table td { padding: 5px; vertical-align: top; }
        .header, .footer { text-align: center; font-size: 10px; color: #777; }
        .title { font-size: 24px; font-weight: bold; text-align: right; }
        .company-details { text-align: left; }
        .border-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
        .items-table { border: 1px solid #ddd; }
        .items-table th { background: #f5f5f5; border: 1px solid #ddd; padding: 5px; font-weight: bold; }
        .items-table td { border: 1px solid #ddd; padding: 5px; }
        .right-align { text-align: right; }
        .center-align { text-align: center; }
        .bold { font-weight: bold; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <h2 class="center-align" style="text-transform: uppercase;">Tax Invoice</h2>
        
        @php
            $balanceDue = $invoice->final_amount - $invoice->paid_amount;
            if ($balanceDue <= 0.01) {
                $statusText = 'PAID';
                $statusColor = '#22c55e';
            } elseif ($invoice->paid_amount > 0) {
                $statusText = 'PARTIALLY PAID';
                $statusColor = '#f59e0b';
            } else {
                $statusText = 'UNPAID';
                $statusColor = '#ef4444';
            }
        @endphp

        <table cellpadding="0" cellspacing="0">
            <tr>
                <td class="company-details" style="width:50%;">
                    <h3 style="margin:0;">{{ $invoice->business->name }}</h3>
                    <p style="margin:0;">{{ $invoice->business->address }}</p>
                    <p style="margin:0;">Phone: {{ $invoice->business->phone }}</p>
                    <p style="margin:0;">GSTIN: {{ $invoice->business->gst_settings->gstin ?? 'N/A' }}</p>
                </td>
                <td class="right-align" style="width:50%; position: relative;">
                    <div style="position: absolute; top: -10px; right: 0; border: 2px solid {{ $statusColor }}; color: {{ $statusColor }}; padding: 5px 10px; font-weight: bold; font-size: 16px; border-radius: 5px; transform: rotate(-5deg); opacity: 0.8; z-index: 1;">
                        {{ $statusText }}
                    </div>
                    <p class="bold" style="font-size:16px; margin-top: 30px;">Invoice No: {{ $invoice->invoice_number }}</p>
                    <p>Date: {{ $invoice->date->format('d-m-Y') }}</p>
                    @if($invoice->due_date)
                    <p>Due Date: {{ \Carbon\Carbon::parse($invoice->due_date)->format('d-m-Y') }}</p>
                    @endif
                    <p>Type: {{ strtoupper(str_replace('_', ' ', $invoice->invoice_type)) }}</p>
                </td>
            </tr>
        </table>
        
        <div class="border-box" style="margin-top:10px;">
            <table cellpadding="0" cellspacing="0">
                <tr>
                    <td style="width:50%;">
                        <p class="bold">Billed To:</p>
                        @if($invoice->customer)
                            <p style="margin:0;">{{ $invoice->customer->name }}</p>
                            <p style="margin:0;">{{ $invoice->customer->address }}</p>
                            <p style="margin:0;">Phone: {{ $invoice->customer->phone }}</p>
                            <p style="margin:0;">GSTIN: {{ $invoice->customer->gstin ?? 'URD' }}</p>
                            <p style="margin:0;">State: {{ $invoice->place_of_supply ?? 'N/A' }}</p>
                        @else
                            <p>Cash / Walk-in Customer</p>
                        @endif
                    </td>
                    <td style="width:50%;">
                        @if($invoice->vehicle_number)
                        <p style="margin:0;"><span class="bold">Vehicle No:</span> {{ $invoice->vehicle_number }}</p>
                        @endif
                        @if($invoice->driver_name)
                        <p style="margin:0;"><span class="bold">Driver Name:</span> {{ $invoice->driver_name }}</p>
                        @endif
                    </td>
                </tr>
            </table>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item Description</th>
                    <th>HSN/SAC</th>
                    <th class="right-align">Qty</th>
                    <th class="right-align">Rate</th>
                    <th class="right-align">Taxable</th>
                    @if($invoice->tax_type === 'gst')
                        <th class="right-align">CGST</th>
                        <th class="right-align">SGST</th>
                    @else
                        <th class="right-align">IGST</th>
                    @endif
                    <th class="right-align">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->product->name ?? 'Unknown Item' }}</td>
                    <td>{{ $item->hsn_code ?? '-' }}</td>
                    <td class="right-align">{{ floatval($item->quantity) }} {{ $item->unit }}</td>
                    <td class="right-align">{{ number_format($item->rate, 2) }}</td>
                    <td class="right-align">{{ number_format($item->taxable_amount, 2) }}</td>
                    @if($invoice->tax_type === 'gst')
                        <td class="right-align">{{ number_format($item->cgst_amount, 2) }}<br><small>({{ $item->gst_rate/2 }}%)</small></td>
                        <td class="right-align">{{ number_format($item->sgst_amount, 2) }}<br><small>({{ $item->gst_rate/2 }}%)</small></td>
                    @else
                        <td class="right-align">{{ number_format($item->igst_amount, 2) }}<br><small>({{ $item->gst_rate }}%)</small></td>
                    @endif
                    <td class="right-align">{{ number_format($item->amount, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div style="width: 100%; display: table; margin-top: 10px;">
            <div style="display: table-cell; width: 60%; padding-right:20px;">
                <p class="bold">Terms & Conditions:</p>
                <p style="font-size:10px;">{{ $invoice->terms_conditions ?? '1. Goods once sold will not be taken back. 2. Subject to local jurisdiction.' }}</p>
                
                @if($invoice->business->bank_details ?? false)
                <p class="bold" style="margin-top:10px;">Bank Details:</p>
                <p style="font-size:10px;">{{ $invoice->business->bank_details }}</p>
                @endif
                
                <p class="bold" style="margin-top:10px;">Amount in Words:</p>
                @php
                    $amountInWords = $invoice->amount_in_words ?? \App\Services\AmountInWordsService::numberToIndianWords($invoice->final_amount);
                @endphp
                <p style="font-size:11px; text-transform: capitalize;">INR {{ $amountInWords }}</p>
            </div>
            
            <div style="display: table-cell; width: 40%;">
                <table class="items-table">
                    <tr>
                        <td>Total Taxable Value</td>
                        <td class="right-align">{{ number_format($invoice->taxable_amount, 2) }}</td>
                    </tr>
                    @if($invoice->tax_type === 'gst')
                    <tr>
                        <td>Total CGST</td>
                        <td class="right-align">{{ number_format($invoice->cgst_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Total SGST</td>
                        <td class="right-align">{{ number_format($invoice->sgst_amount, 2) }}</td>
                    </tr>
                    @else
                    <tr>
                        <td>Total IGST</td>
                        <td class="right-align">{{ number_format($invoice->igst_amount, 2) }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td>Discount</td>
                        <td class="right-align">- {{ number_format($invoice->discount, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Round Off</td>
                        <td class="right-align">{{ number_format($invoice->round_off, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="bold">Grand Total</td>
                        <td class="bold right-align" style="font-size:14px;">₹ {{ number_format($invoice->final_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td>Amount Paid</td>
                        <td class="right-align">{{ number_format($invoice->paid_amount, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="bold">Balance Due</td>
                        <td class="bold right-align">₹ {{ number_format($invoice->final_amount - $invoice->paid_amount, 2) }}</td>
                    </tr>
                </table>
            </div>
        </div>
        
        <div style="margin-top: 50px; text-align: right;">
            <p>For {{ $invoice->business->name }}</p>
            <br><br>
            <p>Authorized Signatory</p>
        </div>
    </div>
</body>
</html>
