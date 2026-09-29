import React, { useState } from 'react';

export default function HospitalityGstAndOperations() {
    // S-27 State: GST Rate Configuration Switcher
    const [propertyCategory, setPropertyCategory] = useState<'standalone' | 'star_hotel'>('standalone');

    return (
        <section id="hospitality-gst" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200/60">
                        Statutory Compliance &amp; Multi-Chain Scale
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Hotel GST 5% vs 18%, Tally Sync &amp; Cashier Float Controls
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Effortlessly navigate Indian hospitality tax rules. Standalone restaurant 5% GST without ITC, luxury hotel 18% GST with ITC, and automated cashier shift reconciliation.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-27 & S-28: Hospitality GST Compliance Engine & 2-Way Tally Prime Sync    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
                    
                    {/* S-27: Restaurant GST 5% vs 18% Engine */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Indian Tax Rules</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        Hospitality GST Dual Compliance Engine
                                    </h3>
                                </div>
                                <span className="text-2xl">🏛️</span>
                            </div>

                            <p className="text-slate-600 text-xs sm:text-sm mb-5 leading-relaxed">
                                Avoid expensive GST audit notices. Indian tax laws mandate completely different GST rates depending on whether your restaurant is standalone or located inside a luxury hotel with room tariff &gt; ₹7,500.
                            </p>

                            {/* Property Category Toggle */}
                            <div className="flex bg-slate-200/80 p-1 rounded-xl mb-5 text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => setPropertyCategory('standalone')}
                                    className={`flex-1 py-2 rounded-lg transition-all ${
                                        propertyCategory === 'standalone' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Standalone Restaurant (5% GST)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPropertyCategory('star_hotel')}
                                    className={`flex-1 py-2 rounded-lg transition-all ${
                                        propertyCategory === 'star_hotel' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Hotel with Tariff &gt; ₹7,500 (18% GST)
                                </button>
                            </div>

                            {propertyCategory === 'standalone' ? (
                                <div className="space-y-2.5 text-xs">
                                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                        <p className="font-bold text-slate-800">F&amp;B GST Rate: 5% (2.5% CGST + 2.5% SGST)</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Applies to dine-in, takeaway, and food delivery. No Input Tax Credit (ITC) allowed on raw purchases.</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                        <p className="font-bold text-slate-800">Liquor Exemption:</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Liquor is outside GST and billed under State VAT / Excise rules. Split bill automatically printed.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5 text-xs">
                                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                        <p className="font-bold text-slate-800">Room Tariff &gt; ₹7,500: 18% GST (9% CGST + 9% SGST)</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Full Input Tax Credit (ITC) claim allowed on commercial equipment, interior fit-outs, and services.</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                        <p className="font-bold text-slate-800">Hotel Restaurant F&amp;B: 18% GST with ITC</p>
                                        <p className="text-[11px] text-slate-500 mt-0.5">In-room dining and hotel restaurants are taxed at 18% with ITC benefits fully supported.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ GSTR-1 Table 7 B2CS Summary Ready</span>
                            <span className="font-bold text-indigo-600">100% Tax Compliant</span>
                        </div>
                    </div>

                    {/* S-28: 2-Way Tally Prime Sync */}
                    <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                                <div>
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Accounting Export</span>
                                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                        2-Way Tally Prime &amp; Busy Connector
                                    </h3>
                                </div>
                                <span className="text-2xl">🔄</span>
                            </div>

                            <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                                Don't let your accountant enter 500 daily restaurant bills manually. Push daily consolidated sales vouchers, room tariffs, and vendor vegetable purchases directly into Tally Prime.
                            </p>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800">Daily Sales Voucher Push</p>
                                        <p className="text-[10px] text-slate-500">Separates Cash, Card, UPI, and Room Charge ledgers</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">Auto-Daily</span>
                                </div>

                                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800">Vendor Purchase Inward Sync</p>
                                        <p className="text-[10px] text-slate-500">Poultry, dairy, and grocery bills mapped to Sundry Creditors</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">1-Click</span>
                                </div>

                                <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-800">Corporate Party Khata Adjustments</p>
                                        <p className="text-[10px] text-slate-500">Company credit billing with bill-by-bill Tally balance matching</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded">Synced</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span>✓ Native XML &amp; ODBC Interface</span>
                            <span className="font-bold text-blue-600">Zero Auditor Friction</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-29 to S-32: Multi-Chain P&L, Cashier Float, WhatsApp & Hardware Guide   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-29: Multi-Outlet Restaurant Chain P&L */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            🏢
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Multi-Outlet Chain MIS
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Monitor revenue, average ticket size, and food cost % across 20+ restaurant branches in real time from your mobile phone.
                        </p>
                    </div>

                    {/* S-30: Cashier Shift Reconciliation & Shortage */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg mb-3">
                            💵
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Cashier Float &amp; Shortage
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Shift change float verification: cash sales + opening float - expenses = physical cash in drawer. Flags cashier shortages instantly.
                        </p>
                    </div>

                    {/* S-31: WhatsApp Guest Folio & Google Review Link */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            ⭐
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            WhatsApp Folio &amp; Reviews
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Send digital PDF tax bills to guest WhatsApp upon checkout with an automated link encouraging 5-star Google Business ratings.
                        </p>
                    </div>

                    {/* S-32: Tested Hardware Compatibility */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-3">
                            🖨️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Tested Printer Hardware
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Certified plug-and-play compatibility with Epson TM-T82, TVS RP3200 thermal KOT printers, Posiflex touch machines, and cash drawers.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
