import React, { useState } from 'react';

export default function GstJobWorkAndSubcontracting() {
    // S-12 State: Interactive GST Section 143 Aging Clock Simulator
    const [selectedChallan, setSelectedChallan] = useState<'challan_1' | 'challan_2' | 'challan_3'>('challan_1');

    const challans = {
        challan_1: {
            challanNo: 'DC-2026-849',
            vendor: 'Apex Surface Nitriding (Bhiwandi)',
            item: 'CNC Spline Shaft Billets (EN-19)',
            dispatchedDate: '12-Feb-2026',
            dispatchedQty: '1,250 kg (450 pcs)',
            daysElapsed: 42,
            daysRemaining: 138,
            statutoryLimit: 180,
            status: 'Safe (In Processing)',
            statusColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
            taxRisk: '₹0 (Within Limit)',
            notes: 'Vendor confirmed salt bath nitriding is 60% complete. Estimated return: 28-Feb-2026.'
        },
        challan_2: {
            challanNo: 'DC-2025-612',
            vendor: 'Shree Balaji Powder Coaters (Turbhe)',
            item: 'Heavy Control Panel Enclosures (CRCA)',
            dispatchedDate: '15-Oct-2025',
            dispatchedQty: '3,800 kg (120 enclosures)',
            daysElapsed: 126,
            daysRemaining: 54,
            statutoryLimit: 180,
            status: 'Warning (54 Days Left)',
            statusColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
            taxRisk: '₹1,42,000 Potential Deemed Supply',
            notes: 'Automated WhatsApp escalation triggered to vendor manager. Requires immediate inward reconciliation.'
        },
        challan_3: {
            challanNo: 'MOLD-DIE-084',
            vendor: 'Modern Tool Room & Die Makers (Pune)',
            item: 'High-Pressure Die Casting Core (H13 Steel)',
            dispatchedDate: '10-Jan-2024',
            dispatchedQty: '1 Tooling Die (2,400 kg)',
            daysElapsed: 770,
            daysRemaining: 325,
            statutoryLimit: 1095, // 3 Years for Capital Goods / Molds
            status: 'Capital Goods (3-Year Clock)',
            statusColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
            taxRisk: '₹0 (Section 143(1)(b) Compliant)',
            notes: 'Molds, dies, and jigs are entitled to 3-year return window under Section 143(1)(b) of CGST Act.'
        }
    };

    // S-14 State: Subcontractor Rate Card Calculator
    const [weightSentKg, setWeightSentKg] = useState(1500);
    const [jobWorkRatePerKg, setJobWorkRatePerKg] = useState(24.50); // ₹24.50/kg for zinc plating
    const [tdsRate, setTdsRate] = useState<1 | 2>(2); // 1% Individual/HUF, 2% Company

    const grossJobWorkBill = Math.round(weightSentKg * jobWorkRatePerKg);
    const tdsDeduction = Math.round(grossJobWorkBill * (tdsRate / 100));
    const gst18Percent = Math.round(grossJobWorkBill * 0.18);
    const netPayableVendor = grossJobWorkBill + gst18Percent - tdsDeduction;

    return (
        <section id="gst-job-work" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
                        Statutory Tax &amp; Subcontracting
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        GST Section 143 Job Work &amp; Form ITC-04 Engine
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Subcontracting without tracking is an invitation to heavy GST penalties. Nexus automates Rule 55 delivery challans, 180-day return clocks, and 1-click Form GST ITC-04 filing.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-11 & S-12: GST Rule 55 Delivery Challan & Section 143 Aging Clock       */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
                    
                    {/* Left: GST Section 143 Aging Clock Simulator (S-12) */}
                    <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                            <div>
                                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Deemed Supply Prevention</span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    GST Section 143 Statutory Aging Radar
                                </h3>
                            </div>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                                100% Audit Protected
                            </span>
                        </div>

                        {/* Challan Selector Tabs */}
                        <div className="grid grid-cols-3 gap-2 mt-5">
                            {(['challan_1', 'challan_2', 'challan_3'] as const).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedChallan(key)}
                                    className={`px-3 py-2 text-xs font-bold rounded-xl transition text-center border ${
                                        selectedChallan === key
                                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                    }`}
                                >
                                    {challans[key].challanNo}
                                </button>
                            ))}
                        </div>

                        {/* Active Challan Inspection Card */}
                        <div className="mt-6 bg-slate-800/80 rounded-2xl p-5 border border-white/5 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                                <div>
                                    <div className="text-sm font-bold text-white">
                                        {challans[selectedChallan].vendor}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Item: <strong>{challans[selectedChallan].item}</strong> ({challans[selectedChallan].dispatchedQty})
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${challans[selectedChallan].statusColor}`}>
                                    {challans[selectedChallan].status}
                                </span>
                            </div>

                            {/* Visual Progress Bar */}
                            <div>
                                <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
                                    <span>Time Elapsed: {challans[selectedChallan].daysElapsed} Days</span>
                                    <span>Remaining: {challans[selectedChallan].daysRemaining} / {challans[selectedChallan].statutoryLimit} Days</span>
                                </div>
                                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            challans[selectedChallan].daysRemaining < 60
                                                ? 'bg-amber-400'
                                                : 'bg-emerald-400'
                                        }`}
                                        style={{
                                            width: `${Math.min(100, (challans[selectedChallan].daysElapsed / challans[selectedChallan].statutoryLimit) * 100)}%`
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                    <span>Day 0 (Dispatched)</span>
                                    <span>Day 90 (First Alert)</span>
                                    <span>Day 180 (Deemed Tax Penalty)</span>
                                </div>
                            </div>

                            {/* Tax Alert Note */}
                            <div className="bg-slate-900/80 rounded-xl p-3.5 border border-white/5 text-xs text-slate-300">
                                <div className="flex items-center justify-between font-bold mb-1">
                                    <span className="text-amber-300">Statutory Assessment:</span>
                                    <span className="font-mono text-slate-200">{challans[selectedChallan].taxRisk}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {challans[selectedChallan].notes}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>Auto WhatsApp &amp; Email alerts to job workers at T-30, T-15, T-7 days</span>
                            <span className="text-amber-400 font-semibold">Zero Deemed Supply Tax</span>
                        </div>
                    </div>

                    {/* Right: Job Work Delivery Challan Rule 55 & ITC-04 Summary (S-11 & S-13) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* S-11: Rule 55 Delivery Challan */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                                Statutory GST Rule 55
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Compliant Job Work Delivery Challans
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Generate legal GST Rule 55 delivery challans with SAC 9988 coding, job worker GSTIN validation, gross/tare vehicle weights, and transport e-Way Bills.
                            </p>

                            <div className="mt-5 space-y-2.5 text-xs">
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">SAC Code 9988 (Manufacturing Services)</span>
                                    <span className="font-bold text-emerald-600">Auto-Tagged</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Job Worker GSTIN Verification</span>
                                    <span className="font-bold text-emerald-600">Live API Verified</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Job Work e-Way Bill (&gt;₹50,000 value)</span>
                                    <span className="font-bold text-emerald-600">1-Click NIC Portal</span>
                                </div>
                            </div>
                        </div>

                        {/* S-13: Form GST ITC-04 Auto-Filing */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60">
                                Quarterly Tax Filing
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                1-Click Form GST ITC-04 Auto-Generation
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Never spend weeks preparing quarterly ITC-04 spreadsheets. Nexus auto-compiles Table 1 (inputs dispatched) and Table 2 (inputs received back) in official government JSON format.
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
                                <span>Zero Discrepancy with GSTR-3B</span>
                                <span>Export Ready JSON →</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-14 to S-16: Subcontractor Rate Cards, Scrap Accountability & Portal     */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* S-14: Subcontractor Rate Card & TDS 194C Engine */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Subcontractor Ledger</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Subcontractor Rate Cards &amp; TDS 194C
                                </h3>
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                                Zinc Plating Vendor
                            </span>
                        </div>

                        {/* Interactive Sliders */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Material Sent (Kg)</span>
                                    <span className="text-indigo-600 font-mono">{weightSentKg} kg</span>
                                </div>
                                <input
                                    type="range"
                                    min="200"
                                    max="5000"
                                    step="100"
                                    value={weightSentKg}
                                    onChange={(e) => setWeightSentKg(parseInt(e.target.value))}
                                    className="w-full accent-indigo-600 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-400">Total batch weight</span>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Rate Per Kg</span>
                                    <span className="text-indigo-600 font-mono">₹{jobWorkRatePerKg.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="60"
                                    step="0.5"
                                    value={jobWorkRatePerKg}
                                    onChange={(e) => setJobWorkRatePerKg(parseFloat(e.target.value))}
                                    className="w-full accent-indigo-600 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-400">Electroplating rate</span>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>TDS Section 194C</span>
                                    <span className="text-indigo-600 font-mono">{tdsRate}%</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setTdsRate(1)}
                                        className={`py-1 text-xs font-bold rounded-lg border transition ${
                                            tdsRate === 1 ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        1% Indiv.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTdsRate(2)}
                                        className={`py-1 text-xs font-bold rounded-lg border transition ${
                                            tdsRate === 2 ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        2% Corp.
                                    </button>
                                </div>
                                <span className="text-[10px] text-slate-400">Statutory withholding</span>
                            </div>
                        </div>

                        {/* Calculated Voucher Summary */}
                        <div className="mt-6 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-[11px] text-slate-400">Gross Job Work</div>
                                    <div className="text-base font-bold text-white mt-0.5">₹{grossJobWorkBill.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">18% GST (ITC Claim)</div>
                                    <div className="text-base font-bold text-emerald-400 mt-0.5">+₹{gst18Percent.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">TDS 194C Withheld</div>
                                    <div className="text-base font-bold text-amber-400 mt-0.5">-₹{tdsDeduction.toLocaleString()}</div>
                                </div>
                                <div className="border-l border-white/10 pl-2">
                                    <div className="text-[11px] text-indigo-300 font-bold">Net Vendor Payout</div>
                                    <div className="text-lg font-black text-indigo-300 mt-0.5">₹{netPayableVendor.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* S-15 & S-16: Scrap Accountability & Subcontractor Vendor Portal */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Zero Scrap Leakage</span>
                                    <h3 className="text-lg font-black text-white mt-0.5">
                                        Job Work Scrap &amp; Vendor Portal
                                    </h3>
                                </div>
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                            </div>

                            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                                Eliminate disputes over missing metal turnings or fabric remnants. Nexus reconciles input weight vs finished weight with agreed burning loss allowances.
                            </p>

                            <div className="mt-5 space-y-3">
                                <div className="bg-slate-800/80 rounded-xl p-3 border border-white/5 text-xs">
                                    <div className="flex items-center justify-between font-bold">
                                        <span>Subcontractor Retained Scrap Credit</span>
                                        <span className="text-emerald-400 font-mono">Auto-Deducted</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">Scrap value deducted from labor billing if vendor keeps swarf.</div>
                                </div>

                                <div className="bg-slate-800/80 rounded-xl p-3 border border-white/5 text-xs">
                                    <div className="flex items-center justify-between font-bold">
                                        <span>Mobile Delivery Weight Confirmation</span>
                                        <span className="text-blue-400 font-mono">Weighbridge Slip</span>
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">Job workers snap weighbridge slip photo via WhatsApp/web link.</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>Average Unreturned Scrap Recovery: <strong className="text-emerald-400">+₹3.8L / Year</strong></span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
