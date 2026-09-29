import React, { useState } from 'react';

export default function AmcContractsAndBilling() {
    // S-27 State: Interactive AMC Contract Calculator
    const [contractType, setContractType] = useState<'comprehensive' | 'labor_only'>('comprehensive');
    const [equipmentUnits, setEquipmentUnits] = useState(6);
    const [contractDuration, setContractDuration] = useState<1 | 3>(1);

    const basePerUnitRate = contractType === 'comprehensive' ? 3200 : 1400; // Comprehensive includes spares; labor-only is service visits
    const discountMultiplier = contractDuration === 3 ? 0.85 : 1.0; // 15% discount for 3-year upfront AMC
    const annualContractValue = Math.round(equipmentUnits * basePerUnitRate * contractDuration * discountMultiplier);
    const scheduledServicesPerYear = contractType === 'comprehensive' ? 4 : 3;

    // S-28 State: WhatsApp Dunning Step Selector
    const [dunningStep, setDunningStep] = useState<30 | 15 | 7 | 1>(7);

    // S-30 State: Technician Incentive & Commission Simulator
    const [ticketsCompleted, setTicketsCompleted] = useState(42);
    const [slaScore, setSlaScore] = useState(96); // 96% on-time SLA
    const [sparesSoldValue, setSparesSoldValue] = useState(28500); // ₹28,500 upsold parts

    const perTicketPayout = ticketsCompleted * 150; // ₹150 base per completed ticket
    const slaBonus = slaScore >= 95 ? 2500 : slaScore >= 90 ? 1200 : 0;
    const sparesCommission = Math.round(sparesSoldValue * 0.08); // 8% commission on spares
    const totalTechBonus = perTicketPayout + slaBonus + sparesCommission;

    return (
        <section id="amc-contracts-billing" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200/60">
                        Recurring Service Revenue
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Automated AMC Contracts, WhatsApp Dunning &amp; SAC 9987 Invoicing
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Turn one-time repair calls into high-margin recurring annual maintenance contracts. Nexus automates scheduled PM visits, dunning reminders, and dual-tax GST service invoices.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-27 & S-28: AMC Lifecycle Engine + Automated WhatsApp Dunning            */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    
                    {/* Left: Interactive AMC Contract Configurator (S-27) */}
                    <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Contract Engine</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Annual Maintenance Contract (AMC) Builder
                                </h3>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                                Auto-Scheduled PM Visits
                            </span>
                        </div>

                        {/* Contract Type Toggle */}
                        <div className="mt-6">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                                Select Plan Tier
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setContractType('comprehensive')}
                                    className={`p-3.5 rounded-2xl border text-left transition ${
                                        contractType === 'comprehensive'
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="font-bold text-sm">Comprehensive AMC</div>
                                    <div className={`text-xs mt-1 ${contractType === 'comprehensive' ? 'text-purple-100' : 'text-slate-500'}`}>
                                        Includes all spares, PCB repairs, gas top-ups &amp; 4 visits/yr
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setContractType('labor_only')}
                                    className={`p-3.5 rounded-2xl border text-left transition ${
                                        contractType === 'labor_only'
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="font-bold text-sm">Labor-Only / Non-Comp</div>
                                    <div className={`text-xs mt-1 ${contractType === 'labor_only' ? 'text-purple-100' : 'text-slate-500'}`}>
                                        Covers labor &amp; 3 wet-wash PM visits; spare parts billed extra
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Sliders: Equipment Units & Duration */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Equipment / AC Units</span>
                                    <span className="text-purple-600 font-mono text-sm">{equipmentUnits} Units</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={equipmentUnits}
                                    onChange={(e) => setEquipmentUnits(parseInt(e.target.value))}
                                    className="w-full accent-purple-600 cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                                    <span>1 unit</span>
                                    <span>15 units</span>
                                    <span>30 units</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Contract Duration</span>
                                    <span className="text-purple-600 font-mono text-sm">{contractDuration} Year{contractDuration > 1 ? 's' : ''}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setContractDuration(1)}
                                        className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                                            contractDuration === 1
                                                ? 'bg-purple-100 border-purple-300 text-purple-800'
                                                : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        1 Year Annual
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setContractDuration(3)}
                                        className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                                            contractDuration === 3
                                                ? 'bg-purple-100 border-purple-300 text-purple-800'
                                                : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                    >
                                        3 Years (Save 15%)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Calculated Summary Box */}
                        <div className="mt-6 bg-white rounded-2xl p-5 border border-purple-100 shadow-xs">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-xs text-slate-500 font-medium">Scheduled PM Visits</div>
                                    <div className="text-lg font-black text-slate-900 mt-0.5">
                                        {scheduledServicesPerYear * contractDuration * equipmentUnits} Visits
                                    </div>
                                    <div className="text-[10px] text-slate-400">Auto-calendar scheduled</div>
                                </div>
                                <div className="border-x border-slate-100">
                                    <div className="text-xs text-slate-500 font-medium">Breakdown SLA</div>
                                    <div className="text-lg font-black text-purple-600 mt-0.5">&lt;4 Hours</div>
                                    <div className="text-[10px] text-slate-400">P1 priority dispatch</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium">Total Contract Value</div>
                                    <div className="text-xl font-black text-slate-900 mt-0.5">
                                        ₹{annualContractValue.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-bold">+18% SAC 9987 GST</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: WhatsApp Dunning Engine (S-28) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div>
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Zero Manual Calling</span>
                                    <h3 className="text-lg font-black text-white mt-0.5">
                                        WhatsApp AMC Dunning Simulator
                                    </h3>
                                </div>
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            </div>

                            {/* Dunning Stage Trigger Tabs */}
                            <div className="mt-4 flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl text-xs font-bold">
                                {[30, 15, 7, 1].map((days) => (
                                    <button
                                        key={days}
                                        type="button"
                                        onClick={() => setDunningStep(days as 30 | 15 | 7 | 1)}
                                        className={`flex-1 py-1.5 rounded-lg transition text-center ${
                                            dunningStep === days
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        T-{days}D
                                    </button>
                                ))}
                            </div>

                            {/* Simulated WhatsApp Chat Notification */}
                            <div className="mt-5 bg-slate-800/90 rounded-2xl p-4 border border-white/10 relative">
                                <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-white/5">
                                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                                        WA
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">Nexus Cloud Bot</div>
                                        <div className="text-[10px] text-slate-400">To: Oberoi Corporate Towers</div>
                                    </div>
                                </div>

                                <div className="text-xs text-slate-200 space-y-2 leading-relaxed">
                                    <p>
                                        Dear Estate Manager, your <strong>Comprehensive AC AMC (#AMC-8492)</strong> for 6 Voltas Cassette Units expires in <strong>{dunningStep} days</strong>.
                                    </p>
                                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-[11px]">
                                        <div className="text-slate-400">Renewal Package: <strong>₹{annualContractValue.toLocaleString()} + GST</strong></div>
                                        <div className="text-emerald-400 font-medium">Includes 4 free coil wash services + zero labor charges on repairs.</div>
                                    </div>
                                </div>

                                {/* Simulated 1-Tap Payment Button */}
                                <div className="mt-3.5 space-y-1.5">
                                    <div className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black text-xs rounded-xl text-center shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        1-Tap UPI Renew (Instant GPay / PhonePe)
                                    </div>
                                    <div className="text-center text-[10px] text-slate-400">
                                        Auto-generates signed AMC Agreement &amp; GST Tax Invoice
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                            <span>Renewal Retention Rate: <strong className="text-emerald-400">89.2%</strong></span>
                            <span>Payment Latency: <strong className="text-white">&lt;2 Hours</strong></span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-29 & S-30: Equipment QR Sticker & Technician Incentive Ledger           */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* S-29: Equipment QR Code Sticker Service Log */}
                    <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                            Smart Equipment Asset Tagging
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-3">
                            Weatherproof QR Sticker on Every Asset
                        </h3>
                        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                            Affix permanent metallic QR stickers on AC outdoor units, RO purifiers, and diesel generators. Customers or building staff simply scan with any phone camera.
                        </p>

                        <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-white rounded-xl border border-slate-300 p-1.5 shrink-0 flex flex-col items-center justify-center">
                                    <svg className="w-14 h-14 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                    <span className="text-[9px] font-mono text-slate-500 font-bold mt-0.5">AC-8492-OD</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900">Carrier 2.0 Ton Inverter Cassette</div>
                                    <div className="text-[11px] text-slate-500">Installation Date: 14-May-2023</div>
                                    <div className="text-[11px] text-slate-500">Refrigerant: R-32 | Factory Charge: 1.15kg</div>
                                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Active AMC Valid till May 2027
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                                <span>Total Visits Completed: <strong>6 Services</strong></span>
                                <span className="text-blue-600 font-semibold cursor-pointer">View PDF Service Card →</span>
                            </div>
                        </div>
                    </div>

                    {/* S-30: Technician Incentive & Commission Ledger */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Field Productivity</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Live Technician Incentive &amp; Commission Ledger
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Real-Time Wallet
                            </span>
                        </div>

                        {/* Interactive Sliders */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Tickets Closed</span>
                                    <span className="text-emerald-600 font-mono">{ticketsCompleted}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="80"
                                    value={ticketsCompleted}
                                    onChange={(e) => setTicketsCompleted(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-400">₹150/ticket base</span>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>SLA Score</span>
                                    <span className="text-emerald-600 font-mono">{slaScore}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="70"
                                    max="100"
                                    value={slaScore}
                                    onChange={(e) => setSlaScore(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-400">&gt;95% = ₹2,500 bonus</span>
                            </div>

                            <div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                                    <span>Spares Upsold</span>
                                    <span className="text-emerald-600 font-mono">₹{sparesSoldValue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="60000"
                                    step="2500"
                                    value={sparesSoldValue}
                                    onChange={(e) => setSparesSoldValue(parseInt(e.target.value))}
                                    className="w-full accent-emerald-600 cursor-pointer"
                                />
                                <span className="text-[10px] text-slate-400">8% commission rate</span>
                            </div>
                        </div>

                        {/* Ledger Breakdown Card */}
                        <div className="mt-6 bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-[11px] text-slate-400">Job Completion Pay</div>
                                    <div className="text-base font-bold text-white mt-0.5">₹{perTicketPayout.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">P1 SLA Bonus</div>
                                    <div className="text-base font-bold text-amber-400 mt-0.5">₹{slaBonus.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-[11px] text-slate-400">Spare Part Commission</div>
                                    <div className="text-base font-bold text-blue-400 mt-0.5">₹{sparesCommission.toLocaleString()}</div>
                                </div>
                                <div className="border-l border-white/10 pl-2">
                                    <div className="text-[11px] text-emerald-400 font-bold">Total Monthly Incentive</div>
                                    <div className="text-xl font-black text-emerald-300 mt-0.5">₹{totalTechBonus.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-31 & S-32: Tally Prime Cloud Sync & SAC 9987 Dual Tax GST Invoicing      */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* S-31: Tally Prime & Zoho Books Two-Way Sync */}
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Accounting Cloud Bridge</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mt-1">
                                Tally Prime &amp; Zoho Books Cloud Sync
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                No manual re-entry of job card receipts into accounting books. Nexus automatically creates service voucher entries and debits spare parts from corresponding godown ledgers.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                    <span className="font-semibold text-slate-800">Job Card Service Invoices → Sales Voucher</span>
                                    <span className="font-bold text-emerald-600">Auto-Posted</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                    <span className="font-semibold text-slate-800">Van Spare Part Consumption → Stock Journal</span>
                                    <span className="font-bold text-emerald-600">Real-Time</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                    <span className="font-semibold text-slate-800">Customer Advance &amp; UPI Khata Reconciliation</span>
                                    <span className="font-bold text-emerald-600">Zero Pending</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>Supported: Tally Prime 4.x, Zoho Books, Busy ERP</span>
                            <span className="font-bold text-blue-600">REST API Ready</span>
                        </div>
                    </div>

                    {/* S-32: SAC 9987 & Dual-Rate GST Invoicing */}
                    <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Statutory Tax Compliance</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mt-1">
                                SAC 9987 &amp; Dual-Rate GST Tax Bifurcation
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Field service invoices combine labor services (SAC 9987 at 18%) with hardware spare parts (HSN 8415 at 18% or 28%). Nexus automatically splits line items into statutory tax schedules.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                    <div>
                                        <div className="font-semibold text-slate-800">Labor / Service Charges (SAC 9987)</div>
                                        <div className="text-[10px] text-slate-500">Maintenance and repair services of commercial AC</div>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900">18% GST</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                    <div>
                                        <div className="font-semibold text-slate-800">Spare Parts &amp; Gas (HSN 8415 / 2903)</div>
                                        <div className="text-[10px] text-slate-500">Dual run capacitors, R32 refrigerant cylinder gas</div>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900">18% / 28% GST</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-xs">
                                    <div>
                                        <div className="font-semibold text-slate-800">B2B E-Invoice IRN &amp; QR Code Generation</div>
                                        <div className="text-[10px] text-slate-500">Direct NIC portal sync for commercial corporate clients</div>
                                    </div>
                                    <span className="font-bold text-purple-600">Automated</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>B2B GSTR-1 Auto-Populated</span>
                            <span className="font-bold text-purple-600">Zero Penalty Risk</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
