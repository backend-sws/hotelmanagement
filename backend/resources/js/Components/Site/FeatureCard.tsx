import type { ReactNode } from 'react';

interface Props {
    icon: ReactNode;
    title: string;
    description: string;
    badge?: string;
    href?: string;
    accentColor?: string;
    className?: string;
}

export default function FeatureCard({ icon, title, description, badge, href, accentColor = 'indigo', className = '' }: Props) {
    const accent: Record<string, string> = {
        indigo:  'from-indigo-600 to-violet-600 shadow-indigo-500/25',
        emerald: 'from-emerald-600 to-teal-600 shadow-emerald-500/25',
        violet:  'from-violet-600 to-purple-600 shadow-violet-500/25',
        amber:   'from-amber-500 to-orange-500 shadow-amber-500/25',
        rose:    'from-rose-500 to-pink-500 shadow-rose-500/25',
        sky:     'from-sky-500 to-cyan-500 shadow-sky-500/25',
    };

    const Wrapper = href ? 'a' : 'div';
    const wrapperProps = href ? { href, className: `group block ${className}` } : { className: `group ${className}` };

    return (
        <Wrapper {...(wrapperProps as any)}>
            <div className="h-full bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-7 hover:border-indigo-400/80 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5">
                {badge && (
                    <span className="inline-block mb-4 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 uppercase tracking-wider">
                        {badge}
                    </span>
                )}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent[accentColor] || accent.indigo} flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <h3 className="text-base lg:text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                {href && (
                    <span className="inline-flex items-center gap-1 mt-4 text-sm text-indigo-600 font-semibold group-hover:gap-2 transition-all">
                        Learn more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                )}
            </div>
        </Wrapper>
    );
}
