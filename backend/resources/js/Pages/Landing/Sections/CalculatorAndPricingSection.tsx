import { useState } from 'react';
import AnimatedSection from '@/Components/Site/AnimatedSection';
import PricingCard from '@/Components/Site/PricingCard';

interface Plan {
    id: number;
    name: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    features?: string[];
}

export default function CalculatorAndPricingSection({ plans = [] }: { plans?: Plan[] }) {
    const [invoicesPerMonth, setInvoicesPerMonth] = useState<number>(450);
    const [billingStaff, setBillingStaff] = useState<number>(3);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const hoursSavedPerMonth = Math.round((invoicesPerMonth * 7.25) / 60);
    const annualSavings = Math.round((hoursSavedPerMonth * 350 * 12) + (billingStaff * 18000));
    const productivityJump = Math.min(85, Math.round(35 + (invoicesPerMonth / 100) * 3));

    const displayPlans: Plan[] = plans && plans.length > 0 ? plans : [
        {
            id: 1,
            name: 'Starter Business',
            description: 'Perfect for retail shops, single-outlet traders, and small workshops.',
            price_monthly: 999,
            price_yearly: 9990,
            features: [
                'Up to 1,000 Invoices / mo',
                'GST e-Invoice & e-Way Bill',
                'Barcode POS & Thermal Print',
                'Single Godown Inventory',
                'WhatsApp Invoice PDF Sharing',
                'Email & Chat Support',
            ],
        },
        {
            id: 2,
            name: 'Growth Pro',
            description: 'For growing businesses with multiple godowns and field staff.',
            price_monthly: 1999,
            price_yearly: 19990,
            features: [
                'Unlimited GST Invoices & Bills',
                'Official WhatsApp Cloud API Bot',
                'GPS FieldOps & AI Vision Punch',
                'Multi-Godown Stock Transfer',
                'Batch & Expiry Date Management',
                'HR Attendance & Salary Slips',
                'Priority WhatsApp Phone Support',
            ],
        },
        {
            id: 3,
            name: 'Enterprise Scale',
            description: 'For large distributors, chains, hotel properties, and multi-branch companies.',
            price_monthly: 3999,
            price_yearly: 39990,
            features: [
                'All Growth Features Included',
                'Multi-Branch Multi-GSTIN Support',
                'Hotel Property Management (PMS)',
                'Dedicated Account Manager',
                'Custom API & Webhook Access',
                'Automated Data Migration Assistance',
                '99.99% Enterprise SLA Guarantee',
            ],
        },
    ];

    return (
        <section className="py-24 relative bg-white overflow-hidden">
            {/* Ambient Lights */}
            <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[180px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 relative z-10">
                {/* S-19: SecurityTrustSection */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Bank-Grade Protection
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Your financial records are 100% private &amp; secured
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Built from day one with enterprise encryption, strict data isolation, and Indian data residency compliance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🔐',
                                title: 'AES-256 & TLS 1.3 Encryption',
                                desc: 'All data is encrypted in transit and at rest using the highest banking standards.',
                            },
                            {
                                icon: '🇮🇳',
                                title: 'Data Hosted In India',
                                desc: 'Strict compliance with Indian data sovereignty laws. Servers in Mumbai & Hyderabad.',
                            },
                            {
                                icon: '🔄',
                                title: 'Automated Daily Backups',
                                desc: 'Geo-redundant automated snapshots with 30-day point-in-time recovery protection.',
                            },
                            {
                                icon: '👤',
                                title: 'Role-Based Access Control',
                                desc: 'Granular permissions: billers see billing only, CA sees reports, technicians see assigned tasks.',
                            },
                            {
                                icon: '🛡️',
                                title: 'Two-Factor Authentication (2FA)',
                                desc: 'Secure staff and owner login via time-based OTP or WhatsApp authentication code.',
                            },
                            {
                                icon: '📜',
                                title: 'Audit Trail & Activity Logs',
                                desc: 'Immutable log of every invoice created, edited, canceled, or stock adjustment made.',
                            },
                        ].map((sec, idx) => (
                            <div
                                key={idx}
                                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
                            >
                                <span className="text-2xl">{sec.icon}</span>
                                <h3 className="text-base font-bold text-slate-900 mt-3 mb-2">{sec.title}</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">{sec.desc}</p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* S-20: RoiCalculator */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                                Dynamic ROI Calculator
                            </span>
                            <h2 className="text-3xl font-black text-slate-900">
                                Calculate your monthly savings with NexusBilling
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 mt-2">
                                Adjust the sliders below to see your estimated return on investment in hours and rupees.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Sliders Left */}
                            <div className="lg:col-span-6 space-y-8">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold text-slate-800">
                                            Invoices created per month
                                        </label>
                                        <span className="text-xl font-black text-indigo-600 font-mono">
                                            {invoicesPerMonth.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="3000"
                                        step="50"
                                        value={invoicesPerMonth}
                                        onChange={(e) => setInvoicesPerMonth(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                                        <span>50</span>
                                        <span>1,500</span>
                                        <span>3,000+</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold text-slate-800">
                                            Total billing &amp; field staff
                                        </label>
                                        <span className="text-xl font-black text-emerald-600 font-mono">
                                            {billingStaff} team members
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="25"
                                        step="1"
                                        value={billingStaff}
                                        onChange={(e) => setBillingStaff(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                                        <span>1</span>
                                        <span>12</span>
                                        <span>25</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                                    ℹ️ Calculation assumes an industry average of 8 minutes per manual invoice vs under 45 seconds on NexusBilling, plus fraud-free verified travel claims.
                                </div>
                            </div>

                            {/* Results Right — Deep Contrast Card Combination */}
                            <div className="lg:col-span-6">
                                <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-slate-800 text-center space-y-6 shadow-2xl">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-slate-300">Estimated Annual Business Savings</p>
                                        <p className="text-4xl sm:text-5xl font-black text-emerald-400 mt-2 font-mono">
                                            ₹{annualSavings.toLocaleString('en-IN')}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                        <div className="p-3.5 rounded-xl bg-white/[0.05]">
                                            <p className="text-xs text-slate-400 font-medium">Hours Saved / Month</p>
                                            <p className="text-2xl font-black text-white mt-1">{hoursSavedPerMonth} hrs</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-white/[0.05]">
                                            <p className="text-xs text-slate-400 font-medium">Productivity Boost</p>
                                            <p className="text-2xl font-black text-indigo-300 mt-1">+{productivityJump}%</p>
                                        </div>
                                    </div>

                                    <a
                                        href="/register"
                                        className="block w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 transition-all"
                                    >
                                        Start Realizing These Savings Today →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-21: PricingPreview */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Transparent Pricing
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Simple, predictable plans for every stage
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            No hidden setup fees. No long-term lock-in. Switch or cancel anytime with 1 click.
                        </p>

                        {/* Billing Cycle Toggle */}
                        <div className="inline-flex items-center gap-2 mt-8 p-1.5 rounded-full bg-slate-100 border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                                    billingCycle === 'monthly'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Monthly Billing
                            </button>
                            <button
                                type="button"
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    billingCycle === 'yearly'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <span>Annual Billing</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                                    Save 2 Months Free
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-8">
                        {displayPlans.map((plan, idx) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                isPopular={idx === 1}
                                billingCycle={billingCycle}
                            />
                        ))}
                    </div>

                    <div className="text-center">
                        <a href="/pricing" className="text-sm font-bold text-indigo-600 hover:underline">
                            View full detailed feature-by-feature matrix &amp; add-ons →
                        </a>
                    </div>
                </AnimatedSection>

                {/* S-22: FreeTrialCTA */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 p-8 sm:p-12 shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden">
                        <div className="max-w-3xl space-y-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                                Instant Access
                            </span>
                            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                                Start your free 14-day trial — no credit card needed
                            </h3>
                            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                                Get complete unrestricted access to GST billing, WhatsApp bot, POS, inventory, and HR attendance. Setup takes less than 3 minutes.
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <a
                                    href="/register"
                                    className="px-8 py-4 rounded-xl bg-white text-indigo-900 font-black text-sm shadow-xl hover:bg-slate-100 transition-all hover:scale-105"
                                >
                                    Create Free Account Now →
                                </a>
                                <span className="text-xs text-indigo-100 font-medium">
                                    ✓ All features included • ✓ Free data migration assistance
                                </span>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
