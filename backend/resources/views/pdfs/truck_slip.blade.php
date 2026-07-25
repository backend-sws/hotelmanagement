<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 15px; }
        .slip { border: 2px solid #333; padding: 15px; max-width: 400px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .header .dc-number { font-size: 14px; font-weight: bold; color: #444; margin-top: 4px; }
        .header .date { font-size: 11px; color: #666; }
        .section { border-bottom: 1px dashed #999; padding: 8px 0; }
        .section:last-child { border-bottom: none; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .label { font-weight: bold; color: #555; width: 120px; }
        .value { flex: 1; text-align: right; }
        .items-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        .items-table th, .items-table td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; }
        .items-table th { background: #f5f5f5; font-size: 10px; text-transform: uppercase; }
        .signature { margin-top: 30px; text-align: center; }
        .signature-line { border-top: 1px solid #333; width: 200px; margin: 0 auto; padding-top: 5px; }
    </style>
</head>
<body>
    <div class="slip">
        <div class="header">
            <h1>Delivery Challan</h1>
            <div class="dc-number">{{ $challan->invoice_number }}</div>
            <div class="date">Date: {{ \Carbon\Carbon::parse($challan->date)->format('d/m/Y') }}</div>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">From:</span>
                <span class="value">{{ $challan->business->name ?? 'N/A' }}</span>
            </div>
            <div class="row">
                <span class="label">To:</span>
                <span class="value">{{ $challan->customer->name ?? 'Walk-in' }}</span>
            </div>
            @if($challan->customer && $challan->customer->address)
            <div class="row">
                <span class="label">Site:</span>
                <span class="value">{{ $challan->customer->address }}</span>
            </div>
            @endif
        </div>

        <div class="section">
            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Material</th>
                        <th>Qty</th>
                        <th>Unit</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($challan->items as $index => $item)
                    <tr>
                        <td>{{ $index + 1 }}</td>
                        <td>{{ $item->product->model_name ?? 'Item' }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>{{ $item->unit ?? 'pcs' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="section">
            <div class="row">
                <span class="label">Vehicle:</span>
                <span class="value">{{ $challan->vehicle_number ?? 'N/A' }}</span>
            </div>
            <div class="row">
                <span class="label">Driver:</span>
                <span class="value">{{ $challan->driver_name ?? 'N/A' }}</span>
            </div>
        </div>

        <div class="signature">
            <div class="signature-line">Authorized Signature</div>
        </div>
    </div>
</body>
</html>
