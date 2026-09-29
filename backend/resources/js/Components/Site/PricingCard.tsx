import { Link } from '@inertiajs/react';

interface Plan {
    id: number;
    name: string;
    description?: string;
    price_monthly: number;
    price_yearly: number;
    features?: string[];
}

interface Props {
    plan: Plan;
    isPopular?: boolean;
    billingCycle?: 'monthly' | 'yearly';
}

export default function PricingCard({ plan, isPopular = false, billingCycle = 'monthly' }: Props) {
    const price = billingCycle === 'yearly'
        ? Math.round(plan.price_yearly / 12)
        : plan.price_monthly;

    const features: string[] = (() => {
        if (!plan.features) return [];
        if (Array.isArray(plan.features)) return plan.features as string[];
        try { return JSON.parse(plan.features as unknown as string) as string[]; }
        catch { return []; }
    })();

    return (
        <div className={`relative flex flex-col h-full rounded-3xl p-7 lg:p-8 transition-all duration-300 ${
            isPopular
                ? 'bg-gradient-to-b from-indigo-50/60 to-white border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 scale-[1.03]'
                : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'
        }`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
                        Most Popular
                    </span>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                {plan.description && <p className="text-xs text-slate-600">{plan.description}</p>}
            </div>

            <div className="mb-6">
                <div className="flex items-end gap-1">
                    <span className="text-slate-500 text-lg font-semibold">₹</span>
                    <span className="text-4xl lg:text-5xl font-black text-slate-900">{price.toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 font-medium mb-1">/mo</span>
                </div>
                {billingCycle === 'yearly' && (
                    <p className="text-xs text-emerald-600 font-semibold mt-1">Billed yearly · Save {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%</p>
                )}
            </div>

            {features.length > 0 && (
                <ul className="flex-1 space-y-3 mb-8">
                    {features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{f}</span>
                        </li>
                    ))}
                </ul>
            )}

            <Link
                href="/register"
                className={`block w-full text-center py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    isPopular
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-100 border border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
            >
                Start Free Trial
            </Link>
        </div>
    );
}
