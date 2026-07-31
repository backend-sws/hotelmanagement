import { Link } from '@inertiajs/react';
import { useIntersectionObserver } from './useIntersectionObserver';

const plans = [
    {
        name: "Starter",
        price: "999",
        desc: "Perfect for small shops just getting started with digital billing.",
        features: ["Up to 1,000 Invoices/mo", "Basic Party Ledgers", "Standard Analytics", "Email Support"],
        highlight: false,
        btnColor: "bg-stone-900 hover:bg-stone-800 text-white"
    },
    {
        name: "Professional",
        price: "2,499",
        desc: "Everything you need to manage your growing retail business.",
        features: ["Unlimited Invoices", "Full Unified Ledger", "HR & Payroll Engine", "Inventory Management", "Live Priority Support"],
        highlight: true,
        btnColor: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
    },
    {
        name: "Enterprise",
        price: "4,999",
        desc: "Advanced multi-godown control and partner affiliate features.",
        features: ["Everything in Pro", "Multi-Godown Stock Transfers", "Advanced Financial Accounting", "Custom API Access", "Dedicated Account Manager"],
        highlight: false,
        btnColor: "bg-stone-900 hover:bg-stone-800 text-white"
    }
];

export default function PricingSection() {
    const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

    return (
        <section id="pricing" className="py-24 relative bg-[#F7F4EB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter uppercase mb-6 leading-[0.9]">
                        Pricing that scales <br/> with your business.
                    </h2>
                    <p className="text-xl text-stone-600 font-medium max-w-2xl mx-auto">
                        Start for free, upgrade when you need to. No hidden fees, ever.
                    </p>
                </div>

                <div 
                    ref={ref}
                    className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-1000 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                    }`}
                >
                    {plans.map((plan, i) => (
                        <div 
                            key={i}
                            className={`relative rounded-[2.5rem] p-8 border ${plan.highlight ? 'border-emerald-500 bg-white shadow-2xl scale-105 z-10' : 'border-[#D4CBB3] bg-white/40 backdrop-blur-sm shadow-lg'} transition-all duration-500 flex flex-col`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-black text-stone-900 uppercase tracking-widest mb-2">{plan.name}</h3>
                            <p className="text-stone-500 font-medium text-sm mb-6 min-h-[40px]">{plan.desc}</p>
                            
                            <div className="flex items-end gap-1 mb-8">
                                <span className="text-5xl font-black text-stone-900 tracking-tighter">₹{plan.price}</span>
                                <span className="text-stone-500 font-medium mb-1">/mo</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-stone-800 font-bold text-sm">
                                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <a 
                                href={`${frontendUrl}/login`} 
                                className={`w-full py-4 text-center font-black uppercase tracking-widest text-xs rounded-xl transition-all ${plan.btnColor}`}
                            >
                                Get Started
                            </a>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
