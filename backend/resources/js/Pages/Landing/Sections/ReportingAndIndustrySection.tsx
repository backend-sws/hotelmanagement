import { useState } from 'react';
import AnimatedSection from '@/Components/Site/AnimatedSection';
import IndustryTab, { IndustryTabItem } from '@/Components/Site/IndustryTab';

export default function ReportingAndIndustrySection() {
    const [reportTab, setReportTab] = useState<'financial' | 'gst' | 'hr' | 'ops'>('financial');

    const industryTabs: IndustryTabItem[] = [
        {
            id: 'retail',
            label: '🛒 Retail & Supermarkets',
            content: (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="lg:col-span-6 space-y-4">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Solution for Retailers</span>
                        <h3 className="text-2xl font-black text-slate-900">Faster counter checkout &amp; zero stock mismatch</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Engineered for high footfall grocery stores, apparel boutiques, electronics outlets, and multi-counter supermarkets.
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700 font-medium">
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Barcode scan to bill under 4 seconds</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Instant real-time multi-counter cloud sync</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Thermal 58mm &amp; 80mm ESC/POS printer support</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Customer loyalty points &amp; WhatsApp bills</li>
                        </ul>
                        <a href="/solutions/retail" className="inline-block mt-2 text-indigo-600 font-bold text-xs hover:underline">
                            Explore Retail Solution →
                        </a>
                    </div>
                    <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200 text-slate-600 font-bold">
                            <span>Counter #1 — Active Cart</span>
                            <span className="text-emerald-700 font-mono">12 Items Scanned</span>
                        </div>
                        <div className="py-4 space-y-2 text-xs text-slate-800 font-medium">
                            <div className="flex justify-between"><span>Basmati Rice 5kg</span><span className="font-bold text-slate-900">₹480</span></div>
                            <div className="flex justify-between"><span>Fortune Sunlite 1L</span><span className="font-bold text-slate-900">₹165</span></div>
                            <div className="flex justify-between"><span>Aashirvaad Atta 10kg</span><span className="font-bold text-slate-900">₹410</span></div>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-xs text-slate-500 font-bold">Subtotal + GST (5%)</span>
                            <span className="text-lg font-black text-emerald-700">₹1,107.75</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'wholesale',
            label: '📦 Wholesale & Traders',
            content: (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="lg:col-span-6 space-y-4">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Solution for Wholesalers</span>
                        <h3 className="text-2xl font-black text-slate-900">B2B e-Invoicing, bulk e-Way bills &amp; credit ledger</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Built for distributors, FMCG super-stockists, hardware merchants, and grain traders who manage large volume credit accounts.
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700 font-medium">
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Instant Govt IRN &amp; signed QR generation</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Bulk e-Way bill generation in 1 click</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Party-wise credit limits &amp; outstanding payment aging</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> WhatsApp automated ledger statement dispatch</li>
                        </ul>
                        <a href="/solutions/wholesale" className="inline-block mt-2 text-indigo-600 font-bold text-xs hover:underline">
                            Explore Wholesale Solution →
                        </a>
                    </div>
                    <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200 text-slate-600 font-bold">
                            <span>Outstanding Khata Overview</span>
                            <span className="text-amber-700 font-mono">18 Pending Invoices</span>
                        </div>
                        <div className="py-4 space-y-2 text-xs text-slate-800">
                            <div className="flex justify-between font-medium"><span>Aggarwal Traders</span><span className="font-bold text-rose-600">₹1,45,000 (Overdue 14d)</span></div>
                            <div className="flex justify-between font-medium"><span>Krishna Agency</span><span className="font-bold text-slate-700">₹85,200 (Due Tomorrow)</span></div>
                            <div className="flex justify-between font-medium"><span>City Supermart</span><span className="font-bold text-emerald-700">₹2,10,000 (Paid UPI)</span></div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'hotel',
            label: '🏨 Hotels & Resorts',
            content: (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="lg:col-span-6 space-y-4">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Solution for Hospitality</span>
                        <h3 className="text-2xl font-black text-slate-900">PMS front desk, room folios &amp; restaurant POS</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Manage boutique hotels, luxury resorts, and service apartments with synchronized room check-ins and room service billing.
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700 font-medium">
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Real-time room rack status &amp; visual calendar</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Guest ID KYC upload &amp; police verification compliance</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Food &amp; Beverage charges linked to room folio bill</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> GST compliance for 12% &amp; 18% hotel tax brackets</li>
                        </ul>
                        <a href="/solutions/hotel" className="inline-block mt-2 text-amber-700 font-bold text-xs hover:underline">
                            Explore Hotel PMS →
                        </a>
                    </div>
                    <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-bold text-slate-900 mb-2">Guest Check-In Folio: Room 304</p>
                        <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                            <div className="flex justify-between"><span>Guest Name:</span><span className="font-bold text-slate-900">Amitav Sengupta</span></div>
                            <div className="flex justify-between"><span>Stay Duration:</span><span>3 Nights (18-21 Sep)</span></div>
                            <div className="flex justify-between"><span>Room Tariff (12% GST):</span><span>₹10,500</span></div>
                            <div className="flex justify-between"><span>Restaurant Dining (5% GST):</span><span>₹2,450</span></div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'services',
            label: '🔧 Field Services & Contractors',
            content: (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <div className="lg:col-span-6 space-y-4">
                        <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">Solution for Field Teams</span>
                        <h3 className="text-2xl font-black text-slate-900">AI work proof, geofenced visits &amp; auto TA/DA</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            For solar installers, HVAC maintenance, elevator servicing, pest control, and on-site repair contractors.
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700 font-medium">
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> GPS verified check-in at client site via WhatsApp</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Gemini AI verifies photo proof before work sign-off</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Automated daily kilometer &amp; travel allowance calculation</li>
                            <li className="flex items-center gap-2"><span className="text-emerald-600 font-bold">✔</span> Instant on-site invoice generation and WhatsApp delivery</li>
                        </ul>
                        <a href="/solutions/field-services" className="inline-block mt-2 text-violet-700 font-bold text-xs hover:underline">
                            Explore Field Services →
                        </a>
                    </div>
                    <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-xs font-bold text-emerald-700 mb-2">Service Ticket #SRV-882 Verified</p>
                        <p className="text-xs text-slate-900 font-bold">Solar Inverter 10kW Commissioning</p>
                        <p className="text-[11px] text-slate-500 mt-1">Client: Sunrise Solar Park • Staff: Dinesh V.</p>
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                            <span className="text-emerald-700 font-bold">✔ AI Photo Confidence 96.8%</span>
                            <span className="font-mono text-slate-700 font-bold">TA/DA: ₹240</span>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section className="py-24 relative bg-slate-50/70 border-t border-slate-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                {/* S-15: ReportingSuite */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Audit &amp; Intelligence
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            CA-Ready Financial &amp; Tax Reports in 1 Click
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Hand over complete, error-free spreadsheets to your Chartered Accountant without sleepless reconciliation nights.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
                        {/* Report Navigation Tabs */}
                        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100 mb-6">
                            {[
                                { id: 'financial', label: '📊 Financial Statements (P&L, Balance Sheet)' },
                                { id: 'gst', label: '🏛️ GST Returns (GSTR-1, 3B, ITC)' },
                                { id: 'hr', label: '👥 HR & Salary Registers' },
                                { id: 'ops', label: '📍 Field Operations Audit' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setReportTab(tab.id as any)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        reportTab === tab.id
                                            ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Report Preview */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                            {reportTab === 'financial' && (
                                <div className="space-y-2 text-slate-700">
                                    <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                                        <span>METRIC</span><span>VALUE (INR)</span>
                                    </div>
                                    <div className="flex justify-between"><span>Gross Revenue (Sales)</span><span className="text-emerald-700 font-bold">₹42,85,600.00</span></div>
                                    <div className="flex justify-between"><span>Cost of Goods Sold (COGS)</span><span className="text-rose-600 font-bold">₹27,10,400.00</span></div>
                                    <div className="flex justify-between font-bold text-slate-900"><span>Gross Profit Margin</span><span className="text-emerald-700 font-bold">36.75% (₹15,75,200)</span></div>
                                    <div className="flex justify-between"><span>Operating Expenses &amp; Payroll</span><span className="text-rose-600 font-bold">₹6,20,000.00</span></div>
                                    <div className="flex justify-between font-black text-indigo-700 border-t border-slate-200 pt-2">
                                        <span>Net Operating Profit</span><span>₹9,55,200.00</span>
                                    </div>
                                </div>
                            )}
                            {reportTab === 'gst' && (
                                <div className="space-y-2 text-slate-700">
                                    <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                                        <span>GST RETURN SUMMARY</span><span>STATUS</span>
                                    </div>
                                    <div className="flex justify-between"><span>GSTR-1 Outward Supplies</span><span className="text-emerald-700 font-bold">JSON Generated (Ready to Upload)</span></div>
                                    <div className="flex justify-between"><span>GSTR-3B Tax Summary</span><span className="text-emerald-700 font-bold">Total Tax: ₹3,14,500</span></div>
                                    <div className="flex justify-between"><span>Eligible Input Tax Credit (ITC)</span><span className="text-indigo-700 font-bold">₹1,98,200 (Auto-matched)</span></div>
                                    <div className="flex justify-between font-bold text-slate-900"><span>Net Cash GST Payable</span><span className="text-amber-700 font-bold">₹1,16,300.00</span></div>
                                </div>
                            )}
                            {reportTab === 'hr' && (
                                <div className="space-y-2 text-slate-700">
                                    <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                                        <span>PAYROLL REGISTER</span><span>28 EMPLOYEES</span>
                                    </div>
                                    <div className="flex justify-between"><span>Total Gross Salary</span><span>₹7,45,000.00</span></div>
                                    <div className="flex justify-between"><span>PF &amp; ESI Statutory Deductions</span><span>₹68,400.00</span></div>
                                    <div className="flex justify-between"><span>Verified TA/DA Travel Reimbursements</span><span className="text-emerald-700 font-bold">₹44,250.00</span></div>
                                    <div className="flex justify-between font-bold text-slate-900"><span>Net Bank Disbursement Total</span><span>₹7,20,850.00</span></div>
                                </div>
                            )}
                            {reportTab === 'ops' && (
                                <div className="space-y-2 text-slate-700">
                                    <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-900">
                                        <span>FIELDOPS AUDIT LOG</span><span>SEPTEMBER 2026</span>
                                    </div>
                                    <div className="flex justify-between"><span>Total Field Tasks Scheduled</span><span>482 Visits</span></div>
                                    <div className="flex justify-between"><span>AI Photo Authenticity Passed</span><span className="text-emerald-700 font-bold">476 (98.75%)</span></div>
                                    <div className="flex justify-between"><span>Spoof Attempts Flagged &amp; Blocked</span><span className="text-rose-600 font-bold">6 Instances Prevented</span></div>
                                    <div className="flex justify-between font-bold text-slate-900"><span>Total Kilometer Travel Validated</span><span>4,120 km</span></div>
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-16: IndustryTabSection */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Tailored For Your Sector
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Pre-configured workflows for your specific industry
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Select your business domain to see how NexusBilling fits your daily operation out-of-the-box.
                        </p>
                    </div>

                    <IndustryTab tabs={industryTabs} defaultTab="retail" />
                </AnimatedSection>

                {/* S-17: StatsBanner — Rich Deep Contrast Combination */}
                <AnimatedSection direction="up">
                    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 p-8 sm:p-12 shadow-2xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                            <div className="pt-4 sm:pt-0">
                                <span className="text-3xl sm:text-5xl font-black text-white">10,000+</span>
                                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">Businesses Onboarded</p>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <span className="text-3xl sm:text-5xl font-black text-emerald-400">₹500 Cr+</span>
                                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">Invoices Processed</p>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <span className="text-3xl sm:text-5xl font-black text-indigo-300">98.7%</span>
                                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">Customer Retention Rate</p>
                            </div>
                            <div className="pt-4 sm:pt-0">
                                <span className="text-3xl sm:text-5xl font-black text-amber-400">4.9 / 5</span>
                                <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">Average User Rating</p>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-18: IntegrationEcosystem */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
                            Seamless Connectors
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Works with the tools you already rely on
                        </h2>
                        <p className="mt-3 text-slate-600 text-base">
                            Connect your payment gateways, banks, government tax portals, and hardware without extra integration costs.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {[
                            { name: 'WhatsApp Cloud API', type: 'Messaging' },
                            { name: 'Govt NIC Portal', type: 'e-Invoicing' },
                            { name: 'Razorpay / UPI', type: 'Payments' },
                            { name: 'Paytm Business', type: 'Payments' },
                            { name: 'Tally Prime Import', type: 'Accounting' },
                            { name: 'ESC/POS Printers', type: 'Hardware' },
                        ].map((tool, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-white border border-slate-200 text-center hover:border-indigo-300 hover:shadow-md transition-all"
                            >
                                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                                    ⚡
                                </div>
                                <p className="text-xs font-bold text-slate-900">{tool.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{tool.type}</p>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
