import { useState } from 'react';

interface Props {
    question: string;
    answer: string;
    badge?: string;
    defaultOpen?: boolean;
}

export default function FAQItem({ question, answer, badge, defaultOpen = false }: Props) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div
            className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ${
                open
                    ? 'border-indigo-300 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm'
            }`}
            itemScope
            itemType="https://schema.org/Question"
        >
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50/70 transition-colors"
                aria-expanded={open}
            >
                <div className="flex items-center gap-3 pr-2">
                    {badge && (
                        <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold tracking-wide uppercase border border-slate-200 flex-shrink-0">
                            {badge}
                        </span>
                    )}
                    <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug" itemProp="name">
                        {question}
                    </span>
                </div>
                <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        open
                            ? 'bg-indigo-600 text-white rotate-180 shadow-md shadow-indigo-500/25'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                itemScope
                itemType="https://schema.org/Answer"
            >
                <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40" itemProp="text">
                    {answer}
                </div>
            </div>
        </div>
    );
}
