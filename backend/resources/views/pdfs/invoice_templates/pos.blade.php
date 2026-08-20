<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $invoice->invoice_type ?? 'Invoice' }} #{{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 4mm 3mm;
            size: 80mm auto; /* 80mm Thermal Receipt Size */
        }
        body { 
            font-family: 'Courier New', Courier, monospace, 'DejaVu Sans Mono', sans-serif;
            font-size: 9.5pt; 
            line-height: 1.3;
            color: #000; 
            margin: 0;
            padding: 0;
        }
        .pos-container {
            width: 100%;
            max-width: 72mm;
            margin: 0 auto;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        
        .dashed-line {
            border-top: 1px dashed #000;
            margin: 4px 0;
        }
        .double-line {
            border-top: 2px dashed #000;
            margin: 4px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
        }
        table th {
            padding: 3px 1px;
            font-weight: bold;
        }
        table td {
            padding: 2px 1px;
            vertical-align: top;
        }
        .item-row td {
            border-bottom: 1px dotted #ccc;
        }
        .totals-table td {
            padding: 1.5px 0;
        }
        .grand-total {
            font-size: 11pt;
            font-weight: bold;
        }
        .qr-section {
            text-align: center;
            margin: 6px 0;
        }
    </style>
</head>
<body>
    <div class="pos-container">
        {{-- Header Section --}}
        <div class="text-center">
            @if(($settings['fields']['show_logo'] ?? true) && $invoice->business->logo_path)
                <img src="{{ public_path('storage/' . $invoice->business->logo_path) }}" style="max-height: 35px; margin-bottom: 3px;" alt="Logo"><br>
            @endif
            <div class="bold uppercase" style="font-size: 11pt; letter-spacing: 0.5px;">{{ $invoice->business->name }}</div>
            <div style="font-size: 8.5pt;">{{ $invoice->business->address }}</div>
            @if($invoice->business->phone)
                <div style="font-size: 8.5pt;">Ph: {{ $invoice->business->phone }}</div>
            @endif
            @if(($settings['fields']['show_gstin'] ?? true) && ($invoice->business->gst_number ?? null))
                <div class="bold" style="font-size: 8.5pt;">GSTIN: {{ $invoice->business->gst_number }}</div>
            @endif
        </div>

        <div class="dashed-line"></div>

        {{-- Meta Section --}}
        <div style="font-size: 8.5pt;">
            <div class="text-center bold uppercase" style="font-size: 9.5pt; margin: 2px 0;">
                *** {{ str_replace('_', ' ', $invoice->invoice_type ?? 'RETAIL INVOICE') }} ***
            </div>
            <table class="totals-table">
                <tr>
                    <td>Bill No: <strong>{{ $invoice->invoice_number }}</strong></td>
                    <td class="text-right">Date: {{ \Carbon\Carbon::parse($invoice->date)->format('d-m-Y') }}</td>
                </tr>
                @if(($settings['fields']['show_reference_number'] ?? true) && $invoice->reference_number)
                <tr>
                    <td colspan="2">Ref No: {{ $invoice->reference_number }}</td>
                </tr>
                @endif
                @if(($settings['fields']['show_due_date'] ?? true) && $invoice->due_date)
                <tr>
                    <td colspan="2">Due Date: {{ \Carbon\Carbon::parse($invoice->due_date)->format('d-m-Y') }}</td>
                </tr>
                @endif
            </table>

            @if($invoice->customer)
                <div style="border-top: 1px dotted #888; padding-top: 2px; margin-top: 2px;">
                    <div>Customer: <strong>{{ $invoice->customer->name }}</strong></div>
                    @if(($settings['fields']['show_customer_phone'] ?? true) && $invoice->customer->phone)
                        <div>Ph: {{ $invoice->customer->phone }}</div>
                    @endif
                    @if(($settings['fields']['show_gstin'] ?? true) && $invoice->customer->gstin)
                        <div>GSTIN: {{ $invoice->customer->gstin }}</div>
                    @endif
                    @if(($settings['fields']['show_place_of_supply'] ?? true) && $invoice->place_of_supply)
                        <div>State: {{ $invoice->place_of_supply }}</div>
                    @endif
                </div>
            @endif

            @if(($settings['fields']['show_vehicle_info'] ?? true) && ($invoice->vehicle_number || $invoice->driver_name))
                <div style="border-top: 1px dotted #888; padding-top: 2px; margin-top: 2px;">
                    @if($invoice->vehicle_number) <div>Veh: {{ $invoice->vehicle_number }}</div> @endif
                    @if($invoice->driver_name) <div>Driver: {{ $invoice->driver_name }}</div> @endif
                </div>
            @endif
        </div>

        <div class="dashed-line"></div>

        {{-- Items Table --}}
        <table>
            <thead>
                <tr style="border-bottom: 1px dashed #000;">
                    <th class="text-left">ITEM</th>
                    @if($settings['fields']['show_qty'] ?? true)
                        <th class="text-center" style="width: 18%;">QTY</th>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                        <th class="text-right" style="width: 22%;">RATE</th>
                    @endif
                    <th class="text-right" style="width: 25%;">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr class="item-row">
                    <td>
                        <div class="bold">{{ $item->name ?? ($item->product->name ?? 'Item') }}</div>
                        @if(($settings['fields']['show_hsn'] ?? true) && ($item->hsn_code ?? $item->product->hsn_code ?? null))
                            <div style="font-size: 7.5pt; color: #555;">HSN: {{ $item->hsn_code ?? $item->product->hsn_code }}</div>
                        @endif
                    </td>
                    @if($settings['fields']['show_qty'] ?? true)
                        <td class="text-center">{{ number_format($item->quantity, 0) }} {{ $item->unit ?? 'pcs' }}</td>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                        <td class="text-right">{{ number_format($item->rate, 2) }}</td>
                    @endif
                    <td class="text-right bold">{{ number_format($item->taxable_amount ?? ($item->quantity * $item->rate), 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="dashed-line"></div>

        {{-- Totals Summary --}}
        <table class="totals-table">
            <tr>
                <td>Subtotal (Taxable):</td>
                <td class="text-right bold">₹ {{ number_format($invoice->taxable_amount, 2) }}</td>
            </tr>
            @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true) && ($invoice->tax_type !== 'exempt'))
                @if(($invoice->cgst_amount ?? 0) > 0)
                <tr>
                    <td>CGST:</td>
                    <td class="text-right">₹ {{ number_format($invoice->cgst_amount, 2) }}</td>
                </tr>
                @endif
                @if(($invoice->sgst_amount ?? 0) > 0)
                <tr>
                    <td>SGST:</td>
                    <td class="text-right">₹ {{ number_format($invoice->sgst_amount, 2) }}</td>
                </tr>
                @endif
                @if(($invoice->igst_amount ?? 0) > 0)
                <tr>
                    <td>IGST:</td>
                    <td class="text-right">₹ {{ number_format($invoice->igst_amount, 2) }}</td>
                </tr>
                @endif
                @if(($invoice->cess_amount ?? 0) > 0)
                <tr>
                    <td>CESS:</td>
                    <td class="text-right">₹ {{ number_format($invoice->cess_amount, 2) }}</td>
                </tr>
                @endif
            @elseif($settings['fields']['show_tax_amount'] ?? true)
                <tr>
                    <td>Tax Amount:</td>
                    <td class="text-right">₹ {{ number_format($invoice->total_tax_amount, 2) }}</td>
                </tr>
            @endif

            @if(($settings['fields']['show_discount'] ?? true) && ($invoice->discount > 0))
            <tr style="color: #900;">
                <td>Discount:</td>
                <td class="text-right">- ₹ {{ number_format($invoice->discount, 2) }}</td>
            </tr>
            @endif
        </table>

        <div class="double-line"></div>

        <table class="totals-table grand-total">
            <tr>
                <td>GRAND TOTAL:</td>
                <td class="text-right">₹ {{ number_format($invoice->final_amount, 2) }}</td>
            </tr>
        </table>

        <div class="double-line"></div>

        {{-- Payment Section --}}
        @if($settings['fields']['show_payment_breakdown'] ?? true)
        <table class="totals-table" style="font-size: 8.5pt;">
            <tr>
                <td>Paid ({{ $invoice->payment_mode ?? 'Cash' }}):</td>
                <td class="text-right bold">₹ {{ number_format($invoice->paid_amount ?? 0, 2) }}</td>
            </tr>
            @if(($invoice->final_amount - ($invoice->paid_amount ?? 0)) > 0)
            <tr style="color: #900;">
                <td>Balance Due:</td>
                <td class="text-right bold">₹ {{ number_format($invoice->final_amount - $invoice->paid_amount, 2) }}</td>
            </tr>
            @endif
        </table>
        @endif

        {{-- QR Code --}}
        @if(($settings['fields']['show_qr_code'] ?? true) && isset($qrCodeUri))
        <div class="qr-section">
            <img src="{{ $qrCodeUri }}" style="width: 75px; height: 75px;" alt="QR Code"><br>
            <span style="font-size: 7.5pt; font-weight: bold;">Scan to Verify / Pay</span>
        </div>
        @endif

        {{-- Terms --}}
        @if(($settings['fields']['show_terms'] ?? true) && ($invoice->terms_conditions ?? $settings['default_terms'] ?? null))
        <div style="font-size: 7.5pt; color: #444; border-top: 1px dotted #888; padding-top: 3px; margin-top: 4px;">
            {!! nl2br(e($invoice->terms_conditions ?? $settings['default_terms'])) !!}
        </div>
        @endif

        <div class="dashed-line"></div>

        <div class="text-center" style="font-size: 8.5pt; font-weight: bold; margin-top: 4px;">
            *** THANK YOU! VISIT AGAIN ***
            @if($settings['fields']['show_signature'] ?? false)
                <div style="font-size: 7.5pt; font-weight: normal; color: #555; margin-top: 4px;">
                    {{ $settings['signature_label'] ?? 'Authorized Signatory' }}
                </div>
            @endif
        </div>
    </div>
</body>
</html>
