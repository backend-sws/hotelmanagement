import React, { useState } from 'react';

export default function RestaurantTableAndKotEngine() {
    // S-12 State: Active Floor Plan Area
    const [selectedArea, setSelectedArea] = useState<'ac' | 'garden' | 'rooftop'>('ac');

    const tables = {
        ac: [
            { id: 'T-01', seats: 4, guests: 4, status: 'dining', bill: 2450, time: '35m' },
            { id: 'T-02', seats: 2, guests: 0, status: 'vacant', bill: 0, time: '-' },
            { id: 'T-03', seats: 6, guests: 5, status: 'bill_printed', bill: 4890, time: '55m' },
            { id: 'T-04', seats: 4, guests: 2, status: 'kot_sent', bill: 1280, time: '12m' },
            { id: 'T-05', seats: 8, guests: 8, status: 'dining', bill: 7850, time: '42m' },
            { id: 'T-06', seats: 2, guests: 0, status: 'vacant', bill: 0, time: '-' }
        ],
        garden: [
            { id: 'G-01', seats: 4, guests: 4, status: 'dining', bill: 3100, time: '20m' },
            { id: 'G-02', seats: 4, guests: 0, status: 'vacant', bill: 0, time: '-' },
            { id: 'G-03', seats: 6, guests: 6, status: 'kot_sent', bill: 2200, time: '8m' },
            { id: 'G-04', seats: 2, guests: 0, status: 'vacant', bill: 0, time: '-' }
        ],
        rooftop: [
            { id: 'R-01', seats: 4, guests: 4, status: 'bill_printed', bill: 5600, time: '65m' },
            { id: 'R-02', seats: 6, guests: 6, status: 'dining', bill: 9200, time: '40m' },
            { id: 'R-03', seats: 2, guests: 2, status: 'kot_sent', bill: 1800, time: '5m' }
        ]
    };

    const currentTables = tables[selectedArea];

    return (
        <section id="table-kot" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200/60">
                        Kitchen &amp; Table Operations
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Floor Plan Customizer, Waiter Captain App &amp; Multi-KOT Routing
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Turn tables 25% faster. Waiter tablet app sends orders straight to individual kitchen stations with 0.3-second thermal KOT printing and live Kitchen Display System (KDS).
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-12: Interactive Table Floor Plan Matrix                                 */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-14">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Dining Floor</span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                                Interactive Table Layout &amp; Occupancy
                            </h3>
                        </div>

                        {/* Floor Area Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setSelectedArea('ac')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedArea === 'ac' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                AC Main Dining (6)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedArea('garden')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedArea === 'garden' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Garden Lawn (4)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedArea('rooftop')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    selectedArea === 'rooftop' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Rooftop Sky Lounge (3)
                            </button>
                        </div>
                    </div>

                    {/* Table Layout Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
                        {currentTables.map((t) => {
                            let tableBg = 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300';
                            let statusText = 'Vacant';
                            let badgeBg = 'bg-emerald-500/20 text-emerald-300';

                            if (t.status === 'dining') {
                                tableBg = 'bg-amber-950/40 border-amber-500/40 text-amber-300';
                                statusText = 'Dining';
                                badgeBg = 'bg-amber-500/20 text-amber-300';
                            } else if (t.status === 'bill_printed') {
                                tableBg = 'bg-rose-950/40 border-rose-500/40 text-rose-300';
                                statusText = 'Bill Printed';
                                badgeBg = 'bg-rose-500/20 text-rose-300';
                            } else if (t.status === 'kot_sent') {
                                tableBg = 'bg-blue-950/40 border-blue-500/40 text-blue-300';
                                statusText = 'KOT Cooking';
                                badgeBg = 'bg-blue-500/20 text-blue-300';
                            }

                            return (
                                <div key={t.id} className={`p-4 rounded-2xl border transition-all ${tableBg}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-base font-black text-white">{t.id}</span>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeBg}`}>
                                            {statusText}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-300">
                                        {t.guests > 0 ? `${t.guests} of ${t.seats} Guests` : `${t.seats} Seats Available`}
                                    </p>
                                    <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-[10.5px]">
                                        <span className="text-slate-400">Bill: {t.bill > 0 ? `₹${t.bill}` : '-'}</span>
                                        <span className="text-slate-400">{t.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Table Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vacant Ready</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Cooking KOT</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Dining Active</span>
                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Bill Printed</span>
                        </div>
                        <span className="text-amber-400 font-bold">Supports 1-Click Table Merge &amp; Split</span>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-13 & S-14: Captain Mobile App & Multi-Kitchen KOT Routing               */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-13: Waiter Captain Mobile Ordering App */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Mobile Captain App</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Table-Side Mobile Waiter App
                                </h3>
                            </div>
                            <span className="text-2xl">📱</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                            Equip stewards with lightweight Android tablets or mobile phones. Punch orders right at the guest table without running back and forth to the cashier counter.
                        </p>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <span className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 font-black flex items-center justify-center shrink-0">
                                    ⚡
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Repeat Orders in 2 Clicks</p>
                                    <p className="text-[10px] text-slate-500">"Another round of Rotis" or "2 more Cokes" takes under 4 seconds to punch</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center shrink-0">
                                    📝
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Special Cooking Instructions Tagging</p>
                                    <p className="text-[10px] text-slate-500">"Less spicy", "No onion garlic", "Crispy paneer" prints clearly on kitchen ticket</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                                    💳
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Dynamic Table UPI QR Code Generation</p>
                                    <p className="text-[10px] text-slate-500">Display dynamic bill payment QR on waiter tablet for instant guest settlement</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* S-14: Multi-Kitchen KOT Routing */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Kitchen Dispatch</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Automated Multi-Kitchen KOT Routing
                                </h3>
                            </div>
                            <span className="text-2xl">🖨️</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                            When an order contains Biryani, Naan, and Mojitos, Nexus splits the items automatically and sends them to the respective preparation counters.
                        </p>

                        <div className="space-y-2.5 text-xs">
                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Tandoor Station Printer</p>
                                    <p className="text-[10px] text-slate-500">Butter Naan, Tandoori Roti, Chicken Tikka</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">
                                    Printer #1 (Kitchen)
                                </span>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Curry &amp; Chinese Station</p>
                                    <p className="text-[10px] text-slate-500">Butter Chicken, Dal Makhani, Hakka Noodles</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                                    Printer #2 (Curry)
                                </span>
                            </div>

                            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Bar &amp; Mocktail Counter</p>
                                    <p className="text-[10px] text-slate-500">Virgin Mojito, Blue Lagoon, Kingfisher Draft</p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md">
                                    Printer #3 (Bar)
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ 0.3s ESC/POS Thermal Printing</span>
                            <span className="font-bold text-indigo-600">Ethernet, Wi-Fi &amp; USB Support</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-15 to S-19: KDS Screen, Anti-Theft OTP, Combo Deals & Scan QR Menu      */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-15: Kitchen Display System (KDS) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            🖥️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Kitchen Display System (KDS)
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Paperless touch screen displays for chefs with color-coded preparation timers (Green &lt; 10m, Amber 15m, Red &gt; 20m overdue).
                        </p>
                    </div>

                    {/* S-17: Anti-Theft Void OTP Lock */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            🛡️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Manager OTP for KOT Voids
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Block cashier theft. Voiding an active KOT or offering complimentary food items requires an instant manager authorization PIN/OTP.
                        </p>
                    </div>

                    {/* S-18: Dynamic Happy Hours & Combos */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-3">
                            🍸
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Happy Hours &amp; Combo Deals
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Automate time-based pricing (Buy 1 Get 1 on cocktails between 5 PM and 8 PM) and chef special combo deals without manual calculation.
                        </p>
                    </div>

                    {/* S-19: QR Code Digital Table Menu */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            📲
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Table QR Self-Ordering
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Guests scan the table QR code to browse high-definition food photos, view chef recommendations, and place orders directly from their phones.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
