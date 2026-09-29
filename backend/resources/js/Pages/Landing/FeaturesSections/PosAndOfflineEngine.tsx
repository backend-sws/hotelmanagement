import { useState } from 'react';

const KEYBOARD_SHORTCUTS = [
    { key: 'F1', label: 'New Invoice', action: 'Clears active cart and focuses on item barcode lookup field' },
    { key: 'F2', label: 'Item Search', action: 'Opens global search by SKU, Brand, Category, or Part Number' },
    { key: 'F3', label: 'Change Qty', action: 'Instantly modifies quantity for the currently highlighted line item' },
    { key: 'F4', label: 'Hold Cart', action: 'Saves current customer cart to queue and serves next queue customer' },
    { key: 'F5', label: 'Recall Cart', action: 'Brings held cart back with original items and applied discounts' },
    { key: 'F8', label: 'Split Tender', action: 'Splits payment across Cash, Card, UPI, and Customer Ledger Credit' },
    { key: 'F9', label: 'WhatsApp Only', action: 'Completes order without paper print, sends digital invoice to phone' },
    { key: 'F12', label: 'Cash & Print', action: '1-touch checkout with thermal print and cash drawer kick' },
];

export default function PosAndOfflineEngine() {
    const [selectedShortcut, setSelectedShortcut] = useState<string>('F12');
    const [isSimulatingPeak, setIsSimulatingPeak] = useState<boolean>(false);

    const activeKey = KEYBOARD_SHORTCUTS.find((k) => k.key === selectedShortcut) || KEYBOARD_SHORTCUTS[7];

    return (
        <div id="retail-pos" className="pt-16 pb-20 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 10: PosFeatures                                   */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                        <span>HIGH-VOLUME RETAIL POS</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Built For 1,000+ Bills A Day. Zero Touch Mouse Required.
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Engineered for lightning-speed retail checkout. Support for all USB/Bluetooth barcode scanners,
                        electronic weighing scale RS232 sync, customer dual-displays, and cash drawers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Interactive Keyboard Shortcut Cheat-Sheet */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Keyboard Mastery</span>
                                    <h3 className="text-lg font-bold text-slate-900">Click Any Function Key</h3>
                                </div>
                                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono font-semibold">
                                    0.3s Checkout Speed
                                </span>
                            </div>

                            {/* Keyboard Keys Grid */}
                            <div className="grid grid-cols-4 gap-2.5">
                                {KEYBOARD_SHORTCUTS.map((item) => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => setSelectedShortcut(item.key)}
                                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                                            selectedShortcut === item.key
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                                        }`}
                                    >
                                        <span className="font-mono font-extrabold text-sm">{item.key}</span>
                                        <span className="text-[10px] mt-0.5 truncate max-w-full opacity-80">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Active Key Explanation Box */}
                            <div className="mt-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-mono font-bold flex items-center justify-center shrink-0">
                                    {activeKey.key}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-indigo-950">{activeKey.label} Action</div>
                                    <p className="text-xs text-indigo-800/80 mt-0.5 leading-relaxed">{activeKey.action}</p>
                                </div>
                            </div>
                        </div>

                        {/* Hardware compatibility badges */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                                <div className="text-lg mb-1">🏷️</div>
                                <div className="font-bold text-xs text-slate-900">1D / 2D Barcode</div>
                                <div className="text-[10px] text-slate-500">USB, Bluetooth & PWA camera</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                                <div className="text-lg mb-1">⚖️</div>
                                <div className="font-bold text-xs text-slate-900">Weighing Scale</div>
                                <div className="text-[10px] text-slate-500">RS-232 live weight sync</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                                <div className="text-lg mb-1">🖨️</div>
                                <div className="font-bold text-xs text-slate-900">Thermal Printers</div>
                                <div className="text-[10px] text-slate-500">ESC/POS 2-inch & 3-inch</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Modern POS Terminal Screen Mockup */}
                    <div className="lg:col-span-6">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 font-sans">
                            {/* Terminal Top Bar */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold tracking-wider text-slate-300">COUNTER #01 — CASHIER: RAHUL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                                        SCANNER ONLINE
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                                        SCALE: 1.250 KG
                                    </span>
                                </div>
                            </div>

                            {/* Cart Items List */}
                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1 text-xs">
                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                    <div>
                                        <div className="font-bold text-white">Tata Salt 1kg Pack</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Barcode: 8901234567890 | GST: 5%</div>
                                    </div>
                                    <div className="text-right font-mono">
                                        <div className="text-slate-300">2 × ₹28.00</div>
                                        <div className="font-bold text-emerald-400">₹56.00</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                    <div>
                                        <div className="font-bold text-white">Fresh Alphonso Mangoes (Kg)</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Weighing Scale Auto-Sync | 0% GST</div>
                                    </div>
                                    <div className="text-right font-mono">
                                        <div className="text-slate-300">1.250 kg × ₹320.00</div>
                                        <div className="font-bold text-emerald-400">₹400.00</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                                    <div>
                                        <div className="font-bold text-white">Amul Butter 500g</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Barcode: 8901002233445 | GST: 12%</div>
                                    </div>
                                    <div className="text-right font-mono">
                                        <div className="text-slate-300">1 × ₹275.00</div>
                                        <div className="font-bold text-emerald-400">₹275.00</div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary & Action Buttons */}
                            <div className="pt-3 border-t border-slate-800 space-y-3">
                                <div className="flex justify-between items-end font-mono">
                                    <div>
                                        <span className="text-[11px] text-slate-400">3 Items (4 Qty)</span>
                                        <div className="text-xs text-emerald-400">Savings Applied: ₹42.00</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 block uppercase">Net Amount</span>
                                        <span className="text-2xl font-extrabold text-white">₹731.00</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                                    <button
                                        type="button"
                                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold border border-slate-700 transition-colors"
                                    >
                                        F4 HOLD (2)
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
                                    >
                                        F8 SPLIT
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/30 transition-colors"
                                    >
                                        F12 CASH (₹)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 11: CloudPosArchitecture                          */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900/40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                                <span>HIGH-AVAILABILITY CLOUD POS ENGINE</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Pure Cloud Speed: Zero Counter Mismatch Across Stores.
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Built on high-performance cloud architecture hosted in AWS Mumbai. Every barcode scanned and bill punched
                                instantly updates master inventory, central accounting ledgers, and owner reports in under 50 milliseconds
                                across all your billing counters and godowns.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                                    <div className="text-emerald-400 font-bold text-lg">Sub-50ms Query</div>
                                    <div className="text-xs text-slate-400 mt-1">Instant barcode lookup optimized for high-volume retail rush hours</div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                                    <div className="text-blue-400 font-bold text-lg">Conflict-Free Multi-Till</div>
                                    <div className="text-xs text-slate-400 mt-1">Unlimited simultaneous counters with atomic isolation</div>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80">
                                    <div className="text-purple-400 font-bold text-lg">99.99% Cloud SLA</div>
                                    <div className="text-xs text-slate-400 mt-1">Enterprise multi-AZ failover and automated real-time backups</div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Cloud Telemetry Simulator */}
                        <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Cloud Telemetry</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSimulatingPeak(!isSimulatingPeak);
                                    }}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                        isSimulatingPeak
                                            ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                                    }`}
                                >
                                    {isSimulatingPeak ? '⚡ SIMULATE NORMAL' : '🚀 SIMULATE PEAK RUSH'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50">
                                    <div>
                                        <div className="text-xs font-semibold text-slate-500">Cloud Connection</div>
                                        <div className="text-sm font-bold flex items-center gap-1.5 mt-0.5 text-emerald-600">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                            ONLINE (AWS Mumbai AP-South-1)
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-semibold text-slate-500">API Latency</div>
                                        <div className="text-base font-extrabold font-mono text-slate-900">
                                            {isSimulatingPeak ? '38ms' : '22ms'} (Ultra-Fast)
                                        </div>
                                    </div>
                                </div>

                                <div className="text-xs text-slate-600 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <span>Real-time stock deduction across all counter terminals</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <span>Instant WhatsApp receipt dispatch via Meta Cloud API</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-600 font-bold">✓</span>
                                        <span>Live owner sales dashboard updates in real time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
