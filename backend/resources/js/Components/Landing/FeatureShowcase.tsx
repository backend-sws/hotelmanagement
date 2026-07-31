import { useIntersectionObserver } from './useIntersectionObserver';

const showcaseFeatures = [
    {
        id: "gst-billing",
        tag: "Invoicing Engine",
        title: "Mathematically Perfect GST Billing.",
        desc: "Stop worrying about tax calculations. Generate flawless, 100% GST-compliant invoices in under 10 seconds. We support thermal printers, A4 PDF generation, and direct WhatsApp sharing.",
        points: ["Auto-calculates CGST/SGST/IGST", "Multi-tax support within the same invoice", "Customizable thermal and A4 print templates", "1-click WhatsApp PDF sharing"],
        imgGradient: "from-blue-600 to-indigo-600",
        reverse: false
    },
    {
        id: "unified-ledger",
        tag: "Accounts & Collections",
        title: "Unified Ledger & Real-time Outstanding.",
        desc: "Experience total financial clarity. Our unified ledger tracks every debit and credit for your customers and suppliers. Never miss a payment with automated outstanding alerts.",
        points: ["Live customer & supplier balances", "Automated payment reminders", "Debit Notes & Credit Notes", "Comprehensive transaction history"],
        imgGradient: "from-emerald-600 to-teal-600",
        reverse: true
    },
    {
        id: "inventory",
        tag: "Inventory Control",
        title: "Multi-Godown Stock Management.",
        desc: "From the front desk to the back warehouse, track every single item. Transfer stock between godowns seamlessly and receive instant alerts when items fall below minimum levels.",
        points: ["Multi-location godown support", "Batch-wise tracking & expiry alerts", "Inter-godown stock transfers", "Real-time stock valuation"],
        imgGradient: "from-orange-500 to-red-500",
        reverse: false
    },
    {
        id: "payroll",
        tag: "HR & Payroll",
        title: "Automated Staff Management.",
        desc: "Ditch the spreadsheets. Track daily attendance, manage salary advances, calculate commissions on sales, and generate complete payroll reports automatically at the end of the month.",
        points: ["Biometric-ready attendance tracking", "Staff sales performance & commissions", "Salary advances & deductions", "Automated payslip generation"],
        imgGradient: "from-purple-600 to-pink-600",
        reverse: true
    },
    {
        id: "accounting",
        tag: "Financial Accounting",
        title: "Enterprise-Grade Accounting.",
        desc: "Your entire financial ecosystem in one place. Record daily expenses, manage purchase bills, track Input Tax Credit (ITC), and monitor cash and bank registers effortlessly.",
        points: ["Daily Cash Book & Bank Book", "Cheque Register & PDC management", "Expense tracking & categorization", "Purchase Bills & ITC tracking"],
        imgGradient: "from-cyan-600 to-blue-600",
        reverse: false
    },
    {
        id: "analytics",
        tag: "Analytics & Reports",
        title: "Data-Driven Decisions.",
        desc: "Access stunning, interactive dashboards that give you a bird's-eye view of your retail empire. Understand your profits, top-selling products, and staff performance at a glance.",
        points: ["Live Profit & Loss reporting", "Top-selling products analytics", "Staff performance leaderboards", "Exportable Excel/PDF reports"],
        imgGradient: "from-amber-500 to-orange-600",
        reverse: true
    },
    {
        id: "partner-program",
        tag: "Affiliate & Reseller",
        title: "Build Your Own CRM Empire.",
        desc: "Join our Partner Program and earn recurring commissions. We give you a dedicated superadmin dashboard to onboard your own clients, set your own pricing margins, and track leads.",
        points: ["Dedicated Partner Portal", "White-label potential", "Recurring revenue streams", "Automated lead tracking"],
        imgGradient: "from-pink-500 to-rose-600",
        reverse: false
    }
];

export default function FeatureShowcase() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                
                {showcaseFeatures.map((feature, idx) => {
                    const { ref, isVisible } = useIntersectionObserver({ threshold: 0.2 });
                    
                    return (
                        <div 
                            key={feature.id}
                            ref={ref}
                            className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20 transition-all duration-1000 transform ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
                            }`}
                        >
                            {/* Text Content */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <div>
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 font-black text-[10px] tracking-widest uppercase mb-6">
                                        {feature.tag}
                                    </span>
                                    <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter leading-[0.95] mb-6">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-stone-600 font-medium leading-relaxed max-w-xl">
                                        {feature.desc}
                                    </p>
                                </div>
                                
                                <ul className="space-y-4">
                                    {feature.points.map((point, i) => (
                                        <li key={i} className="flex items-center gap-4 text-stone-800 font-bold">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                            </div>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visual Abstract Box */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative aspect-[4/3] rounded-[2.5rem] bg-stone-50 border border-stone-200 shadow-xl overflow-hidden group">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.imgGradient} opacity-10 group-hover:opacity-20 transition-opacity duration-700`}></div>
                                    
                                    {/* Abstract UI Elements */}
                                    <div className="absolute top-8 left-8 right-8 bottom-0 bg-white rounded-t-3xl shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] border-t border-x border-stone-200 p-6 transform transition-transform duration-700 group-hover:-translate-y-4">
                                        
                                        {/* Mock Toolbar */}
                                        <div className="flex items-center gap-2 mb-8 pb-4 border-b border-stone-100">
                                            <div className="w-3 h-3 rounded-full bg-stone-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-stone-200"></div>
                                            <div className="w-3 h-3 rounded-full bg-stone-200"></div>
                                        </div>

                                        {/* Mock Data Lines */}
                                        <div className="space-y-4">
                                            <div className="h-4 w-3/4 bg-stone-100 rounded-full"></div>
                                            <div className="h-4 w-1/2 bg-stone-100 rounded-full"></div>
                                            <div className="h-4 w-5/6 bg-stone-100 rounded-full"></div>
                                            
                                            <div className="grid grid-cols-2 gap-4 pt-8">
                                                <div className="h-24 bg-stone-50 rounded-2xl border border-stone-100"></div>
                                                <div className="h-24 bg-stone-50 rounded-2xl border border-stone-100"></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    );
                })}

            </div>
        </section>
    );
}
