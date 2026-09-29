import { useState } from 'react';

const TRIAL_DAYS = [
    { day: 'Day 1', title: 'Zero Friction Setup', desc: 'Sign up with just your phone number. Upload item catalog or select default grocery/apparel masters.' },
    { day: 'Day 3', title: 'Connect WhatsApp & POS', desc: 'Plug in your barcode scanner and connect your official business WhatsApp number in 2 clicks.' },
    { day: 'Day 7', title: 'File First E-Invoices', desc: 'Generate Govt NIC e-invoices with QR codes and track automated payment recovery reminders.' },
    { day: 'Day 14', title: 'Permanent 1-Click Go-Live', desc: 'Select any plan to continue seamlessly. Zero data reset, zero downtime, zero re-entry.' },
];

export default function DiscountsAndPerks() {
    return (
        <div className="py-16 space-y-24 bg-slate-50/60 border-y border-slate-200">
            {/* ========================================================= */}
            {/* SECTION 12: StartupAndMsmeDiscount                        */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                                <span>STARTUP INDIA &amp; UDYAM MSME INITIATIVE</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                15% Additional Grant for DPIIT Startups &amp; MSME Enterprises
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                We are proud supporters of the Make in India initiative. If your business holds a valid MSME Udyam Registration
                                or DPIIT Startup Certificate, apply your registration number at checkout for an instant 15% discount for your first 12 months.
                            </p>
                        </div>
                        <div className="lg:col-span-4 bg-amber-50 p-6 rounded-2xl border border-amber-200 text-center">
                            <span className="text-xs font-bold text-amber-800 uppercase block">Special Coupon Code</span>
                            <div className="text-2xl font-extrabold font-mono text-amber-900 mt-1">MSME15</div>
                            <div className="text-[11px] text-amber-700 mt-1">Instant 15% off annual plans</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 13: AnnualBillingPerks                            */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
                        <span>ANNUAL PLAN EXCLUSIVES</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Why 84% Of Indian Businesses Choose Annual Billing
                    </h2>
                    <p className="mt-3 text-slate-600 text-base">
                        Get massive financial savings plus VIP white-glove onboarding benefits that accelerate your ROI from week one.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4">
                            🎁
                        </div>
                        <h3 className="text-base font-bold text-slate-900">2 Months 100% Free</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            Pay for 10 months and get full 12 months uninterrupted cloud access. You instantly pocket up to ₹8,000 in immediate cash savings.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-4">
                            👨‍🏫
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Dedicated 1-on-1 Staff Training</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            A dedicated customer success manager hosts 3 customized remote Google Meet sessions to train your billing clerks, cashiers, and accountant.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-4">
                            🎨
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Custom Invoice Design Service</h3>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                            Our design team customizes your A4 and thermal receipt template with your brand fonts, high-resolution logo watermark, and custom legal disclaimers.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 14: FreeTrialDetailedWalkthrough                  */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
                            <span>14-DAY RISK-FREE EVALUATION</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            What Happens During Your 14-Day Free Trial?
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Zero credit card needed. Full unrestricted enterprise access so you can test all features with your actual team before spending a single rupee.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRIAL_DAYS.map((td, idx) => (
                            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative">
                                <span className="font-mono text-xs font-bold text-indigo-600 uppercase block">{td.day}</span>
                                <h4 className="font-bold text-sm text-slate-900 mt-1">{td.title}</h4>
                                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{td.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 15: DataMigrationGuarantee                        */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                                <span>4-HOUR DATA MIGRATION SLA</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                                Switching From Tally, Busy or Vyapar? We Migrate Everything For Free.
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Don't let your old data hold you hostage. Export your item masters, customer contact lists, and opening balances to Excel;
                                our technical migration squad maps your columns and loads everything into Nexus in less than 4 business hours.
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex flex-wrap gap-2 justify-center">
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                                Tally 9 / Prime
                            </span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                                Busy Accounting
                            </span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                                Marg ERP
                            </span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                                Vyapar App
                            </span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                                Zoho Books
                            </span>
                            <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200">
                                Custom Excel / CSV
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECTION 16: PaymentMethodsAccepted                        */}
            {/* ========================================================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                    <div>
                        <div className="font-bold text-sm text-slate-900">Supported Payment Gateways &amp; Methods</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                            All transactions processed securely via Razorpay &amp; Cashfree with 256-bit encryption.
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-slate-700">
                        <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">UPI (PhonePe / GPay)</span>
                        <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">Netbanking (50+ Banks)</span>
                        <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">Credit / Debit Cards</span>
                        <span className="px-3 py-1 rounded-lg bg-white border border-slate-200">Corporate NEFT / RTGS</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
