import AnimatedSection from '@/Components/Site/AnimatedSection';

export default function FieldOpsAndHRSection() {
    return (
        <section className="py-24 relative bg-white overflow-hidden">
            {/* Background highlights */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-100/50 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 relative z-10">
                {/* S-12: FieldOpsShowcase */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider mb-4">
                                <span>🤖</span>
                                <span>WhatsApp Bot &amp; AI Vision FieldOps</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Complete field staff control — without any mobile app to install
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-8">
                                Field engineers, sales reps, and delivery agents simply interact with our official WhatsApp Bot. Our Gemini AI Vision checks photos for authenticity, verifies GPS geofencing, and eliminates fraudulent TA/DA travel claims.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                    <span className="text-2xl font-black text-emerald-600">94.2%</span>
                                    <p className="text-xs text-slate-900 font-bold mt-1">AI Vision Confidence</p>
                                    <p className="text-[10px] text-slate-500">Detects screen spoofing &amp; old photos</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                                    <span className="text-2xl font-black text-indigo-600">100%</span>
                                    <p className="text-xs text-slate-900 font-bold mt-1">Geofence Compliance</p>
                                    <p className="text-[10px] text-slate-500">Staff must be within 100m of client</p>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-600 font-bold">✓</span>
                                    <span>Tamper-proof watermarked photos (Live Date, Time, Lat/Long, Address)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-600 font-bold">✓</span>
                                    <span>Auto-calculated TA/DA travel claims based on verified Google Maps routes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-emerald-600 font-bold">✓</span>
                                    <span>Client digital signature or WhatsApp OTP upon task completion</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive FieldOps Radar Map Mockup (Deep Contrast Combination) */}
                        <div className="lg:col-span-6">
                            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
                                {/* Grid Radar Background */}
                                <div className="absolute inset-0 bg-[radial-gradient(#8b5cf620_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Live Field Operations Radar</h4>
                                            <p className="text-[10px] text-slate-400">NCR Region • 14 Active Field Personnel</p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                            GPS Tracking Live
                                        </span>
                                    </div>

                                    {/* Tech Card 1 */}
                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.08] mb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-violet-600/30 text-violet-300 font-bold text-xs flex items-center justify-center border border-violet-500/30">
                                                    RS
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Rajesh Sharma (Senior Tech)</p>
                                                    <p className="text-[10px] text-slate-400">At: Fortis Healthcare HVAC Unit #3</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                                                In Progress
                                            </span>
                                        </div>
                                        <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400">
                                            <span>📷 Live Photo Proof Uploaded</span>
                                            <span className="text-emerald-400 font-semibold">Gemini AI: 97% Verified</span>
                                        </div>
                                    </div>

                                    {/* Tech Card 2 */}
                                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/[0.08] mb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                                                    AK
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Anil Kumar (Delivery)</p>
                                                    <p className="text-[10px] text-slate-400">Sector 18 • 18 km traveled today</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                                Completed (8/8)
                                            </span>
                                        </div>
                                        <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400">
                                            <span>🚗 TA/DA Approved: ₹198.00</span>
                                            <span className="text-slate-300">OTP Signed by Customer</span>
                                        </div>
                                    </div>

                                    {/* Summary banner */}
                                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center">
                                        <p className="text-[11px] text-slate-300">
                                            📍 All field actions automatically update manager dashboard and customer notification via WhatsApp in real-time.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-13: HrAttendanceSection */}
                <AnimatedSection direction="up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1">
                            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xl shadow-slate-200/50">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">HR &amp; Biometric-Free Attendance</h4>
                                    <span className="text-xs text-indigo-600 font-bold">September 2026</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                                P
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">WhatsApp Selfie Punch</p>
                                                <p className="text-[10px] text-slate-500">Live GPS Location + Camera Timestamp</p>
                                            </div>
                                        </div>
                                        <span className="text-emerald-700 font-bold">09:02 AM</span>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                                                S
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">Shift &amp; Overtime Rules</p>
                                                <p className="text-[10px] text-slate-500">Day/Night rosters with grace periods</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-600 font-medium">Auto-Applied</span>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                                ₹
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">1-Click Salary Slip Generator</p>
                                                <p className="text-[10px] text-slate-500">Basic, HRA, PF, ESI &amp; TA/DA deductions</p>
                                            </div>
                                        </div>
                                        <span className="text-indigo-600 font-bold">WhatsApp PDF</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6 order-1 lg:order-2">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                                HRMS &amp; Payroll
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                                Throw away hardware biometric thumb scanners
                            </h2>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                                Biometric devices break, get dirty, and cannot track field or remote workers. With Nexus Billing, every employee punches in with a selfie and GPS location directly on WhatsApp.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-700 font-medium">
                                <li className="flex items-center gap-2.5">
                                    <span className="text-emerald-600 font-bold">✔</span>
                                    Zero expensive hardware to buy or maintain
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <span className="text-emerald-600 font-bold">✔</span>
                                    Shift rosters, late-marks, leaves &amp; half-day logic built in
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <span className="text-emerald-600 font-bold">✔</span>
                                    Automated salary slips dispatched to employee WhatsApp on payday
                                </li>
                            </ul>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-14: HotelPmsTeaser */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 border border-amber-200 p-8 sm:p-12 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-7">
                                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
                                    Hospitality Edition
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                                    Running a Hotel, Resort, or Guest House?
                                </h3>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                                    NexusBilling comes with integrated Hotel Property Management (PMS): live room occupancy calendar, guest ID scanning, check-in/out folios, housekeeping schedules, and restaurant KOT billing — all linked to GST.
                                </p>
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {['Room Availability Grid', 'Guest Check-In Folio', 'Restaurant Table POS', 'Housekeeping Live Status'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    href="/solutions/hotel"
                                    className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-bold text-sm"
                                >
                                    <span>Explore Hotel PMS Solution</span>
                                    <span>→</span>
                                </a>
                            </div>

                            <div className="lg:col-span-5">
                                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                    {[
                                        { room: '101 Deluxe', status: 'Occupied', color: 'text-rose-700 bg-rose-50 border-rose-200' },
                                        { room: '102 Deluxe', status: 'Available', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                                        { room: '103 Suite', status: 'Cleaning', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                                        { room: '201 Executive', status: 'Occupied', color: 'text-rose-700 bg-rose-50 border-rose-200' },
                                        { room: '202 Executive', status: 'Available', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                                        { room: '203 Penthouse', status: 'Occupied', color: 'text-rose-700 bg-rose-50 border-rose-200' },
                                    ].map((rm, idx) => (
                                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                                            <p className="text-xs font-bold text-slate-900">{rm.room}</p>
                                            <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-bold border ${rm.color}`}>
                                                {rm.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
