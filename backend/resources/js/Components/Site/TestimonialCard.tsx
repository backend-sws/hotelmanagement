interface Props {
    name: string;
    company: string;
    role?: string;
    quote: string;
    rating?: number;
    industry?: string;
    initials?: string;
    accentColor?: string;
}

export default function TestimonialCard({ name, company, role, quote, rating = 5, industry, initials, accentColor = 'indigo' }: Props) {
    const accent: Record<string, string> = {
        indigo:  'from-indigo-600 to-violet-600',
        emerald: 'from-emerald-600 to-teal-600',
        violet:  'from-violet-600 to-purple-600',
        amber:   'from-amber-600 to-orange-600',
    };

    const avatarInitials = initials || name.split(' ').map(n => n[0]).join('').slice(0, 2);

    return (
        <div className="group h-full bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm flex flex-col justify-between">
            <div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                {/* Big opening quote */}
                <div className="text-4xl text-indigo-500/20 font-serif leading-none mb-1">&ldquo;</div>

                <p className="text-sm text-slate-700 leading-relaxed mb-6 font-normal">{quote}</p>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${accent[accentColor] || accent.indigo} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                        {avatarInitials}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{name}</p>
                        <p className="text-xs text-slate-500">{role ? `${role}, ` : ''}{company}</p>
                    </div>
                </div>
                {industry && (
                    <span className="text-[11px] px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full font-semibold text-slate-600">{industry}</span>
                )}
            </div>
        </div>
    );
}
