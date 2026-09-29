import AnimatedSection from '@/Components/Site/AnimatedSection';
import StepFlow from '@/Components/Site/StepFlow';

export default function PainAndSolutionSection() {
    const painPoints = [
        {
            title: 'Manual Invoicing Nightmares',
            description: 'Hours spent typing GST details manually, GST rate calculation errors, mismatch in ITC credits, and rejected IRN e-invoices on the government portal.',
            impact: 'Losing 3+ hours daily & risking GST penalty notices',
            icon: '⚠️',
        },
        {
            title: 'Staff Attendance & Travel Fraud',
            description: 'Buddy punching, proxy attendance via spoofed location apps, fake manual timesheets, and inflated TA/DA travel allowance claims with zero audit proof.',
            impact: 'Overpaying up to 18% in fraudulent payroll & expenses',
            icon: '🚫',
        },
        {
            title: 'Blindspot on Field Ops & Inventory',
            description: 'No real-time visibility into which technician visited which client, fake photo proof, lost stock in godowns, and stock-outs during peak customer demand.',
            impact: 'Customer complaints & untracked inventory leakage',
            icon: '📉',
        },
    ];

    const solutionSteps = [
        {
            number: 1,
            title: 'Register in 2 Minutes',
            description: 'Sign up without credit card, enter your GSTIN, and import your existing customers and inventory from Excel or Tally in 1 click.',
        },
        {
            number: 2,
            title: 'Invite Staff & Link WhatsApp',
            description: 'Staff scan a QR or get a WhatsApp bot message. No app download needed — attendance, geofencing & tasks live instantly.',
        },
        {
            number: 3,
            title: 'Bill Faster with Barcode & POS',
            description: 'Create GST e-invoices in 10 seconds, dispatch PDFs to customers via WhatsApp, and collect payments via UPI dynamic QR.',
        },
        {
            number: 4,
            title: 'Auto-Pilot Reports & Payroll',
            description: 'One-click GSTR-1 / 3B filing summaries, automated payroll calculation with verified TA/DA, and P&L financial visibility.',
        },
    ];

    return (
        <section className="py-24 relative bg-slate-50 border-t border-slate-200 overflow-hidden">
            {/* Soft backdrop */}
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-rose-100/40 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* S-04: PainPointSection */}
                <AnimatedSection direction="up">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider mb-4">
                            The Manual Chaos
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Still drowning in manual billing &amp; unverified staff reports?
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                            Traditional software was built 20 years ago for desktop computers. Today’s fast-moving businesses lose money every single day to manual friction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {painPoints.map((item, idx) => (
                            <div
                                key={idx}
                                className="relative rounded-2xl bg-white border border-rose-200/90 hover:border-rose-400 p-7 transition-all duration-300 shadow-sm hover:shadow-lg group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-xl mb-5 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{item.description}</p>
                                </div>
                                
                                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-rose-700">
                                    <span>💥</span>
                                    <span>{item.impact}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mb-24">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-indigo-700 text-sm font-bold shadow-xs">
                            <span>✨ There is a 10x smarter way. Here is your modern operating system:</span>
                        </div>
                    </div>
                </AnimatedSection>

                {/* S-05: SolutionFlow */}
                <AnimatedSection direction="up" delay={150}>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Seamless 4-Step Onboarding
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Go live in 10 minutes, not 10 weeks
                        </h2>
                        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                            Zero expensive IT consultants or complex training. Everything works smoothly on mobile and web.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
                        <StepFlow steps={solutionSteps} />
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
