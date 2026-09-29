import { useState } from 'react';
import { Link } from '@inertiajs/react';

const ADDONS = [
    {
        title: 'Additional Storefront / Branch GSTIN',
        price: '₹499 / mo',
        billing: 'Billed monthly or annually',
        desc: 'Expands your plan by +1 independent branch with separate invoice series, user logins, and isolated godown inventory.',
        badge: 'Multi-Branch',
    },
    {
        title: 'Additional 10 Staff User Accounts',
        price: '₹499 / mo',
        billing: 'Billed monthly or annually',
        desc: 'Add 10 more cashiers, delivery runners, warehouse loaders, or field technicians with granular role-based permissions.',
        badge: 'Scale Team',
    },
    {
        title: 'Official Meta WhatsApp API Message Credits',
        price: '₹0.18 / msg',
        billing: 'Zero markup pass-through',
        desc: '100% Meta direct pricing. No per-bill charge from Nexus. Top-up ₹500 or ₹2,000 anytime with automated low-balance alerts.',
        badge: 'Zero Markup',
    },
    {
        title: 'Dedicated CA Account Manager & GST Audit Support',
        price: '₹1,499 / mo',
        billing: 'Optional Concierge',
        desc: 'Senior GST specialist reviews your GSTR-1 and GSTR-3B filings each month to guarantee 100% statutory compliance.',
        badge: 'Peace of Mind',
    },
];

export default function PlanWizardAndRoi() {
    // Plan Wizard State
    const [wizardBiz, setWizardBiz] = useState<'retail' | 'wholesale' | 'hotel' | 'field' | 'mfg'>('retail');
    const [wizardBranches, setWizardBranches] = useState<number>(1);
    const [wizardAdvanced, setWizardAdvanced] = useState<boolean>(false);

    // TCO Calculator State
    const [numStaff, setNumStaff] = useState<number>(5);

    // Recommended plan logic
    const getRecommendation = () => {
        if (wizardBiz === 'hotel' || wizardBranches > 3 || wizardAdvanced) {
            return {
                plan: 'Enterprise Plan',
                price: '₹3,999 / mo',
                reason: 'Includes unlimited branches, hotel property management, KOT, and Gemini AI vision audit.',
                cta: 'Choose Enterprise Plan',
            };
        }
        if (wizardBranches > 1 || wizardBiz === 'wholesale' || wizardBiz === 'field') {
            return {
                plan: 'Professional Plan',
                price: '₹1,999 / mo',
                reason: 'Perfect for up to 3 branches, multi-godown stock, WhatsApp PDF dispatch, and HR payroll.',
                cta: 'Choose Professional Plan',
            };
        }
        return {
            plan: 'Starter Plan',
            price: '₹999 / mo',
            reason: 'Tailor-made for single store billing, barcode scanning POS, and basic customer khata ledger.',
            cta: 'Choose Starter Plan',
        };
    };

    const rec = getRecommendation();

    // TCO Calculations
    const tallyCostAnnual = 24000;
    const whatsappToolCost = 9600;
    const biometricHardware = 8500;
    const payrollSeparate = numStaff * 80 * 12;
    const legacyTotalAnnual = tallyCostAnnual + whatsappToolCost + biometricHardware + payrollSeparate;

    const nexusAnnual = 19990; // Professional annual
    const annualSavings = legacyTotalAnnual - nexusAnnual;

    return (
        <div className="py-16 space-y-24 bg-slate-50/60 border-y border-slate-200">
            {/* ========================================================= */}
            {/* SECTION 5: AddonCostBreakdown                             */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                        <span>TRANSPARENT ADD-ONS</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Grow Only When You Need. Transparent Add-on Pricing.
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Never get forced into a higher pricing tier just because you opened a second small warehouse or hired 2 more interns.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ADDONS.map((addon, idx) => (
                        <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                                    {addon.badge}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mt-3">{addon.title}</h3>
                                <div className="mt-2 text-2xl font-extrabold font-mono text-indigo-600">{addon.price}</div>
                                <div className="text-[11px] text-slate-400 font-medium">{addon.billing}</div>
                                <p className="mt-3 text-xs text-slate-600 leading-relaxed">{addon.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 6: PlanChooserWizard                              */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-md">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                            <span>INTERACTIVE PLAN WIZARD</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Find Your Exact Plan in 3 Easy Clicks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* 3 Questions */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Q1: Business Type */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    1. What type of business do you run?
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        { id: 'retail', label: '🛒 Retail Store / Kirana' },
                                        { id: 'wholesale', label: '📦 Wholesale / FMCG' },
                                        { id: 'hotel', label: '🏨 Hotel / Restaurant' },
                                        { id: 'field', label: '📍 Field Ops / Services' },
                                        { id: 'mfg', label: '🏭 Manufacturing' },
                                    ].map((b) => (
                                        <button
                                            key={b.id}
                                            type="button"
                                            onClick={() => setWizardBiz(b.id as any)}
                                            className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                                                wizardBiz === b.id
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Q2: Locations */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    2. How many branches or godowns do you operate?
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { val: 1, label: 'Single Branch' },
                                        { val: 3, label: '2 to 3 Branches' },
                                        { val: 5, label: '4+ Multi-City Branches' },
                                    ].map((loc) => (
                                        <button
                                            key={loc.val}
                                            type="button"
                                            onClick={() => setWizardBranches(loc.val)}
                                            className={`p-3 rounded-xl border text-xs text-center transition-all ${
                                                wizardBranches === loc.val
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {loc.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Q3: Advanced features */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    3. Do you need GPS Field Tracking, Gemini AI, or Hotel Room Folios?
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setWizardAdvanced(false)}
                                        className={`p-3 rounded-xl border text-xs text-center transition-all ${
                                            !wizardAdvanced
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        No, standard billing &amp; inventory only
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setWizardAdvanced(true)}
                                        className={`p-3 rounded-xl border text-xs text-center transition-all ${
                                            wizardAdvanced
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        Yes, need FieldOps GPS, AI &amp; Hotel PMS
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation Result Card */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl text-center">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                                WIZARD RECOMMENDATION
                            </span>
                            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
                                {rec.plan}
                            </div>
                            <div className="text-emerald-400 font-mono font-bold text-lg mt-1">
                                {rec.price}
                            </div>
                            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                                {rec.reason}
                            </p>

                            <div className="mt-6 pt-4 border-t border-slate-800">
                                <Link
                                    href="/demo"
                                    className="w-full block py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg"
                                >
                                    {rec.cta} →
                                </Link>
                                <div className="text-[10px] text-slate-400 mt-2">
                                    Instant 14-day trial • No commitment
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 7: TotalCostOfOwnershipCalculator                 */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
                    <div className="max-w-3xl mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-3">
                            <span>TOTAL COST OF OWNERSHIP (TCO)</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Replace 5 Fragmented Bills With One Unified Subscription
                        </h2>
                        <p className="mt-2 text-slate-300 text-sm sm:text-base">
                            See how much money you burn each year running desktop software with disjointed third-party plugins.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Interactive Staff Slider */}
                        <div className="lg:col-span-6 space-y-4">
                            <div className="flex justify-between text-xs font-semibold text-slate-300">
                                <span>Total Employees / Billing Counters:</span>
                                <span className="text-emerald-400 font-mono font-bold text-base">{numStaff} Staff Members</span>
                            </div>
                            <input
                                type="range"
                                min="2"
                                max="50"
                                value={numStaff}
                                onChange={(e) => setNumStaff(Number(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                            />

                            {/* Legacy Software breakdown items */}
                            <div className="space-y-2 text-xs font-mono pt-2">
                                <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <span className="text-slate-300">Desktop ERP License + Annual AMC:</span>
                                    <span className="text-rose-400 font-bold">₹{tallyCostAnnual.toLocaleString('en-IN')}/yr</span>
                                </div>
                                <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <span className="text-slate-300">Third-Party WhatsApp Notification Add-on:</span>
                                    <span className="text-rose-400 font-bold">₹{whatsappToolCost.toLocaleString('en-IN')}/yr</span>
                                </div>
                                <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <span className="text-slate-300">Biometric Attendance Machine &amp; AMC:</span>
                                    <span className="text-rose-400 font-bold">₹{biometricHardware.toLocaleString('en-IN')}/yr</span>
                                </div>
                                <div className="flex justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                                    <span className="text-slate-300">Separate HR/Payroll SaaS for {numStaff} Staff:</span>
                                    <span className="text-rose-400 font-bold">₹{payrollSeparate.toLocaleString('en-IN')}/yr</span>
                                </div>
                            </div>
                        </div>

                        {/* Net Savings Calculation Box */}
                        <div className="lg:col-span-6 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200 text-center">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Your Annual Net Savings
                            </div>
                            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 font-mono mt-2">
                                ₹{annualSavings.toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs text-slate-500 font-semibold mt-1">
                                Saved every single year with Nexus
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs font-mono">
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                                    <div className="text-[10px] uppercase text-rose-700">Legacy Cost</div>
                                    <div className="font-bold text-rose-800 mt-0.5">₹{legacyTotalAnnual.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                    <div className="text-[10px] uppercase text-emerald-700">Nexus Professional</div>
                                    <div className="font-bold text-emerald-800 mt-0.5">₹{nexusAnnual.toLocaleString('en-IN')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
