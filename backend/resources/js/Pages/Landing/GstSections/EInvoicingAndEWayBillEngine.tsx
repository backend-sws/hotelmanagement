import React, { useState } from 'react';

export default function EInvoicingAndEWayBillEngine() {
    // S-10 State: Interactive E-Invoice & E-Way Bill Generator Simulator
    const [invoiceNo, setInvoiceNo] = useState('INV-2026-9481');
    const [buyerGstin, setBuyerGstin] = useState('27AAACT0012P1Z9');
    const [buyerName, setBuyerName] = useState('Tata AutoComp Systems Ltd');
    const [pincodeFrom, setPincodeFrom] = useState('411026'); // Bhosari, Pune
    const [pincodeTo, setPincodeTo] = useState('400701'); // Turbhe, Navi Mumbai
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsGenerated(true);
        }, 600);
    };

    return (
        <section id="e-invoicing-ewb" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        Government Transit Integration
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Direct NIC IRP E-Invoicing &amp; Instant E-Way Bills
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Issue legally valid B2B E-Invoices in &lt;200ms with signed QR codes. Generate Pin-to-Pin E-Way Bills directly from your dispatch dock with zero manual government portal logins.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-06 & S-10: Direct IRP E-Invoicing Engine & Interactive Web Simulator    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* Left: Interactive E-Invoice Generator Simulator (S-10) */}
                    <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Direct IRP Portal Node</span>
                            </div>
                            <span className="text-xs font-mono text-slate-400">NIC API v1.04</span>
                        </div>

                        {/* Interactive Form Controls */}
                        <div className="mt-5 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="text-slate-400 block mb-1">Invoice Number:</label>
                                    <input
                                        type="text"
                                        value={invoiceNo}
                                        onChange={(e) => setInvoiceNo(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">Buyer GSTIN:</label>
                                    <input
                                        type="text"
                                        value={buyerGstin}
                                        onChange={(e) => setBuyerGstin(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="text-slate-400 block mb-1">From Pincode (Plant):</label>
                                    <input
                                        type="text"
                                        value={pincodeFrom}
                                        onChange={(e) => setPincodeFrom(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-400 block mb-1">To Pincode (Buyer):</label>
                                    <input
                                        type="text"
                                        value={pincodeTo}
                                        onChange={(e) => setPincodeTo(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-white font-mono font-bold"
                                    />
                                </div>
                            </div>

                            {/* Simulated Output Card */}
                            {isGenerated ? (
                                <div className="mt-4 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 space-y-2 text-xs">
                                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                                        <span>✓ E-Invoice &amp; E-Way Bill Generated</span>
                                        <span className="font-mono">148ms</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-slate-300 break-all bg-slate-900 p-2 rounded-lg border border-white/5">
                                        IRN: 8a94bc12f...9120de (64 Chars Verified)
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-white/5 font-mono">
                                        <span>EWB No: <strong>9182-4410-8812</strong></span>
                                        <span>Distance: <strong>124 km Auto-Matched</strong></span>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-400">
                                    Click below to simulate live IRP API handshake with NIC servers
                                </div>
                            )}

                            {/* Action Button */}
                            <button
                                type="button"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 mt-2"
                            >
                                {isGenerating ? (
                                    <span>Connecting to NIC IRP Server...</span>
                                ) : isGenerated ? (
                                    <span>Regenerate Fresh IRN ↺</span>
                                ) : (
                                    <span>Generate B2B E-Invoice &amp; E-Way Bill →</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Technical Features (S-06 & S-07) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                                Mandatory Compliance
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Direct IRP E-Invoicing &amp; Pin-to-Pin E-Way Bills
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Avoid heavy fines under Section 122 of CGST Act. Non-generation of E-Invoices incurs a penalty of 100% of tax or ₹10,000 per invoice. Nexus automates complete compliance in real time.
                            </p>

                            <div className="mt-6 space-y-3 text-xs">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        ⚡
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Sub-200ms IRN Latency</div>
                                        <div className="text-slate-500 mt-0.5">High-speed dedicated GSP pipes to government IRP servers guarantee zero billing counter bottlenecks.</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        📍
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Automated Pin-to-Pin Distance API</div>
                                        <div className="text-slate-500 mt-0.5">Calculates exact road distance between warehouse and customer factory to prevent vehicle transit rejections.</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold shrink-0 mt-0.5">
                                        📲
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">Government Signed QR Code Print</div>
                                        <div className="text-slate-500 mt-0.5">Embeds the official base64 signed QR code on PDF invoices for instant barcode scanner scanning at highway checkposts.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-08 & S-09: Multi-Vehicle Consignments & B2C Dynamic QR Compliance       */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* S-08: Multi-Vehicle & Consolidated EWB */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                                Complex Logistics
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Multi-Vehicle &amp; Consolidated E-Way Bills
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Large industrial orders require shipment across multiple trucks. Nexus supports Part-A generation, Part-B vehicle number updates on the fly, and consolidated Form GST EWB-02 for multi-drop delivery routes.
                            </p>

                            <div className="mt-5 space-y-2 text-xs">
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Part-A Consignment Slip Issued</span>
                                    <span className="font-bold text-emerald-600">Goods Ready at Dock</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Vehicle Breakdown / Transshipment</span>
                                    <span className="font-bold text-blue-600">Part-B Vehicle No Updated</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Consolidated EWB-02 for 8 Shipments</span>
                                    <span className="font-bold text-purple-600">1 Master Trip Document</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Prevents highway truck confiscation</span>
                            <span className="font-bold text-indigo-700">100% Transit Legal</span>
                        </div>
                    </div>

                    {/* S-09: B2C Dynamic UPI QR Code */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                Large Enterprise Mandate
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                B2C Dynamic UPI QR Code Compliance
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Mandatory under Notification No. 14/2020 for businesses with turnover &gt;₹500 Cr issuing invoices to unregistered consumers. Nexus prints a dynamic UPI QR code with digital merchant parameters on every retail slip.
                            </p>

                            <div className="mt-5 space-y-2 text-xs">
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Merchant VPA &amp; Transaction ID Encoded</span>
                                    <span className="font-bold text-emerald-600">Notification 14/2020</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Exact Invoice Amount Pre-Filled</span>
                                    <span className="font-bold text-emerald-600">Zero Over/Under Payment</span>
                                </div>
                                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <span className="font-semibold text-slate-800">Thermal POS &amp; A4 Printer Support</span>
                                    <span className="font-bold text-emerald-600">Crisp Scannable Vector QR</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Avoids statutory ₹25,000 per invoice penalty</span>
                            <span className="font-bold text-emerald-700">Fully Certified</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
