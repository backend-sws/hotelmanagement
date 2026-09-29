import type { ReactNode } from 'react';

type Color = 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'sky';

const colorMap: Record<Color, string> = {
    indigo:  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    violet:  'bg-violet-500/10 text-violet-400 border border-violet-500/25',
    amber:   'bg-amber-500/10  text-amber-400  border border-amber-500/25',
    rose:    'bg-rose-500/10   text-rose-400   border border-rose-500/25',
    sky:     'bg-sky-500/10    text-sky-400    border border-sky-500/25',
};

export default function GradientBadge({
    children,
    color = 'indigo',
    className = '',
}: { children: ReactNode; color?: Color; className?: string }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${colorMap[color]} ${className}`}>
            {children}
        </span>
    );
}
