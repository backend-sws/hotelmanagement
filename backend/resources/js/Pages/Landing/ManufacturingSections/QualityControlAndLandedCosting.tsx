import React, { useState } from 'react';

export default function QualityControlAndLandedCosting() {
    // S-23 State: Three-Stage QC Gateway active tab
    const [activeQcStage, setActiveQcStage] = useState<'inward' | 'in_process' | 'pdi'>('inward');

    const qcStages = {
        inward: {
            title: 'Stage 1: Raw Material Inward QC (GRN)',
            gatekeeper: 'Incoming Raw Stores Gate',
            tests: [
                { parameter: 'Spectro Chemical Analysis', spec: 'C: 0.38-0.45%, Cr: 0.90-1.20%', actual: 'C: 0.41%, Cr: 1.05%', result: 'Pass' },
                { parameter: 'Core Hardness (BHN)', spec: '220 - 250 BHN', actual: '238 BHN', result: 'Pass' },
                { parameter: 'Ultrasonic Flaw Detection', spec: 'Zero Internal Cavity / Inclusion', actual: 'Clean Sound Profile', result: 'Pass' }
            ],
            status: 'Accepted for Production',
            badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        },
        in_process: {
            title: 'Stage 2: In-Process Machine Line Check',
            gatekeeper: 'CNC Machine Center Line #04',
            tests: [
                { parameter: 'Outer Diameter (OD)', spec: '48.000 ± 0.015 mm', actual: '48.008 mm', result: 'Pass' },
                { parameter: 'Bearing Seat Runout', spec: 'Max 0.008 mm Total Indicator Reading', actual: '0.004 mm TIR', result: 'Pass' },
                { parameter: 'Tool Wear Offset Check', spec: 'Within Sandvik Insert Allowance', actual: '+0.003 mm Compensation', result: 'Pass' }
            ],
            status: 'First Piece Setup Approved',
            badgeColor: 'text-blue-700 bg-blue-50 border-blue-200'
        },
        pdi: {
            title: 'Stage 3: Pre-Dispatch Final Inspection (PDI)',
            gatekeeper: 'Finished Goods Dispatch Bay',
            tests: [
                { parameter: 'Nitriding Case Depth', spec: '0.40 - 0.50 mm Surface Depth', actual: '0.46 mm Depth', result: 'Pass' },
                { parameter: 'Surface Roughness (Ra)', spec: 'Ra ≤ 0.8 Microns (Ground Finish)', actual: 'Ra 0.45 Microns', result: 'Pass' },
                { parameter: 'Visual Rust Prevention Oil', spec: '100% VCI Poly Wrap Coating', actual: 'Dip Coated & Bagged', result: 'Pass' }
            ],
            status: 'PDI Certificate Generated',
            badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
        }
    };

    // S-24 State: True Landed Cost Breakdown Component Toggle
    const [monthlyVolumePcs, setMonthlyVolumePcs] = useState(2500);
    const powerKwhPerPiece = 3.2; // 3.2 kWh industrial power per turned shaft
    const powerTariffPerKwh = 8.50; // ₹8.50/unit industrial rate
    const toolingInsertCostPerPiece = 18.50; // Carbide insert consumption

    const electricityCostTotal = Math.round(monthlyVolumePcs * powerKwhPerPiece * powerTariffPerKwh);
    const toolingCostTotal = Math.round(monthlyVolumePcs * toolingInsertCostPerPiece);

    return (
        <section id="qc-costing" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/60">
                        Quality &amp; Financial Governance
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        3-Stage QC Gateways &amp; True Landed Cost Engine
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Stop shipping dimensional rejections and stop underpricing custom jobs. Nexus connects lab test reports with live electricity, insert tooling, and Tally Prime accounting.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-23: Three-Stage Quality Control Gateway (Inward, Line, PDI)            */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-16">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                        <div>
                            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Zero-Defect Protocol</span>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                                3-Stage Quality Inspection Gateway
                            </h3>
                        </div>

                        {/* Stage Selector Tabs */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                            {(['inward', 'in_process', 'pdi'] as const).map((stage) => (
                                <button
                                    key={stage}
                                    type="button"
                                    onClick={() => setActiveQcStage(stage)}
                                    className={`px-3 py-1.5 rounded-lg transition ${
                                        activeQcStage === stage
                                            ? 'bg-teal-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {stage === 'inward' && '1. Raw Material GRN'}
                                    {stage === 'in_process' && '2. In-Process Line'}
                                    {stage === 'pdi' && '3. Final PDI Dispatch'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active QC Inspection Report Card */}
                    <div className="mt-6 bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                            <div>
                                <h4 className="text-base font-bold text-slate-900">
                                    {qcStages[activeQcStage].title}
                                </h4>
                                <div className="text-xs text-slate-500 mt-0.5">
                                    Inspection Location: <strong>{qcStages[activeQcStage].gatekeeper}</strong>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${qcStages[activeQcStage].badgeColor}`}>
                                {qcStages[activeQcStage].status}
                            </span>
                        </div>

                        {/* Test Parameters Table */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                                        <th className="py-2.5 px-2">Inspection Parameter</th>
                                        <th className="py-2.5 px-2">Design Specification</th>
                                        <th className="py-2.5 px-2">Actual Measured Value</th>
                                        <th className="py-2.5 px-2 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/60 font-mono">
                                    {qcStages[activeQcStage].tests.map((test, idx) => (
                                        <tr key={idx} className="hover:bg-white transition">
                                            <td className="py-3 px-2 font-bold text-slate-800 font-sans">
                                                {test.parameter}
                                            </td>
                                            <td className="py-3 px-2 text-slate-600">
                                                {test.spec}
                                            </td>
                                            <td className="py-3 px-2 text-teal-800 font-bold">
                                                {test.actual}
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                    ✓ {test.result}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                            <span>Auto-attaches digital QC Inspection Certificate (COA) to client tax invoice</span>
                            <span className="font-bold text-teal-700">ISO 9001 / IATF 16949 Compliant</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-24 & S-25: True Landed Costing & MRP Shortage Alarms                    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    
                    {/* Left: True Landed Cost Factor Absorption (S-24) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Absorption Costing</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Power, Tooling &amp; True Landed Cost
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Plant Utility Index
                            </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                            Most MSMEs lose money because they forget to add industrial electricity and carbide tool insert depreciation into job quotation rates. Nexus captures every utility cost factor.
                        </p>

                        <div className="mt-5 space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Monthly Production Volume</span>
                                    <span className="text-emerald-600 font-mono">{monthlyVolumePcs.toLocaleString()} Pieces</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="10000"
                                    step="500"
                                    value={monthlyVolumePcs}
                                    onChange={(e) => setMonthlyVolumePcs(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                            </div>

                            {/* Utility Cost Cards */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                    <div className="text-[11px] text-slate-500">Industrial Power Consumption</div>
                                    <div className="text-lg font-black text-slate-900 mt-0.5">
                                        ₹{electricityCostTotal.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-slate-400">@ 3.2 kWh/piece (₹8.50/unit)</div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                    <div className="text-[11px] text-slate-500">Carbide Tool Insert Wear</div>
                                    <div className="text-lg font-black text-slate-900 mt-0.5">
                                        ₹{toolingCostTotal.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-slate-400">@ ₹18.50 insert cost/piece</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Auto-computes true gross profit margin</span>
                            <span className="font-bold text-emerald-600">Zero Underpriced Job Loss</span>
                        </div>
                    </div>

                    {/* Right: MRP-I Raw Material Shortage Alarms (S-25) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                                MRP-I Engine
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Automated Raw Material Shortage Alarms
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Never let a machine sit idle waiting for raw steel or chemical drums. Nexus matches scheduled work orders against vendor lead times to trigger auto-indents before stockouts occur.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-xs text-xs">
                                    <div className="flex items-center justify-between font-bold">
                                        <span className="text-slate-900">EN-19 Round Bar 55mm</span>
                                        <span className="text-rose-600 font-mono">Critical (2 Days Left)</span>
                                    </div>
                                    <p className="text-slate-500 text-[11px] mt-0.5">Available: 850 kg | Required for WO #8945: 2,400 kg</p>
                                </div>

                                <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-xs text-xs">
                                    <div className="flex items-center justify-between font-bold">
                                        <span className="text-slate-900">Carbide Inserts CNMG-120408</span>
                                        <span className="text-amber-600 font-mono">Reorder Point Reached</span>
                                    </div>
                                    <p className="text-slate-500 text-[11px] mt-0.5">Available: 14 pcs | Safety Stock: 20 pcs</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between text-xs font-medium text-amber-900">
                            <span>Auto-generates Purchase PO to pre-approved suppliers</span>
                            <span className="font-bold">1-Click WhatsApp PO →</span>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-26 to S-28: Tally Prime Bridge, E-Way Bill & Statutory HSN Tax          */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* S-26: Tally Prime Manufacturing Journals */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Tally Prime Manufacturing Journals
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Automatically post Manufacturing Journals into Tally Prime: debits raw materials consumed and credits finished goods at true production cost.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Zero Manual Excel Imports</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-27: E-Way Bill & E-Invoice Dispatch Gate */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            NIC E-Way Bill &amp; B2B E-Invoice Gate
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Generate NIC E-Way Bills and B2B IRN QR codes directly at the factory dispatch weighbridge before loading trucks. 100% compliant with GST transit laws.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                            <span>No Highway Interceptions</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-28: Statutory HSN Chapters & Export LUT */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            HSN Chapters 72/73/84 &amp; Export LUT
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Pre-mapped HSN tax schedules for industrial steel, machined shafts, and heavy machinery. Supports zero-tax Export Invoicing under valid Letter of Undertaking (LUT).
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                            <span>Zero Penalty Exposure</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
