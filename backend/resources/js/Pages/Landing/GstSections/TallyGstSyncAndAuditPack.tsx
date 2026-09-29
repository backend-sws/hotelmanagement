import React, { useState } from 'react';

export default function TallyGstSyncAndAuditPack() {
    // S-22 State: Tally Sync Mode Tabs
    const [tallySyncTab, setTallySyncTab] = useState<'sales' | 'purchases' | 'ledgers'>('sales');

    // S-23 State: GSTR-9 Audit Pack Table Selector
    const [activeGstr9Table, setActiveGstr9Table] = useState<'table4' | 'table6' | 'table8' | 'form9c'>('table8');

    // S-24 State: ASMT-10 Defense Notice Scenario
    const [activeNoticeScenario, setActiveNoticeScenario] = useState<'turnover' | 'itc_mismatch' | 'tax_rate'>('itc_mismatch');

    return (
        <section id="tally-sync-audit" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                        Accounting Bridge &amp; Audit Defense
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Two-Way Tally Prime Sync &amp; Statutory GSTR-9 Audit Defense
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Seamlessly bridge frontend point-of-sale and distribution with your CA’s Tally Prime books. Protect your business against scrutiny notices with immutable timestamped audit trails.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-22: Two-Way Tally Prime GST Sync Engine                                  */}
                {/* ========================================================================= */}
                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                        <div>
                            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Bridge Integration</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                Native Two-Way Tally Prime &amp; Tally.ERP 9 Sync
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1">
                                Direct XML/ODBC sync engine. Push sales invoices with line-item HSN, tax bifurcations, and round-off ledgers without third-party utility tools.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setTallySyncTab('sales')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    tallySyncTab === 'sales'
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                Sales Voucher Push
                            </button>
                            <button
                                onClick={() => setTallySyncTab('purchases')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    tallySyncTab === 'purchases'
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                Purchase Register Sync
                            </button>
                            <button
                                onClick={() => setTallySyncTab('ledgers')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                    tallySyncTab === 'ledgers'
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                Master Ledger Mapping
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Tab Body */}
                    <div className="mt-6">
                        {tallySyncTab === 'sales' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                                            VCH
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 text-base">Automatic Sales Voucher Posting</h4>
                                            <p className="text-xs text-slate-500">Generates Tally standard XML standard voucher with exact IRN, Ack No, and QR string</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2.5 text-xs text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span><strong>Auto-splits Ledger Accounts:</strong> Posts to Sales Account, Output CGST 9%, Output SGST 9%, Output IGST 18%, and Round Off automatically.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span><strong>Zero Duplicate Invoices:</strong> Idempotent UUID hashing ensures no double voucher creation if network drops during sync.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-600 font-bold">✓</span>
                                            <span><strong>Tally Narration Enrichment:</strong> Embedded with IRN Ack Date, E-Way Bill Number, Vehicle No., and Delivery Challan Ref.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="lg:col-span-5 bg-slate-950 p-4 rounded-2xl font-mono text-[11px] text-slate-300 border border-slate-800 shadow-inner overflow-x-auto">
                                    <div className="text-purple-400 font-bold text-xs pb-2 mb-2 border-b border-slate-800 flex justify-between items-center">
                                        <span>&lt;TALLYMESSAGE&gt; LIVE PAYLOAD</span>
                                        <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">POSTED (HTTP 200)</span>
                                    </div>
                                    <div className="space-y-1 text-slate-400">
                                        <div>&lt;VOUCHER VCHTYPE=&quot;Sales&quot; ACTION=&quot;Create&quot;&gt;</div>
                                        <div className="pl-3 text-amber-300">&lt;DATE&gt;20260918&lt;/DATE&gt;</div>
                                        <div className="pl-3 text-blue-300">&lt;VOUCHERNUMBER&gt;INV-26-8491&lt;/VOUCHERNUMBER&gt;</div>
                                        <div className="pl-3 text-purple-300">&lt;PARTYLEDGERNAME&gt;Apex Global Logistics Pvt Ltd&lt;/PARTYLEDGERNAME&gt;</div>
                                        <div className="pl-3 text-emerald-300">&lt;IRNACKNO&gt;142618992019&lt;/IRNACKNO&gt;</div>
                                        <div className="pl-3 text-slate-500">&lt;ALLLEDGERENTRIES.LIST&gt;</div>
                                        <div className="pl-6 text-slate-300">&lt;LEDGERNAME&gt;Output CGST @ 9%&lt;/LEDGERNAME&gt;</div>
                                        <div className="pl-6 text-emerald-400">&lt;AMOUNT&gt;-7560.00&lt;/AMOUNT&gt;</div>
                                        <div className="pl-3 text-slate-500">&lt;/ALLLEDGERENTRIES.LIST&gt;</div>
                                        <div>&lt;/VOUCHER&gt;</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {tallySyncTab === 'purchases' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mb-2">01</div>
                                    <h4 className="font-bold text-slate-900 text-sm">GSTR-2B Verified Entry</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Only supplier invoices verified in your GSTR-2B are pushed to Tally purchase register, avoiding premature ITC claims in accounts.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-2">02</div>
                                    <h4 className="font-bold text-slate-900 text-sm">Automated Item Linking</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Maps vendor raw material description to internal Tally Stock Item IDs with automated unit of measurement (UOM) translation.
                                    </p>
                                </div>
                                <div className="p-4 bg-white rounded-2xl border border-slate-200">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs mb-2">03</div>
                                    <h4 className="font-bold text-slate-900 text-sm">RCM &amp; GTA Automatic Flag</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Transporter bills are tagged with Section 9(3) Reverse Charge Mechanism, crediting Input RCM CGST/SGST liability accounts automatically.
                                    </p>
                                </div>
                            </div>
                        )}

                        {tallySyncTab === 'ledgers' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                                        <tr>
                                            <th className="p-3">Nexus Billing Module</th>
                                            <th className="p-3">Matched Tally Prime Ledger</th>
                                            <th className="p-3">Parent Group</th>
                                            <th className="p-3">Statutory Tax Type</th>
                                            <th className="p-3">Sync Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        <tr>
                                            <td className="p-3 font-medium text-slate-900">B2B Local Sales (18%)</td>
                                            <td className="p-3 font-mono text-purple-700">Sales - Intra State 18%</td>
                                            <td className="p-3 text-slate-500">Sales Accounts</td>
                                            <td className="p-3">CGST 9% + SGST 9%</td>
                                            <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Synchronized</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium text-slate-900">Inter-State Distribution (18%)</td>
                                            <td className="p-3 font-mono text-purple-700">Sales - Inter State 18%</td>
                                            <td className="p-3 text-slate-500">Sales Accounts</td>
                                            <td className="p-3">IGST 18%</td>
                                            <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Synchronized</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium text-slate-900">Export Sales under LUT</td>
                                            <td className="p-3 font-mono text-purple-700">Export Sales - LUT Zero Rated</td>
                                            <td className="p-3 text-slate-500">Sales Accounts</td>
                                            <td className="p-3">Zero Tax / LUT Bond</td>
                                            <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Synchronized</span></td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-medium text-slate-900">Freight &amp; Handling Charges</td>
                                            <td className="p-3 font-mono text-purple-700">Freight Recovered on Sales</td>
                                            <td className="p-3 text-slate-500">Direct Incomes</td>
                                            <td className="p-3">Composite Supply (Same as Principal)</td>
                                            <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Synchronized</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-23: Annual GSTR-9 and GSTR-9C Audit Pack Generator                       */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Annual Compliance</span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">
                                Annual GSTR-9 &amp; GSTR-9C Audit Pack Generator
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1">
                                Eliminate the year-end reconciliation rush. Nexus automatically collates Tables 4, 5, 6, 7, 8, and 9 with turnover reconciliation for CA certification.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveGstr9Table('table4')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeGstr9Table === 'table4' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Table 4 (Outward Taxable)
                            </button>
                            <button
                                onClick={() => setActiveGstr9Table('table6')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeGstr9Table === 'table6' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Table 6 (ITC Availed)
                            </button>
                            <button
                                onClick={() => setActiveGstr9Table('table8')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeGstr9Table === 'table8' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Table 8 (2A/2B vs Books)
                            </button>
                            <button
                                onClick={() => setActiveGstr9Table('form9c')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeGstr9Table === 'form9c' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                Form 9C (Turnover Match)
                            </button>
                        </div>
                    </div>

                    {/* Table View Container */}
                    <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        {activeGstr9Table === 'table8' && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-black text-slate-900 text-sm">Table 8: Comparison of ITC Availed with GSTR-2A/2B</h4>
                                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        Variance: ₹0.00 (Zero Discrepancy)
                                    </span>
                                </div>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700 font-medium">8A: ITC as per GSTR-2B auto-populated (Sum of Inward Supplies)</span>
                                        <span className="font-mono font-bold text-slate-900">₹48,92,450.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700 font-medium">8B: ITC as per Table 6(B) and 6(H) above</span>
                                        <span className="font-mono font-bold text-slate-900">₹48,92,450.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700 font-medium">8C: ITC on inward supplies received during FY 2025-26 availed in FY 2026-27</span>
                                        <span className="font-mono font-bold text-slate-900">₹1,24,300.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <span className="text-emerald-900 font-bold">8D: Difference [8A - (8B + 8C)] (Eligible ITC not lapsed)</span>
                                        <span className="font-mono font-black text-emerald-800">₹0.00 (Perfect Match)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeGstr9Table === 'table4' && (
                            <div>
                                <h4 className="font-black text-slate-900 text-sm mb-4">Table 4: Details of Advances, Inward &amp; Outward Supplies</h4>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">4A: Supplies made to un-registered persons (B2C Others)</span>
                                        <span className="font-mono font-bold text-slate-900">₹1,18,40,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">4B: Supplies made to registered persons (B2B Taxable)</span>
                                        <span className="font-mono font-bold text-slate-900">₹5,42,80,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">4C: Zero rated supply (Export) on payment of tax</span>
                                        <span className="font-mono font-bold text-slate-900">₹45,00,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                                        <span className="text-blue-900 font-bold">4N: Total Turnover on which tax is payable [4A to 4M]</span>
                                        <span className="font-mono font-black text-blue-900">₹7,06,20,000.00</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeGstr9Table === 'table6' && (
                            <div>
                                <h4 className="font-black text-slate-900 text-sm mb-4">Table 6: Details of Input Tax Credit Availed During FY</h4>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">6A: Total amount of input tax credit availed through GSTR-3B</span>
                                        <span className="font-mono font-bold text-slate-900">₹48,92,450.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">6B: Inward supplies (other than imports and RCM) - Inputs</span>
                                        <span className="font-mono font-bold text-slate-900">₹36,40,200.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">6B: Inward supplies - Capital Goods (Plant &amp; Machinery)</span>
                                        <span className="font-mono font-bold text-slate-900">₹8,12,250.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">6B: Inward supplies - Input Services (Logistics &amp; IT)</span>
                                        <span className="font-mono font-bold text-slate-900">₹4,40,000.00</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeGstr9Table === 'form9c' && (
                            <div>
                                <h4 className="font-black text-slate-900 text-sm mb-4">Form 9C: CA Reconciliation Statement (Turnover vs Audited Books)</h4>
                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">Table 5A: Gross Turnover as per Audited Financial Statements</span>
                                        <span className="font-mono font-bold text-slate-900">₹7,06,20,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200">
                                        <span className="text-slate-700">Table 5Q: Annual Turnover as per GSTR-9 Table 4N</span>
                                        <span className="font-mono font-bold text-slate-900">₹7,06,20,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <span className="text-emerald-900 font-bold">Table 5R: Unreconciled Turnover [5A - 5Q]</span>
                                        <span className="font-mono font-black text-emerald-800">₹0.00 (Zero CA Audit Discrepancy)</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-24: Department Notice & ASMT-10 Audit Defense Toolkit                    */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-16">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                        <div>
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Statutory Scrutiny Defense</span>
                            <h3 className="text-2xl font-black text-white mt-1">
                                ASMT-10 &amp; DRC-01 Scrutiny Notice Defense Pack
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                Respond to department notices within hours, not weeks. Download timestamped verification trails, IRN portal logs, and transporter dispatch proofs.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveNoticeScenario('itc_mismatch')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeNoticeScenario === 'itc_mismatch'
                                        ? 'bg-amber-500 text-slate-950 font-black'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                GSTR-3B vs 2B ITC Discrepancy
                            </button>
                            <button
                                onClick={() => setActiveNoticeScenario('turnover')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeNoticeScenario === 'turnover'
                                        ? 'bg-amber-500 text-slate-950 font-black'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                GSTR-1 vs 3B Turnover Diff
                            </button>
                            <button
                                onClick={() => setActiveNoticeScenario('tax_rate')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    activeNoticeScenario === 'tax_rate'
                                        ? 'bg-amber-500 text-slate-950 font-black'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                HSN Classification Query
                            </button>
                        </div>
                    </div>

                    {/* Notice Resolution Workflow */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
                                01
                            </div>
                            <h4 className="font-bold text-white text-sm">Notice Ingestion &amp; Clause Analysis</h4>
                            <p className="text-xs text-slate-400 mt-1.5">
                                Identifies the disputed tax period and auto-fetches exact invoice IDs cited by the GST officer in ASMT-10 or DRC-01A.
                            </p>
                        </div>

                        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                            <div className="w-8 h-8 rounded-xl bg-blue-400/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-3">
                                02
                            </div>
                            <h4 className="font-bold text-white text-sm">Evidence Dossier Collation</h4>
                            <p className="text-xs text-slate-400 mt-1.5">
                                Generates signed IRN JSON payload, E-Way Bill transit toll scan timestamps, and supplier GSTR-1 filing ARN references.
                            </p>
                        </div>

                        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
                            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-3">
                                03
                            </div>
                            <h4 className="font-bold text-white text-sm">Ready ASMT-11 Reply Drafting</h4>
                            <p className="text-xs text-slate-400 mt-1.5">
                                Exports clean, legally vetted response text in Form GST ASMT-11 with pre-indexed annexures ready for GST portal upload.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-25: GST TDS & TCS Compliance Engine                                      */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                §51
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">GST TDS (Section 51)</h3>
                                <p className="text-xs text-slate-500">For contractors &amp; suppliers to Government, PSUs &amp; Municipalities</p>
                            </div>
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>Automated 2% Deduction:</strong> Applies 1% CGST + 1% SGST (or 2% IGST) when contract value exceeds ₹2.5 Lakhs.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>GSTR-7 Credit Verification:</strong> Matches TDS certificates (Form GSTR-7A) against bank credits and auto-credits Cash Ledger.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 font-bold">✓</span>
                                <span><strong>Contract-Wise Balance Ledger:</strong> Tracks cumulative billings against each government work order number.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                §52
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">GST TCS (Section 52)</h3>
                                <p className="text-xs text-slate-500">For marketplace merchants &amp; e-commerce operators</p>
                            </div>
                        </div>
                        <ul className="space-y-2.5 text-xs text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">✓</span>
                                <span><strong>1% E-Commerce TCS Collection:</strong> Automated tax collection on net taxable supplies made through marketplace channels.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">✓</span>
                                <span><strong>GSTR-8 Reconciliation:</strong> Reconciles marketplace TCS statements (Amazon, Flipkart, Swiggy) directly into cash ledger.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-600 font-bold">✓</span>
                                <span><strong>Return Goods Adjustment:</strong> Automatically nets customer returns against gross sales in the same calendar month.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-26: Role-Based Tax Edit Authorization Gates                             */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                    <div className="max-w-2xl mb-6">
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Internal Controls &amp; Fraud Prevention</span>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                            Role-Based Statutory Authorization &amp; Backdated Entry Locks
                        </h3>
                        <p className="text-slate-600 text-xs sm:text-sm mt-1">
                            Prevent accidental tax rate alterations, unrecorded backdated sales, or unauthorized invoice cancellations that cause GST mismatches.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-rose-600 font-black text-lg mb-1">🔒 Period Lock</div>
                            <h4 className="text-xs font-bold text-slate-900">Backdated Lock</h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Automatically locks accounting periods once GSTR-1 and GSTR-3B returns are filed on the 11th and 20th.
                            </p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-rose-600 font-black text-lg mb-1">🛡️ Tax Rate Lock</div>
                            <h4 className="text-xs font-bold text-slate-900">HSN Rate Shield</h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Counter operators cannot manually override 18% to 5% at POS counter without CA/Manager OTP approval.
                            </p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-rose-600 font-black text-lg mb-1">👥 Maker-Checker</div>
                            <h4 className="text-xs font-bold text-slate-900">Credit Note Gate</h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Sales return credit notes require dual sign-off before altering output tax liability on the GST portal.
                            </p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-rose-600 font-black text-lg mb-1">📜 Immutable Log</div>
                            <h4 className="text-xs font-bold text-slate-900">Audit Trail (Rule 11)</h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Compliant with MCA mandate: every edit, deletion, and user action is logged with IP, timestamp, and old value.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
