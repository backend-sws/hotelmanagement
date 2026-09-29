import React, { useState } from 'react';

export default function GodownLogisticsAndDispatch() {
    // S-20 State: Interactive E-Way Bill Generator Simulator
    const [consigneePin, setConsigneePin] = useState('400001');
    const [consignorPin] = useState('395002'); // Surat
    const [approxDistance, setApproxDistance] = useState(285);
    const [transportMode, setTransportMode] = useState<'Road' | 'Rail' | 'Air'>('Road');
    const [vehicleNo, setVehicleNo] = useState('MH-04-AZ-9214');

    return (
        <section id="eway-bills" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                        Zero Friction Logistics
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Multi-Godown Transfers, Automated E-Way Bills &amp; Dispatch
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Central warehouse to depot stock transfers (STN), 0.4s NIC E-Way bills with distance auto-calculation, FEFO pick lists, and transporter LR ledgers.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-19 & S-20: Multi-Godown STN & Direct NIC E-Way Bill Generator           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
                    
                    {/* S-19: Multi-Godown Stock Transfer Note (STN) */}
                    <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Inter-Warehouse Movement</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        Multi-Godown Stock Transfer (STN)
                                    </h3>
                                </div>
                                <span className="text-2xl">📦</span>
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                                Move bulk stock from Central Bhiwandi Godown to City Depots with full in-transit inventory visibility and receiving GRN verification.
                            </p>

                            {/* Workflow Step Diagram */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                        1
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Dispatch Godown Issues Outward STN</p>
                                        <p className="text-[10px] text-slate-500">Stock decremented from Central Godown &amp; marked "In-Transit"</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                        2
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Direct Delivery Challan + E-Way Bill</p>
                                        <p className="text-[10px] text-slate-500">Consignment value &gt; ₹50,000 auto-synced with govt portal</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                        3
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Receiving Godown Physical Barcode Audit</p>
                                        <p className="text-[10px] text-slate-500">Blind barcode count detects transit leakage or short deliveries instantly</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ In-Transit Stock Value Tracked</span>
                            <span className="font-bold text-blue-600">Zero Stock Leakage</span>
                        </div>
                    </div>

                    {/* S-20: Direct NIC Portal E-Way Bill Generator Simulator */}
                    <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Direct NIC Gateway</span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    Automated 0.4s E-Way Bill Generation
                                </h3>
                            </div>
                            <span className="text-2xl">🚛</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-2 mb-5">
                            Never visit ewaybillgst.gov.in manually again. Nexus pulls party GSTIN, calculates road distance between PIN codes, and validates Part-A &amp; Part-B in real time.
                        </p>

                        {/* Interactive Parameters */}
                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">From PIN (Surat Godown):</label>
                                    <input 
                                        type="text" 
                                        value={consignorPin} 
                                        disabled 
                                        className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">To PIN (Consignee):</label>
                                    <input 
                                        type="text" 
                                        value={consigneePin} 
                                        onChange={(e) => {
                                            setConsigneePin(e.target.value);
                                            setApproxDistance(e.target.value.startsWith('40') ? 285 : 460);
                                        }}
                                        className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono focus:border-emerald-400 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Transport Mode:</label>
                                    <select 
                                        value={transportMode}
                                        onChange={(e) => setTransportMode(e.target.value as any)}
                                        className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-white/20 text-white text-xs outline-none"
                                    >
                                        <option value="Road">Road Transporter</option>
                                        <option value="Rail">Indian Railways</option>
                                        <option value="Air">Air Cargo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400 font-medium mb-1">Vehicle / Truck No:</label>
                                    <input 
                                        type="text" 
                                        value={vehicleNo}
                                        onChange={(e) => setVehicleNo(e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono uppercase focus:border-emerald-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Output Badge */}
                        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    <p className="text-xs font-bold text-emerald-300">NIC Auto-Distance: {approxDistance} KM</p>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">Part-A (Invoice) &amp; Part-B (Vehicle {vehicleNo}) Validated</p>
                            </div>
                            <span className="text-xs font-black px-2.5 py-1 rounded bg-emerald-500 text-slate-950">
                                1-Click Generate
                            </span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-21 to S-26: Order Flow, FEFO, LR Register, Box QR Labels & GRN         */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* S-21: Sales Order to Delivery Challan Flow */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            📋
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            SO &rarr; Pick &rarr; DC &rarr; Tax Invoice
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Support partial shipments and backorders. Generate warehouse pick lists, packing slips with net/gross weights, delivery challans, and final tax invoices.
                        </p>
                    </div>

                    {/* S-22: Batch Expiry & FEFO Allocation */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            ⏳
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Strict FEFO Batch Allocation
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Warehouse dispatch algorithms prioritize First-Expiry-First-Out (FEFO) stock batches to eliminate dead inventory and near-expiry write-offs.
                        </p>
                    </div>

                    {/* S-23: Lorry Receipt (LR) & Transporter Ledger */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg mb-3">
                            🚛
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Lorry Receipt (LR) &amp; Freight
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Track transporter LR numbers, driver mobile numbers, and freight charges. Supports To-Pay, Paid, and Billed-to-Customer freight accounting.
                        </p>
                    </div>

                    {/* S-24: Bulk Packing Slips & Carton QR Labels */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                            🏷️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Carton QR Shipping Labels
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Print 4"x6" barcode/QR box labels displaying Box # (e.g. 1 of 8), destination city, gross weight, and consignee party name for easy transport sorting.
                        </p>
                    </div>

                    {/* S-25: Godown Cycle Counting & Damage Write-Off */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            🔍
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Godown Stock Audit &amp; Leakage
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Run weekly blind barcode audits without shutting operations. Instantly isolate breakage, transit leakages, and supervisor-approved inventory write-offs.
                        </p>
                    </div>

                    {/* S-26: Pallet Bulk Inward GRN */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-lg mb-3">
                            📥
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Fast Pallet Inward GRN
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Scan manufacturer master pallet barcodes for 1-click inwarding against purchase orders (PO). Auto-matches invoiced rates with landed costing.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
