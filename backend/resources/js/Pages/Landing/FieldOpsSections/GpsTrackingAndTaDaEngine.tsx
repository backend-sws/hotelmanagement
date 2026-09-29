import React, { useState } from 'react';

export default function GpsTrackingAndTaDaEngine() {
    // S-14 State: Interactive TA/DA Kilometers Expense Calculator
    const [kilometersDriven, setKilometersDriven] = useState(48);
    const [ratePerKm, setRatePerKm] = useState(3.50); // ₹3.50/km standard 2-wheeler rate
    const [dailyAllowance, setDailyAllowance] = useState(250); // ₹250 DA for lunch/petrol

    const travelAllowance = Math.round(kilometersDriven * ratePerKm);
    const totalPayout = travelAllowance + dailyAllowance;

    // S-12 State: Active Radar Filter
    const [statusFilter, setStatusFilter] = useState<'all' | 'onsite' | 'driving' | 'idle'>('all');

    const technicians = [
        { id: 'TECH-01', name: 'Rahul Sharma (Senior AC)', status: 'onsite', km: 38, location: 'Sector 62, Noida', battery: '88%', task: 'Compressor Repair #4910' },
        { id: 'TECH-02', name: 'Vikram Kumar (RO Tech)', status: 'driving', km: 54, location: 'Barakhamba Rd, CP', battery: '74%', task: 'Filter Replacement #4911' },
        { id: 'TECH-03', name: 'Amitabh Sen (Solar Tech)', status: 'onsite', km: 29, location: 'DLF Phase 2, Gurgaon', battery: '92%', task: 'Inverter AMC Audit #4912' },
        { id: 'TECH-04', name: 'Deepak Verma (CCTV Tech)', status: 'idle', km: 41, location: 'Indirapuram Hub', battery: '61%', task: 'Waiting for Parts Dispatch' },
        { id: 'TECH-05', name: 'Sunil Rao (Elevator Tech)', status: 'driving', km: 62, location: 'MG Road Metro Hub', battery: '45%', task: 'P1 Breakdown Call #4913' }
    ];

    const filteredTechs = statusFilter === 'all' 
        ? technicians 
        : technicians.filter(t => t.status === statusFilter);

    return (
        <section id="gps-radar" className="py-20 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200/60">
                        Live Fleet Intelligence
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                        Live GPS Technician Radar &amp; Automated TA/DA Engine
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base mt-2">
                        Eliminate fake odometer bills and manual travel claim disputes. Nexus calculates actual road kilometers traveled via background GPS and auto-credits TA/DA directly to staff payroll.
                    </p>
                </div>

                {/* ========================================================================= */}
                {/* S-12: Live GPS Technician Radar Map View                                  */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-14">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div>
                            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Live Fleet Radar</span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                                Real-Time Field Engineer Map Coordinates
                            </h3>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-bold">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    statusFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                All (5)
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('onsite')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    statusFilter === 'onsite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                On-Site Working (2)
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('driving')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    statusFilter === 'driving' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Driving (2)
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('idle')}
                                className={`px-3 py-1.5 rounded-lg transition-all ${
                                    statusFilter === 'idle' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                Idle / Depot (1)
                            </button>
                        </div>
                    </div>

                    {/* Technician Table Rows */}
                    <div className="space-y-2.5 my-6">
                        {filteredTechs.map((tech) => {
                            let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                            let statusText = 'On-Site Working';

                            if (tech.status === 'driving') {
                                statusBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                                statusText = 'In-Transit Driving';
                            } else if (tech.status === 'idle') {
                                statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                                statusText = 'Idle (>40 min)';
                            }

                            return (
                                <div key={tech.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-bold text-white truncate">{tech.name}</p>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${statusBadge}`}>
                                                {statusText}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Current GPS: <strong className="text-white">{tech.location}</strong> • Battery: {tech.battery} • Task: {tech.task}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 self-end sm:self-center">
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-400">{tech.km} KM Driven</p>
                                            <p className="text-[10px] text-slate-400">TA/DA: ₹{(tech.km * 3.5).toFixed(0)}</p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-bold">
                                            View Route
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Radar Status Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            GPS Breadcrumbs Recorded Every 60 Seconds
                        </span>
                        <span className="text-teal-400 font-bold">Battery &amp; Offline Resilient</span>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-13 & S-14: Geofenced Attendance & Automated TA/DA Calculator            */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
                    
                    {/* S-13: Geofenced Attendance Punch-In */}
                    <div className="lg:col-span-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Zero Proxy Attendance</span>
                                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                                    Geofenced 50-Meter Punch-In
                                </h3>
                            </div>
                            <span className="text-2xl">📍</span>
                        </div>
                        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                            Technicians cannot punch in attendance from bed. Punch-in is strictly locked to within 50 meters of the assigned customer site or morning spare-parts depot with selfie capture.
                        </p>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 font-black flex items-center justify-center shrink-0">
                                    🎯
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">50-Meter Precision Geofencing</p>
                                    <p className="text-[10px] text-slate-500">Auto-validates latitude &amp; longitude against customer address pin</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center shrink-0">
                                    📸
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Selfie Facial Verification</p>
                                    <p className="text-[10px] text-slate-500">Stops buddy punching: AI matches selfie against employee ID card</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 font-black flex items-center justify-center shrink-0">
                                    ⚠️
                                </span>
                                <div>
                                    <p className="font-bold text-slate-800">Mock Location &amp; Fake GPS Blocker</p>
                                    <p className="text-[10px] text-slate-500">Rooted phones and developer option fake GPS apps are instantly rejected</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* S-14: Automated TA/DA Kilometers Calculator */}
                    <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                            <div>
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Payroll Automation</span>
                                <h3 className="text-xl font-black text-white mt-0.5">
                                    Automated TA/DA Travel Calculator
                                </h3>
                            </div>
                            <span className="text-2xl">💰</span>
                        </div>
                        <p className="text-slate-300 text-xs mt-1 mb-5">
                            Stop checking fake petrol slips. Nexus computes actual GPS travel distance, multiplies by your configured per-km rate, and auto-generates monthly reimbursement vouchers.
                        </p>

                        {/* Interactive Sliders */}
                        <div className="space-y-4 text-xs">
                            <div>
                                <div className="flex justify-between text-xs font-bold mb-1.5">
                                    <span className="text-slate-300">Daily Travel Distance (GPS):</span>
                                    <span className="text-emerald-400 text-sm">{kilometersDriven} Kilometers</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="120"
                                    value={kilometersDriven}
                                    onChange={(e) => setKilometersDriven(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1">Bike Travel Allowance Rate:</label>
                                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold">
                                        ₹{ratePerKm} / KM
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] text-slate-400 mb-1">Daily Allowance (Food/Tea):</label>
                                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-xs font-mono font-bold">
                                        ₹{dailyAllowance} / Day
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Output Calculation Card */}
                        <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400">Total Today's Payout to Technician:</p>
                                <p className="text-2xl font-black text-emerald-400">₹{totalPayout}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">₹{travelAllowance} (Travel) + ₹{dailyAllowance} (Daily Allowance)</p>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs">
                                Auto-Push to Salary Slip
                            </span>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-15 to S-18: Route Optimization, Idle Alerts, Breadcrumbs & Territories  */}
                {/* ========================================================================= */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* S-15: Route Optimization & Beat Planning */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg mb-3">
                            🗺️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Multi-Stop Beat Planning
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Cluster service calls geographically. Technicians visit adjacent customer societies in sequence, saving 25% daily petrol consumption.
                        </p>
                    </div>

                    {/* S-16: Idle Time & Geofence Breach Alerts */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg mb-3">
                            ⏰
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Idle Time Stop Alerts
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Automated manager notification if a technician stays stationary for &gt; 45 minutes at a tea stall or outside assigned customer boundaries.
                        </p>
                    </div>

                    {/* S-17: Battery & Network Breadcrumb Buffering */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3">
                            📶
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Network Breadcrumb Cache
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            When driving through basements or remote rural zones, GPS points are safely cached and auto-synced to cloud the moment 4G/5G restores.
                        </p>
                    </div>

                    {/* S-18: Multi-Depot Territory Management */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg mb-3">
                            🏙️
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">
                            Territory Zone Routing
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            Divide metropolitan regions into North, South, East, West zones. Customer calls are auto-routed exclusively to designated zone technicians.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
