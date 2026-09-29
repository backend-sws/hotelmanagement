import { useState } from 'react';

const SHORTCUTS = [
    { key: 'F1', label: 'New Cart', desc: 'Focus cursor to barcode scanner input' },
    { key: 'F2', label: 'Item Search', desc: 'Search product by name, brand, or SKU' },
    { key: 'F3', label: 'Qty Edit', desc: 'Rapidly modify item quantity in active row' },
    { key: 'F4', label: 'Hold Bill', desc: 'Park active customer cart to queue' },
    { key: 'F5', label: 'Recall Bill', desc: 'Retrieve held cart back with items' },
    { key: 'F7', label: 'Apply Promo', desc: 'Trigger loyalty points or coupon code' },
    { key: 'F8', label: 'Split Tender', desc: 'Split Cash + UPI + Store Credit' },
    { key: 'F9', label: 'WhatsApp Only', desc: 'Paperless digital bill dispatched to mobile' },
    { key: 'F12', label: 'Cash & Print', desc: '1-touch checkout with thermal print & drawer kick' },
];

export default function PosAndCheckoutExperience() {
    const [selectedShortcut, setSelectedShortcut] = useState('F12');
    const [simulatedWeight, setSimulatedWeight] = useState<number>(1.85); // kg
    const [pricePerKg, setPricePerKg] = useState<number>(160); // ₹160/kg Shimla Apples
    const [thermalSize, setThermalSize] = useState<'3inch' | '2inch'>('3inch');

    const totalProduceCost = simulatedWeight * pricePerKg;
    const activeKey = SHORTCUTS.find((s) => s.key === selectedShortcut) || SHORTCUTS[8];

    return (
        <div id="retail-pos-features" className="py-16 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 3 & 4: BarcodePosDeepDive & KeyboardOnlyBilling   */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                        <span>HIGH-SPEED CHECKOUT ENGINE</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        0.3-Second Barcode POS: 100% Keyboard Driven
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Trained cashiers never touch a computer mouse. Scan any 1D/2D barcode or trigger function keys for lightning-fast queue clearing during peak rush hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Keyboard Trainer */}
                    <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Cashier Speed Trainer</span>
                                <h3 className="text-lg font-bold text-slate-900">Click Any Function Key</h3>
                            </div>
                            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-mono font-semibold rounded-lg">
                                Zero Mouse Needed
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            {SHORTCUTS.map((sc) => (
                                <button
                                    key={sc.key}
                                    type="button"
                                    onClick={() => setSelectedShortcut(sc.key)}
                                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                                        selectedShortcut === sc.key
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="font-mono font-extrabold text-sm">{sc.key}</span>
                                    <span className="text-[10px] mt-0.5 truncate max-w-full opacity-80">{sc.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-bold flex items-center justify-center shrink-0">
                                {activeKey.key}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-emerald-950">{activeKey.label} Action</div>
                                <p className="text-xs text-emerald-800/80 mt-0.5 leading-relaxed">{activeKey.desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* Live Counter POS Display Screen */}
                    <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl font-sans">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold text-slate-300">EXPRESS COUNTER #03 — CASHIER: PRIYA</span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                SCANNER: READY
                            </span>
                        </div>

                        <div className="space-y-2 mb-4 text-xs font-mono">
                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                                <div>
                                    <div className="font-bold text-white">Britannia Good Day 200g</div>
                                    <div className="text-[10px] text-slate-400">Barcode: 8901063142210 | GST: 18%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-slate-300">2 × ₹40.00</div>
                                    <div className="font-bold text-emerald-400">₹80.00</div>
                                </div>
                            </div>

                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                                <div>
                                    <div className="font-bold text-white">Fresh Shimla Apples (Kg)</div>
                                    <div className="text-[10px] text-slate-400">Scale Weight Sync | GST: 0%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-slate-300">{simulatedWeight} kg × ₹{pricePerKg}</div>
                                    <div className="font-bold text-emerald-400">₹{totalProduceCost.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-between items-end font-mono">
                            <div>
                                <span className="text-[10px] text-slate-400">Total Items: 2 (Qty: 3)</span>
                                <div className="text-xs text-emerald-400">Loyalty Discount: -₹15.00</div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-slate-400 block uppercase">Net Payable</span>
                                <span className="text-2xl font-extrabold text-white">
                                    ₹{(80 + totalProduceCost - 15).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 5: WeighingScaleIntegration                       */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                                <span>ELECTRONIC SCALE HARDWARE SYNC</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Live RS-232 Electronic Weighing Scale Integration
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Never type vegetable or grain weights manually. As soon as an apple or potato bag touches the counter scale,
                                Nexus reads the exact gram weight via RS-232 serial cable, multiplies with the day's market rate, and adds it to the active bill in 0.2 seconds.
                            </p>

                            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <div className="font-bold text-white">Auto-Tare Zeroing</div>
                                    <div className="text-slate-400 text-[11px] mt-0.5">Deducts plastic container weight automatically</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <div className="font-bold text-white">Weight-Embedded Barcodes</div>
                                    <div className="text-slate-400 text-[11px] mt-0.5">Reads pre-packed stickers (EAN-13 price embedded)</div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Scale Simulator */}
                        <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold font-mono">
                                LIVE WEIGHING SCALE DISPLAY
                            </span>
                            <div className="text-4xl font-extrabold font-mono text-emerald-400 bg-black/60 p-4 rounded-xl border border-slate-800">
                                {simulatedWeight.toFixed(3)} KG
                            </div>

                            <div className="space-y-2 text-left text-xs">
                                <div className="flex justify-between text-slate-300 font-mono">
                                    <span>Simulate Weight on Scale:</span>
                                    <span className="text-emerald-400 font-bold">{simulatedWeight} kg</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.25"
                                    max="5.00"
                                    step="0.05"
                                    value={simulatedWeight}
                                    onChange={(e) => setSimulatedWeight(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTIONS 6 to 9: Cloud POS, Multi-Counter, Hold & Split   */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* S-06: Real-Time Cloud POS */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">☁️</span>
                            <h3 className="font-bold text-base text-slate-900">100% Real-Time Cloud POS</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Pure cloud speed. Every counter sale instantly updates master inventory, central accounting, and owner analytics with 99.99% AWS Mumbai cloud uptime.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600">
                            Instant Multi-Device Sync →
                        </div>
                    </div>

                    {/* S-07: Multi-Counter */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">🖥️</span>
                            <h3 className="font-bold text-base text-slate-900">Multi-Counter Management</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Manage 2, 5, or 15 billing counters simultaneously. Each cashier has their own shift login, opening cash float, and day-end audit summary.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600">
                            Isolated Cash Drawers →
                        </div>
                    </div>

                    {/* S-08: Hold & Retrieve */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">⏸️</span>
                            <h3 className="font-bold text-base text-slate-900">1-Click Cart Hold &amp; Recall</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Customer forgot their wallet in the car? Hit `F4` to hold the 18 items, serve the next customer, and hit `F5` to restore instantly.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600">
                            Zero Queue Bottlenecks →
                        </div>
                    </div>

                    {/* S-09: Split Tender */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-2xl mb-2 block">💳</span>
                            <h3 className="font-bold text-base text-slate-900">Split Tender Multi-Payment</h3>
                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                Split a ₹2,400 bill: ₹1,000 in Cash + ₹1,000 via UPI QR + ₹400 written to customer Khata credit account in one single invoice.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-purple-600">
                            Cash + UPI + Khata →
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTIONS 10 & 11: ThermalPrint & WhatsApp Receipts        */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                                <span>PAPER &amp; DIGITAL RECEIPTS</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                2-Inch &amp; 3-Inch ESC/POS Thermal Printing + Paperless WhatsApp
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Customize your store receipt with your logo, GSTIN, dynamic counter UPI payment QR, store return policy,
                                and savings callouts ("You saved ₹142 today!"). Or tap `F9` for zero paper waste — the bill is sent directly to customer WhatsApp.
                            </p>

                            <div className="flex gap-2 text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => setThermalSize('3inch')}
                                    className={`px-4 py-2 rounded-xl transition-all ${
                                        thermalSize === '3inch'
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    3-Inch (80mm) Standard POS Roll
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setThermalSize('2inch')}
                                    className={`px-4 py-2 rounded-xl transition-all ${
                                        thermalSize === '2inch'
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    2-Inch (58mm) Compact Roll
                                </button>
                            </div>
                        </div>

                        {/* Thermal Mockup Output */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="w-full max-w-xs bg-slate-50 border border-slate-300 rounded-2xl p-5 shadow-lg font-mono text-[11px] text-slate-800 space-y-2">
                                <div className="text-center border-b border-dashed border-slate-300 pb-2">
                                    <div className="font-bold text-sm text-slate-900">SUPER FRESH MART</div>
                                    <div className="text-[10px] text-slate-500">GSTIN: 27AABCS1429M1Z3</div>
                                    <div className="text-[9px] text-slate-400">Andheri West, Mumbai • Ph: 9820011223</div>
                                </div>

                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>Bill #POS-4892</span>
                                    <span>18-Sep-2026 14:40</span>
                                </div>

                                <div className="border-b border-dashed border-slate-300 pb-2 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Good Day Biscuit 200g</span>
                                        <span>₹40.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shimla Apples 1.85kg</span>
                                        <span>₹296.00</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-xs pt-1">
                                    <span>NET TOTAL</span>
                                    <span>₹336.00</span>
                                </div>

                                <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                                    <div className="font-bold text-emerald-700">*** YOU SAVED ₹42.00 TODAY ***</div>
                                    <div className="text-[9px] text-slate-400 mt-1">Thank you! Visit again.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
