import React, { useState } from 'react';
import { 
    Quote, 
    Star, 
    Building2, 
    TrendingUp, 
    Clock, 
    ShieldCheck, 
    HelpCircle, 
    Search, 
    Calculator, 
    ArrowRight, 
    CheckCircle2, 
    Sparkles, 
    MessageSquare, 
    PhoneCall, 
    ChevronDown, 
    ChevronUp,
    Check,
    Receipt,
    DollarSign,
    ShoppingBag
} from 'lucide-react';

export const RetailSocialProofAndClosing: React.FC = () => {
    // S-34: Retail FAQ state
    const [faqSearch, setFaqSearch] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: 'Does Nexus Retail POS require an active internet connection?',
            a: 'Yes, Nexus is an enterprise-grade 100% online cloud ERP. Because all store counters, inventory godowns, customer credit ledgers, and GST calculations remain synchronized in real time without version conflicts, a reliable internet or mobile hotspot connection is used. This enables store owners to view live sales and profits from anywhere on their phone.'
        },
        {
            q: 'Can I connect my existing weighing scale and thermal printer?',
            a: 'Absolutely. Nexus works with all standard ESC/POS USB, Bluetooth, and Ethernet thermal printers (TVS, Epson, NGX, Posiflex) and RS232 weighing scales (Essae, Phoenix, Eagle). No proprietary lock-in or special drivers required.'
        },
        {
            q: 'How does the apparel matrix handle different prices for different sizes?',
            a: 'With our 2D Matrix Master, you can assign unique MRPs, selling prices, and barcodes to each size and color permutation (for example, XXL can be priced at ₹1,099 while S, M, L are ₹999). Cashiers simply scan the apparel barcode tag, and the correct price registers instantly.'
        },
        {
            q: 'Can I restrict cashiers from seeing profit margins and cost prices?',
            a: 'Yes. Our Role-Based Access Control (RBAC) allows store owners to mask supplier costs, purchase prices, and daily store aggregate turnover from cashier screens. Cashiers can only view item names, selling prices, and apply pre-approved promotional discounts.'
        },
        {
            q: 'How does WhatsApp billing save paper roll costs?',
            a: 'Instead of printing long 80mm thermal slips for every small purchase, cashiers can enter customer mobile numbers to dispatch high-definition digital PDF receipts directly to their WhatsApp. At an average thermal roll cost of ₹0.40 to ₹0.60 per print, a busy store generating 4,000 monthly bills saves ₹2,000+ every month purely on paper.'
        },
        {
            q: 'Is GSTR-1 B2CS filing compliant with current GST portal rules?',
            a: 'Yes. Nexus aggregates all retail consumer invoices into state-wise and GST rate-wise summaries for GSTR-1 Table 7 (B2C Small). You can download ready-to-upload JSON files or direct Excel formats that match GSTN portal specifications exactly.'
        },
        {
            q: 'Can I manage multiple retail stores with centralized inventory?',
            a: 'Yes! You can manage 2 to 50+ retail branches from a single cloud dashboard. Enjoy centralized catalog additions, inter-branch stock transfers (IBT) with transit passes, and comparative store performance reports.'
        },
        {
            q: 'How quickly can we import our existing product inventory from Excel?',
            a: 'You can migrate your entire product catalog in less than 10 minutes. Use our pre-built Excel/CSV template to import barcodes, item names, HSN codes, GST rates, MRP, and current stock. Our support team is also available via WhatsApp to help you map your legacy data.'
        }
    ];

    const filteredFaqs = faqs.filter(f => 
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
        f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    // S-35: Retail ROI Calculator state
    const [monthlyBills, setMonthlyBills] = useState(4000);
    const [averageBillValue, setAverageBillValue] = useState(650);
    const [shrinkageEstimate, setShrinkageEstimate] = useState(1.5); // 1.5%

    const monthlyTurnover = monthlyBills * averageBillValue;
    const paperSavings = Math.round(monthlyBills * 0.45 * 0.70); // 70% customers opt for WhatsApp bill
    const shrinkageSavings = Math.round(monthlyTurnover * (shrinkageEstimate / 100) * 0.65); // 65% reduction in theft
    const laborHoursSaved = Math.round(monthlyBills * 0.015); // ~1 min saved per 4 bills
    const laborSavings = laborHoursSaved * 120; // ₹120/hr cashier wage
    const totalMonthlyRoi = paperSavings + shrinkageSavings + laborSavings;

    return (
        <div className="bg-white">
            {/* S-33: Verified Retailer Case Studies */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200">
                            VERIFIED RETAIL IMPACT
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Trusted by 10,000+ Indian Retail Counters
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            From neighborhood supermarkets to regional apparel chains, see how forward-thinking retail owners modernized their store operations with Nexus.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Case Study 1: Supermarket */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-emerald-600/30 mb-2" />
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                    "During Sunday peak hours, our checkout queue used to stretch across the aisles. With Nexus barcode scanner speed and RS232 weighing scale sync, our average checkout time dropped from 4 minutes to 42 seconds per cart."
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-900">Green Mart Supermarket</div>
                                        <div className="text-slate-500">5 Counters &bull; Pune, Maharashtra</div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                                        Supermarket
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <div className="text-slate-400 text-[10px]">Queue Time</div>
                                        <div className="font-bold text-emerald-700">-78% Faster</div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <div className="text-slate-400 text-[10px]">Shrinkage</div>
                                        <div className="font-bold text-emerald-700">Under 0.2%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 2: Apparel Boutique */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-indigo-600/30 mb-2" />
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                    "Managing 15 sizes and 6 colors across ethnic kurtis was an Excel nightmare. Nexus 2D matrix lets us inward 200 items in 3 minutes and print custom barcode stickers with our boutique brand logo."
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-900">Kavita Ethnic Boutiques</div>
                                        <div className="text-slate-500">3 Outlets &bull; Jaipur, Rajasthan</div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200">
                                        Apparel Chain
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <div className="text-slate-400 text-[10px]">Stock Audit</div>
                                        <div className="font-bold text-indigo-700">Saved 4 hrs/day</div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <div className="text-slate-400 text-[10px]">Barcode Sync</div>
                                        <div className="font-bold text-indigo-700">100% Automated</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Case Study 3: Pharmacy */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                                    ))}
                                </div>
                                <Quote className="w-8 h-8 text-rose-600/30 mb-2" />
                                <p className="text-sm text-slate-700 italic leading-relaxed">
                                    "Medicine expiry write-offs used to eat up over ₹2 Lakhs of our profits annually. With Nexus FEFO batch rotation and 45-day radar alerts, we return expiring stock to distributors well before cutoff dates."
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-xs">
                                        <div className="font-bold text-slate-900">Sanjivani Medicos 24/7</div>
                                        <div className="text-slate-500">Retail &amp; Chemist &bull; Indore, MP</div>
                                    </div>
                                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-200">
                                        Pharmacy
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <div className="text-slate-400 text-[10px]">Expiry Loss</div>
                                        <div className="font-bold text-rose-700">Saved ₹2.4L/yr</div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                        <div className="text-slate-400 text-[10px]">Schedule H Audit</div>
                                        <div className="font-bold text-rose-700">100% Compliant</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-35: Interactive Retail ROI Calculator */}
            <section className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100/80 rounded-full border border-purple-200">
                            RETAIL ROI CALCULATOR
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Calculate Your Monthly Store Cost Savings
                        </h2>
                        <p className="text-lg text-slate-600 mt-4">
                            See how much your store can save on thermal paper rolls, shrinkage theft prevention, and cashier checkout speed by switching to Nexus.
                        </p>
                    </div>

                    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Sliders Column */}
                            <div className="lg:col-span-6 space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-300 mb-2">
                                        <span>Monthly Retail Invoices Generated:</span>
                                        <span className="font-bold text-emerald-400 font-mono text-sm">{monthlyBills.toLocaleString('en-IN')} bills</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="1000"
                                        max="20000"
                                        step="500"
                                        value={monthlyBills}
                                        onChange={(e) => setMonthlyBills(Number(e.target.value))}
                                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>1,000 (Small Shop)</span>
                                        <span>20,000 (Busy Supermarket)</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-slate-300 mb-2">
                                        <span>Average Bill Value (ABV):</span>
                                        <span className="font-bold text-emerald-400 font-mono text-sm">₹{averageBillValue.toLocaleString('en-IN')}</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="200"
                                        max="3000"
                                        step="50"
                                        value={averageBillValue}
                                        onChange={(e) => setAverageBillValue(Number(e.target.value))}
                                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>₹200 (Convenience)</span>
                                        <span>₹3,000 (Apparel/Electronics)</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs text-slate-300 mb-2">
                                        <span>Estimated Store Shrinkage / Leakage Rate:</span>
                                        <span className="font-bold text-amber-400 font-mono text-sm">{shrinkageEstimate}% of Turnover</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="0.5"
                                        max="3.0"
                                        step="0.1"
                                        value={shrinkageEstimate}
                                        onChange={(e) => setShrinkageEstimate(Number(e.target.value))}
                                        className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>0.5% (Tightly Managed)</span>
                                        <span>3.0% (High Pilferage)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estimated ROI Card */}
                            <div className="lg:col-span-6 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
                                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                                    Projected Monthly Financial Return
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-700/60">
                                        <span className="text-slate-300">WhatsApp Paperless Roll Savings:</span>
                                        <span className="font-bold font-mono text-white text-sm">+ ₹{paperSavings.toLocaleString('en-IN')} / mo</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-slate-700/60">
                                        <span className="text-slate-300">Shrinkage &amp; Pilferage Prevention:</span>
                                        <span className="font-bold font-mono text-emerald-400 text-sm">+ ₹{shrinkageSavings.toLocaleString('en-IN')} / mo</span>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-b border-slate-700/60">
                                        <span className="text-slate-300">Cashier Speed &amp; Labor Hours Saved:</span>
                                        <span className="font-bold font-mono text-white text-sm">+ ₹{laborSavings.toLocaleString('en-IN')} / mo</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="bg-emerald-950/80 p-4 rounded-xl border border-emerald-500/50 flex items-center justify-between">
                                        <div>
                                            <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Total Monthly Benefit</div>
                                            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                                                ₹{totalMonthlyRoi.toLocaleString('en-IN')}
                                                <span className="text-xs font-normal text-emerald-300 ml-1">/ month</span>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-lg">
                                            18x ROI
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                                    Nexus subscription pays for itself within the first 48 hours of installation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* S-34: Retail-Specific FAQ Section */}
            <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 rounded-full border border-blue-200">
                            RETAILER FAQ
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                            Frequently Asked Questions by Store Owners
                        </h2>
                        <p className="text-base text-slate-600 mt-3">
                            Have questions about your specific counter setup? Everything you need to know about switching your store to Nexus.
                        </p>
                    </div>

                    {/* FAQ Search Bar */}
                    <div className="relative mb-8">
                        <input 
                            type="text"
                            placeholder="Search retail questions (e.g., cloud sync, weighing scale, apparel matrix, GST)..."
                            value={faqSearch}
                            onChange={(e) => setFaqSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                    </div>

                    {/* FAQ Accordions */}
                    <div className="space-y-4">
                        {filteredFaqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div 
                                    key={idx}
                                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                                    >
                                        <span className="font-bold text-slate-900 text-base">{faq.q}</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                                            isOpen ? 'bg-emerald-100 text-emerald-800 rotate-180' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {filteredFaqs.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                                <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <p className="text-sm font-bold text-slate-700">No matching questions found.</p>
                                <p className="text-xs text-slate-500 mt-1">Our retail engineers are available 24/7 on WhatsApp to answer your custom setup questions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* S-36: Retail Closing CTA Ribbon */}
            <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 rounded-full border border-amber-500/20">
                        GET STARTED TODAY
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
                        Transform Your Retail Counter in Under 10 Minutes
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-4">
                        Join 10,000+ Indian retailers who deliver 0.3s checkouts, zero shrinkage loss, and effortless GST filing with Nexus POS.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                        <a 
                            href="/demo"
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base rounded-2xl transition shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <span>Start 14-Day Free Trial</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a 
                            href="https://wa.me/917479499718?text=Hi%20Nexus%20Team,%20I%20want%20a%20live%20demo%20of%20Nexus%20Retail%20POS%20for%20my%20store"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-base rounded-2xl transition border border-slate-700 flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-5 h-5 text-emerald-400" />
                            <span>WhatsApp Sales Team</span>
                        </a>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>No Credit Card Required</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Free Hardware Setup Assistance</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Cancel Anytime with 1-Click Excel Export</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
