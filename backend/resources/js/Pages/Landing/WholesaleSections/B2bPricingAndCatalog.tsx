import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function B2bPricingAndCatalog() {
    // S-05 State: Interactive Tier Slab Pricing Calculator
    const [orderCases, setOrderCases] = useState(35);
    
    // Slab calculation logic
    let ratePerCase = 520;
    let slabTier = 'Tier 1 (Retail / Small Wholesaler)';
    let slabColor = 'text-slate-600 bg-slate-100 border-slate-200';
    let discountPercent = 0;

    if (orderCases >= 50) {
        ratePerCase = 440;
        slabTier = 'Tier 3 (Superstockist / Institutional)';
        slabColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
        discountPercent = 15.4;
    } else if (orderCases >= 20) {
        ratePerCase = 475;
        slabTier = 'Tier 2 (Wholesale Distributor)';
        slabColor = 'text-blue-700 bg-blue-50 border-blue-200';
        discountPercent = 8.6;
    }

    const totalBill = orderCases * ratePerCase;
    const baseTotal = orderCases * 520;
    const totalSavings = baseTotal - totalBill;

    // S-06 State: Customer Grades
    const [selectedGrade, setSelectedGrade] = useState<'A' | 'B' | 'C'>('A');

    const gradeData = {
        A: {
            title: 'Grade A — Superstockist / C&F Depot',
            rateLock: 'Factory Cost + 4.5% Fixed Margin',
            creditDays: '45 Days Credit',
            creditLimit: '₹25,00,000',
            moq: '100 Master Cartons',
            specialTerms: 'Turnover discount (TOD) 2.5% quarterly on ₹50L+ target'
        },
        B: {
            title: 'Grade B — District Wholesaler / Semi-Stockist',
            rateLock: 'Wholesale Price List #2',
            creditDays: '21 Days Credit',
            creditLimit: '₹8,00,000',
            moq: '25 Master Cartons',
            specialTerms: 'Cash discount 1.5% for immediate RTGS within 48 hours'
        },
        C: {
            title: 'Grade C — Key Institutional / Large Retailer',
            rateLock: 'Standard Wholesale Rate',
            creditDays: '7 Days / PDC on Delivery',
            creditLimit: '₹2,50,000',
            moq: '5 Master Cartons',
            specialTerms: 'Strict credit lock if overdue exceeds 10 calendar days'
        }
    };

    return (
        <section id="tier-pricing" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                        Dynamic B2B Monetization
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Tiered Slab Pricing, Grade Contracts &amp; Broker Ledgers
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Automate volume-based rate matrices, party-specific locked contracts, and dalal commissions without manual price overrides.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-05: Tiered Slab Pricing Interactive Calculator                          */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Interactive Simulation</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                Quantity-Based Tier Slab Pricing Engine
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Wholesalers can never afford one flat price. Nexus automatically detects total carton quantities in a sales order and drops the rate to the configured tier slab.
                            </p>

                            {/* Quantity Slider */}
                            <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-700">Order Quantity:</span>
                                    <span className="text-lg font-black text-blue-600">{orderCases} Master Cartons</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="120"
                                    value={orderCases}
                                    onChange={(e) => setOrderCases(parseInt(e.target.value))}
                                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-2">
                                    <span>1 Case (Tier 1: ₹520)</span>
                                    <span>20 Cases (Tier 2: ₹475)</span>
                                    <span>50+ Cases (Tier 3: ₹440)</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Live Calculation Output */}
                        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Applied Price Tier</p>
                                    <p className="text-sm font-bold text-white mt-0.5">{slabTier}</p>
                                </div>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${slabColor}`}>
                                    {discountPercent > 0 ? `${discountPercent}% Bulk Discount` : 'Base Rate'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 my-5">
                                <div>
                                    <p className="text-xs text-slate-400">Effective Rate Per Case</p>
                                    <p className="text-2xl font-black text-emerald-400 mt-1">₹{ratePerCase}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Base Rate: ₹520 / case</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Total Net Amount</p>
                                    <p className="text-2xl font-black text-white mt-1">₹{totalBill.toLocaleString('en-IN')}</p>
                                    <p className="text-[11px] text-emerald-400 mt-0.5">Party Saves: ₹{totalSavings.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                                <span>🔒 Zero Cashier Tampering Allowed</span>
                                <span className="text-blue-300 font-bold">Auto-Synced to Tax Invoice</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-06 & S-07: Party Grade Contracts & Secondary Case Conversions           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-06: Customer Grade Contract Matrix */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Contract Locking</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Customer Grade-Specific Price Lists
                                </h3>
                            </div>
                            <span className="text-xl">📜</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-5">
                            Lock specific price matrices, payment days, and credit thresholds per party grade so sales reps can never misquote rates.
                        </p>

                        {/* Grade Switcher */}
                        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
                            {(['A', 'B', 'C'] as const).map((grade) => (
                                <button
                                    key={grade}
                                    type="button"
                                    onClick={() => setSelectedGrade(grade)}
                                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all ${
                                        selectedGrade === grade 
                                            ? 'bg-white text-blue-600 shadow-xs' 
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Grade {grade}
                                </button>
                            ))}
                        </div>

                        {/* Grade Details Table */}
                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-slate-500 font-medium">Category Description:</span>
                                <span className="font-bold text-slate-800">{gradeData[selectedGrade].title}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-slate-500 font-medium">Pricing Formula:</span>
                                <span className="font-bold text-blue-600">{gradeData[selectedGrade].rateLock}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-slate-500 font-medium">Credit Period Allowed:</span>
                                <span className="font-bold text-slate-800">{gradeData[selectedGrade].creditDays}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-slate-500 font-medium">Sanctioned Credit Limit:</span>
                                <span className="font-bold text-emerald-600">{gradeData[selectedGrade].creditLimit}</span>
                            </div>
                            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-slate-500 font-medium">Minimum Order Quantity (MOQ):</span>
                                <span className="font-bold text-slate-800">{gradeData[selectedGrade].moq}</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-800 text-[11px] font-medium">
                                💡 <strong>Special Terms:</strong> {gradeData[selectedGrade].specialTerms}
                            </div>
                        </div>
                    </div>

                    {/* S-07: Master Carton to Box to Pieces Unit Conversion */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Multi-Unit Precision</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    MOQ &amp; Secondary Unit Auto-Conversion
                                </h3>
                            </div>
                            <span className="text-xl">📐</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-5">
                            Sell in Master Cartons, Inner Poly-Bags, or Loose Pieces. Nexus manages inventory at the base piece level while invoicing in wholesale packs.
                        </p>

                        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white mb-5">
                            <p className="text-[11px] text-slate-400 font-mono">Example: Parle-G 800g Family Pack</p>
                            <div className="flex items-center justify-between mt-3 text-center">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <p className="text-lg font-black text-emerald-400">1 Carton</p>
                                    <p className="text-[10px] text-slate-300">Master Box</p>
                                </div>
                                <span className="text-slate-400 font-bold">=</span>
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <p className="text-lg font-black text-blue-400">12 Boxes</p>
                                    <p className="text-[10px] text-slate-300">Inner Display</p>
                                </div>
                                <span className="text-slate-400 font-bold">=</span>
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <p className="text-lg font-black text-amber-400">144 Pcs</p>
                                    <p className="text-[10px] text-slate-300">Retail Units</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span className="text-slate-700 font-medium">Automatic loose-piece surcharge (e.g. +₹2/pc if box is broken)</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span className="text-slate-700 font-medium">Print Dual Units on Tax Invoice: 5 Cases + 4 Loose Pcs (Total: 724 Pcs)</span>
                            </div>
                            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span className="text-slate-700 font-medium">Strict MOQ threshold prevents booking sub-economic order sizes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-08 to S-11: Broker Ledger, WhatsApp Catalog, TOD & Credit Order Lock    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-08: Broker & Agent Dalali Ledger */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-3">
                            🤝
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Broker &amp; Dalal Commission
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Auto-calculate 1% or 2% broker commission on net sales value. Generate broker statement of accounts and direct payout vouchers upon payment recovery.
                        </p>
                    </div>

                    {/* S-09: Wholesale WhatsApp Catalog Share */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            📲
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            WhatsApp Digital Catalog
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Export password-protected wholesale rate cards with live stock availability directly to customer WhatsApp broadcast groups in 1 click.
                        </p>
                    </div>

                    {/* S-10: Turnover Discount (TOD) Schemes */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                            🎁
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Turnover Discount (TOD)
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Configure quarterly turnover targets (e.g. ₹25L = 2% credit note, ₹50L = 3.5%). Nexus auto-generates GST credit notes with reversal calculations.
                        </p>
                    </div>

                    {/* S-11: Credit Limit & Order Lock */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            ⛔
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Credit Limit &amp; Overdue Lock
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Instantly freeze new sales order creation if a customer exceeds their sanctioned credit ceiling or holds unpaid bills past 45 days. Override requires owner OTP.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
