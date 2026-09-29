import { useState } from 'react';

interface MatrixRow {
    feature: string;
    starter: string | boolean;
    pro: string | boolean;
    enterprise: string | boolean;
}

interface MatrixGroup {
    category: string;
    rows: MatrixRow[];
}

const FEATURE_MATRIX: MatrixGroup[] = [
    {
        category: '🧾 GST & Core Invoicing',
        rows: [
            { feature: 'B2B, B2C, SEZ & Export Invoicing', starter: true, pro: true, enterprise: true },
            { feature: 'Govt NIC Direct E-Invoice IRN & Signed QR', starter: false, pro: true, enterprise: true },
            { feature: 'Auto E-Way Bill Generation (Part A & B)', starter: false, pro: true, enterprise: true },
            { feature: '8 Professional Invoice Templates (A4 & Thermal)', starter: '3 Templates', pro: 'All 8 Templates', enterprise: 'Custom Watermark' },
            { feature: 'Multi-Currency Foreign Invoicing with LUT', starter: false, pro: true, enterprise: true },
            { feature: 'Recurring Auto-Invoicing & Subscriptions', starter: false, pro: true, enterprise: true },
        ],
    },
    {
        category: '🛒 Retail Barcode POS & Cloud Engine',
        rows: [
            { feature: 'Keyboard-First POS (F1-F12 Shortcuts)', starter: true, pro: true, enterprise: true },
            { feature: '1D / 2D / GS1 Barcode Scanner Sync', starter: true, pro: true, enterprise: true },
            { feature: 'Real-Time Cloud POS (Instant Multi-Counter Sync)', starter: true, pro: true, enterprise: true },
            { feature: 'Weighing Scale RS-232 Auto-Tare & Sync', starter: false, pro: true, enterprise: true },
            { feature: 'Hold / Retrieve Unlimited Customer Carts', starter: 'Up to 3 Carts', pro: 'Unlimited', enterprise: 'Unlimited' },
            { feature: 'Dual Customer Display Screen Support', starter: false, pro: true, enterprise: true },
        ],
    },
    {
        category: '📦 Inventory & Godown Management',
        rows: [
            { feature: 'Warehouses / Godown Locations', starter: '1 Godown', pro: '3 Godowns', enterprise: 'Unlimited' },
            { feature: 'Batch Number & 45-Day Expiry Radar', starter: false, pro: true, enterprise: true },
            { feature: 'Serial Number / IMEI Tracker', starter: false, pro: true, enterprise: true },
            { feature: 'Inter-Godown Stock Transfer Note (STN)', starter: false, pro: true, enterprise: true },
            { feature: 'PO to GRN 3-Way Matching Flow', starter: false, pro: true, enterprise: true },
            { feature: 'Automated Low-Stock Vendor Reorder Alert', starter: true, pro: true, enterprise: true },
        ],
    },
    {
        category: '👥 HR, Attendance & Payroll',
        rows: [
            { feature: 'Staff User Accounts Included', starter: '3 Staff', pro: '10 Staff', enterprise: 'Unlimited' },
            { feature: 'Staff Web Portal Check-in', starter: true, pro: true, enterprise: true },
            { feature: 'WhatsApp Bot GPS Geo-Fence Selfie Punch', starter: false, pro: true, enterprise: true },
            { feature: 'Biometric LAN Fingerprint Device Webhook', starter: false, pro: true, enterprise: true },
            { feature: '1-Click Indian Statutory Payroll (PF, ESIC, PT)', starter: false, pro: true, enterprise: true },
            { feature: 'Automated WhatsApp PDF Payslip Dispatch', starter: false, pro: true, enterprise: true },
        ],
    },
    {
        category: '📍 FieldOps, TA/DA & Google Gemini AI',
        rows: [
            { feature: 'Field Sales & Engineer GPS Tracking', starter: false, pro: true, enterprise: true },
            { feature: 'Haversine GPS Travel Allowance (TA/DA)', starter: false, pro: true, enterprise: true },
            { feature: '6-Stage Service Ticket Dispatch with OTP', starter: false, pro: true, enterprise: true },
            { feature: 'Google Gemini 1.5 Vision AI Site Photo Audit', starter: false, pro: false, enterprise: true },
            { feature: 'Anti-Screen Spoof & Tamper Detection', starter: false, pro: false, enterprise: true },
        ],
    },
    {
        category: '🏨 Hotel PMS & Restaurant Table POS',
        rows: [
            { feature: 'Front Desk Room Status Grid & Folio', starter: false, pro: false, enterprise: true },
            { feature: 'Restaurant Floor Visualizer & Table Management', starter: false, pro: false, enterprise: true },
            { feature: 'Kitchen Order Ticket (KOT) Multi-Station Print', starter: false, pro: false, enterprise: true },
            { feature: 'Split Bill by Seat & Custom Modifiers', starter: false, pro: false, enterprise: true },
        ],
    },
    {
        category: '📊 Financial Ledgers & CA Reports',
        rows: [
            { feature: '360° Party Ledger & Debt Aging Analysis', starter: true, pro: true, enterprise: true },
            { feature: 'GSTR-1 & GSTR-3B JSON / Excel Generation', starter: true, pro: true, enterprise: true },
            { feature: 'GSTR-2B Auto-Reconciliation Engine', starter: false, pro: true, enterprise: true },
            { feature: 'PDC Cheque Registry & Bounce Notifications', starter: false, pro: true, enterprise: true },
            { feature: 'Project BOQ & Bill of Materials (BOM)', starter: false, pro: false, enterprise: true },
            { feature: '1-Click "CA Tax Audit Pack" (.ZIP Dump)', starter: false, pro: true, enterprise: true },
        ],
    },
    {
        category: '🔒 Security, API & SLA',
        rows: [
            { feature: 'Role-Based Access Control (50+ Toggles)', starter: 'Basic Roles', pro: 'Custom Roles', enterprise: 'Granular Matrix' },
            { feature: 'Security Audit Log Retention', starter: '7 Days', pro: '60 Days', enterprise: '180 Days' },
            { feature: 'Enterprise REST API Suite & Webhooks', starter: false, pro: false, enterprise: true },
            { feature: 'Support SLA', starter: 'Standard (Email)', pro: 'Priority WhatsApp', enterprise: 'Dedicated 15-Min' },
        ],
    },
];

export default function FeatureMatrixAndHardware() {
    const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

    const toggleGroup = (idx: number) => {
        setExpandedGroup(expandedGroup === idx ? null : idx);
    };

    return (
        <div className="py-16 space-y-24">
            {/* ========================================================= */}
            {/* SECTION 8: ComprehensiveFeatureMatrix                     */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>SIDE-BY-SIDE MATRIX</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Deep Feature Comparison Across All Tiers
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Every single feature explained with zero ambiguity. Compare Starter, Professional, and Enterprise plans.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                    {/* Matrix Sticky Header */}
                    <div className="grid grid-cols-12 bg-slate-900 text-white p-4 sm:p-6 font-bold text-xs sm:text-sm items-center">
                        <div className="col-span-6 sm:col-span-5 text-slate-300">Feature Capability</div>
                        <div className="col-span-2 text-center text-slate-200">Starter (₹999)</div>
                        <div className="col-span-2 text-center text-indigo-300 font-extrabold">Pro (₹1,999)</div>
                        <div className="col-span-2 sm:col-span-3 text-center text-emerald-400 font-extrabold">
                            Enterprise (₹3,999)
                        </div>
                    </div>

                    {/* Matrix Groups */}
                    <div className="divide-y divide-slate-200">
                        {FEATURE_MATRIX.map((grp, gIdx) => {
                            const isExpanded = expandedGroup === null || expandedGroup === gIdx;

                            return (
                                <div key={gIdx}>
                                    {/* Category Header Accordion Button */}
                                    <button
                                        type="button"
                                        onClick={() => toggleGroup(gIdx)}
                                        className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                                    >
                                        <span className="font-extrabold text-sm text-slate-800">{grp.category}</span>
                                        <span className="text-xs text-indigo-600 font-semibold">
                                            {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
                                        </span>
                                    </button>

                                    {/* Category Rows */}
                                    {isExpanded && (
                                        <div className="divide-y divide-slate-100 text-xs font-mono">
                                            {grp.rows.map((r, rIdx) => (
                                                <div
                                                    key={rIdx}
                                                    className="grid grid-cols-12 p-3.5 sm:p-4 items-center hover:bg-indigo-50/20 transition-colors"
                                                >
                                                    <div className="col-span-6 sm:col-span-5 font-sans font-medium text-slate-800">
                                                        {r.feature}
                                                    </div>

                                                    {/* Starter */}
                                                    <div className="col-span-2 text-center">
                                                        {typeof r.starter === 'boolean' ? (
                                                            r.starter ? (
                                                                <span className="text-emerald-600 font-bold text-base">✓</span>
                                                            ) : (
                                                                <span className="text-slate-300 font-bold text-sm">—</span>
                                                            )
                                                        ) : (
                                                            <span className="text-slate-700 font-medium text-[11px] font-sans">
                                                                {r.starter}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Pro */}
                                                    <div className="col-span-2 text-center bg-indigo-50/40 py-1 rounded-lg">
                                                        {typeof r.pro === 'boolean' ? (
                                                            r.pro ? (
                                                                <span className="text-indigo-600 font-bold text-base">✓</span>
                                                            ) : (
                                                                <span className="text-slate-300 font-bold text-sm">—</span>
                                                            )
                                                        ) : (
                                                            <span className="text-indigo-900 font-bold text-[11px] font-sans">
                                                                {r.pro}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Enterprise */}
                                                    <div className="col-span-2 sm:col-span-3 text-center">
                                                        {typeof r.enterprise === 'boolean' ? (
                                                            r.enterprise ? (
                                                                <span className="text-emerald-600 font-bold text-base">✓</span>
                                                            ) : (
                                                                <span className="text-slate-300 font-bold text-sm">—</span>
                                                            )
                                                        ) : (
                                                            <span className="text-emerald-700 font-bold text-[11px] font-sans">
                                                                {r.enterprise}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 9: HardwareBundlesSection                         */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                            <span>PLUG &amp; PLAY HARDWARE</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Tested Hardware Kits With 1-Year Onsite Replacement Warranty
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Bring your own hardware or order our pre-configured retail kits that work straight out of the box with zero drivers.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <span className="text-3xl mb-3 block">🏷️</span>
                                <h3 className="text-base font-bold text-slate-900">2D Barcode &amp; QR Scanner</h3>
                                <div className="mt-1 text-lg font-bold font-mono text-indigo-600">₹1,850</div>
                                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                    Ultra-fast CMOS sensor scans damaged barcodes, mobile screens, and QR codes from up to 30 cm distance. USB plug &amp; play.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-emerald-600">
                                ✓ 1-Year Onsite Replacement Warranty
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <span className="text-3xl mb-3 block">🖨️</span>
                                <h3 className="text-base font-bold text-slate-900">3-Inch (80mm) Thermal Receipt Printer</h3>
                                <div className="mt-1 text-lg font-bold font-mono text-indigo-600">₹4,450</div>
                                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                    High-speed 260mm/sec auto-cutter printer with USB, LAN &amp; Bluetooth. Supports your store logo and dynamic UPI payment QR.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-emerald-600">
                                ✓ Free 10 Thermal Paper Rolls Included
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <span className="text-3xl mb-3 block">📦</span>
                                <h3 className="text-base font-bold text-slate-900">Complete POS Counter Kit</h3>
                                <div className="mt-1 text-lg font-bold font-mono text-indigo-600">₹8,990</div>
                                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                                    Includes 3-inch thermal printer + 2D scanner + heavy-duty steel 4-bill cash drawer with automated RJ11 kick.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-medium text-emerald-600">
                                ✓ Ready to bill in 5 minutes
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 10: GstTaxCreditBanner                            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-indigo-900/40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                                <span>18% GST INPUT TAX CREDIT (ITC)</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Claim 18% GST Credit On Every Invoice
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Simply enter your registered company GSTIN at checkout. You will receive a GST Tax Invoice with SAC Code 998313,
                                enabling you to claim full 18% Input Tax Credit against your monthly output tax liability.
                            </p>
                        </div>
                        <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                            <span className="text-xs text-slate-300 uppercase block font-mono">Effective Monthly Cost (Post-ITC)</span>
                            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">₹846 / mo</div>
                            <div className="text-[11px] text-slate-400 mt-1">On ₹999 Starter Plan</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 11: NoHiddenFeesDeclaration                       */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
                            <span>ZERO HIDDEN FEES DECLARATION</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            6 Commitments To Complete Transparency
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">🚫 No Per-Invoice Charges</div>
                            <p className="text-slate-600 leading-relaxed">
                                Print or issue 100 bills or 100,000 bills — your subscription cost remains 100% constant.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">🚫 No E-Way Bill Tax</div>
                            <p className="text-slate-600 leading-relaxed">
                                Unlike other apps that charge ₹2 to ₹5 per e-Way Bill generated, Nexus includes unlimited generation.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">🚫 Free Lifetime Updates</div>
                            <p className="text-slate-600 leading-relaxed">
                                When GST rules or e-invoice thresholds change, updates are rolled out to the cloud instantly for free.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">🚫 Zero Setup &amp; Onboarding Fee</div>
                            <p className="text-slate-600 leading-relaxed">
                                We do not charge ₹5,000 or ₹10,000 for "installation assistance". Self-onboarding takes 3 minutes.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">🚫 Free Data Migration</div>
                            <p className="text-slate-600 leading-relaxed">
                                Our migration team converts your Tally or Vyapar Excel data into Nexus at zero charge.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                            <div className="font-bold text-slate-900 text-sm mb-1">🚫 No Cancellation Penalties</div>
                            <p className="text-slate-600 leading-relaxed">
                                Monthly plans can be stopped with 1 click. Your data remains downloadable in CSV/JSON forever.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
