import { useState } from 'react';

const FIELD_TASKS = [
    {
        id: 'TSK-941',
        customer: 'Apex Diagnostics & Lab',
        service: 'Water Purifier RO Membrane Replacement',
        engineer: 'Vikas Patil',
        status: 'OTP Verified & Completed',
        distance: '18.4 km',
        payout: '₹142.00 (Bike @ ₹3.5/km + DA)',
        aiScore: '96% AI Vision Match',
    },
    {
        id: 'TSK-942',
        customer: 'Hotel Royal Palace (Bandra)',
        service: 'Central AC Duct Inspection & Filter Clean',
        engineer: 'Suresh More',
        status: 'In Transit to Site',
        distance: '24.1 km',
        payout: '₹204.85 (Car @ ₹8.5/km)',
        aiScore: 'Pending Photo Upload',
    },
];

export default function FieldOpsAndAiSection() {
    const [activeTab, setActiveTab] = useState<'tada' | 'dispatch' | 'bot' | 'gemini'>('gemini');
    const [simulatedDistance, setSimulatedDistance] = useState<number>(32);
    const [vehicleRate, setVehicleRate] = useState<number>(3.5); // Bike default

    const taPayout = simulatedDistance * vehicleRate;
    const daAllowance = simulatedDistance > 25 ? 250 : 150;
    const totalClaim = taPayout + daAllowance;

    return (
        <div id="fieldops-ai" className="pt-16 pb-20 space-y-24 bg-slate-50/60 border-y border-slate-200">
            {/* ========================================================= */}
            {/* SECTION 19: TaDaTracking (Travel & Daily Allowance)       */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                        <span>TRAVEL ALLOWANCE (TA/DA)</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Zero Fake Travel Bills. Automated Haversine GPS Kilometers.
                    </h2>
                    <p className="mt-4 text-slate-600 text-base sm:text-lg">
                        Field executives no longer submit handwritten petrol bills. Nexus records GPS breadcrumbs silently during duty hours,
                        computes accurate road distance using the Haversine formula, and applies your company's per-km vehicle rate.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Interactive TA/DA Calculator */}
                    <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Interactive TA/DA Reimbursement Estimator</h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                                    <span>Field Travel Distance (GPS Tracked):</span>
                                    <span className="text-indigo-600 font-mono font-bold text-sm">{simulatedDistance} KM</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="120"
                                    value={simulatedDistance}
                                    onChange={(e) => setSimulatedDistance(Number(e.target.value))}
                                    className="w-full accent-indigo-600 cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vehicle Type & Approved Rate Slab</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setVehicleRate(3.5)}
                                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                                            vehicleRate === 3.5
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-700'
                                        }`}
                                    >
                                        <div>🏍️ Two-Wheeler (Bike)</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">₹3.50 / km (Approved)</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVehicleRate(8.5)}
                                        className={`p-3 rounded-xl border text-left text-xs transition-all ${
                                            vehicleRate === 8.5
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                                                : 'bg-slate-50 border-slate-200 text-slate-700'
                                        }`}
                                    >
                                        <div>🚗 Four-Wheeler (Car)</div>
                                        <div className="text-[11px] text-slate-500 mt-0.5">₹8.50 / km (Approved)</div>
                                    </button>
                                </div>
                            </div>

                            {/* Payout Calculation Box */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                                <div className="flex justify-between text-slate-600">
                                    <span>Travel Allowance (TA): {simulatedDistance} km × ₹{vehicleRate}</span>
                                    <span className="font-bold text-slate-900">₹{taPayout.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Daily Food Allowance (DA Shift Duration &gt; 6h):</span>
                                    <span className="font-bold text-slate-900">₹{daAllowance}.00</span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-emerald-600">
                                    <span>Total Approved Claim:</span>
                                    <span>₹{totalClaim.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Field Map Simulation */}
                    <div className="lg:col-span-6 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live GPS Breadcrumb Map</span>
                            <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                                ACTIVE ROUTE #MH-29
                            </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs">
                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                                <div>
                                    <span className="text-slate-400 text-[10px] block">PUNCH-IN ORIGIN (09:15 AM)</span>
                                    <span className="text-white font-medium">Nexus Hub, Sector 14, Navi Mumbai</span>
                                </div>
                            </div>

                            <div className="border-l-2 border-dashed border-slate-600 ml-1.5 pl-4 py-2 space-y-1">
                                <span className="text-[10px] text-indigo-400 font-mono">14 Waypoints Pinged via WhatsApp Bot</span>
                                <div className="text-[11px] text-slate-300">Client Stop 1: Apex Labs (42 mins spent)</div>
                                <div className="text-[11px] text-slate-300">Client Stop 2: Hotel Royal (Ongoing)</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full bg-blue-400 shrink-0 animate-ping" />
                                <div>
                                    <span className="text-slate-400 text-[10px] block">CURRENT LIVE LOCATION (02:40 PM)</span>
                                    <span className="text-white font-medium">Bandra West, Mumbai (Accuracy: 6m)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 20: FieldOpsTaskSection                           */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
                            <span>SERVICE TICKET WORKFLOW</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            6-Stage Service Ticket Lifecycle With Customer OTP Proof
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Auto-dispatches tickets to the nearest available technician. The customer signs off with a 4-digit OTP sent to their mobile phone.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-2xl mb-1">🎫</div>
                            <div className="font-bold text-slate-900">1. Ticket Created</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Web or Call Center</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-2xl mb-1">📲</div>
                            <div className="font-bold text-slate-900">2. Dispatched</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">WhatsApp Alert</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-2xl mb-1">🛵</div>
                            <div className="font-bold text-slate-900">3. En Route</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Google Maps Link</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-2xl mb-1">📍</div>
                            <div className="font-bold text-slate-900">4. Reached Site</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Timestamp Logged</div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="text-2xl mb-1">📸</div>
                            <div className="font-bold text-slate-900">5. Photo Proof</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Gemini AI Audit</div>
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                            <div className="text-2xl mb-1">🔐</div>
                            <div className="font-bold">6. Customer OTP</div>
                            <div className="text-[10px] text-indigo-700 mt-0.5">Instant Bill & Close</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 21 & 22: WhatsAppBotFeatures & GeminiAiSection     */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-indigo-900/40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                                <span>AI VISION &amp; AUTONOMOUS BOT</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                Google Gemini 1.5 Vision AI For Site Photo Verification
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                Field agents often photograph old pictures or fake their work. Nexus integrates Google Gemini Vision AI
                                to inspect uploaded task photos in under 2 seconds. It verifies genuine site surroundings, checks for screen spoofing,
                                and extracts meter readings automatically.
                            </p>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold">✓</span>
                                        <span>Anti-Screen Spoof Detection</span>
                                    </div>
                                    <span className="text-slate-400">Detects photos taken of computer screens</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold">✓</span>
                                        <span>Meter OCR &amp; Serial Tag Reader</span>
                                    </div>
                                    <span className="text-slate-400">Extracts 7-segment numbers &amp; barcodes</span>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold">✓</span>
                                        <span>Autonomous WhatsApp Command Bot</span>
                                    </div>
                                    <span className="text-slate-400">Staff run /punch, /stock, /task commands</span>
                                </div>
                            </div>
                        </div>

                        {/* Gemini AI Verification Mockup Sandbox */}
                        <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Gemini 1.5 Vision Analysis</span>
                                </div>
                                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                                    CONFIDENCE: 96.4%
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono">
                                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Analyzed Image Target:</span>
                                    <div className="font-semibold text-slate-800 mt-0.5">RO Water Filter Replacement at Apex Labs</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Spoof Detection</span>
                                        <span className="font-bold text-emerald-600">GENUINE PHYSICAL SITE</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Geo-Coordinate Match</span>
                                        <span className="font-bold text-emerald-600">MATCH (Within 12m)</span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-950 font-mono text-[11px] leading-relaxed">
                                    <span className="font-bold text-indigo-700 block text-[10px] uppercase mb-0.5">Gemini Vision Reasoning:</span>
                                    "Image shows technician installing new blue membrane cartridge. Old dirty filter visible on floor. Live ambient lighting consistent with time of capture (14:32). Approval recommended."
                                </div>

                                <div className="pt-2 flex justify-between items-center text-xs">
                                    <span className="text-slate-500">Auto-action taken:</span>
                                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs">
                                        Auto-Approved &amp; Payout Released
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
