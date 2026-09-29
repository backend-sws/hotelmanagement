import { useState } from 'react';

const GODOWNS = [
    { name: 'Central Distribution Godown (Bhiwandi)', capacity: '84%', skus: 1420, batches: 380, status: 'Normal' },
    { name: 'Retail Store Backroom (Andheri)', capacity: '62%', skus: 650, batches: 120, status: 'Normal' },
    { name: 'Cold Storage Unit (Vashi)', capacity: '91%', skus: 180, batches: 94, status: 'Near Full' },
    { name: 'Transit Float (Truck Fleet MH-04)', capacity: '35%', skus: 45, batches: 12, status: 'In Transit' },
];

const PO_STEPS = [
    { step: '01', title: 'Smart PO Generation', desc: 'Auto-calculates reorder quantity based on 30-day sales velocity and lead time.', icon: '📝' },
    { step: '02', title: 'Inward GRN & Inspection', desc: 'Warehouse manager records Goods Receipt Note (GRN) with batch barcodes & photos.', icon: '📦' },
    { step: '03', title: 'Landed Costing Allocator', desc: 'Apportions transport freight, customs duty, and unloading labor to unit item cost.', icon: '⚖️' },
    { step: '04', title: '3-Way Match & Bill Post', desc: 'Automated 3-way check: PO vs Vendor Invoice vs Physical GRN quantity with debit note.', icon: '✅' },
];

export default function InventoryAndSupplyChain() {
    const [selectedGodown, setSelectedGodown] = useState(0);

    return (
        <div id="inventory-po" className="pt-16 pb-20 space-y-24 bg-slate-50/60 border-y border-slate-200">
            {/* ========================================================= */}
            {/* SECTION 12: InventoryFeatures                             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                        <span>MULTI-GODOWN INVENTORY</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Real-Time Batch, Expiry & Godown Control
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Prevent dead stock and expired goods. Nexus tracks every SKU down to batch numbers, serial numbers,
                        manufacturing dates, and expiry warning horizons.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Godown Selection Cards */}
                    <div className="lg:col-span-5 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Select Warehouse / Godown
                        </div>
                        {GODOWNS.map((g, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedGodown(idx)}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    selectedGodown === idx
                                        ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                                        : 'bg-white/80 border-slate-200 hover:border-indigo-300'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm text-slate-900">{g.name}</h4>
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                            g.status === 'Near Full'
                                                ? 'bg-amber-100 text-amber-800'
                                                : g.status === 'In Transit'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                    >
                                        {g.status}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-mono">
                                    <span>Capacity: {g.capacity}</span>
                                    <span>{g.skus} Active SKUs</span>
                                    <span>{g.batches} Batches</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Godown Details & Expiry Radar Screen */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Live Godown Monitor</span>
                                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{GODOWNS[selectedGodown].name}</h3>
                            </div>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg font-mono">
                                FIFO Valuation Active
                            </span>
                        </div>

                        {/* Batch Alert Table Mock */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                Expiring Batches in Next 45 Days (Alert Threshold)
                            </div>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                                <div className="grid grid-cols-12 bg-slate-100 p-2.5 font-bold text-[11px] text-slate-700 border-b border-slate-200">
                                    <div className="col-span-4">Item & Batch #</div>
                                    <div className="col-span-3">Expiry Date</div>
                                    <div className="col-span-2 text-right">Stock Qty</div>
                                    <div className="col-span-3 text-right">Action</div>
                                </div>

                                <div className="grid grid-cols-12 p-3 items-center border-b border-slate-100 bg-rose-50/40">
                                    <div className="col-span-4">
                                        <div className="font-bold text-slate-900">Paracetamol 500mg Strip</div>
                                        <div className="font-mono text-[10px] text-slate-500">BATCH: PARA-24-09</div>
                                    </div>
                                    <div className="col-span-3">
                                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                                            Exp: 15 Oct 2026 (27d)
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-right font-mono font-bold text-slate-900">350 Strips</div>
                                    <div className="col-span-3 text-right">
                                        <button
                                            type="button"
                                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-semibold hover:bg-rose-700"
                                        >
                                            Discount Sale
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 p-3 items-center border-b border-slate-100 bg-amber-50/40">
                                    <div className="col-span-4">
                                        <div className="font-bold text-slate-900">Organic Basmati Rice 5kg</div>
                                        <div className="font-mono text-[10px] text-slate-500">BATCH: RICE-B82</div>
                                    </div>
                                    <div className="col-span-3">
                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                                            Exp: 05 Nov 2026 (48d)
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-right font-mono font-bold text-slate-900">80 Bags</div>
                                    <div className="col-span-3 text-right">
                                        <button
                                            type="button"
                                            className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-semibold hover:bg-amber-700"
                                        >
                                            Transfer Outlet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features checklist */}
                        <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>IMEI & Serial Number tracking for electronics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>Automatic low-stock reorder triggers to vendors</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>Physical inventory count barcode audit scanner</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>Negative inventory protection & stock locking</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 13: PurchaseOrderFlow                             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                        <span>PROCUREMENT WORKFLOW</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        End-to-End Purchase Order to GRN Lifecycle
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Eliminate duplicate supplier payments and unaccounted inventory shrinkage with automated 3-way matching.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {PO_STEPS.map((step, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative">
                            <div className="text-3xl mb-4">{step.icon}</div>
                            <div className="font-mono text-xs font-bold text-indigo-600 uppercase">STEP {step.step}</div>
                            <h3 className="font-bold text-base text-slate-900 mt-1">{step.title}</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 14: StockTransferFlow                             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-8">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-4">
                            <span>INTER-GODOWN TRANSIT</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Inter-Godown Stock Transfer (STN) With Zero Leakage
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Moving stock between warehouses? Nexus maintains a virtual "In-Transit" godown.
                            Stock leaves Godown A immediately, sits in transit, and only enters Godown B once the receiving supervisor scans and approves the goods.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">1. Dispatch Transfer Note</div>
                            <p className="text-slate-600 leading-relaxed">
                                Origin warehouse prints Delivery Challan with transporter details, driver contact, and dispatch timestamp.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">2. In-Transit Float Protection</div>
                            <p className="text-slate-600 leading-relaxed">
                                Goods in transit cannot be sold or billed until received, preventing ghost sales and inventory mismatches.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">3. Damage & Breakage Write-off</div>
                            <p className="text-slate-600 leading-relaxed">
                                If 10 units were broken on the road, receiving store logs transit damage with photos; debit note is auto-created.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
