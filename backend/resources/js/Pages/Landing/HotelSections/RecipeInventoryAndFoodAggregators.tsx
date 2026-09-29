import React, { useState } from 'react';

export default function RecipeInventoryAndFoodAggregators() {
    // S-20 State: Recipe BOM Interactive Demonstration
    const [dishesSold, setDishesSold] = useState(12);

    // Bill of Materials consumption per 1 dish of Murgh Makhani (Butter Chicken)
    const chickenGrams = dishesSold * 250;
    const butterGrams = dishesSold * 50;
    const creamMl = dishesSold * 60;
    const makhaniGravyGrams = dishesSold * 150;

    return (
        <section id="recipe-bom" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60">
                        Kitchen Inventory &amp; Raw Materials
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Recipe BOM Stock Deduction &amp; Swiggy/Zomato Sync
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Stop kitchen ingredient theft. Every KOT automatically decrements raw chicken, paneer, butter, and gravies from warehouse stock based on executive chef standard recipes.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-20: Recipe Bill of Materials (BOM) Interactive Engine                   */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Inventory Simulation</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                Recipe Bill of Materials (BOM) Auto-Deduction
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                When a waiter punches 1 portion of Murgh Makhani, Nexus calculates raw ingredient consumption and instantly debits raw meat and dairy inventory without manual entry.
                            </p>

                            {/* Quantity Slider */}
                            <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-700">Orders Sold (Murgh Makhani):</span>
                                    <span className="text-lg font-black text-emerald-600">{dishesSold} Portions</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={dishesSold}
                                    onChange={(e) => setDishesSold(parseInt(e.target.value))}
                                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-2">
                                    <span>1 Dish</span>
                                    <span>25 Dishes</span>
                                    <span>50 Dishes</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Ingredient Deduction Breakdown */}
                        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <p className="text-xs font-bold text-slate-300">Raw Materials Auto-Deducted from Godown</p>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Real-Time Stock Sink
                                </span>
                            </div>

                            <div className="space-y-2.5 my-5 text-xs">
                                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                                    <span className="text-slate-300">🍗 Fresh Boneless Chicken (250g/dish):</span>
                                    <span className="font-black text-emerald-400 font-mono">{(chickenGrams / 1000).toFixed(2)} KG</span>
                                </div>
                                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                                    <span className="text-slate-300">🧈 Amul Table Butter (50g/dish):</span>
                                    <span className="font-black text-amber-400 font-mono">{(butterGrams / 1000).toFixed(2)} KG</span>
                                </div>
                                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                                    <span className="text-slate-300">🥛 Fresh Cooking Cream (60ml/dish):</span>
                                    <span className="font-black text-blue-300 font-mono">{(creamMl / 1000).toFixed(2)} Litres</span>
                                </div>
                                <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                                    <span className="text-slate-300">🍅 Base Makhani Gravy (150g/dish):</span>
                                    <span className="font-black text-purple-300 font-mono">{(makhaniGravyGrams / 1000).toFixed(2)} KG</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                                <span>🔒 Detects Kitchen Pilferage &amp; Excess Portions</span>
                                <span className="text-emerald-400 font-bold">Zero Stock Leakage</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-22 & S-24: Swiggy/Zomato Central Receiver & Liquor Bottle-to-Peg        */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-22: Swiggy & Zomato Aggregator Sync */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Online Aggregators</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        Swiggy &amp; Zomato Central Order Receiver
                                    </h3>
                                </div>
                                <span className="text-2xl">🛵</span>
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                                Say goodbye to managing multiple merchant tablets. Swiggy and Zomato orders land straight into Nexus with auto-accept and print directly on the kitchen thermal printer.
                            </p>

                            <div className="space-y-2.5 text-xs">
                                <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                                        <div>
                                            <p className="font-bold text-slate-900">Swiggy Order #8921 • 2 Items</p>
                                            <p className="text-[10px] text-slate-500">Rider: Ramesh Kumar (Reaching in 6 min)</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-orange-700">₹640</span>
                                </div>

                                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                                        <div>
                                            <p className="font-bold text-slate-900">Zomato Order #4109 • 4 Items</p>
                                            <p className="text-[10px] text-slate-500">Packaging Ready • Rider OTP Verified</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-rose-700">₹1,180</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ Automatic Menu &amp; Item On/Off Sync</span>
                            <span className="font-bold text-orange-600">Zero Tablet Chaos</span>
                        </div>
                    </div>

                    {/* S-24: Bar Excise & Liquor Bottle-to-Peg Sync */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Excise Compliance</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        Bar Bottle-to-Peg &amp; State Excise Register
                                    </h3>
                                </div>
                                <span className="text-2xl">🍾</span>
                            </div>
                            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                                Complete compliance with Indian State Excise rules. Invoicing a 30ml / 60ml peg automatically decrements from 750ml or 1000ml sealed bottle master inventory.
                            </p>

                            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 text-xs">
                                <div className="flex justify-between pb-2 border-b border-white/10 font-bold">
                                    <span>Whisky Brand: Black Label (750ml)</span>
                                    <span className="text-amber-400">Total: 25 Pegs (30ml)</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-300">
                                    <span>Opening Stock Today:</span>
                                    <span className="font-mono">14 Bottles + 12 Pegs</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-300">
                                    <span>Sold via Bar KOTs:</span>
                                    <span className="font-mono text-rose-400">-38 Pegs</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-emerald-400 font-bold pt-2 border-t border-white/10">
                                    <span>Closing Balance for State Excise:</span>
                                    <span className="font-mono">12 Bottles + 24 Pegs</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ Daily Excise Register Form Ready</span>
                            <span className="font-bold text-purple-600">Zero Audit Fines</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-21, S-23, S-25, S-26: Spoilage, Commissary, Mandi GRN & Food Costing    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-21: Kitchen Spoilage & Waste Register */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            🗑️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Kitchen Waste &amp; Spoilage
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Log daily burnt items, prep trim loss, and curdling dairy with reasons. Generates food waste cost reports for executive chef review.
                        </p>
                    </div>

                    {/* S-23: Central Commissary to Outlet Transfer */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            🏭
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Central Commissary Transfer
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Distribute base gravies, marinated meats, and bakery dough from your central base kitchen to multi-outlet restaurant branches with STN notes.
                        </p>
                    </div>

                    {/* S-25: Mandi Vegetable & Meat Procurement */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                            🥬
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Daily Mandi Market GRN
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Handle daily fluctuating vegetable and poultry mandi rates with quick cash purchase vouchers and chef weighing scale inward checks.
                        </p>
                    </div>

                    {/* S-26: Theoretical vs Actual Food Costing */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-3">
                            📊
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Food Cost Variance Analysis
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Compare theoretical food consumption from billed KOTs against actual godown consumption to pinpoint exact ingredient leakage points.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
