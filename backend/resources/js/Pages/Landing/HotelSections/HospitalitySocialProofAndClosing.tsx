import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function HospitalitySocialProofAndClosing() {
    // S-35 State: Interactive Restaurant ROI & Table Turn Calculator
    const [dailyTablesServed, setDailyTablesServed] = useState(80);
    const [avgCheckSize, setAvgCheckSize] = useState(1200);

    // Faster table turns (+15% more tables per shift) + 4% food cost savings from recipe BOM
    const additionalTablesDaily = Math.round(dailyTablesServed * 0.15);
    const extraDailyRevenue = additionalTablesDaily * avgCheckSize;
    const monthlyExtraRevenue = extraDailyRevenue * 30;
    const monthlyFoodTheftSaved = Math.round((dailyTablesServed * avgCheckSize * 30) * 0.04);
    const totalMonthlyProfitBoost = Math.round((monthlyExtraRevenue * 0.35) + monthlyFoodTheftSaved); // ~35% restaurant gross margin

    // S-34 State: FAQ Search
    const [faqSearch, setFaqSearch] = useState('');

    const faqs = [
        {
            q: 'Does Nexus Hotel & Restaurant ERP work 100% online in the cloud?',
            a: 'Yes, absolutely. Nexus is a pure cloud-native hospitality platform hosted on AWS Mumbai with 99.99% uptime. This ensures that waiter tablet apps, kitchen display systems (KDS), room service folios, and reception front-desk computers are always in 100% real-time synchronization with zero delay.'
        },
        {
            q: 'Can room service food orders be directly added to the guest room folio?',
            a: 'Yes. When room service takes an in-room dining order, the captain enters the guest Room Number. The food charge is automatically posted to that guest active folio. At checkout, the front desk prints one consolidated GST invoice combining room stay, F&B, laundry, and minibar charges.'
        },
        {
            q: 'How does multi-kitchen KOT printing work if we have separate Tandoor and Bar counters?',
            a: 'Nexus features intelligent category-based KOT routing. When an order contains tandoori starters, curries, and mocktails, the system prints separate KOT slips on the Tandoor thermal printer, Main Kitchen printer, and Bar counter printer simultaneously in under 0.3 seconds.'
        },
        {
            q: 'Can Nexus auto-accept orders from Swiggy and Zomato?',
            a: 'Yes. Nexus integrates directly with food delivery aggregators. Online orders land into your central POS screen, auto-accept based on your configured kitchen prep capacity, and print directly on the kitchen KOT printer without needing multiple tablets.'
        },
        {
            q: 'How does the recipe BOM feature stop kitchen food theft?',
            a: 'You can define standard recipe ingredient quantities (e.g. 1 Paneer Tikka = 200g Paneer, 40g Capsicum, 30g Curd). Every billed KOT automatically decrements the raw materials from your warehouse inventory. Comparing theoretical stock with physical stock immediately isolates theft or excess portioning.'
        },
        {
            q: 'Does Nexus support State Liquor Excise registers for bars and pubs?',
            a: 'Yes. Selling 30ml or 60ml pegs automatically calculates consumption against 750ml or 1000ml sealed bottle master inventory. Daily State Excise Form registers are generated automatically, eliminating manual register book maintenance.'
        },
        {
            q: 'What is the GST rate for standalone restaurants vs hotel dining?',
            a: 'Standalone restaurants in India are taxed at 5% GST without Input Tax Credit (ITC). Restaurants located inside luxury hotels with room tariff > ₹7,500 are taxed at 18% GST with full ITC benefits. Nexus supports both configurations with 1-click tax mode selection.'
        },
        {
            q: 'Can guests view the digital menu and place orders from their phones?',
            a: 'Yes. You can place QR code stands on each table. Guests scan the QR to browse rich photo menus, check chef recommendations, and place orders directly. Orders reflect immediately on the captain app and kitchen KOT printer.'
        }
    ];

    const filteredFaqs = faqs.filter(f => 
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
        f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    return (
        <>
            {/* ========================================================================= */}
            {/* S-33: Verified Hospitality Customer Case Studies                          */}
            {/* ========================================================================= */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
                            Proven Hospitality ROI
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Loved by Leading Indian Hotels &amp; Restaurants
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-2">
                            Discover how heritage resorts, multi-outlet dining chains, and cafes eliminated order delays and maximized occupancy with Nexus.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Case Study 1: Heritage Resort */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                                        Heritage Resort
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">Jaipur, Rajasthan</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">
                                    Royal Orchid Heritage Palace
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    48 luxury rooms, 2 royal dining halls, and banquet lawns operating seamlessly on a single unified cloud folio.
                                </p>

                                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-amber-600">30 Sec</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Guest Check-In Speed</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-emerald-600">Zero</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Folio Checkout Disputes</p>
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
                                "Combining room stay, laundry, and restaurant dining on a single WhatsApp GST invoice reduced our front desk checkout queues completely."
                            </blockquote>
                        </div>

                        {/* Case Study 2: Fine Dining Chain */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                                        Fine Dining Chain
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">Pune, Maharashtra</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">
                                    Sigree Charcoal &amp; Bar
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    4 busy restaurant outlets turning tables 18 minutes faster during dinner rushes using steward captain tablets.
                                </p>

                                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-orange-600">+22%</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Daily Table Turns</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-emerald-600">-6.5%</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Food Cost Variance</p>
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
                                "Multi-kitchen KOT routing and automatic recipe BOM deductions gave us full control over our raw ingredient margins."
                            </blockquote>
                        </div>

                        {/* Case Study 3: High-Volume QSR Cafe */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                        QSR Cafe Chain
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">Connaught Place, Delhi</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900">
                                    Chai &amp; Bun Maska Express
                                </h3>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                    Serving 1,800 daily orders with token number displays and automated Swiggy/Zomato central order dispatch.
                                </p>

                                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-blue-600">0.3 Sec</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Counter Token Billing</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xl font-black text-emerald-600">100%</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Zomato Sync Uptime</p>
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-xs text-slate-500 italic pt-4 border-t border-slate-100">
                                "The token screen display and automated Swiggy rider handover eliminated counter crowding and rider arguments completely."
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-35: Interactive Restaurant ROI & Table Turn Boost Calculator            */}
            {/* ========================================================================= */}
            <section id="hospitality-roi" className="py-20 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-12 border border-slate-800 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                            
                            {/* Sliders */}
                            <div className="lg:col-span-6">
                                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                                    Hospitality Profit Simulator
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                                    Calculate Your Monthly Bottom-Line Growth
                                </h3>
                                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                                    See how turning tables 15% faster and curbing raw ingredient kitchen wastage with recipe BOMs unlocks substantial monthly profit.
                                </p>

                                <div className="space-y-6 mt-8">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-300">Daily Dining Tables Served:</span>
                                            <span className="text-amber-400 text-sm">{dailyTablesServed} Tables / Day</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="20"
                                            max="300"
                                            step="5"
                                            value={dailyTablesServed}
                                            onChange={(e) => setDailyTablesServed(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>20 Tables</span>
                                            <span>150 Tables</span>
                                            <span>300 Tables</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="text-slate-300">Average Bill Size per Table:</span>
                                            <span className="text-emerald-400 text-sm">₹{avgCheckSize}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="300"
                                            max="4000"
                                            step="100"
                                            value={avgCheckSize}
                                            onChange={(e) => setAvgCheckSize(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                            <span>₹300 (Cafe)</span>
                                            <span>₹1,500 (Dine-In)</span>
                                            <span>₹4,000 (Fine Dining)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ROI Outputs */}
                            <div className="lg:col-span-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Estimated Monthly Profit Addition</p>
                                
                                <div className="mt-4">
                                    <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                                        +₹{totalMonthlyProfitBoost.toLocaleString('en-IN')} / month
                                    </p>
                                    <p className="text-xs text-slate-300 mt-1">
                                        Net extra profit from faster table turnarounds and zero recipe theft
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-slate-400">Extra Tables Served</p>
                                        <p className="text-xl font-bold text-white mt-0.5">+{additionalTablesDaily} Tables / Day</p>
                                        <p className="text-[10px] text-slate-400">via Captain Mobile POS</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Food Pilferage Saved</p>
                                        <p className="text-xl font-bold text-white mt-0.5">₹{monthlyFoodTheftSaved.toLocaleString('en-IN')}</p>
                                        <p className="text-[10px] text-slate-400">4% raw margin recovered</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <Link
                                        href="/demo"
                                        className="w-full block text-center py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 transition-all"
                                    >
                                        Deploy Nexus in Your Property &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-34: Hospitality FAQ Section with Live Search                            */}
            {/* ========================================================================= */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200/60">
                            Got Questions?
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                            Frequently Asked Questions by Hoteliers &amp; Restaurateurs
                        </h2>
                        
                        {/* Search Box */}
                        <div className="mt-6 max-w-md mx-auto">
                            <input
                                type="text"
                                value={faqSearch}
                                onChange={(e) => setFaqSearch(e.target.value)}
                                placeholder="Search room folios, KOT printers, GST 5% vs 18%..."
                                className="w-full px-4 py-2.5 rounded-full border border-slate-300 text-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none shadow-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredFaqs.map((faq, idx) => (
                            <details key={idx} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                                <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-sm sm:text-base select-none">
                                    <span>{faq.q}</span>
                                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 group-open:rotate-180 transition-transform shrink-0 ml-2">
                                        ▼
                                    </span>
                                </summary>
                                <p className="text-slate-600 text-xs sm:text-sm mt-3 pt-3 border-t border-slate-100 leading-relaxed font-normal">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* S-36: Hospitality Closing CTA Ribbon & S-37: Trust Badges Strip           */}
            {/* ========================================================================= */}
            <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-800 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-100 text-xs font-bold border border-white/20 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        14-Day Free Access • Zero Credit Card Required
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
                        Upgrade Your Hotel &amp; Restaurant Operations Today
                    </h2>
                    <p className="text-amber-100 text-sm sm:text-lg max-w-2xl mx-auto mb-8 font-normal">
                        Join 4,000+ Indian resorts, fine-dining restaurants, and cloud kitchens running on India's #1 Cloud Hospitality OS.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/demo"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-amber-900 hover:bg-amber-50 font-black text-sm shadow-xl shadow-amber-950/20 transition-all hover:scale-105"
                        >
                            Start Free 14-Day Trial &rarr;
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-700/60 hover:bg-amber-700 border border-white/20 text-white font-bold text-sm transition-all"
                        >
                            Schedule 1-on-1 Architecture Call
                        </Link>
                    </div>

                    {/* S-37: Trust Badges Strip */}
                    <p className="text-[11px] text-amber-200 mt-6 font-medium">
                        ✓ 100% Real-Time Cloud Sync • ✓ Direct Swiggy/Zomato Integration • ✓ FSSAI &amp; GST Ready • ✓ Free Menu &amp; Guest Data Migration
                    </p>
                </div>
            </section>
        </>
    );
}
