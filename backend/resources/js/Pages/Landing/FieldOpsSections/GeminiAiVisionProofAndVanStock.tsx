import React, { useState } from 'react';

export default function GeminiAiVisionProofAndVanStock() {
    // S-19 State: Gemini Vision AI Analysis Test Simulator
    const [selectedAiSample, setSelectedAiSample] = useState<'gauge' | 'burnt_pcb' | 'solar_panel' | 'ro_membrane'>('gauge');

    const aiSamples = {
        gauge: {
            title: 'AC Gas Manifold Pressure Gauge',
            imageLabel: 'Manifold Gauge Dial (R-32 Refrigerant)',
            aiStatus: 'Verified Pass',
            confidence: '99.4%',
            detectedValue: '68 PSI Operating Pressure',
            notes: 'Refrigerant pressure is within manufacturer nominal range (65-75 PSI). No vacuum leak detected.',
            tags: ['R32 Refrigerant', 'Suction Pressure: 68 PSI', 'Leak Check: Passed']
        },
        burnt_pcb: {
            title: 'Inverter AC Outdoor PCB Inspection',
            imageLabel: 'Outdoor Motherboard Power Stage',
            aiStatus: 'Component Failure Verified',
            confidence: '98.8%',
            detectedValue: 'Blown 450V 680uF Filter Capacitor',
            notes: 'High voltage surge damage detected on secondary power line. Replacement of PCB approved under AMC.',
            tags: ['Surge Damage', 'Capacitor Bulge', 'Warranty Approved']
        },
        solar_panel: {
            title: 'Rooftop Solar PV Array Thermal Audit',
            imageLabel: '540W Monocrystalline Panel Surface',
            aiStatus: 'Hotspot Warning',
            confidence: '97.2%',
            detectedValue: 'Cell Bypass Diode Failure (Delta T = 22°C)',
            notes: 'Thermal hotspot localized at junction box diode. Recommended bypass diode replacement to prevent panel degradation.',
            tags: ['Hotspot Detected', 'Diode Bypass', 'Efficiency -18%']
        },
        ro_membrane: {
            title: 'Commercial RO Membrane & TDS Check',
            imageLabel: 'TDS Meter Dial & Membrane Housing',
            aiStatus: 'Replacement Required',
            confidence: '99.1%',
            detectedValue: 'TDS In: 1,420 PPM | TDS Out: 285 PPM',
            notes: 'Membrane salt rejection fallen below 80% threshold (Current: 79.9%). Scaling verified on RO-4040 element.',
            tags: ['Scaling Verified', 'TDS: 285 PPM', 'Pre-filter Choked']
        }
    };

    // S-21 State: Mobile Van / Bike Bag Stock Search & Filter
    const [stockSearch, setStockSearch] = useState('');
    const vanInventory = [
        { sku: 'CAP-45UF', name: '45 µF Dual Motor Run Capacitor (Heavy Duty)', vanQty: 8, minAlert: 3, unitPrice: '₹380', status: 'In Stock' },
        { sku: 'GAS-R32-CYL', name: 'R-32 Refrigerant 2.5kg Portable Mini Cylinder', vanQty: 2, minAlert: 2, unitPrice: '₹2,450', status: 'Low Stock' },
        { sku: 'COP-PIPE-05', name: 'Copper Tube 1/2" + 1/4" Pair (3m Roll)', vanQty: 4, minAlert: 2, unitPrice: '₹1,650', status: 'In Stock' },
        { sku: 'REL-POT-25A', name: 'Potential Relay 25A 240V Carrier/Voltas', vanQty: 5, minAlert: 2, unitPrice: '₹420', status: 'In Stock' },
        { sku: 'FIL-SED-10IN', name: 'Spun Sediment Filter 10" 5 Micron RO', vanQty: 12, minAlert: 5, unitPrice: '₹95', status: 'In Stock' },
        { sku: 'MCB-DP-32A', name: 'Double Pole 32A C-Curve Isolator MCB', vanQty: 1, minAlert: 3, unitPrice: '₹340', status: 'Critical' }
    ];

    const filteredInventory = vanInventory.filter(item =>
        item.name.toLowerCase().includes(stockSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(stockSearch.toLowerCase())
    );

    return (
        <section id="ai-vision-van-stock" className="py-20 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/60">
                        AI Verification &amp; Mobile Inventory
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Gemini 1.5 Flash Vision AI Proof &amp; Mobile Van Stock
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Stop fake technician repair reports and unbilled spare parts. Nexus pairs Google Gemini 1.5 Flash Vision AI with live mobile van stock so every replaced screw and capacitor is accounted for.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-19 & S-20: Gemini 1.5 Flash Vision AI + Anti-Fraud Metadata Inspector  */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-center">
                    
                    {/* Left: Interactive Gemini AI Vision Inspector */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl">
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                                        Google Gemini 1.5 Flash Vision AI
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mt-1">
                                    Real-Time Technical Image Analysis
                                </h3>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                &lt;800ms Latency
                            </span>
                        </div>

                        {/* Sample Selector Tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                            {(['gauge', 'burnt_pcb', 'solar_panel', 'ro_membrane'] as const).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSelectedAiSample(key)}
                                    className={`px-3 py-2 text-xs font-bold rounded-xl transition text-center ${
                                        selectedAiSample === key
                                            ? 'bg-emerald-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                                    }`}
                                >
                                    {key === 'gauge' && 'Pressure Gauge'}
                                    {key === 'burnt_pcb' && 'Burnt PCB'}
                                    {key === 'solar_panel' && 'Solar Hotspot'}
                                    {key === 'ro_membrane' && 'RO TDS Meter'}
                                </button>
                            ))}
                        </div>

                        {/* Interactive AI Inspection Card */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden border border-slate-800">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                                <div>
                                    <span className="text-xs font-mono text-emerald-400">INPUT: WhatsApp Photo Dispatch</span>
                                    <h4 className="text-base font-bold text-white mt-0.5">
                                        {aiSamples[selectedAiSample].title}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                                        {aiSamples[selectedAiSample].aiStatus}
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">
                                        Conf: {aiSamples[selectedAiSample].confidence}
                                    </span>
                                </div>
                            </div>

                            {/* Inspection Results Box */}
                            <div className="mt-5 space-y-3">
                                <div className="bg-slate-800/80 rounded-xl p-4 border border-white/5">
                                    <div className="text-xs text-slate-400 font-medium">Vision AI Extracted Parameter:</div>
                                    <div className="text-lg font-black text-amber-300 mt-0.5 font-mono">
                                        {aiSamples[selectedAiSample].detectedValue}
                                    </div>
                                </div>

                                <div className="text-xs text-slate-300 leading-relaxed bg-white/5 rounded-xl p-3.5 border border-white/5">
                                    <strong className="text-white block mb-1">Automated Diagnostic Assessment:</strong>
                                    {aiSamples[selectedAiSample].notes}
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {aiSamples[selectedAiSample].tags.map((tag, idx) => (
                                        <span key={idx} className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Security Badge */}
                            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Tamper-Proof EXIF Stamp Verified</span>
                                </div>
                                <span className="font-mono text-[11px] text-slate-500">SHA-256: 9e4f...b72a</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Anti-Fraud Duplicate & Metadata Detector Features */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                            <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
                                Anti-Fraud Shield
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                4-Layer Duplicate &amp; Fake Image Detection
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Field technicians cannot pick old photos from their gallery or download photos from Google. Nexus verifies photo authenticity at the point of capture.
                            </p>

                            <div className="mt-6 space-y-3.5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Zero-Gallery Direct Camera Lock</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Technicians must take live photos inside WhatsApp using the native camera trigger; file attachments from media gallery are rejected.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">EXIF Geotag vs Job Lat/Long Match</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Compares embedded photo coordinates against customer service address; rejects photos taken &gt;100 meters away.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Perceptual Hash (pHash) Duplicate Filter</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Identifies if the technician is submitting the same indoor coil photo across 5 different customer tickets on the same day.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                        4
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Automatic Manager Red Flag Alert</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Jobs with flagged images require supervisor override approval before the invoice is released or technician commission is credited.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-21 & S-22: Mobile Van & Bike Bag Stock Tracking + Scrap Return Pipeline */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    
                    {/* Left: Mobile Van Live Stock Table */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Mobile Sub-Warehouse</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Technician Bike Bag &amp; Van Inventory
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Assigned to: <strong>Rahul Sharma (Van #DL-1V-8942)</strong>
                                </p>
                            </div>

                            {/* Search bar */}
                            <div className="w-full sm:w-48">
                                <input
                                    type="text"
                                    value={stockSearch}
                                    onChange={(e) => setStockSearch(e.target.value)}
                                    placeholder="Search spare parts..."
                                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Stock List */}
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                                        <th className="py-2.5 px-2">Part Details</th>
                                        <th className="py-2.5 px-2 text-center">Van Qty</th>
                                        <th className="py-2.5 px-2 text-right">Price</th>
                                        <th className="py-2.5 px-2 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInventory.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3 px-2">
                                                <div className="font-bold text-slate-900">{item.name}</div>
                                                <span className="font-mono text-[11px] text-slate-500">{item.sku}</span>
                                            </td>
                                            <td className="py-3 px-2 text-center font-bold text-slate-800">
                                                {item.vanQty} pcs
                                            </td>
                                            <td className="py-3 px-2 text-right font-medium text-slate-700">
                                                {item.unitPrice}
                                            </td>
                                            <td className="py-3 px-2 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    item.status === 'In Stock'
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : item.status === 'Low Stock'
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                            <span>Auto-deducted from Van inventory upon customer OTP completion</span>
                            <span className="font-semibold text-indigo-600">Total Van Stock Value: ₹24,820</span>
                        </div>
                    </div>

                    {/* Right: Scrap Return & Damaged Part Pipeline */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                                100% Stock Accountability
                            </span>
                            <h3 className="text-xl font-black text-slate-900 mt-3">
                                Damaged Scrap &amp; Replaced Part Return Gate
                            </h3>
                            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                                Prevent copper scrap theft and counterfeit warranty returns. Field technicians cannot request new copper coils or compressors until old replaced units are logged into godown custody.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-900">1. Replaced Part Photo &amp; Serial Tag</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">At Customer Site</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Technician scans damaged compressor QR and snaps photo of burnt winding.</p>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-900">2. Customer Custody Handover Sign</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">WhatsApp OTP</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Customer confirms whether scrap copper is retained or collected by company.</p>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-900">3. Central Godown Inward Verification</span>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Godown Handover</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Godown in-charge scans incoming scrap barcode; releases replenishment quota for next day.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between text-xs font-medium text-amber-900">
                            <span>Scrap Value Recovery Rate: <strong>+18.4%</strong></span>
                            <span>Warranty RMA Rejections: <strong>&lt;0.5%</strong></span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-23 to S-26: Serial RMA, Van Indents, Toolbag & PPE Safety Compliance    */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-23: Barcode & Serial RMA */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Serial Number &amp; OEM Warranty RMA
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Scan compressor and PCB barcodes with smartphone camera. Nexus ties serial numbers to OEM warranty databases for 1-click manufacturer claim processing.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Voltas / Daikin RMA Ready</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-24: Automated Van Replenishment Indents */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            1-Click Morning Van Restocking
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            When van parts fall below threshold, Nexus creates an automatic store indent. The godown clerk prepares pre-packed morning kits for 2-minute gate collection.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                            <span>Zero Morning Delays</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-25: Toolbag & Instrument Audit */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Weekly Toolbag Instrument Audits
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            Technicians submit weekly photo checklists of multimeters, vacuum pumps, and flaring tools. Prevents lost company assets and poor workmanship.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
                            <span>Calibration Tracking</span>
                            <span>→</span>
                        </div>
                    </div>

                    {/* S-26: PPE & Safety Protocol Check */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-slate-300 transition">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">
                            Mandatory PPE Selfie &amp; Safety Gate
                        </h4>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            For rooftop solar or ladder jobs &gt;10ft, Gemini AI checks technician selfie for safety helmet, harness, and gloves before allowing job start punch-in.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
                            <span>Zero OSHA / Safety Lapses</span>
                            <span>→</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
