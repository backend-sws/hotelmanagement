<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tax Invoice</title>
    <style>
        body { 
            font-family: {!! str_replace("'", "", $settings['styles']['font_family'] ?? "Helvetica, Arial, sans-serif") !!}; 
            font-size: {{ $settings['styles']['font_size'] ?? 11 }}px; 
            line-height: {{ $settings['styles']['line_spacing'] ?? 1.5 }};
            color: #000; 
            margin-top: {{ $settings['styles']['margin_top'] ?? 10 }}px;
            margin-bottom: {{ $settings['styles']['margin_bottom'] ?? 10 }}px;
            margin-left: {{ $settings['styles']['margin_left'] ?? 10 }}px;
            margin-right: {{ $settings['styles']['margin_right'] ?? 10 }}px;
        }
        .invoice-box { max-width: 800px; margin: auto; }
        .main-table { width: 100%; border-collapse: collapse; border: 2px solid #000; }
        .main-table td, .main-table th { border: 1px solid #000; padding: 4px; vertical-align: top; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .company-header {
            color: {{ $settings['styles']['primary_color'] ?? '#ff0000' }};
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            padding: 10px 0 5px 0;
            text-transform: uppercase;
            text-align: center;
        }
        .company-sub { font-weight: bold; text-align: center; font-size: 11px; margin: 0; padding-bottom: 5px; }
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
            <div class="text-center" style="margin-bottom: 10px; border: 2px solid #000; padding: 5px;">
                <img src="{{ $settings['header_image'] }}" style="max-width: 100%; max-height: 120px;" alt="Header">
            </div>
        @else
            <div style="border: 2px solid #000; border-bottom: none; padding-bottom: 5px;">
                <h1 class="company-header">{{ $invoice->business->name }}</h1>
                <p class="company-sub">{{ $invoice->business->address }}</p>
                <p class="company-sub">
                    @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->business->gst_settings->gstin))
                    GSTIN: {{ $invoice->business->gst_settings->gstin }} 
                    @endif
                    @if(!empty($invoice->business->phone))
                    <span style="margin-left: 20px;">MOB:- {{ $invoice->business->phone }}</span>
                    @endif
                </p>
                @if(!empty($settings['custom_fields']))
                    <div style="text-align: center; margin-top: 5px; margin-bottom: 5px;">
                        @foreach($settings['custom_fields'] as $field)
                            <p class="company-sub" style="font-weight: normal; margin:0;"><span style="font-weight:bold;">{{ $field['key'] }}:</span> {{ $field['value'] }}</p>
                        @endforeach
                    </div>
                @endif
            </div>
        @endif

        <table class="main-table">
            <tr>
                <td colspan="4" class="text-center font-bold" style="background-color: #f0f0f0;">{{ strtoupper(str_replace('_', ' ', $invoice->invoice_type)) }}</td>
            </tr>
            <tr>
                <td colspan="2" style="width: 50%;">
                    <p class="font-bold" style="margin:0;">Billing Address :-</p>
                    @if($invoice->customer)
                        <p style="margin:0;">{{ $invoice->customer->name }}</p>
                        <p style="margin:0;">{{ $invoice->customer->address }}</p>
                        @if(($settings['fields']['show_customer_phone'] ?? true) && !empty($invoice->customer->phone))
                        <p style="margin:0;">Mob:- {{ $invoice->customer->phone }}</p>
                        @endif
                        @if(($settings['fields']['show_gstin'] ?? true) && !empty($invoice->customer->gstin))
                            <p style="margin:0;">GSTIN: {{ $invoice->customer->gstin }}</p>
                        @endif
                    @else
                        <p>Cash / Walk-in Customer</p>
                    @endif
                </td>
                <td colspan="2" style="width: 50%;">
                    <table style="width:100%; font-size: inherit;">
                        <tr>
                            <td style="border:none; padding:0 0 2px 0;">Date:- {{ $invoice->date->format('d/m/Y') }}</td>
                        </tr>
                        <tr>
                            <td style="border:none; padding:0 0 2px 0;">Invoice No - {{ $invoice->invoice_number }}</td>
                        </tr>
                        @if(($settings['fields']['show_reference_number'] ?? true) && $invoice->reference_number)
                        <tr>
                            <td style="border:none; padding:0 0 2px 0;">Ref No - {{ $invoice->reference_number }}</td>
                        </tr>
                        @endif
                        @if($invoice->due_date && ($settings['fields']['show_due_date'] ?? true))
                        <tr>
                            <td style="border:none; padding:0 0 2px 0;">Due Date:- {{ \Carbon\Carbon::parse($invoice->due_date)->format('d/m/Y') }}</td>
                        </tr>
                        @endif
                        @if(($settings['fields']['show_vehicle_info'] ?? true) && $invoice->vehicle_number)
                        <tr>
                            <td style="border:none; padding:0 0 2px 0;">Vehicle No:- {{ $invoice->vehicle_number }}</td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
            
            <tr class="font-bold text-center" style="background-color: #f9f9f9;">
                <td style="width: 5%;">SL<br>NO.</td>
                @if($settings['fields']['show_hsn'] ?? true)
                <td style="width: 10%;">HSN</td>
                @endif
                <td style="width: 35%;">Item Description</td>
                @if($settings['fields']['show_qty'] ?? true)
                <td style="width: 10%;">Qty</td>
                @endif
                @if($settings['fields']['show_rate'] ?? true)
                <td style="width: 10%;">RATE</td>
                @endif
                @if($settings['fields']['show_tax_breakdown'] ?? true)
                    @if($invoice->tax_type !== 'exempt')
                    <td style="width: 10%;">TAX</td>
                    @endif
                @endif
                <td style="width: 15%;">AMOUNT</td>
            </tr>
            
            @php $totalRows = max(15, count($invoice->items)); @endphp
            @for($i = 0; $i < $totalRows; $i++)
                @if(isset($invoice->items[$i]))
                    @php $item = $invoice->items[$i]; @endphp
                    <tr class="text-center">
                        <td>{{ $i + 1 }}</td>
                        @if($settings['fields']['show_hsn'] ?? true)
                        <td>{{ $item->hsn_code ?? '-' }}</td>
                        @endif
                        <td style="text-align: left;">{{ $item->product->name ?? 'Unknown Item' }}</td>
                        @if($settings['fields']['show_qty'] ?? true)
                        <td>{{ floatval($item->quantity) }} {{ $item->unit }}</td>
                        @endif
                        @if($settings['fields']['show_rate'] ?? true)
                        <td>{{ number_format($item->rate, 2) }}</td>
                        @endif
                        @if($settings['fields']['show_tax_breakdown'] ?? true)
                            @if($invoice->tax_type !== 'exempt')
                            <td>{{ number_format(($invoice->tax_type === 'gst') ? ($item->cgst_amount + $item->sgst_amount) : $item->igst_amount, 2) }}</td>
                            @endif
                        @endif
                        <td>{{ number_format($item->total_amount, 2) }}</td>
                    </tr>
                @else
                    <tr class="text-center">
                        <td style="color: transparent; border-bottom: none; border-top: none;">-</td>
                        @if($settings['fields']['show_hsn'] ?? true)
                        <td style="border-bottom: none; border-top: none;"></td>
                        @endif
                        <td style="border-bottom: none; border-top: none;"></td>
                        @if($settings['fields']['show_qty'] ?? true)
                        <td style="border-bottom: none; border-top: none;"></td>
                        @endif
                        @if($settings['fields']['show_rate'] ?? true)
                        <td style="border-bottom: none; border-top: none;"></td>
                        @endif
                        @if($settings['fields']['show_tax_breakdown'] ?? true)
                            @if($invoice->tax_type !== 'exempt')
                            <td style="border-bottom: none; border-top: none;"></td>
                            @endif
                        @endif
                        <td style="border-bottom: none; border-top: none;"></td>
                    </tr>
                @endif
            @endfor

            <!-- Subtotals -->
            <tr>
                @php 
                    $colSpan = 2; // base description col
                    if($settings['fields']['show_hsn'] ?? true) $colSpan++;
                    if($settings['fields']['show_qty'] ?? true) $colSpan++;
                    if($settings['fields']['show_rate'] ?? true) $colSpan++;
                    if(($settings['fields']['show_tax_breakdown'] ?? true) && $invoice->tax_type !== 'exempt') $colSpan++;
                @endphp
                <td colspan="{{ $colSpan }}" style="border-right: none;"></td>
                <td class="font-bold text-center">Total</td>
                <td class="text-right font-bold">₹ {{ number_format($invoice->taxable_amount, 2) }}</td>
            </tr>
            <tr>
                <td colspan="{{ $colSpan }}" style="border-right: none;"></td>
                <td class="font-bold text-center">Tax Amount</td>
                <td class="text-right">₹ {{ number_format(($invoice->tax_type === 'gst') ? ($invoice->cgst_amount + $invoice->sgst_amount) : $invoice->igst_amount, 2) }}</td>
            </tr>
            @if($settings['fields']['show_discount'] ?? true)
            <tr>
                <td colspan="{{ $colSpan }}" style="border-right: none;"></td>
                <td class="font-bold text-center">Discount</td>
                <td class="text-right">- ₹ {{ number_format($invoice->discount, 2) }}</td>
            </tr>
            @endif
            <tr>
                <td colspan="{{ $colSpan }}" style="border-right: none;"></td>
                <td class="font-bold text-center">Round Off</td>
                <td class="text-right">₹ {{ number_format($invoice->round_off, 2) }}</td>
            </tr>
            
            <!-- Grand Total -->
            <tr>
                <td colspan="{{ $colSpan }}" class="text-center font-bold" style="font-size: 14px;">GRAND TOTAL</td>
                <td colspan="2" class="text-center font-bold" style="font-size: 16px;">₹ {{ number_format($invoice->final_amount, 2) }}</td>
            </tr>
            
            @if($settings['fields']['show_amount_in_words'] ?? true)
            <tr>
                @php
                    $amountInWords = '';
                    if (class_exists('NumberFormatter')) {
                        $formatter = new \NumberFormatter('en', \NumberFormatter::SPELLOUT);
                        $amountInWords = $formatter->format($invoice->final_amount);
                    } else {
                        $amountInWords = $invoice->final_amount; 
                    }
                @endphp
                <td colspan="{{ $colSpan + 2 }}" class="font-bold" style="font-size: 10px;">Rupees in Word: <span style="text-transform: capitalize; font-weight: normal;">{{ $amountInWords }} only.</span></td>
            </tr>
            @endif
            
            <tr>
                <td colspan="{{ ($settings['fields']['show_hsn'] ?? true) ? 3 : 2 }}" style="height: 100px; padding: 5px;">
                    @if($settings['fields']['show_terms'] ?? true)
                        <p class="font-bold" style="margin: 0; font-size: 10px;">Category of Service / Terms:</p>
                        <p style="font-size: 9px; margin: 2px 0;">{{ $invoice->terms_conditions ?? '1. Goods once sold will not be taken back.' }}</p>
                    @endif
                </td>
                <td colspan="4" style="padding: 5px;">
                    @if(($settings['fields']['show_bank_details'] ?? true) && ($invoice->business->bank_details ?? false))
                        <p class="font-bold" style="margin: 0; font-size: 10px;">Bank Details:</p>
                        <p style="font-size: 9px; margin: 2px 0;">{!! nl2br(e($invoice->business->bank_details)) !!}</p>
                    @endif
                </td>
            </tr>
            
            <tr>
                <td colspan="{{ ($settings['fields']['show_hsn'] ?? true) ? 3 : 2 }}" class="text-center" style="height: 80px; vertical-align: bottom; padding-bottom: 5px;">
                    <p style="font-size: 9px; text-align: left;">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                    <br>
                    Customer's Seal And Signature
                </td>
                <td colspan="4" class="text-right" style="vertical-align: bottom; padding-bottom: 5px;">
                    @if(!empty($settings['footer_image']))
                        <div style="text-align: right; margin-bottom: 5px;">
                            <img src="{{ $settings['footer_image'] }}" style="max-height: 50px;" alt="Footer">
                        </div>
                    @else
                        @if($settings['fields']['show_signature'] ?? true)
                            <p class="font-bold" style="margin-bottom: 5px;">{{ $settings['signature_label'] ?? 'Authorized Signatory' }}</p>
                            For {{ $invoice->business->name }}
                        @endif
                    @endif
                </td>
            </tr>
        </div>
    </div>
</body>
</html>
