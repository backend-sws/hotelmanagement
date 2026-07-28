<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Outstanding Aging Report</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #1e293b; margin: 0; padding: 25px; }
        .container { max-width: 950px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; text-transform: uppercase; }
        .meta { font-size: 12px; color: #64748b; text-align: right; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        .table th { background: #0f172a; color: #ffffff; font-size: 11px; text-transform: uppercase; }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        
        /* Aging Color Badges */
        .badge-green { background-color: #dcfce7; color: #15803d; font-weight: bold; padding: 4px 6px; border-radius: 4px; display: inline-block; }
        .badge-yellow { background-color: #fef9c3; color: #a16207; font-weight: bold; padding: 4px 6px; border-radius: 4px; display: inline-block; }
        .badge-orange { background-color: #ffedd5; color: #c2410c; font-weight: bold; padding: 4px 6px; border-radius: 4px; display: inline-block; }
        .badge-red { background-color: #fee2e2; color: #b91c1c; font-weight: bold; padding: 4px 6px; border-radius: 4px; display: inline-block; }
        
        .total-row { background-color: #f1f5f9; font-weight: 800; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h1>Outstanding Aging Report</h1>
                <span style="color: #64748b; font-size: 14px;">{{ isset($report_type) ? ucfirst($report_type) . ' Due Summary' : 'Receivables & Payables Aging Breakdown' }}</span>
            </div>
            <div class="meta">
                <strong>Generated On:</strong> {{ date('d/m/Y H:i') }}<br>
                <strong>Business:</strong> {{ $business_name ?? 'My Business Enterprise' }}
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Party Name & Phone</th>
                    <th class="text-right">Total Outstanding</th>
                    <th class="text-right">0 - 30 Days<br><small style="color: #86efac; font-weight: normal;">(Current)</small></th>
                    <th class="text-right">31 - 60 Days<br><small style="color: #fde047; font-weight: normal;">(Overdue)</small></th>
                    <th class="text-right">61 - 90 Days<br><small style="color: #fdba74; font-weight: normal;">(Critical)</small></th>
                    <th class="text-right">90+ Days<br><small style="color: #fca5a5; font-weight: normal;">(Severe)</small></th>
                    <th class="text-center">Last Invoice</th>
                </tr>
            </thead>
            <tbody>
                @forelse($items as $index => $row)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $row['name'] }}</strong><br>
                        <span style="color: #64748b; font-size: 11px;">{{ $row['phone'] }}</span>
                    </td>
                    <td class="text-right" style="font-weight: 800; font-size: 13px;">
                        ₹ {{ number_format($row['total_outstanding'], 2) }}
                    </td>
                    <td class="text-right">
                        @if($row['current_0_30'] > 0)
                            <span class="badge-green">₹ {{ number_format($row['current_0_30'], 2) }}</span>
                        @else
                            <span style="color: #cbd5e1;">-</span>
                        @endif
                    </td>
                    <td class="text-right">
                        @if($row['overdue_31_60'] > 0)
                            <span class="badge-yellow">₹ {{ number_format($row['overdue_31_60'], 2) }}</span>
                        @else
                            <span style="color: #cbd5e1;">-</span>
                        @endif
                    </td>
                    <td class="text-right">
                        @if($row['overdue_61_90'] > 0)
                            <span class="badge-orange">₹ {{ number_format($row['overdue_61_90'], 2) }}</span>
                        @else
                            <span style="color: #cbd5e1;">-</span>
                        @endif
                    </td>
                    <td class="text-right">
                        @if($row['overdue_90_plus'] > 0)
                            <span class="badge-red">₹ {{ number_format($row['overdue_90_plus'], 2) }}</span>
                        @else
                            <span style="color: #cbd5e1;">-</span>
                        @endif
                    </td>
                    <td class="text-center" style="font-size: 11px; color: #64748b;">
                        {{ $row['last_invoice_date'] ? \Carbon\Carbon::parse($row['last_invoice_date'])->format('d/m/Y') : 'N/A' }}
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center" style="padding: 25px; color: #64748b;">No outstanding dues found! All party accounts are settled.</td>
                </tr>
                @endforelse
            </tbody>
            @if(count($items) > 0)
            <tfoot>
                <tr class="total-row">
                    <td colspan="2" class="text-right">Grand Totals:</td>
                    <td class="text-right">₹ {{ number_format(array_sum(array_column($items, 'total_outstanding')), 2) }}</td>
                    <td class="text-right" style="color: #15803d;">₹ {{ number_format(array_sum(array_column($items, 'current_0_30')), 2) }}</td>
                    <td class="text-right" style="color: #a16207;">₹ {{ number_format(array_sum(array_column($items, 'overdue_31_60')), 2) }}</td>
                    <td class="text-right" style="color: #c2410c;">₹ {{ number_format(array_sum(array_column($items, 'overdue_61_90')), 2) }}</td>
                    <td class="text-right" style="color: #b91c1c;">₹ {{ number_format(array_sum(array_column($items, 'overdue_90_plus')), 2) }}</td>
                    <td>-</td>
                </tr>
            </tfoot>
            @endif
        </table>
        
        <div style="margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center;">
            * This is a system-generated account aging report for tracking credit durations and timely payment follow-ups.
        </div>
    </div>
</body>
</html>
