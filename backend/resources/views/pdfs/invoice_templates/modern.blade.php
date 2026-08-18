<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tax Invoice</title>
    <style>
        body { 
            font-family: {!! str_replace("'", "", $settings['styles']['font_family'] ?? "Helvetica, Arial, sans-serif") !!}; 
            font-size: {{ $settings['styles']['font_size'] ?? 12 }}px; 
            line-height: {{ $settings['styles']['line_spacing'] ?? 1.5 }};
            color: #334155; 
            margin-top: {{ $settings['styles']['margin_top'] ?? 20 }}px;
            margin-bottom: {{ $settings['styles']['margin_bottom'] ?? 20 }}px;
            margin-left: {{ $settings['styles']['margin_left'] ?? 20 }}px;
            margin-right: {{ $settings['styles']['margin_right'] ?? 20 }}px;
        }
        .invoice-box { max-width: 800px; margin: auto; }
        .grid-container { width: 100%; display: table; table-layout: fixed; }
        .grid-row { display: table-row; }
        .grid-cell { display: table-cell; vertical-align: top; }
        
        .accent-bg { background-color: {{ $settings['styles']['primary_color'] ?? '#333' }}; color: #ffffff; }
        .accent-text { color: {{ $settings['styles']['primary_color'] ?? '#333' }}; }
        .secondary-text { color: {{ $settings['styles']['secondary_color'] ?? '#64748b' }}; }
        .border-color { border-color: {{ $settings['styles']['border_color'] ?? '#e2e8f0' }}; }
        
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            border-radius: {{ $settings['styles']['border_radius'] ?? 0 }}px;
            border-radius: {{ $settings['styles']['border_radius'] ?? 0 }}px; 
            overflow: hidden; 
        }
        th { 
            background-color: {{ $settings['styles']['primary_color'] ?? '#333' }}; 
            color: #ffffff; 
            font-weight: 700; 
            padding: 10px; 
            text-align: left; 
            border-bottom: 2px solid {{ $settings['styles']['primary_color'] ?? '#333' }}; 
        }
        td { 
            padding: 10px; 
            border-bottom: 1px solid #e2e8f0; 
        }
        
        .header-section { margin-bottom: 30px; }
        .info-box { 
            background-color: #f1f5f9; 
            padding: 15px; 
            border-radius: {{ $settings['styles']['border_radius'] ?? 8 }}px; 
        }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .text-sm { font-size: 0.85em; color: {{ $settings['styles']['secondary_color'] ?? '#64748b' }}; }
        
        .summary-box { width: 300px; float: right; margin-top: 20px; }
        .summary-row { display: table; width: 100%; padding: 5px 0; }
        .summary-label { display: table-cell; color: #64748b; }
        .summary-value { display: table-cell; text-align: right; font-weight: bold; }
        .grand-total { 
            font-size: 1.2em; 
            padding: 10px 0; 
            border-top: 2px solid #e2e8f0; 
            margin-top: 10px; 
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
        @if($settings['fields']['show_watermark'] ?? true)
        <div style="position: fixed; top: 40%; left: -20%; width: 140%; transform: rotate(-45deg); font-size: 80px; color: rgba(0,0,0,0.04); text-align: center; font-weight: bold; text-transform: uppercase; z-index: -1;">
            {{ $invoice->business->name }}
        </div>
        @endif
        <div class="invoice-box">
        @if(!empty($settings['header_image']))
            <div style="text-align: center; margin-bottom: 30px; border-radius: 8px; overflow: hidden;">
                <img src="{{ $settings['header_image'] }}" style="width: 100%; max-height: 150px; object-fit: cover;" alt="Header">
            </div>
        @endif

        <div class="header-section grid-container">
            <div class="grid-cell" style="width: 50%;">
                @if(($settings['fields']['show_logo'] ?? true) && $invoice->business->logo_path && empty($settings['header_image']))
                    <img src="{{ Storage::url($invoice->business->logo_path) }}" style="max-height: 60px; margin-bottom: 10px;" alt="Logo">
                @endif
                
                @if(empty($settings['header_image']))
                    <h2 class="accent-text" style="margin: 0 0 5px 0; font-size: 24px;">{{ $invoice->business->name }}</h2>
                    <p style="margin: 0; line-height: 1.5;" class="text-sm">
                        {{ $invoice->business->address }}
                        @if(!empty($invoice->business->phone))
                        <br>Phone: {{ $invoice->business->phone }}
                        @endif
                        @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->business->gst_settings->gstin))
                            <br>GSTIN: {{ $invoice->business->gst_settings->gstin }}
                        @endif
                    </p>
                    @if(!empty($settings['custom_fields']))
                        <div style="margin-top: 5px;">
                            @foreach($settings['custom_fields'] as $field)
                                <p style="margin:0;" class="text-sm"><span style="font-weight:bold;">{{ $field['key'] }}:</span> {{ $field['value'] }}</p>
                            @endforeach
                        </div>
                    @endif
                @endif
            </div>
            
            <div class="grid-cell text-right" style="width: 50%;">
                <h1 style="margin: 0 0 10px 0; font-size: 32px; letter-spacing: 2px; color: #cbd5e1;">INVOICE</h1>
                <div class="info-box" style="display: inline-block; text-align: left; min-width: 200px;">
                    <p style="margin: 0 0 5px 0;"><span class="text-sm">Invoice No:</span><br> <span class="font-bold">{{ $invoice->invoice_number }}</span></p>
                    @if(($settings['fields']['show_reference_number'] ?? true) && $invoice->reference_number)
                        <p style="margin: 0 0 5px 0;"><span class="text-sm">Ref No:</span><br> <span class="font-bold">{{ $invoice->reference_number }}</span></p>
                    @endif
                    <p style="margin: 0 0 5px 0;"><span class="text-sm">Date:</span><br> <span class="font-bold">{{ $invoice->date->format('d M, Y') }}</span></p>
                    @if($invoice->due_date && ($settings['fields']['show_due_date'] ?? true))
                        <p style="margin: 0;"><span class="text-sm">Due Date:</span><br> <span class="font-bold">{{ \Carbon\Carbon::parse($invoice->due_date)->format('d M, Y') }}</span></p>
                    @endif
                </div>
            </div>
        </div>

        <div class="grid-container" style="margin-bottom: 30px;">
            <div class="grid-cell info-box" style="width: 48%;">
                <p class="accent-text font-bold" style="margin: 0 0 10px 0; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Billed To</p>
                @if($invoice->customer)
                    <p class="font-bold" style="margin: 0 0 5px 0; font-size: 16px;">{{ $invoice->customer->name }}</p>
                    <p class="text-sm" style="margin: 0; line-height: 1.5;">
                        {{ $invoice->customer->address }}
                        @if(($settings['fields']['show_customer_phone'] ?? true) && !empty($invoice->customer->phone))
                        <br>Phone: {{ $invoice->customer->phone }}
                        @endif
                        @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->customer->gstin))
                            <br>GSTIN: {{ $invoice->customer->gstin }}
                        @endif
                    </p>
                @else
                    <p class="font-bold" style="margin: 0 0 5px 0; font-size: 16px;">Walk-in Customer</p>
                @endif
            </div>
            
            <div class="grid-cell" style="width: 4%;"></div>
            
            <div class="grid-cell info-box" style="width: 48%;">
                <p class="accent-text font-bold" style="margin: 0 0 10px 0; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Order Details</p>
                <p class="text-sm" style="margin: 0; line-height: 1.5;">
                    <span class="font-bold">Type:</span> {{ strtoupper(str_replace('_', ' ', $invoice->invoice_type)) }}<br>
                    @if(($settings['fields']['show_place_of_supply'] ?? true) && !empty($invoice->place_of_supply))
                        <span class="font-bold">Place of Supply:</span> {{ $invoice->place_of_supply }}<br>
                    @endif
                    @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->vehicle_number)
                        <span class="font-bold">Vehicle:</span> {{ $invoice->vehicle_number }}<br>
                    @endif
                    @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->driver_name)
                        <span class="font-bold">Driver:</span> {{ $invoice->driver_name }}
                    @endif
                </p>
            </div>
        </div>

        <table>
            <thead class="accent-bg">
                <tr>
                    <th style="color: #fff; border-bottom: none;">Description</th>
                    @if($settings['fields']['show_hsn'] ?? true)
                    <th style="color: #fff; border-bottom: none;">HSN</th>
                    @endif
                    @if($settings['fields']['show_qty'] ?? true)
                    <th class="text-right" style="color: #fff; border-bottom: none;">Qty</th>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                    <th class="text-right" style="color: #fff; border-bottom: none;">Rate</th>
                    @endif
                    @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                        @if($invoice->tax_type !== 'exempt')
                        <th class="text-right" style="color: #fff; border-bottom: none;">Tax</th>
                        @endif
                    @endif
                    <th class="text-right" style="color: #fff; border-bottom: none;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <span class="font-bold">{{ $item->product->name ?? 'Unknown Item' }}</span>
                    </td>
                    @if($settings['fields']['show_hsn'] ?? true)
                    <td class="text-sm">{{ $item->hsn_code ?? '-' }}</td>
                    @endif
                    @if($settings['fields']['show_qty'] ?? true)
                    <td class="text-right">{{ floatval($item->quantity) }} {{ $item->unit }}</td>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                    <td class="text-right">{{ number_format($item->rate, 2) }}</td>
                    @endif
                    @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                        @if($invoice->tax_type !== 'exempt')
                        <td class="text-right text-sm">
                            @if($invoice->tax_type === 'gst')
                                CGST: {{ number_format($item->cgst_amount, 2) }}<br>
                                SGST: {{ number_format($item->sgst_amount, 2) }}
                            @elseif($invoice->tax_type === 'igst')
                                IGST: {{ number_format($item->igst_amount, 2) }}
                            @else
                                {{ number_format($item->igst_amount, 2) }}
                            @endif
                        </td>
                        @endif
                    @endif
                    <td class="text-right font-bold accent-text">{{ number_format($item->amount, 2) }}</td>
                </tr>
                @endforeach
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
            <p class="font-bold text-sm" style="margin: 0 0 5px 0;">Tax Summary</p>
            <table style="width: 70%; font-size: 10px; margin-top: 0; border: 1px solid #e2e8f0;">
                <thead style="background: #f8fafc; color: #475569;">
                    <tr>
                        <th class="text-left" style="padding: 4px; border: 1px solid #e2e8f0;">Tax Rate</th>
                        <th class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">Taxable Value</th>
                        @if($invoice->tax_type === 'gst')
                        <th class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">CGST</th>
                        <th class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">SGST</th>
                        @else
                        <th class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">IGST</th>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                        <th class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">CESS</th>
                        @endif
                        <th class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">Total Tax</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($taxSummary as $rate => $taxes)
                    <tr>
                        <td class="text-left" style="padding: 4px; border: 1px solid #e2e8f0;">GST {{ $rate }}%</td>
                        <td class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">₹ {{ number_format($taxes['taxable'], 2) }}</td>
                        @if($invoice->tax_type === 'gst')
                        <td class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">₹ {{ number_format($taxes['cgst'], 2) }}</td>
                        <td class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">₹ {{ number_format($taxes['sgst'], 2) }}</td>
                        @else
                        <td class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">₹ {{ number_format($taxes['igst'], 2) }}</td>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                        <td class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">₹ {{ number_format($taxes['cess'], 2) }}</td>
                        @endif
                        <td class="text-right" style="padding: 4px; border: 1px solid #e2e8f0;">₹ {{ number_format($taxes['total'], 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <div style="margin-top: 30px; clear: both; overflow: hidden;">
            <div style="width: 50%; float: left; padding-right: 20px;">
                @if($settings['fields']['show_amount_in_words'] ?? true)
                    <p class="text-sm" style="margin: 0 0 5px 0;">Amount in Words</p>
                    @php
                        $amountInWords = $invoice->amount_in_words ?? \App\Services\AmountInWordsService::numberToIndianWords($invoice->final_amount);
                    @endphp
                    <p class="font-bold accent-text" style="margin: 0 0 20px 0; text-transform: capitalize;">{{ $amountInWords }}</p>
                @endif
                
                @if(($settings['fields']['show_bank_details'] ?? true) && ($invoice->business->bank_details ?? false))
                    <div class="info-box" style="margin-bottom: 20px;">
                        <p class="font-bold" style="margin: 0 0 5px 0; font-size: 11px;">Payment Details</p>
                        <p class="text-sm" style="margin: 0; line-height: 1.5;">{!! nl2br(e($invoice->business->bank_details)) !!}</p>
                    </div>
                @endif

                @if($settings['fields']['show_terms'] ?? true)
                    <p class="font-bold" style="margin: 0 0 5px 0; font-size: 11px;">Terms & Conditions</p>
                    <p class="text-sm" style="margin: 0; line-height: 1.4;">{{ $invoice->terms_conditions ?? '1. Goods once sold will not be taken back.' }}</p>
                @endif
            </div>

            <div class="summary-box">
                <div class="summary-row">
                    <div class="summary-label">Subtotal</div>
                    <div class="summary-value">₹ {{ number_format($invoice->taxable_amount, 2) }}</div>
                </div>
                
                @if($settings['fields']['show_tax_amount'] ?? true)
                    @if(($settings['fields']['show_tax_breakdown'] ?? true) && $invoice->tax_type !== 'exempt')
                        @if($invoice->tax_type === 'gst')
                            <div class="summary-row">
                                <div class="summary-label">CGST</div>
                                <div class="summary-value">₹ {{ number_format($invoice->cgst_amount, 2) }}</div>
                            </div>
                            <div class="summary-row">
                                <div class="summary-label">SGST</div>
                                <div class="summary-value">₹ {{ number_format($invoice->sgst_amount, 2) }}</div>
                            </div>
                        @elseif($invoice->tax_type === 'igst')
                            <div class="summary-row">
                                <div class="summary-label">IGST</div>
                                <div class="summary-value">₹ {{ number_format($invoice->igst_amount, 2) }}</div>
                            </div>
                        @else
                            <div class="summary-row">
                                <div class="summary-label">Tax</div>
                                <div class="summary-value">₹ {{ number_format($invoice->total_tax_amount - ($invoice->cess_amount ?? 0), 2) }}</div>
                            </div>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                            <div class="summary-row">
                                <div class="summary-label">CESS</div>
                                <div class="summary-value">₹ {{ number_format($invoice->cess_amount, 2) }}</div>
                            </div>
                        @endif
                    @else
                        <div class="summary-row">
                            <div class="summary-label">Total Tax</div>
                            <div class="summary-value">₹ {{ number_format($invoice->total_tax_amount, 2) }}</div>
                        </div>
                    @endif
                @endif

                @if($settings['fields']['show_discount'] ?? true)
                    <div class="summary-row">
                        <div class="summary-label">Discount</div>
                        <div class="summary-value" style="color: #ef4444;">- ₹ {{ number_format($invoice->discount, 2) }}</div>
                    </div>
                @endif
                
                <div class="summary-row">
                    <div class="summary-label">Round Off</div>
                    <div class="summary-value">₹ {{ number_format($invoice->round_off, 2) }}</div>
                </div>

                <div class="summary-row grand-total accent-text">
                    <div class="summary-label accent-text font-bold">Total Amount</div>
                    <div class="summary-value">₹ {{ number_format($invoice->final_amount, 2) }}</div>
                </div>
                
                @if(($settings['fields']['show_payment_breakdown'] ?? true))
                    @if($invoice->payment_mode === 'Split' && $invoice->payments && $invoice->payments->count() > 0)
                        <div class="summary-row" style="margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                            <div class="summary-label font-bold" style="font-size: 10px;">Payment Breakdown</div>
                            <div class="summary-value"></div>
                        </div>
                        @foreach($invoice->payments as $payment)
                        <div class="summary-row" style="border: none; padding: 2px 0;">
                            <div class="summary-label text-sm" style="color: #475569;">{{ $payment->payment_mode }}</div>
                            <div class="summary-value">₹ {{ number_format($payment->amount, 2) }}</div>
                        </div>
                        @endforeach
                        <div class="summary-row" style="border: none; padding: 5px 0;">
                            <div class="summary-label font-bold">Total Received</div>
                            <div class="summary-value font-bold">₹ {{ number_format($invoice->paid_amount, 2) }}</div>
                        </div>
                    @else
                        <div class="summary-row" style="margin-top: 10px;">
                            <div class="summary-label">Received ({{ $invoice->payment_mode ?? 'None' }})</div>
                            <div class="summary-value">₹ {{ number_format($invoice->paid_amount, 2) }}</div>
                        </div>
                    @endif
                @endif
            </div>
        </div>

        <div style="clear: both;"></div>

        @if(!empty($settings['footer_image']))
            <div style="margin-top: 40px; text-align: right;">
                <img src="{{ $settings['footer_image'] }}" style="max-height: 80px;" alt="Footer">
            </div>
        @else
            @if($settings['fields']['show_signature'] ?? true)
            <div style="margin-top: 60px; text-align: right;">
                <div style="display: inline-block; text-align: center;">
                    <div style="border-bottom: 1px solid #cbd5e1; width: 200px; margin-bottom: 5px;"></div>
                    <p class="font-bold" style="margin: 0; color: #475569;">{{ $settings['signature_label'] ?? 'Authorized Signatory' }}</p>
                    <p class="text-sm" style="margin: 0;">For {{ $invoice->business->name }}</p>
                </div>
            </div>
            @endif
        @endif
    </div>
</div>
</body>
</html>
