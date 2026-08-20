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
            color: #333; 
            margin-top: {{ $settings['styles']['margin_top'] ?? 10 }}px;
            margin-bottom: {{ $settings['styles']['margin_bottom'] ?? 10 }}px;
            margin-left: {{ $settings['styles']['margin_left'] ?? 10 }}px;
            margin-right: {{ $settings['styles']['margin_right'] ?? 10 }}px;
        }
        .invoice-box { max-width: 800px; margin: auto; }
        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        table td { padding: 5px; vertical-align: top; }
        .header, .footer { text-align: center; font-size: 10px; color: #777; }
        .title { font-size: 24px; font-weight: bold; text-align: right; color: {{ $settings['styles']['primary_color'] ?? '#333' }}; }
        .company-details { text-align: left; }
        .border-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
        .items-table { border: 1px solid #ddd; }
        .items-table th { background: {{ $settings['styles']['primary_color'] ?? '#333' }}; border: 1px solid {{ $settings['styles']['primary_color'] ?? '#333' }}; padding: 8px; font-weight: bold; color: #ffffff; }
        .items-table td { border: 1px solid #ddd; padding: 5px; }
        .right-align { text-align: right; }
        .center-align { text-align: center; }
        .bold { font-weight: bold; }
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
            <div style="text-align: center; margin-bottom: 15px;">
                <img src="{{ $settings['header_image'] }}" style="max-width: 100%; max-height: 120px;" alt="Header">
            </div>
        @else
            <h2 class="center-align" style="text-transform: uppercase; color: {{ $settings['styles']['primary_color'] ?? '#333' }};">Tax Invoice</h2>
        @endif
        
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td class="company-details" style="width:50%;">
                    @if(empty($settings['header_image']))
                        @if(($settings['fields']['show_logo'] ?? true) && $invoice->business->logo_path)
                            <img src="{{ Storage::url($invoice->business->logo_path) }}" style="max-height: 50px; margin-bottom: 5px;" alt="Logo"><br>
                        @endif
                        <h3 style="margin:0; color: {{ $settings['styles']['primary_color'] ?? '#333' }};">{{ $invoice->business->name }}</h3>
                        <p style="margin:0;">{{ $invoice->business->address }}</p>
                        @if(!empty($invoice->business->phone))
                        <p style="margin:0;">Phone: {{ $invoice->business->phone }}</p>
                        @endif
                        @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->business->gst_settings->gstin))
                        <p style="margin:0;">GSTIN: {{ $invoice->business->gst_settings->gstin }}</p>
                        @endif
                    @endif
                    @if(!empty($settings['custom_fields']))
                        <div style="margin-top: 5px;">
                            @foreach($settings['custom_fields'] as $field)
                                <p style="margin:0; color: {{ $settings['styles']['primary_color'] ?? '#333' }};"><span style="font-weight:bold;">{{ $field['key'] }}:</span> {{ $field['value'] }}</p>
                            @endforeach
                        </div>
                    @endif
                </td>
                <td class="right-align" style="width:50%;">
                    <p class="bold" style="font-size:16px;">Invoice No: {{ $invoice->invoice_number }}</p>
                    @if(($settings['fields']['show_reference_number'] ?? true) && $invoice->reference_number)
                    <p>Ref No: {{ $invoice->reference_number }}</p>
                    @endif
                    <p>Date: {{ $invoice->date->format('d-m-Y') }}</p>
                    @if($invoice->due_date && ($settings['fields']['show_due_date'] ?? true))
                    <p>Due Date: {{ \Carbon\Carbon::parse($invoice->due_date)->format('d-m-Y') }}</p>
                    @endif
                    @if($settings['fields']['show_invoice_type'] ?? true)
                    <p>Type: {{ strtoupper(str_replace('_', ' ', $invoice->invoice_type)) }}</p>
                    @endif
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
                            @if(($settings['fields']['show_customer_phone'] ?? true) && !empty($invoice->customer->phone))
                            <p style="margin:0;">Phone: {{ $invoice->customer->phone }}</p>
                            @endif
                            @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->customer->gstin))
                            <p style="margin:0;">GSTIN: {{ $invoice->customer->gstin }}</p>
                            @endif
                            @if(($settings['fields']['show_place_of_supply'] ?? true) && !empty($invoice->place_of_supply))
                            <p style="margin:0;">State: {{ $invoice->place_of_supply }}</p>
                            @endif
                        @else
                            <p>Cash / Walk-in Customer</p>
                        @endif
                    </td>
                    <td style="width:50%;">
                        @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->vehicle_number)
                        <p style="margin:0;"><span class="bold">Vehicle No:</span> {{ $invoice->vehicle_number }}</p>
                        @endif
                        @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->driver_name)
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
                    @if($settings['fields']['show_hsn'] ?? true)
                    <th>HSN/SAC</th>
                    @endif
                    @if($settings['fields']['show_qty'] ?? true)
                    <th class="right-align">Qty</th>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                    <th class="right-align">Rate</th>
                    @endif
                    @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                        @if($invoice->tax_type !== 'exempt')
                            <th class="right-align">Taxable</th>
                            @if($invoice->tax_type === 'gst')
                                <th class="right-align">CGST</th>
                                <th class="right-align">SGST</th>
                            @elseif($invoice->tax_type === 'igst')
                                <th class="right-align">IGST</th>
                            @else
                                <th class="right-align">Tax</th>
                            @endif
                        @endif
                    @endif
                    <th class="right-align">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->name ?? $item->product?->name ?? $item->product?->model_name ?? 'Item/Service' }}</td>
                    @if($settings['fields']['show_hsn'] ?? true)
                    <td>{{ $item->hsn_code ?? '-' }}</td>
                    @endif
                    @if($settings['fields']['show_qty'] ?? true)
                    <td class="right-align">{{ floatval($item->quantity) }} {{ $item->unit }}</td>
                    @endif
                    @if($settings['fields']['show_rate'] ?? true)
                    <td class="right-align">{{ number_format($item->rate, 2) }}</td>
                    @endif
                    @if(($settings['fields']['show_tax_amount'] ?? true) && ($settings['fields']['show_tax_breakdown'] ?? true))
                        @if($invoice->tax_type !== 'exempt')
                            <td class="right-align">{{ number_format($item->taxable_amount, 2) }}</td>
                            @if($invoice->tax_type === 'gst')
                                <td class="right-align">
                                    @if($item->cgst_amount > 0)
                                        {{ number_format($item->cgst_amount, 2) }}<br>
                                        <small>({{ floatval($item->cgst_rate) }}%)</small>
                                    @else
                                        -
                                    @endif
                                </td>
                                <td class="right-align">
                                    @if($item->sgst_amount > 0)
                                        {{ number_format($item->sgst_amount, 2) }}<br>
                                        <small>({{ floatval($item->sgst_rate) }}%)</small>
                                    @else
                                        -
                                    @endif
                                </td>
                            @elseif($invoice->tax_type === 'igst')
                                <td class="right-align">
                                    @if($item->igst_amount > 0)
                                        {{ number_format($item->igst_amount, 2) }}<br>
                                        <small>({{ floatval($item->igst_rate) }}%)</small>
                                    @else
                                        -
                                    @endif
                                </td>
                            @else
                                <td class="right-align">
                                    @if($item->igst_amount > 0)
                                        {{ number_format($item->igst_amount, 2) }}
                                    @else
                                        -
                                    @endif
                                </td>
                            @endif
                        @endif
                    @endif
                    <td class="right-align">{{ number_format($item->total_amount, 2) }}</td>
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
            <p class="bold" style="font-size: 11px;">Tax Summary</p>
            <table class="items-table" style="width: 70%; margin-top: 5px; font-size: 10px;">
                <thead style="background: #f8fafc;">
                    <tr>
                        <th class="text-left" style="padding: 4px;">Tax Rate</th>
                        <th class="right-align" style="padding: 4px;">Taxable Value</th>
                        @if($invoice->tax_type === 'gst')
                        <th class="right-align" style="padding: 4px;">CGST</th>
                        <th class="right-align" style="padding: 4px;">SGST</th>
                        @else
                        <th class="right-align" style="padding: 4px;">IGST</th>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                        <th class="right-align" style="padding: 4px;">CESS</th>
                        @endif
                        <th class="right-align" style="padding: 4px;">Total Tax</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($taxSummary as $rate => $taxes)
                    <tr>
                        <td class="text-left" style="padding: 4px;">GST {{ $rate }}%</td>
                        <td class="right-align" style="padding: 4px;">₹ {{ number_format($taxes['taxable'], 2) }}</td>
                        @if($invoice->tax_type === 'gst')
                        <td class="right-align" style="padding: 4px;">₹ {{ number_format($taxes['cgst'], 2) }}</td>
                        <td class="right-align" style="padding: 4px;">₹ {{ number_format($taxes['sgst'], 2) }}</td>
                        @else
                        <td class="right-align" style="padding: 4px;">₹ {{ number_format($taxes['igst'], 2) }}</td>
                        @endif
                        @if(($invoice->cess_amount ?? 0) > 0)
                        <td class="right-align" style="padding: 4px;">₹ {{ number_format($taxes['cess'], 2) }}</td>
                        @endif
                        <td class="right-align" style="padding: 4px;">₹ {{ number_format($taxes['total'], 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <div style="width: 100%; display: table; margin-top: 10px;">
            <div style="display: table-cell; width: 60%; padding-right:20px;">
                @if($settings['fields']['show_terms'] ?? true)
                <p class="bold">Terms & Conditions:</p>
                <p style="font-size:10px;">{{ $invoice->terms_conditions ?? '1. Goods once sold will not be taken back. 2. Subject to local jurisdiction.' }}</p>
                @endif
                
                @if(($settings['fields']['show_bank_details'] ?? true) && ($invoice->business->bank_details ?? false))
                <p class="bold" style="margin-top:10px;">Bank Details:</p>
                <p style="font-size:10px;">{{ $invoice->business->bank_details }}</p>
                @endif
                
                @if($settings['fields']['show_amount_in_words'] ?? true)
                <p class="bold" style="margin-top:10px;">Amount in Words:</p>
                @php
                    $amountInWords = $invoice->amount_in_words ?? \App\Services\AmountInWordsService::numberToIndianWords($invoice->final_amount);
                @endphp
                <p style="font-size:11px; text-transform: capitalize;">INR {{ $amountInWords }}</p>
                @endif
            </div>
            
            <div style="display: table-cell; width: 40%;">
                <table class="items-table">
                    <tr>
                        <td>Total</td>
                        <td class="right-align">{{ number_format($invoice->taxable_amount, 2) }}</td>
                    </tr>
                    @if($settings['fields']['show_tax_amount'] ?? true)
                        @if(($settings['fields']['show_tax_breakdown'] ?? true) && $invoice->tax_type !== 'exempt')
                            @if($invoice->tax_type === 'gst')
                            <tr>
                                <td>Total CGST</td>
                                <td class="right-align">{{ number_format($invoice->cgst_amount, 2) }}</td>
                            </tr>
                            <tr>
                                <td>Total SGST</td>
                                <td class="right-align">{{ number_format($invoice->sgst_amount, 2) }}</td>
                            </tr>
                            @elseif($invoice->tax_type === 'igst')
                            <tr>
                                <td>Total IGST</td>
                                <td class="right-align">{{ number_format($invoice->igst_amount, 2) }}</td>
                            </tr>
                            @else
                            <tr>
                                <td>Total Tax</td>
                                <td class="right-align">{{ number_format($invoice->total_tax_amount - ($invoice->cess_amount ?? 0), 2) }}</td>
                            </tr>
                            @endif
                            @if(($invoice->cess_amount ?? 0) > 0)
                            <tr>
                                <td>Total CESS</td>
                                <td class="right-align">{{ number_format($invoice->cess_amount, 2) }}</td>
                            </tr>
                            @endif
                        @else
                            <tr>
                                <td>Total Tax</td>
                                <td class="right-align">{{ number_format($invoice->total_tax_amount, 2) }}</td>
                            </tr>
                        @endif
                    @endif
                    @if($settings['fields']['show_discount'] ?? true)
                    <tr>
                        <td>Discount</td>
                        <td class="right-align">- {{ number_format($invoice->discount, 2) }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td>Round Off</td>
                        <td class="right-align">{{ number_format($invoice->round_off, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="bold">Grand Total</td>
                        <td class="bold right-align" style="font-size:14px;">₹ {{ number_format($invoice->final_amount, 2) }}</td>
                    </tr>
                    @if(($settings['fields']['show_payment_breakdown'] ?? true))
                        @if($invoice->payment_mode === 'Split' && $invoice->payments && $invoice->payments->count() > 0)
                            <tr>
                                <td colspan="2" class="bold" style="border-top: 1px dashed #ccc; padding-top: 5px; font-size: 10px;">Payment Breakdown</td>
                            </tr>
                            @foreach($invoice->payments as $payment)
                            <tr>
                                <td style="padding-left: 10px;">{{ $payment->payment_mode }}</td>
                                <td class="right-align">₹ {{ number_format($payment->amount, 2) }}</td>
                            </tr>
                            @endforeach
                            <tr>
                                <td class="bold">Amount Paid</td>
                                <td class="bold right-align">₹ {{ number_format($invoice->paid_amount, 2) }}</td>
                            </tr>
                        @else
                            <tr>
                                <td>Amount Paid ({{ $invoice->payment_mode ?? 'None' }})</td>
                                <td class="right-align">₹ {{ number_format($invoice->paid_amount, 2) }}</td>
                            </tr>
                        @endif
                        <tr>
                            <td class="bold">Balance Due</td>
                            <td class="bold right-align">₹ {{ number_format($invoice->final_amount - $invoice->paid_amount, 2) }}</td>
                        </tr>
                    @endif
                </table>
            </div>
        </div>
        
        @if(!empty($settings['footer_image']))
            <div style="margin-top: 30px; text-align: center;">
                <img src="{{ $settings['footer_image'] }}" style="max-width: 100%; max-height: 100px;" alt="Footer">
            </div>
        @else
            @if($settings['fields']['show_signature'] ?? true)
            <div style="margin-top: 50px; text-align: right;">
                <p>For {{ $invoice->business->name }}</p>
                <br><br>
                <p class="bold">{{ $settings['signature_label'] ?? 'Authorized Signatory' }}</p>
            </div>
        @endif
    </div>
</div>
</body>
</html>
