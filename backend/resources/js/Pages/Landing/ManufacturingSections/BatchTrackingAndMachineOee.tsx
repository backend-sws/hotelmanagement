import React, { useState } from 'react';

export default function BatchTrackingAndMachineOee() {
    // S-18 State: Interactive Machine OEE (Overall Equipment Effectiveness) Calculator
    const [availabilityPercent, setAvailabilityPercent] = useState(92); // 92% Availability (planned vs actual uptime)
    const [performancePercent, setPerformancePercent] = useState(86);  // 86% Speed/Performance vs rated cycle
    const [qualityPercent, setQualityPercent] = useState(98);          // 98% Quality (good parts vs total scrap)

    const oeeScore = ((availabilityPercent / 100) * (performancePercent / 100) * (qualityPercent / 100)) * 100;
    const oeeRounded = oeeScore.toFixed(1);

    // S-17 State: Interactive Heat Number Traceability Search
    const [searchHeatNo, setSearchHeatNo] = useState('HEAT-JSW-8921');
    const [selectedGenealogyStep, setSelectedGenealogyStep] = useState<number>(0);

    const heatGenealogy = [
        {
            stage: 'Steel Mill Inward GRN',
            source: 'JSW Steel Ltd (Dolvi Plant)',
            date: '14-Jan-2026',
            details: 'Heat #HEAT-JSW-8921 | 24.5 MT Billets | EN-19 / 42CrMo4 | Mill Test Cert #MTC-9912'
        },
        {
            stage: 'Chemical & Mechanical Lab QC',
            source: 'In-House Spectro Lab',
            date: '15-Jan-2026',
            details: 'Carbon 0.41%, Chrome 1.05%, Moly 0.22% | Hardness 240 BHN | Status: PASSED'
        },
        {
            stage: 'CNC Shop Work Order #WO-8942',
            source: 'Machine Center CNC-04',
            date: '18-Jan-2026',
            details: 'Cut 500 billets (2,100 kg) | 488 Good Pcs | 12 Rejections logged with root cause'
        },
        {
            stage: 'Subcontract Heat Treatment',
            source: 'Apex Surface Nitriding',
            date: '21-Jan-2026',
            details: 'Rule 55 Challan #DC-412 | Surface Hardness: 60 HRC | Case Depth: 0.45 mm'
        },
        {
            stage: 'Final Dispatch & Tax Invoice',
            source: 'Tata AutoComp Systems Ltd',
            date: '25-Jan-2026',
            details: 'Invoice #INV-2026-0914 | E-Way Bill #9182-4410-8812 | Batch QR Serial #SN-4910 to #SN-5398'
        }
    ];

    return (
        <section id="batch-oee" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200/60">
                        Shop Floor Intelligence
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Heat Number Traceability &amp; Machine OEE Tracking
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Trace every finished part back to its steel mill heat number in 3 seconds. Monitor real-time machine uptime, operator piece rates, and eliminate sudden equipment breakdowns.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-17: End-to-End Heat Number Backward / Forward Genealogy                 */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-16">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Automotive OEM Compliance</span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                                End-to-End Heat Lot Traceability Timeline
                            </h3>
                        </div>

                        {/* Search Input */}
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 w-full sm:w-auto">
                            <span className="text-xs text-slate-400 font-mono">Heat No:</span>
                            <input
                                type="text"
                                value={searchHeatNo}
                                onChange={(e) => setSearchHeatNo(e.target.value)}
                                className="bg-transparent text-xs font-mono font-bold text-amber-300 focus:outline-none w-36"
                            />
                        </div>
                    </div>

                    {/* Timeline Steps */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
                        {heatGenealogy.map((step, idx) => {
                            const isSelected = selectedGenealogyStep === idx;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedGenealogyStep(idx)}
                                    className={`text-left p-4 rounded-2xl border transition ${
                                        isSelected
                                            ? 'bg-slate-800 border-amber-400 shadow-lg'
                                            : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-bold">
                                            Stage 0{idx + 1}
                                        </span>
                                        <span className="text-[10px] text-slate-400">{step.date}</span>
                                    </div>
                                    <div className="text-xs font-bold text-white leading-snug">{step.stage}</div>
                                    <div className="text-[11px] text-amber-400 font-medium mt-1">{step.source}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Step Detailed Inspector */}
                    <div className="mt-6 bg-slate-800/90 rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <div className="text-xs text-slate-400 font-medium">
                                Active Audit Record: <strong>{heatGenealogy[selectedGenealogyStep].stage}</strong>
                            </div>
                            <div className="text-sm font-mono text-emerald-300 font-bold mt-1">
                                {heatGenealogy[selectedGenealogyStep].details}
                            </div>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 shrink-0">
                            100% IATF 16949 Audit Ready
                        </span>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-18: Interactive Machine OEE (Availability x Speed x Quality)            */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* Left: OEE Sliders */}
                    <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Plant Productivity</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Machine OEE Calculator (Overall Equipment Effectiveness)
                                </h3>
                            </div>
                            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-700">
                                CNC Machine #04
                            </span>
                        </div>

                        {/* 3 Pillars of OEE */}
                        <div className="mt-6 space-y-5">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>1. Machine Availability (Uptime vs Breakdown)</span>
                                    <span className="text-rose-600 font-mono text-sm">{availabilityPercent}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="60"
                                    max="100"
                                    value={availabilityPercent}
                                    onChange={(e) => setAvailabilityPercent(parseInt(e.target.value))}
                                    className="w-full accent-rose-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>Frequent Breakdowns (60%)</span>
                                    <span>Average (80%)</span>
                                    <span>Zero Breakdown (100%)</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>2. Operating Performance (Actual Speed vs Rated Cycle)</span>
                                    <span className="text-amber-600 font-mono text-sm">{performancePercent}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="60"
                                    max="100"
                                    value={performancePercent}
                                    onChange={(e) => setPerformancePercent(parseInt(e.target.value))}
                                    className="w-full accent-amber-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>Slow Feed (60%)</span>
                                    <span>Standard (85%)</span>
                                    <span>100% Design Speed</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>3. Quality Rate (Good Finished Parts vs Scrap)</span>
                                    <span className="text-emerald-600 font-mono text-sm">{qualityPercent}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="80"
                                    max="100"
                                    value={qualityPercent}
                                    onChange={(e) => setQualityPercent(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>High Rejection (80%)</span>
                                    <span>Acceptable (95%)</span>
                                    <span>Zero Defect Six-Sigma (100%)</span>
                                </div>
                            </div>
                        </div>

                        {/* OEE Formula Visualizer */}
                        <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 font-mono flex items-center justify-between">
                            <span>OEE = {availabilityPercent}% × {performancePercent}% × {qualityPercent}%</span>
                            <span className="font-bold text-slate-800">Formula: Availability × Performance × Quality</span>
                        </div>
                    </div>

                    {/* Right: OEE Score Card */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl text-center flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Composite Factory Efficiency</span>
                            <div className="mt-4">
                                <div className="text-6xl sm:text-7xl font-black tracking-tight text-white">
                                    {oeeRounded}%
                                </div>
                                <div className="text-xs font-bold mt-2">
                                    {parseFloat(oeeRounded) >= 85 ? (
                                        <span className="text-emerald-400">★ World-Class OEE Benchmark (&gt;85%)</span>
                                    ) : parseFloat(oeeRounded) >= 70 ? (
                                        <span className="text-amber-400">Typical Indian MSME Level (70-85%)</span>
                                    ) : (
                                        <span className="text-rose-400">High Capacity Waste (&lt;70%)</span>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                                Raising your machine OEE from 65% to 80% increases factory revenue by <strong>23%</strong> without purchasing a single new CNC machine.
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>Idle Spindle Alerts: <strong>Real-Time</strong></span>
                            <span>Preventive Maintenance: <strong>Active</strong></span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-19 to S-22: Barcode Scanner, PM Schedules, Piece Rates & Yield Report   */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-19: Shop Floor Barcode Scanner */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Work Center Barcode Punch-In
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Machine operators scan QR codes on job traveler travelers with smartphone cameras or wireless 2D scanners to log operation start, pause, and good/scrap piece counts.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Zero Paper Logs</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-20: Preventive Maintenance Schedules */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Machine Runtime PM Alerts
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Spindle hour meters automatically trigger lubricating oil changes, hydraulic filter cleaning, and insert indexing after 250 runtime hours.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                            <span>Prevents Sudden Breakdown</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-21: Operator Piece Rate Incentive */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Operator Piece-Rate Incentives
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Auto-calculate daily piece-rate bonuses based on verified good pieces produced per shift. Motivates machine operators while penalizing defective parts.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                            <span>Fair Shift Payroll</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-22: Production Yield & Variance */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Daily Yield &amp; Variance Reports
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Compare theoretical output from raw materials issued against actual finished goods. Flags unexplained weight loss or shop floor material theft.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                            <span>Identifies Material Leaks</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
