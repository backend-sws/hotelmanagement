<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Statement - {{ $statement['party']['name'] ?? 'Party' }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; color: #1e293b; margin: 0; padding: 30px; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px; }
        .title h1 { margin: 0; font-size: 24px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px; }
        .title .subtitle { color: #64748b; font-size: 14px; margin-top: 5px; }
        .meta { text-align: right; }
        .party-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; border-radius: 6px; margin-bottom: 20px; display: flex; justify-content: space-between; }
        .party-info h3 { margin: 0 0 5px 0; font-size: 16px; color: #0f172a; }
        .party-info p { margin: 2px 0; color: #475569; font-size: 12px; }
        .balance-summary { text-align: right; }
        .balance-summary .open-bal { font-size: 14px; color: #334155; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; }
        .table th { background: #f1f5f9; font-weight: 700; color: #334155; font-size: 11px; text-transform: uppercase; }
        .table td { font-size: 12px; }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .dr { color: #15803d; font-weight: 600; }
        .cr { color: #b91c1c; font-weight: 600; }
        .footer-summary { margin-top: 20px; background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
        .footer-summary h2 { margin: 0; font-size: 18px; color: #1e40af; }
        .signature { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; color: #64748b; }
        .signature-line { border-top: 1px solid #94a3b8; width: 180px; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">
                <h1>Account Statement</h1>
                <div class="subtitle">{{ ucfirst($statement['party_type'] ?? 'Party') }} Ledger Summary</div>
            </div>
            <div class="meta">
                <strong>Generated Date:</strong> {{ date('d/m/Y') }}<br>
                @if(!empty($statement['period']['from']) && !empty($statement['period']['to']))
                    <strong>Period:</strong> {{ \Carbon\Carbon::parse($statement['period']['from'])->format('d/m/Y') }} to {{ \Carbon\Carbon::parse($statement['period']['to'])->format('d/m/Y') }}
                @else
                    <strong>Period:</strong> Entire Account History
                @endif
            </div>
        </div>

        <div class="party-box">
            <div class="party-info">
                <h3>{{ $statement['party']['name'] ?? 'N/A' }}</h3>
                @if(!empty($statement['party']['phone']))
                    <p><strong>Phone:</strong> {{ $statement['party']['phone'] }}</p>
                @endif
                @if(!empty($statement['party']['gstin']))
                    <p><strong>GSTIN:</strong> {{ $statement['party']['gstin'] }}</p>
                @endif
                @if(!empty($statement['party']['address']))
                    <p><strong>Address:</strong> {{ $statement['party']['address'] }}</p>
                @endif
            </div>
            <div class="balance-summary">
                <p class="open-bal">Opening Balance: ₹ {{ number_format($statement['opening_balance'], 2) }}</p>
                <p style="color: #64748b; font-size: 11px;">(Brought forward at period start)</p>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th class="text-center">Date</th>
                    <th>Voucher / Ref</th>
                    <th>Narration</th>
                    <th class="text-right">Debit (₹)</th>
                    <th class="text-right">Credit (₹)</th>
                    <th class="text-right">Balance (₹)</th>
                </tr>
            </thead>
            <tbody>
                <!-- Opening Balance Row -->
                <tr style="background-color: #f8fafc; font-weight: 600;">
                    <td class="text-center">-</td>
                    <td>OPENING</td>
                    <td>Opening Balance brought forward</td>
                    <td class="text-right">-</td>
                    <td class="text-right">-</td>
                    <td class="text-right">{{ number_format($statement['opening_balance'], 2) }}</td>
                </tr>

                @forelse($statement['entries'] as $entry)
                <tr>
                    <td class="text-center">{{ \Carbon\Carbon::parse($entry['date'])->format('d/m/Y') }}</td>
                    <td style="font-weight: 600; text-transform: uppercase;">{{ str_replace('_', ' ', $entry['entry_type']) }}</td>
                    <td>{{ $entry['narration'] ?? 'N/A' }}</td>
                    <td class="text-right dr">{{ $entry['debit'] > 0 ? number_format($entry['debit'], 2) : '-' }}</td>
                    <td class="text-right cr">{{ $entry['credit'] > 0 ? number_format($entry['credit'], 2) : '-' }}</td>
                    <td class="text-right" style="font-weight: bold;">{{ number_format($entry['balance'], 2) }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="text-center" style="padding: 20px; color: #64748b;">No transactions recorded in this selected period.</td>
                </tr>
                @endforelse
            </tbody>
            <tfoot>
                <tr style="background: #f1f5f9; font-weight: 800;">
                    <td colspan="3" class="text-right">Period Totals:</td>
                    <td class="text-right dr">₹ {{ number_format($statement['total_debit'], 2) }}</td>
                    <td class="text-right cr">₹ {{ number_format($statement['total_credit'], 2) }}</td>
                    <td>-</td>
                </tr>
            </tfoot>
        </table>

        <div class="footer-summary">
            <div>
                <span style="font-size: 13px; color: #3b82f6; font-weight: bold; text-transform: uppercase;">Final Closing Balance:</span>
                <p style="margin: 3px 0 0 0; color: #64748b; font-size: 11px;">
                    {{ $statement['closing_balance'] >= 0 ? '(Amount collectible / due from party)' : '(Amount payable / credit with party)' }}
                </p>
            </div>
            <h2>₹ {{ number_format(abs($statement['closing_balance']), 2) }} {{ $statement['closing_balance'] >= 0 ? 'Dr' : 'Cr' }}</h2>
        </div>

        <div class="signature">
            <div>
                <div class="signature-line"></div>
                Prepared By (Accountant)
            </div>
            <div>
                <div class="signature-line"></div>
                Authorized Signatory / Seal
            </div>
        </div>
    </div>
</body>
</html>
