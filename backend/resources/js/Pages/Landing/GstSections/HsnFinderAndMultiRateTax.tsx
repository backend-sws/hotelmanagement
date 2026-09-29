import React, { useState } from 'react';

export default function HsnFinderAndMultiRateTax() {
    // S-17 State: Interactive HSN / SAC Code Search Library
    const [hsnQuery, setHsnQuery] = useState('8415');

    const hsnDatabase = [
        { code: '8415', type: 'HSN', description: 'Air conditioning machines, comprising a motor-driven fan', gstRate: '28%', cess: 'Nil', chapter: 'Chapter 84 (Nuclear Reactors, Boilers, Machinery)' },
        { code: '7214', type: 'HSN', description: 'Other bars and rods of iron or non-alloy steel, not further worked', gstRate: '18%', cess: 'Nil', chapter: 'Chapter 72 (Iron and Steel)' },
        { code: '9987', type: 'SAC', description: 'Maintenance, repair and installation services of machinery', gstRate: '18%', cess: 'Nil', chapter: 'Section 99 (Services)' },
        { code: '9963', type: 'SAC', description: 'Accommodation, food and beverage services provided by restaurants', gstRate: '5%', cess: 'Nil', chapter: 'Section 99 (Hospitality Services)' },
        { code: '5208', type: 'HSN', description: 'Woven fabrics of cotton, containing 85% or more by weight', gstRate: '5%', cess: 'Nil', chapter: 'Chapter 52 (Cotton)' },
        { code: '2903', type: 'HSN', description: 'Halogenated derivatives of hydrocarbons (Refrigerant Gas R32/R410A)', gstRate: '18%', cess: 'Nil', chapter: 'Chapter 29 (Organic Chemicals)' }
    ];

    const filteredHsn = hsnDatabase.filter(item =>
        item.code.includes(hsnQuery) ||
        item.description.toLowerCase().includes(hsnQuery.toLowerCase()) ||
        item.chapter.toLowerCase().includes(hsnQuery.toLowerCase())
    );

    return (
        <section id="hsn-tax-rates" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                        Statutory Classification
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        15,000+ HSN / SAC Code Finder &amp; Multi-Rate Tax Engine
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Never guess whether an item is 5%, 18%, or 28%. Nexus automatically auto-suggests correct 6-digit and 8-digit HSN codes with statutory Place of Supply tax split rules.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-17: Interactive HSN & SAC Code Finder Tool                              */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">HSN / SAC Code Library</span>
                            <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                Search 15,000+ Goods &amp; Service Tax Slabs
                            </h3>
                        </div>

                        {/* Search Input */}
                        <div className="w-full sm:w-64">
                            <input
                                type="text"
                                value={hsnQuery}
                                onChange={(e) => setHsnQuery(e.target.value)}
                                placeholder="Search code or item (e.g. 8415, steel, cotton)..."
                                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            />
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                    <th className="py-2.5 px-3">Code</th>
                                    <th className="py-2.5 px-3">Type</th>
                                    <th className="py-2.5 px-3">Description &amp; Chapter</th>
                                    <th className="py-2.5 px-3 text-center">GST Slab</th>
                                    <th className="py-2.5 px-3 text-center">Cess</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono">
                                {filteredHsn.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                                        <td className="py-3 px-3 font-bold text-blue-700 text-sm">
                                            {item.code}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 font-sans">
                                            <div className="font-bold text-slate-900">{item.description}</div>
                                            <div className="text-[11px] text-slate-500">{item.chapter}</div>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                                                {item.gstRate}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-center text-slate-500 text-xs">
                                            {item.cess}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Updated with Central Board of Indirect Taxes and Customs (CBIC) 2026 notifications</span>
                        <span className="font-bold text-blue-700">8-Digit Export HSN Ready</span>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-18 to S-21: Composition vs Regular, Place of Supply & Export LUT        */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-18: Composition vs Regular Billing */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Composition vs Regular Dual Mode
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Switch easily between 1% Composition (Bill of Supply with zero ITC) and Regular Scheme (Full B2B tax invoice with CGST/SGST/IGST breakdown).
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                            <span>Section 10 Compliant</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-19: Place of Supply Auto-Bifurcation */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Auto Place of Supply (POS) Split
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Intelligent state code matching: splits tax into CGST + SGST (intra-state) or IGST (inter-state) automatically based on buyer delivery address.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Zero Tax Ledger Misposts</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-20: Export Invoicing Under LUT */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Zero-Tax Export Invoicing (LUT)
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Issue foreign currency export invoices (USD, EUR, GBP) referencing your approved Letter of Undertaking (LUT) for zero-tax international shipments.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                            <span>Rule 96A Compliant</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-21: Special Economic Zone (SEZ) Billing */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            SEZ Developer &amp; Unit Billing
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Dedicated zero-rated invoicing for SEZ developers and SEZ units with endorsement certificate tracking and refund claim documentation.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                            <span>Zero Disallowed Credits</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
