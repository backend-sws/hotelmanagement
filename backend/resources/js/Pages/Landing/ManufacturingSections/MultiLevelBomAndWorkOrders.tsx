import React, { useState } from 'react';

export default function MultiLevelBomAndWorkOrders() {
    // S-10 State: Interactive BOM & Production Cost Calculator
    const [rawMaterialRate, setRawMaterialRate] = useState(82); // ₹82/kg for EN-19 alloy steel
    const [billetWeight, setBilletWeight] = useState(4.2); // 4.2 kg raw billet weight
    const [cycleTimeMinutes, setCycleTimeMinutes] = useState(24); // 24 mins CNC machining
    const [machineHourlyRate, setMachineHourlyRate] = useState(650); // ₹650/hr CNC machine cost
    const [scrapRecoveryRate, setScrapRecoveryRate] = useState(38); // ₹38/kg scrap resale value

    // Computations
    const rawMaterialCost = rawMaterialRate * billetWeight; // ₹344.40
    const finishedPartWeight = 2.8; // kg
    const scrapWeight = Math.max(0, billetWeight - finishedPartWeight); // 1.4 kg scrap
    const scrapCredit = scrapWeight * scrapRecoveryRate; // ₹53.20 credit
    const netMaterialCost = rawMaterialCost - scrapCredit;

    const machiningCost = (cycleTimeMinutes / 60) * machineHourlyRate; // ₹260.00
    const directLaborCost = 45.00; // Fixed direct labor per unit
    const factoryOverhead = Math.round((machiningCost + directLaborCost) * 0.18); // 18% overhead

    const totalLandedUnitCost = Math.round(netMaterialCost + machiningCost + directLaborCost + factoryOverhead);

    // S-05 State: Interactive BOM Tree expand/collapse
    const [expandedBom, setExpandedBom] = useState<'all' | 'rotor' | 'stator'>('all');

    return (
        <section id="bom-work-orders" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
                        Core Production Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Multi-Level BOMs, Shop Routing &amp; Material Reservation
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Eliminate shop floor guesswork and unbudgeted raw material consumption. Build multi-tiered BOMs with automated scrap recovery, sequential machine routing, and 1-click store issue slips.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-05 & S-06: Multi-Level BOM Tree Visualizer + Shop Floor Routing Engine  */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
                    
                    {/* Left: Multi-Level BOM Tree Visualizer (S-05) */}
                    <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Multi-Tier Hierarchy</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Multi-Level Bill of Materials (BOM)
                                </h3>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setExpandedBom('all')}
                                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                                        expandedBom === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Expand All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setExpandedBom('rotor')}
                                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                                        expandedBom === 'rotor' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Rotor Core
                                </button>
                            </div>
                        </div>

                        {/* Interactive Tree View */}
                        <div className="mt-5 space-y-3 font-mono text-xs">
                            {/* Level 0: Top Assembly */}
                            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <span>[L0] Submersible Solar Motor 5HP (ASY-MTR-5HP)</span>
                                    </div>
                                    <span className="text-emerald-700 font-black">₹11,480 / Unit</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1 pl-4">
                                    Base Batch: 100 Units | Standard Scrap Buffer: 3.5%
                                </div>
                            </div>

                            {/* Level 1: Rotor Assembly */}
                            {(expandedBom === 'all' || expandedBom === 'rotor') && (
                                <div className="ml-4 pl-4 border-l-2 border-amber-400 space-y-2">
                                    <div className="bg-white rounded-xl p-3 border border-amber-200">
                                        <div className="flex items-center justify-between font-bold text-slate-800">
                                            <span>├── [L1] High-Permeability Rotor Core (SUB-ROT-01)</span>
                                            <span className="text-amber-800 font-bold">₹4,250</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">Qty: 1 per motor | Routing: Stamping → Die Casting</div>
                                    </div>

                                    {/* Level 2: Raw Materials under Rotor */}
                                    <div className="ml-4 pl-4 border-l-2 border-slate-300 space-y-1.5">
                                        <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                                            <span>│   ├── CRNGO Silicon Steel Coil 0.5mm (18.4 kg)</span>
                                            <span className="font-semibold text-slate-900">+4.5% Slitting Scrap</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                                            <span>│   └── EC Grade Ingot 99.7% Pure (2.1 kg)</span>
                                            <span className="font-semibold text-slate-900">High-Pressure Aluminum</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Level 1: Stator Assembly */}
                            {(expandedBom === 'all' || expandedBom === 'stator') && (
                                <div className="ml-4 pl-4 border-l-2 border-blue-400 space-y-2">
                                    <div className="bg-white rounded-xl p-3 border border-blue-200">
                                        <div className="flex items-center justify-between font-bold text-slate-800">
                                            <span>├── [L1] Stator Copper Winding Sub-Assembly (SUB-STA-02)</span>
                                            <span className="text-blue-800 font-bold">₹5,820</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">Qty: 1 per motor | Routing: Slot Insulation → Winding → Varnish</div>
                                    </div>

                                    <div className="ml-4 pl-4 border-l-2 border-slate-300 space-y-1.5">
                                        <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                                            <span>│   ├── Dual Coat Enamelled Copper Wire (3.8 kg)</span>
                                            <span className="font-semibold text-slate-900">LME Copper Indexed</span>
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                                            <span>│   └── Class-H Nomex Insulation Paper (0.35 kg)</span>
                                            <span className="font-semibold text-slate-900">High Temp 180°C</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Level 1: Hardware Kit */}
                            {expandedBom === 'all' && (
                                <div className="ml-4 pl-4 border-l-2 border-slate-300">
                                    <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between font-bold text-slate-800">
                                        <span>└── [L1] Fastener &amp; Mechanical Seal Kit (KIT-HDW-05)</span>
                                        <span className="text-slate-700">₹1,410</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>Automatic Multi-Level Cost Rollup Engine</span>
                            <span className="font-bold text-amber-700">Active Version: v3.2 Approved</span>
                        </div>
                    </div>

                    {/* Right: Sequential Shop Floor Routing Engine (S-06) */}
                    <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="pb-4 border-b border-slate-100">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Process Engineering</span>
                            <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                Sequential Shop Floor Routing &amp; Work Centers
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">
                                Every job traveler follows an audited sequence of work centers with cycle times, setup offsets, and operator skill criteria.
                            </p>
                        </div>

                        {/* 5-Stage Routing Timeline */}
                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                                    01
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-900">Work Center: Band Saw Slitting Line</div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Completed</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                                        <span>Machine: Saw-01 | Setup: 15 min</span>
                                        <span className="font-mono text-slate-700">Cycle: 2.5 min/pc</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 font-black text-xs flex items-center justify-center shrink-0 border border-amber-200">
                                    02
                                </div>
                                <div className="flex-1 bg-amber-50/50 rounded-2xl p-3.5 border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-900">Work Center: CNC Turning Center #04</div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">In Progress (82%)</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                                        <span>Machine: Doosan Puma 2600 | Setup: 35 min</span>
                                        <span className="font-mono text-slate-700">Cycle: 14.8 min/pc</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center shrink-0 border border-blue-200">
                                    03
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-900">Subcontract Process: Liquid Nitriding Hardening</div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Job Work Outward</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                                        <span>Vendor: Apex Surface Tech | Challan: Rule 55</span>
                                        <span className="font-mono text-slate-700">Hardness: 58-62 HRC</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                                    04
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold text-slate-900">Work Center: CMM Dimensional Quality Gate</div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">Queued</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                                        <span>Carl Zeiss Coordinate Measuring Machine</span>
                                        <span className="font-mono text-slate-700">Tolerance: ±5 Microns</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Prevents process stage skipping</span>
                            <span className="font-bold text-blue-600">Barcode Traveler Locked</span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-07 to S-09: Work Order Dispatch, Store Slips & Scrap Recovery          */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    
                    {/* S-07: Work Order Generation */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            1-Click Work Order &amp; Stock Reservation
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Convert customer sales orders into production work orders instantly. Nexus checks godown raw material inventory and reserves required quantities in real time.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
                            <span>Zero Material Shortage Stops</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-08: Material Requisition Slips */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Strict Store Material Requisition (MRN)
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Shop floor workers can only withdraw raw materials pre-authorized on the BOM requisition slip. Any excess or scrap replenishment requires plant manager approval.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
                            <span>Cuts Shop Floor Leakage</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-09: Scrap & By-Product Recovery */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 font-black">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Scrap Recovery &amp; By-Product Resale Credit
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Accurately log swarf, turnings, runner regrind, and solvent recovery. Nexus credits scrap market value against finished part costs to calculate accurate gross margins.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                            <span>Direct Bottom-Line Gain</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

                {/* ========================================================================= */}
                {/* S-10: Interactive BOM Production Costing Simulator                        */}
                {/* ========================================================================= */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Live Costing Engine</span>
                            <h3 className="text-2xl font-black text-white mt-1">
                                Interactive BOM &amp; Landed Unit Cost Simulator
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Adjust raw steel rates, cycle times, and scrap values to see your true manufacturing margin in real time.
                            </p>
                        </div>
                        <div className="bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 text-xs font-mono text-amber-300">
                            Standard CNC Turning Job
                        </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Raw Material Rate</span>
                                <span className="text-amber-400 font-mono">₹{rawMaterialRate} / kg</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="150"
                                value={rawMaterialRate}
                                onChange={(e) => setRawMaterialRate(parseInt(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400">EN-19 / 42CrMo4 Alloy Steel</span>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Billet Cut Weight</span>
                                <span className="text-amber-400 font-mono">{billetWeight.toFixed(1)} kg</span>
                            </div>
                            <input
                                type="range"
                                min="2.0"
                                max="10.0"
                                step="0.2"
                                value={billetWeight}
                                onChange={(e) => setBilletWeight(parseFloat(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400">Finished Part: 2.8 kg (Swarf: {scrapWeight.toFixed(1)} kg)</span>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>CNC Cycle Time</span>
                                <span className="text-amber-400 font-mono">{cycleTimeMinutes} Mins</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                value={cycleTimeMinutes}
                                onChange={(e) => setCycleTimeMinutes(parseInt(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400">Machine Hourly Rate: ₹{machineHourlyRate}/hr</span>
                        </div>

                        <div>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                                <span>Swarf Scrap Credit</span>
                                <span className="text-emerald-400 font-mono">₹{scrapRecoveryRate} / kg</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="60"
                                value={scrapRecoveryRate}
                                onChange={(e) => setScrapRecoveryRate(parseInt(e.target.value))}
                                className="w-full accent-emerald-400 cursor-pointer"
                            />
                            <span className="text-[10px] text-slate-400">Recovery Value: -₹{scrapCredit.toFixed(0)}</span>
                        </div>
                    </div>

                    {/* Calculated Summary Box */}
                    <div className="mt-8 bg-slate-950/70 rounded-2xl p-6 border border-white/5">
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-x-0 sm:divide-x divide-white/10">
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Net Raw Material</div>
                                <div className="text-lg font-bold text-white mt-1">₹{Math.round(netMaterialCost)}</div>
                                <div className="text-[10px] text-slate-400">After scrap credit</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Machining Spindle</div>
                                <div className="text-lg font-bold text-amber-400 mt-1">₹{Math.round(machiningCost)}</div>
                                <div className="text-[10px] text-slate-400">{cycleTimeMinutes} min runtime</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Direct Labor</div>
                                <div className="text-lg font-bold text-white mt-1">₹{directLaborCost}</div>
                                <div className="text-[10px] text-slate-400">Piece-rate worker</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-medium">Overheads (18%)</div>
                                <div className="text-lg font-bold text-blue-400 mt-1">₹{factoryOverhead}</div>
                                <div className="text-[10px] text-slate-400">Power &amp; plant rent</div>
                            </div>
                            <div className="col-span-2 sm:col-span-1 pl-2">
                                <div className="text-xs text-emerald-400 font-bold">Total Landed Cost</div>
                                <div className="text-2xl font-black text-emerald-300 mt-0.5">₹{totalLandedUnitCost}</div>
                                <div className="text-[10px] text-emerald-400/80">Per Finished Piece</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
