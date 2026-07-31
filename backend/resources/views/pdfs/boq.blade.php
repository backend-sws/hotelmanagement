<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>BOQ / Estimate</title>
    <style>
        body { 
            font-family: Helvetica, Arial, sans-serif; 
            font-size: 12px; 
            line-height: 1.5;
            color: #333; 
            margin: 30px;
        }
        .invoice-box { max-width: 800px; margin: auto; }
        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 20px; }
        table td { padding: 5px; vertical-align: top; }
        .header, .footer { text-align: center; font-size: 10px; color: #777; }
        .company-details { text-align: left; }
        .border-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; }
        .items-table { border: 1px solid #ddd; }
        .items-table th { background: #333; border: 1px solid #333; padding: 8px; font-weight: bold; color: #ffffff; }
        .items-table td { border: 1px solid #ddd; padding: 5px; }
        .right-align { text-align: right; }
        .center-align { text-align: center; }
        .bold { font-weight: bold; }
        .section-header {
            background-color: #f3f4f6;
            font-weight: bold;
            font-size: 14px;
            color: #111827;
        }
        .total-row {
            font-size: 14px;
            font-weight: bold;
            background-color: #f9fafb;
        }
    </style>
</head>
<body>
    <div style="padding: 15px;">
        <div class="invoice-box">
        <h2 class="center-align" style="text-transform: uppercase; color: #333;">Bill of Quantities / Estimate</h2>
        
        <table cellpadding="0" cellspacing="0">
            <tr>
                <td class="company-details" style="width:50%;">
                    @if($boq->business->logo_path)
                        <img src="{{ Storage::url($boq->business->logo_path) }}" style="max-height: 50px; margin-bottom: 5px;" alt="Logo"><br>
                    @endif
                    <h3 style="margin:0; color: #333;">{{ $boq->business->name }}</h3>
                    <p style="margin:0;">{{ $boq->business->address }}</p>
                    @if(!empty($boq->business->phone))
                    <p style="margin:0;">Phone: {{ $boq->business->phone }}</p>
                    @endif
                    @if(!empty($boq->business->gst_settings->gstin))
                    <p style="margin:0;">GSTIN: {{ $boq->business->gst_settings->gstin }}</p>
                    @endif
                </td>
                <td class="right-align" style="width:50%;">
                    <p class="bold" style="font-size:16px;">BOQ No: BOQ-{{ str_pad($boq->id, 4, '0', STR_PAD_LEFT) }}</p>
                    <p>Date: {{ $boq->created_at->format('d-m-Y') }}</p>
                    @if($boq->validity_date)
                    <p>Valid Until: {{ \Carbon\Carbon::parse($boq->validity_date)->format('d-m-Y') }}</p>
                    @endif
                    <p>Status: {{ strtoupper($boq->status) }}</p>
                </td>
            </tr>
        </table>
        
        <div class="border-box">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:0; width: 100%;">
                <tr>
                    <td style="width:50%;">
                        <p class="bold" style="margin:0;">Client Details:</p>
                        <p style="margin:0;">Name: {{ $boq->client_name ?? 'General Client' }}</p>
                    </td>
                    @if($boq->project_name || $boq->project_id)
                    <td style="width:50%;">
                        <p class="bold" style="margin:0;">Project Details:</p>
                        <p style="margin:0;">Name: {{ $boq->project_name ?? ($boq->project->name ?? 'N/A') }}</p>
                    </td>
                    @endif
                </tr>
            </table>
        </div>

        <p class="bold" style="font-size:14px;">Estimate Title: {{ $boq->name }}</p>
        
        <table class="items-table" cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th style="width: 50%;">Item / Description</th>
                    <th class="center-align">Quantity</th>
                    <th class="center-align">Unit</th>
                    <th class="right-align">Rate (Rs.)</th>
                    <th class="right-align">Amount (Rs.)</th>
                </tr>
            </thead>
            <tbody>
                @php $grandTotal = 0; @endphp
                @foreach($boq->sections as $section)
                    <tr class="section-header">
                        <td colspan="5">{{ $section->section_name }}</td>
                    </tr>
                    @php $sectionTotal = 0; @endphp
                    @foreach($section->items as $item)
                        @php 
                            $itemAmount = $item->quantity * $item->rate;
                            $sectionTotal += $itemAmount;
                        @endphp
                        <tr>
                            <td>{{ $item->item_name }}</td>
                            <td class="center-align">{{ $item->quantity }}</td>
                            <td class="center-align">{{ $item->unit }}</td>
                            <td class="right-align" style="white-space: nowrap;">{{ number_format($item->rate, 2) }}</td>
                            <td class="right-align" style="white-space: nowrap;">{{ number_format($itemAmount, 2) }}</td>
                        </tr>
                    @endforeach
                    <tr style="background-color: #fafafa;">
                        <td colspan="4" class="right-align bold">Section Total:</td>
                        <td class="right-align bold" style="white-space: nowrap;">{{ number_format($sectionTotal, 2) }}</td>
                    </tr>
                    @php $grandTotal += $sectionTotal; @endphp
                @endforeach
                
                <tr class="total-row">
                    <td colspan="4" class="right-align">Grand Total:</td>
                    <td class="right-align" style="white-space: nowrap;">Rs.&nbsp;{{ number_format($boq->total_amount ?? $grandTotal, 2) }}</td>
                </tr>
            </tbody>
        </table>
        
        <div style="margin-top: 30px;">
            <table cellpadding="0" cellspacing="0" style="margin-bottom:0;">
                <tr>
                    <td style="width: 50%;">
                        <p class="bold">Terms & Conditions:</p>
                        <ul style="padding-left: 20px; font-size: 11px;">
                            <li>This is an estimate, not a tax invoice.</li>
                            <li>Validity of this estimate is limited to the date specified.</li>
                        </ul>
                    </td>
                    <td style="width: 50%; text-align: right; vertical-align: bottom;">
                        <br><br><br>
                        <p class="bold" style="margin:0;">Authorized Signatory</p>
                    </td>
                </tr>
            </table>
        </div>
        
        <div class="footer" style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p>Generated by MobileCRM</p>
        </div>
        </div>
    </div>
</body>
</html>
