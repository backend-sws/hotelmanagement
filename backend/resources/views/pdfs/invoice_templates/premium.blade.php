<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Premium Invoice</title>
    <style>
        body {
            font-family: {!! str_replace("'", "", $settings['styles']['font_family'] ?? "Helvetica, Arial, sans-serif") !!};
            margin: {{ $settings['styles']['margin_top'] ?? 30 }}px {{ $settings['styles']['margin_right'] ?? 30 }}px {{ $settings['styles']['margin_bottom'] ?? 30 }}px {{ $settings['styles']['margin_left'] ?? 30 }}px;
            color: {{ $settings['styles']['primary_color'] ?? '#1a1a1a' }};
            font-size: {{ $settings['styles']['font_size'] ?? 12 }}px;
            line-height: {{ $settings['styles']['line_spacing'] ?? 1.5 }};
            background-color: #ffffff;
        }
        .container {
            width: 100%;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-sm { font-size: 10px; }
        .uppercase { text-transform: uppercase; }

        .business-name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
            margin-top: 0;
        }
        
        .separator-bar {
            height: 12px;
            background-color: #000000;
            margin-top: 20px;
            margin-bottom: 10px;
            width: 100%;
        }

        .meta-box {
            background-color: #f1f5f9;
            padding: 10px 15px;
            margin-bottom: 20px;
            width: 100%;
            display: table;
            box-sizing: border-box;
        }

        .meta-cell {
            display: table-cell;
            width: 33.33%;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .info-table {
            margin-bottom: 20px;
            table-layout: fixed;
        }
        
        .info-table td {
            vertical-align: top;
        }

        .items-table {
            margin-bottom: 20px;
        }

        .items-table th {
            border-bottom: 2px solid #000;
            border-top: 1px solid #000;
            padding: 8px 5px;
            text-align: right;
            font-size: 11px;
            font-weight: bold;
        }
        
        .items-table th.text-left {
            text-align: left;
        }

        .items-table td {
            padding: 8px 5px;
            text-align: right;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }

        .items-table td.text-left {
            text-align: left;
        }

        .subtotal-row td {
            border-top: 2px solid #000 !important;
            border-bottom: 2px solid #000 !important;
            background-color: #f8fafc;
            font-weight: bold;
            padding: 10px 5px !important;
        }

        .summary-table td {
            padding: 4px 0;
        }
        
        .summary-table td.label {
            text-align: left;
            color: #475569;
        }

        .summary-table td.value {
            text-align: right;
        }

        .summary-table tr.total-row td {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            font-weight: bold;
            padding: 8px 0;
            font-size: 13px;
        }

        .amount-words {
            text-align: right;
            margin-top: 15px;
            font-size: 11px;
            color: #475569;
        }

        .signatures {
            margin-top: 40px;
            width: 100%;
            display: table;
        }

        .signatures .cell {
            display: table-cell;
            width: 50%;
            vertical-align: bottom;
        }
    </style>
</head>
<body>
    @php
        $frameStyle = $settings['styles']['frame_style'] ?? 'none';
        $primaryColor = $settings['styles']['primary_color'] ?? '#333';
        $borderColor = $settings['styles']['border_color'] ?? '#e2e8f0';
    @endphp

    @if($frameStyle === 'elegant')
        <div style="position: fixed; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 3px double {{ $primaryColor }}; z-index: -100;"></div>
        <div style="position: fixed; top: -8px; left: -8px; width: 30px; height: 30px; border-top: 3px solid {{ $primaryColor }}; border-left: 3px solid {{ $primaryColor }}; z-index: -99;"></div>
        <div style="position: fixed; top: -8px; right: -8px; width: 30px; height: 30px; border-top: 3px solid {{ $primaryColor }}; border-right: 3px solid {{ $primaryColor }}; z-index: -99;"></div>
        <div style="position: fixed; bottom: -8px; left: -8px; width: 30px; height: 30px; border-bottom: 3px solid {{ $primaryColor }}; border-left: 3px solid {{ $primaryColor }}; z-index: -99;"></div>
        <div style="position: fixed; bottom: -8px; right: -8px; width: 30px; height: 30px; border-bottom: 3px solid {{ $primaryColor }}; border-right: 3px solid {{ $primaryColor }}; z-index: -99;"></div>
    @elseif($frameStyle !== 'none')
        <div style="position: fixed; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 4px {{ $frameStyle }} {{ $borderColor }}; z-index: -100;"></div>
    @endif

    <div style="padding: {{ $frameStyle === 'none' ? '0' : '15px' }};">
        <div class="container">
        <!-- HEADER -->
        @if(!empty($settings['header_image']))
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="{{ $settings['header_image'] }}" style="width: 100%; max-height: 120px; object-fit: cover;" alt="Header">
            </div>
        @else
            <h1 class="business-name">{{ $invoice->business->name }}</h1>
            <div class="text-sm">
                @if(!empty($invoice->business->phone))
                Mobile: {{ $invoice->business->phone }}
                @endif
                @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->business->gst_settings->gstin))
                    &nbsp;|&nbsp;GSTIN: {{ $invoice->business->gst_settings->gstin }}
                @endif
            </div>
        @endif

        <div class="separator-bar"></div>

        <!-- META -->
        <div class="meta-box">
            <div class="meta-cell">
                <span class="font-bold">Invoice No.:</span> {{ $invoice->invoice_number }}
            </div>
            <div class="meta-cell text-center">
                <span class="font-bold">Invoice Date:</span> {{ $invoice->date->format('d/m/Y') }}
            </div>
            <div class="meta-cell text-right">
                @if($invoice->due_date && ($settings['fields']['show_due_date'] ?? true))
                <span class="font-bold">Due Date:</span> {{ \Carbon\Carbon::parse($invoice->due_date)->format('d/m/Y') }}
                @endif
            </div>
        </div>

        <!-- INFO -->
        <table class="info-table">
            <tr>
                <td style="width: 60%; padding-right: 20px;">
                    <p class="font-bold uppercase text-sm" style="margin: 0 0 5px 0; color: #475569;">BILL TO</p>
                    @if($invoice->customer)
                        <p class="font-bold" style="margin: 0 0 5px 0; font-size: 14px;">{{ $invoice->customer->name }}</p>
                        <p style="margin: 0; line-height: 1.4;">
                            {{ $invoice->customer->address }}
                            @if(($settings['fields']['show_customer_phone'] ?? true) && !empty($invoice->customer->phone))
                            <br>Mobile: {{ $invoice->customer->phone }}
                            @endif
                            @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->customer->gstin))
                                <br>GSTIN: {{ $invoice->customer->gstin }}
                            @endif
                        </p>
                    @else
                        <p class="font-bold" style="margin: 0 0 5px 0; font-size: 14px;">Walk-in Customer</p>
                    @endif
                </td>
                <td style="width: 40%;">
                    <table style="width: 100%;">
                        @if(($settings['fields']['show_reference_number'] ?? true) && $invoice->reference_number)
                        <tr>
                            <td class="font-bold py-1" style="width: 40%;">P.O. No.</td>
                            <td class="text-right">{{ $invoice->reference_number }}</td>
                        </tr>
                        @endif
                        @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->vehicle_number)
                        <tr>
                            <td class="font-bold py-1">Vehicle No.</td>
                            <td class="text-right">{{ $invoice->vehicle_number }}</td>
                        </tr>
                        @endif
                        @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->driver_name)
                        <tr>
                            <td class="font-bold py-1">Driver Name</td>
                            <td class="text-right">{{ $invoice->driver_name }}</td>
                        </tr>
                        @endif
                        @if(($settings['fields']['show_place_of_supply'] ?? true) && !empty($invoice->place_of_supply))
                        <tr>
                            <td class="font-bold py-1">Place of Supply</td>
                            <td class="text-right">{{ $invoice->place_of_supply }}</td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>

        <!-- ITEMS -->
        <table class="items-table">
            <thead>
                <tr>
                    <th class="text-left" style="width: 35%;">ITEMS</th>
                    @if($settings['fields']['show_hsn'] ?? true)
                    <th style="width: 10%;">HSN</th>
                    @endif
                    @if($settings['fields']['show_qty'] ?? true)
                    <th style="width: 10%;">QTY.</th>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                    <th style="width: 12%;">RATE</th>
                    @endif
                    @if($settings['fields']['show_discount'] ?? true)
                    <th style="width: 10%;">DISC.</th>
                    @endif
                    @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                        @if($invoice->tax_type !== 'exempt')
                        <th style="width: 10%;">TAX</th>
                        @endif
                    @endif
                    <th style="width: 13%;">AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                @php 
                    $totalQty = 0;
                @endphp
                @foreach($invoice->items as $item)
                    @php $totalQty += $item->quantity; @endphp
                    <tr>
                        <td class="text-left">
                            <span class="font-bold" style="color: #000;">{{ $item->product->name ?? 'Item' }}</span>
                            @if(!empty($item->notes))
                                <div style="font-size: 8px; color: #64748b;">{{ $item->notes }}</div>
                            @endif
                        </td>
                        
                        @if($settings['fields']['show_hsn'] ?? true)
                        <td>{{ $item->hsn_code ?? '-' }}</td>
                        @endif
                        
                        @if($settings['fields']['show_qty'] ?? true)
                        <td>
                            {{ rtrim(rtrim(number_format($item->quantity, 2), '0'), '.') }} 
                            <span style="font-size: 8px; color: #64748b;">{{ strtoupper($item->unit ?? 'PCS') }}</span>
                        </td>
                        @endif
                        
                        @if($settings['fields']['show_rate'] ?? true)
                        <td>{{ number_format($item->rate, 2) }}</td>
                        @endif

                        @if($settings['fields']['show_discount'] ?? true)
                        <td>
                            @if($item->discount > 0)
                                {{ number_format($item->discount, 2) }}
                            @else
                                -
                            @endif
                        </td>
                        @endif
                        
                        @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                            @if($invoice->tax_type !== 'exempt')
                            <td>
                                {{ number_format($item->total_tax, 2) }}
                                <div style="font-size: 9px; color: #64748b; margin-top:2px;">({{ $item->gst_rate }}%)</div>
                            </td>
                            @endif
                        @endif
                        
                        <td class="font-bold">{{ number_format($item->amount, 2) }}</td>
                    </tr>
                @endforeach

                <!-- SUBTOTAL ROW -->
                <tr class="subtotal-row">
                    <td class="text-left uppercase">SUBTOTAL</td>
                    
                    @if($settings['fields']['show_hsn'] ?? true)
                    <td></td>
                    @endif
                    
                    @if($settings['fields']['show_qty'] ?? true)
                    <td>{{ rtrim(rtrim(number_format($totalQty, 2), '0'), '.') }}</td>
                    @endif
                    
                    @if($settings['fields']['show_rate'] ?? true)
                    <td></td>
                    @endif

                    @if($settings['fields']['show_discount'] ?? true)
                    <td></td>
                    @endif
                    
                    @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                        @if($invoice->tax_type !== 'exempt')
                        <td>&#8377; {{ number_format($invoice->total_tax_amount, 2) }}</td>
                        @endif
                    @endif
                    
                    <td>&#8377; {{ number_format($invoice->taxable_amount + $invoice->total_tax_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true) && $invoice->tax_type !== 'exempt')
        @php
            $taxSummary = [];
            foreach($invoice->items as $item) {
                $rate = $item->gst_rate;
                if (!isset($taxSummary[$rate])) {
                    $taxSummary[$rate] = [
                        'taxable' => 0, 'cgst' => 0, 'sgst' => 0, 'igst' => 0, 'cess' => 0, 'total' => 0
                    ];
                }
                $taxSummary[$rate]['taxable'] += $item->taxable_amount;
                $taxSummary[$rate]['cgst'] += $item->cgst_amount;
                $taxSummary[$rate]['sgst'] += $item->sgst_amount;
                $taxSummary[$rate]['igst'] += $item->igst_amount;
                $taxSummary[$rate]['cess'] += $item->cess_amount ?? 0;
                $taxSummary[$rate]['total'] += ($item->cgst_amount + $item->sgst_amount + $item->igst_amount) + ($item->cess_amount ?? 0);
            }
            ksort($taxSummary);
        @endphp
        <div style="margin-top: 15px; page-break-inside: avoid;">
            <p class="font-bold uppercase text-sm" style="margin: 0 0 5px 0;">TAX SUMMARY</p>
            <table class="items-table" style="width: 70%; margin-top: 0; font-size: 10px;">
                <thead>
                    <tr>
                        <th class="text-left">TAX RATE</th>
                        <th class="text-right">TAXABLE VALUE</th>
                        @if($invoice->tax_type === 'igst')
                        <th class="text-right">IGST</th>
                        @elseif($invoice->tax_type === 'gst')
                        <th class="text-right">CGST</th>
                        <th class="text-right">SGST</th>
                        @else
                        <th class="text-right">{{ $settings['custom_tax_label'] ?? 'VAT' }}</th>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                        <th class="text-right">CESS</th>
                        @endif
                        <th class="text-right">TOTAL TAX</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($taxSummary as $rate => $taxes)
                    <tr>
                        <td class="text-left font-bold">{{ $rate }}%</td>
                        <td class="text-right">&#8377; {{ number_format($taxes['taxable'], 2) }}</td>
                        @if($invoice->tax_type === 'igst')
                        <td class="text-right">&#8377; {{ number_format($taxes['igst'], 2) }}</td>
                        @elseif($invoice->tax_type === 'gst')
                        <td class="text-right">&#8377; {{ number_format($taxes['cgst'], 2) }}</td>
                        <td class="text-right">&#8377; {{ number_format($taxes['sgst'], 2) }}</td>
                        @else
                        <td class="text-right">&#8377; {{ number_format($taxes['total'], 2) }}</td>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                        <td class="text-right">&#8377; {{ number_format($taxes['cess'], 2) }}</td>
                        @endif
                        <td class="text-right font-bold">&#8377; {{ number_format($taxes['total'], 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <!-- SUMMARY & NOTES -->
        <table style="width: 100%; margin-top: 20px; page-break-inside: avoid;">
            <tr>
                <td style="width: 55%; vertical-align: top; padding-right: 30px;">
                    @if($invoice->notes)
                        <div style="margin-bottom: 20px;">
                            <p class="font-bold uppercase text-sm" style="margin: 0 0 5px 0;">NOTES</p>
                            <p style="margin: 0; line-height: 1.5; color: #475569;">{{ nl2br(e($invoice->notes)) }}</p>
                        </div>
                    @endif
                    
                    @if($invoice->terms_conditions || !empty($settings['default_terms']))
                        <div style="margin-bottom: 20px;">
                            <p class="font-bold uppercase text-sm" style="margin: 0 0 5px 0;">TERMS AND CONDITIONS</p>
                            <p style="margin: 0; line-height: 1.5; color: #475569;">
                                {!! nl2br(e($invoice->terms_conditions ?? $settings['default_terms'])) !!}
                            </p>
                        </div>
                    @endif

                    @if($invoice->bank_details || !empty($settings['default_bank_details']))
                        <div>
                            <p class="font-bold uppercase text-sm" style="margin: 0 0 5px 0;">BANK DETAILS</p>
                            <p style="margin: 0; line-height: 1.5; color: #475569;">
                                {!! nl2br(e($invoice->bank_details ?? $settings['default_bank_details'])) !!}
                            </p>
                        </div>
                    @endif
                </td>
                
                <td style="width: 45%; vertical-align: top;">
                    <table class="summary-table">
                        <tr>
                            <td class="label">Taxable Amount</td>
                            <td class="value">&#8377; {{ number_format($invoice->taxable_amount, 2) }}</td>
                        </tr>
                        
                        @if($settings['fields']['show_tax_amount'] ?? true)
                            @if(($settings['fields']['show_tax_breakdown'] ?? true) && $invoice->tax_type !== 'exempt')
                                @if($invoice->tax_type === 'igst')
                                    <tr>
                                        <td class="label">IGST</td>
                                        <td class="value">&#8377; {{ number_format($invoice->igst_amount, 2) }}</td>
                                    </tr>
                                @elseif($invoice->tax_type === 'gst')
                                    <tr>
                                        <td class="label">CGST</td>
                                        <td class="value">&#8377; {{ number_format($invoice->cgst_amount, 2) }}</td>
                                    </tr>
                                    <tr>
                                        <td class="label">SGST</td>
                                        <td class="value">&#8377; {{ number_format($invoice->sgst_amount, 2) }}</td>
                                    </tr>
                                @else
                                    <tr>
                                        <td class="label">{{ $settings['custom_tax_label'] ?? 'VAT' }}</td>
                                        <td class="value">&#8377; {{ number_format($invoice->total_tax_amount - ($invoice->cess_amount ?? 0), 2) }}</td>
                                    </tr>
                                @endif
                                @if(($invoice->cess_amount ?? 0) > 0)
                                    <tr>
                                        <td class="label">CESS</td>
                                        <td class="value">&#8377; {{ number_format($invoice->cess_amount, 2) }}</td>
                                    </tr>
                                @endif
                            @else
                                <tr>
                                    <td class="label">Total Tax</td>
                                    <td class="value">&#8377; {{ number_format($invoice->total_tax_amount, 2) }}</td>
                                </tr>
                            @endif
                        @endif

                        @if($invoice->discount > 0)
                            <tr>
                                <td class="label">Discount</td>
                                <td class="value">- &#8377; {{ number_format($invoice->discount, 2) }}</td>
                            </tr>
                        @endif
                        
                        @if($invoice->round_off != 0)
                            <tr>
                                <td class="label">Round Off</td>
                                <td class="value">{{ $invoice->round_off > 0 ? '+' : '' }} &#8377; {{ number_format($invoice->round_off, 2) }}</td>
                            </tr>
                        @endif

                        <tr class="total-row">
                            <td class="label" style="color: #000;">Total Amount</td>
                            <td class="value">&#8377; {{ number_format($invoice->final_amount, 2) }}</td>
                        </tr>
                        
                        <tr><td colspan="2" style="height: 10px;"></td></tr>
                        
                        @if(($settings['fields']['show_payment_breakdown'] ?? true))
                            @if($invoice->payment_mode === 'Split' && $invoice->payments && $invoice->payments->count() > 0)
                                <tr><td colspan="2"><div style="border-bottom: 1px dashed #cbd5e1; margin: 5px 0;"></div></td></tr>
                                <tr><td colspan="2" class="font-bold uppercase" style="font-size: 10px; padding-bottom: 3px;">Payment Breakdown</td></tr>
                                @foreach($invoice->payments as $payment)
                                <tr>
                                    <td class="label" style="padding-left: 10px; color: #475569;">{{ $payment->payment_mode }}</td>
                                    <td class="value">&#8377; {{ number_format($payment->amount, 2) }}</td>
                                </tr>
                                @endforeach
                                <tr>
                                    <td class="label font-bold" style="color: #000;">Total Received</td>
                                    <td class="value font-bold" style="color: #000;">&#8377; {{ number_format($invoice->paid_amount, 2) }}</td>
                                </tr>
                                <tr><td colspan="2"><div style="border-bottom: 1px dashed #cbd5e1; margin: 5px 0;"></div></td></tr>
                            @else
                                <tr>
                                    <td class="label">Received ({{ $invoice->payment_mode ?? 'None' }})</td>
                                    <td class="value">&#8377; {{ number_format($invoice->paid_amount, 2) }}</td>
                                </tr>
                            @endif
                        @endif
                        
                        @if($invoice->customer && $invoice->customer->closing_balance)
                            <tr>
                                <td class="label">Previous Balance</td>
                                <td class="value">&#8377; {{ number_format($invoice->customer->closing_balance, 2) }}</td>
                            </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>
        
        @if(($settings['fields']['show_amount_in_words'] ?? true))
        <div class="amount-words">
            <span class="font-bold" style="color: #000;">Total Amount (in words)</span><br>
            {{ $invoice->amount_in_words ?? \App\Services\AmountInWordsService::numberToIndianWords($invoice->final_amount) }}
        </div>
        @endif

        <!-- SIGNATURES -->
        <div class="signatures">
            <div class="cell">
                @if($settings['fields']['show_receiver_signature'] ?? true)
                    <div style="margin-top: 50px; font-weight: bold; color: #475569;">
                        Receiver's Signature
                    </div>
                @endif
            </div>
            
            <div class="cell text-right">
                @if($settings['fields']['show_signature'] ?? true)
                    @if(!empty($settings['signature_image']))
                        <div style="margin-bottom: 5px;">
                            <img src="{{ $settings['signature_image'] }}" style="max-height: 50px; max-width: 150px; object-fit: contain;" alt="Signature">
                        </div>
                    @else
                        <div style="height: 50px;"></div>
                    @endif
                    <div style="font-weight: bold;">{{ $settings['signature_label'] ?? 'Authorized Signatory' }}</div>
                    <div class="text-sm" style="color: #64748b;">For {{ $invoice->business->name }}</div>
                @endif
            </div>
        </div>

        @if(!empty($settings['footer_image']))
            <div style="text-align: center; margin-top: 40px;">
                <img src="{{ $settings['footer_image'] }}" style="width: 100%; max-height: 100px; object-fit: contain;" alt="Footer">
            </div>
        @endif

        @if(($settings['fields']['show_watermark'] ?? true))
            <div style="position: fixed; top: 40%; left: -20%; width: 140%; text-align: center; font-size: 100px; color: rgba(0,0,0,0.03); transform: rotate(-30deg); z-index: -1; text-transform: uppercase; line-height: 1;">
                {{ $invoice->business->name }}
            </div>
        @endif
        </div>
    </div>
</body>
</html>
