import React, { useState } from 'react';

export default function CreditKhataAndReceivables() {
    // S-12 State: Active Aging Bucket Filter
    const [activeBucket, setActiveBucket] = useState<'all' | '0-15' | '16-30' | '31-45' | '46-60' | '90+'>('all');

    const sampleParties = [
        {
            name: 'Singhania Mega Mart (Bhiwandi)',
            bucket: '0-15',
            dueDays: 8,
            amount: 284000,
            creditLimit: 500000,
            status: 'Normal',
            statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        },
        {
            name: 'Mahavir Textiles (Surat Hub)',
            bucket: '16-30',
            dueDays: 24,
            amount: 195600,
            creditLimit: 300000,
            status: 'Due Soon',
            statusColor: 'text-blue-700 bg-blue-50 border-blue-200'
        },
        {
            name: 'Apothecary Chemists (Kalyan)',
            bucket: '31-45',
            dueDays: 38,
            amount: 78400,
            creditLimit: 150000,
            status: 'Follow Up',
            statusColor: 'text-amber-700 bg-amber-50 border-amber-200'
        },
        {
            name: 'Balaji Hardware & Sanitary (Pune)',
            bucket: '46-60',
            dueDays: 52,
            amount: 412000,
            creditLimit: 400000,
            status: 'Critical Overdue',
            statusColor: 'text-rose-700 bg-rose-50 border-rose-200'
        },
        {
            name: 'Gupta Electrical Traders (Nagpur)',
            bucket: '90+',
            dueDays: 104,
            amount: 145000,
            creditLimit: 200000,
            status: 'Locked / Legal Notice',
            statusColor: 'text-purple-700 bg-purple-50 border-purple-200'
        }
    ];

    const filteredParties = activeBucket === 'all' 
        ? sampleParties 
        : sampleParties.filter(p => p.bucket === activeBucket);

    return (
        <section id="credit-khata" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60">
                        Zero Bad Debts Guarantee
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Party Credit Aging Radar &amp; WhatsApp Khata Dunning
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Collect B2B market receivables 12 days faster. Automated aging buckets, scheduled WhatsApp payment reminders with dynamic UPI links, and Post-Dated Cheque (PDC) vaults.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-12: Party Credit Aging Radar Interactive Component                      */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-14">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Receivables Radar</span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                                Market Credit Aging Heatmap
                            </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold">
                            <div>
                                <p className="text-slate-400">Total Outstanding:</p>
                                <p className="text-lg font-black text-emerald-400">₹11,15,000</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <p className="text-slate-400">Overdue (&gt;30d):</p>
                                <p className="text-lg font-black text-rose-400">₹6,35,400</p>
                            </div>
                        </div>
                    </div>

                    {/* Aging Bucket Buttons */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-6 text-xs">
                        <button
                            type="button"
                            onClick={() => setActiveBucket('all')}
                            className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                                activeBucket === 'all' 
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs' 
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                            }`}
                        >
                            All Buckets
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveBucket('0-15')}
                            className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                                activeBucket === '0-15' 
                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs' 
                                    : 'bg-white/5 border-white/10 text-emerald-400 hover:bg-white/10'
                            }`}
                        >
                            0-15 Days (Safe)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveBucket('16-30')}
                            className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                                activeBucket === '16-30' 
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-xs' 
                                    : 'bg-white/5 border-white/10 text-blue-300 hover:bg-white/10'
                            }`}
                        >
                            16-30 Days (Normal)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveBucket('31-45')}
                            className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                                activeBucket === '31-45' 
                                    ? 'bg-amber-600 border-amber-500 text-white shadow-xs' 
                                    : 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10'
                            }`}
                        >
                            31-45 Days (Attention)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveBucket('46-60')}
                            className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                                activeBucket === '46-60' 
                                    ? 'bg-rose-600 border-rose-500 text-white shadow-xs' 
                                    : 'bg-white/5 border-white/10 text-rose-400 hover:bg-white/10'
                            }`}
                        >
                            46-60 Days (Critical)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveBucket('90+')}
                            className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                                activeBucket === '90+' 
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-xs' 
                                    : 'bg-white/5 border-white/10 text-purple-400 hover:bg-white/10'
                            }`}
                        >
                            90+ Days (Default Risk)
                        </button>
                    </div>

                    {/* Party Aging List Table */}
                    <div className="space-y-2.5">
                        {filteredParties.map((party, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-white truncate">{party.name}</p>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${party.statusColor}`}>
                                            {party.status}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Due Since: <strong className="text-white">{party.dueDays} Days</strong> • Credit Limit: ₹{party.creditLimit.toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 self-end sm:self-center">
                                    <div className="text-right">
                                        <p className="text-sm font-black text-emerald-400">₹{party.amount.toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] text-slate-400">Pending Balance</p>
                                    </div>
                                    <button 
                                        type="button"
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-xs"
                                    >
                                        WhatsApp Reminder
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-13 & S-14: WhatsApp Automated Dunning & Post-Dated Cheques (PDC)        */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-13: 3-Stage WhatsApp Dunning Engine */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Automated Recovery</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    3-Stage WhatsApp Payment Dunning
                                </h3>
                            </div>
                            <span className="text-2xl">📲</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-5">
                            Stop awkward collection phone calls. Nexus sends polite, automated WhatsApp reminders with instant UPI payment links and attached bill PDFs.
                        </p>

                        <div className="space-y-3">
                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">Stage 1: T-3 Days Before Due Date</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">Gentle Alert</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    "Dear Rahul Traders, your invoice #4810 of ₹42,500 is due on 24th Sep. Attached is statement PDF for your verification."
                                </p>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">Stage 2: On Due Date</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded">Payment Day</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    "Invoice #4810 is due today. Pay instantly via zero-fee UPI QR link: nexus-pay.in/u/9814"
                                </p>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">Stage 3: Overdue &gt; 15 Days</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded">Strict Reminder</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    "Notice: Payment overdue by 16 days. Overdue interest @ 18% p.a. will be levied from tomorrow. Future sales order creation is currently on hold."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* S-14: Post-Dated Cheque (PDC) Vault */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Indian Banking Ops</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Post-Dated Cheque (PDC) Register
                                </h3>
                            </div>
                            <span className="text-2xl">🏦</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-5">
                            Wholesale runs on PDCs. Track physical cheques in your vault, get automated morning bank deposit alerts, and handle bounces with 1-click debit notes.
                        </p>

                        <div className="space-y-2.5 text-xs">
                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Cheque #491024 • HDFC Bank</p>
                                    <p className="text-[10px] text-slate-500">Party: Kaveri Granites • Maturity: 28th Sep</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-slate-900">₹1,50,000</span>
                                    <p className="text-[9px] text-blue-600 font-bold">In Vault</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Cheque #819201 • State Bank of India</p>
                                    <p className="text-[10px] text-slate-500">Party: Apex Surgicals • Maturity: Today</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-slate-900">₹85,400</span>
                                    <p className="text-[9px] text-emerald-600 font-bold">Deposit Today</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Cheque #102941 • ICICI Bank</p>
                                    <p className="text-[10px] text-slate-500">Party: Royal Orchid Spas • Dishonored</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-black text-rose-600">₹62,000</span>
                                    <p className="text-[9px] text-rose-600 font-bold">+₹500 Bounce Debit Note</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ Direct reconciliation with bank statement</span>
                            <span className="font-bold text-blue-600">Cheque Return Register</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-15 to S-18: Running Ledger, Overdue Interest, Group Khata & Bad Debts   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-15: Interactive Khata Ledger */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            📒
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Bill-by-Bill Ledger
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Auto-match receipts to specific past bills. Adjust on FIFO or manual invoice selection with running balance and on-account credits.
                        </p>
                    </div>

                    {/* S-16: Automated Overdue Interest */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                            📈
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            18% - 24% Overdue Interest
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Automatically compute commercial interest for payments delayed beyond grace days. Print interest calculation memo with monthly statements.
                        </p>
                    </div>

                    {/* S-17: Multi-Branch Group Khata */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg mb-3">
                            🏢
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Multi-Branch Group Ledger
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Consolidate credit limits and ledger statements across a dealer’s 10 different retail shops under a single parent account.
                        </p>
                    </div>

                    {/* S-18: Bad Debt & Security Cover */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            🛡️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Credit Scoring &amp; Security
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Track security deposit cheques, bank guarantees, and credit rating flags (Green/Yellow/Red) to prevent sudden market defaults.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
