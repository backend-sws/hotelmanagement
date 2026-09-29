import { useState } from 'react';
import { Link } from '@inertiajs/react';

interface Plan {
    id: number;
    name: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    features?: Record<string, any>;
}

interface PricingHeroAndCardsProps {
    plans?: Plan[];
    isAnnual: boolean;
    onToggleBilling: (isAnnual: boolean) => void;
}

export default function PricingHeroAndCards({
    plans = [],
    isAnnual,
    onToggleBilling,
}: PricingHeroAndCardsProps) {
    // Fallback plans if database plans are not loaded
    const defaultPlans = [
        {
            id: 1,
            name: 'Starter Plan',
            tagline: 'Ideal for Single Store & Independent Traders',
            price_monthly: 999,
            price_yearly: 9990,
            badge: null,
            features: [
                '1 Location / Storefront Branch',
                'Up to 3 Staff Cashier Accounts',
                'Unlimited GST & Non-GST Invoicing',
                'Superfast Keyboard-First Barcode POS',
                'Basic Inventory Tracking (Single Godown)',
                '1D/2D Barcode Scanning Support',
                'Email & WhatsApp Community Support',
            ],
            cta: 'Start 14-Day Free Trial',
            accent: 'border-slate-200 hover:border-slate-400',
        },
        {
            id: 2,
            name: 'Professional Plan',
            tagline: 'Best for Growing Retailers, Distributors & Agencies',
            price_monthly: 1999,
            price_yearly: 19990,
            badge: 'MOST POPULAR (78% BUSINESSES)',
            features: [
                'Up to 3 Locations / Regional Branches',
                'Up to 10 Staff & Role-Based Permissions',
                'Official WhatsApp PDF Invoicing & UPI Pay',
                'Govt NIC Direct E-Invoice IRN & QR',
                'Multi-Godown Inventory & Batch Expiry Radar',
                'Full Indian Statutory HR & Payroll Engine',
                'Staff Geo-Fence & WhatsApp Bot Attendance',
                'Automated 4-Stage Payment Recovery Sequence',
                'Dedicated Account Onboarding Specialist',
            ],
            cta: 'Start 14-Day Free Trial',
            accent: 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/30 scale-105 bg-white relative z-10',
        },
        {
            id: 3,
            name: 'Enterprise Plan',
            tagline: 'For Multi-Branch Chains, Hotels & High-Volume Operations',
            price_monthly: 3999,
            price_yearly: 39990,
            badge: 'ALL-INCLUSIVE POWERHOUSE',
            features: [
                'Unlimited Branches & Multi-GSTIN Entities',
                'Unlimited Staff Accounts & Audit Trail',
                'Full Hotel Property Management (Rooms & Folio)',
                'Restaurant POS with Kitchen Order Tickets (KOT)',
                'Project BOQ & Bill of Materials (BOM)',
                'Google Gemini 1.5 Vision AI Photo Verification',
                'Developer REST API Suite & Real-Time Webhooks',
                '180-Day Immutable Security Audit Trail',
                'Priority 15-Minute WhatsApp Support SLA',
            ],
            cta: 'Start 14-Day Free Trial',
            accent: 'border-slate-200 hover:border-slate-400',
        },
    ];

    const displayPlans = defaultPlans.map((dp) => {
        const found = plans.find((p) => p.id === dp.id);
        if (found) {
            return {
                ...dp,
                name: found.name || dp.name,
                price_monthly: Number(found.price_monthly) || dp.price_monthly,
                price_yearly: Number(found.price_yearly) || dp.price_yearly,
            };
        }
        return dp;
    });

    return (
        <>
            {/* ========================================================= */}
            {/* SECTION 1: PricingHero                                    */}
            {/* ========================================================= */}
            <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-[#fafafa] border-b border-slate-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-80 bg-gradient-to-r from-indigo-200/40 via-blue-200/30 to-emerald-200/30 blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Simple, Transparent SaaS Pricing — No Surprises</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
                        Predictable Pricing.{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600">
                            Zero Per-Invoice Penalties.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Unlike legacy desktop software that charges for AMC, upgrades, and per-bill sync, Nexus gives you
                        unlimited cloud billing, e-Invoicing, and inventory with zero hidden fees.
                    </p>

                    {/* ========================================================= */}
                    {/* SECTION 2: BillingCycleToggle                             */}
                    {/* ========================================================= */}
                    <div className="mt-10 inline-flex items-center gap-4 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-md">
                        <button
                            type="button"
                            onClick={() => onToggleBilling(false)}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                !isAnnual
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            Monthly Billing
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleBilling(true)}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                isAnnual
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <span>Annual Billing</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 uppercase tracking-wide">
                                2 Months Free (Save 20%)
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 3: PrimaryPricingCards                            */}
            {/* ========================================================= */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    {displayPlans.map((plan) => {
                        const monthlyEffective = isAnnual ? Math.round(plan.price_yearly / 12) : plan.price_monthly;
                        const billedTotal = isAnnual ? plan.price_yearly : plan.price_monthly;
                        const savings = plan.price_monthly * 12 - plan.price_yearly;

                        return (
                            <div
                                key={plan.id}
                                className={`rounded-3xl p-8 transition-all flex flex-col justify-between ${
                                    plan.badge
                                        ? 'bg-white border-2 border-indigo-600 shadow-2xl relative'
                                        : 'bg-white border border-slate-200 shadow-md hover:shadow-xl'
                                }`}
                            >
                                <div>
                                    {/* Top Badge */}
                                    {plan.badge && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[10px] font-extrabold tracking-wider shadow-md">
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                                            GST 18% Applicable
                                        </span>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 min-h-[32px]">{plan.tagline}</p>

                                    {/* Price Box */}
                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono">
                                                ₹{monthlyEffective.toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-slate-500 text-sm font-medium">/ month</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {isAnnual ? (
                                                <span className="text-emerald-700 font-semibold">
                                                    Billed annually at ₹{billedTotal.toLocaleString('en-IN')} (Saved ₹{savings.toLocaleString('en-IN')})
                                                </span>
                                            ) : (
                                                <span>Billed month-to-month, cancel anytime</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Feature Checklist */}
                                    <div className="mt-8 space-y-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Included In This Plan:
                                        </div>
                                        {plan.features.map((feat, fIdx) => (
                                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                                                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                                                <span className="leading-relaxed">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Action */}
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <Link
                                        href="/demo"
                                        className={`w-full block py-3.5 text-center rounded-2xl text-sm font-bold transition-all shadow-md ${
                                            plan.badge
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                                        }`}
                                    >
                                        {plan.cta} →
                                    </Link>
                                    <p className="text-[11px] text-center text-slate-400 mt-2">
                                        14 days free • No credit card required
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 4: TrustGuaranteeStrip                            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-xl">⚡</div>
                        <div className="font-bold text-xs text-slate-900">3-Minute Cloud Setup</div>
                        <div className="text-[10px] text-slate-500">Instant activation without local install</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xl">💳</div>
                        <div className="font-bold text-xs text-slate-900">Zero Credit Card Required</div>
                        <div className="text-[10px] text-slate-500">Test all features completely free for 14 days</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xl">🛡️</div>
                        <div className="font-bold text-xs text-slate-900">100% Money-Back Guarantee</div>
                        <div className="text-[10px] text-slate-500">30-day refund if not fully satisfied</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-xl">🔒</div>
                        <div className="font-bold text-xs text-slate-900">99.9% Uptime Guarantee</div>
                        <div className="text-[10px] text-slate-500">Backed by AWS India & automated backup</div>
                    </div>
                </div>
            </section>
        </>
    );
}
