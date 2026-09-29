interface Competitor {
    name: string;
    values: boolean[];
}

interface Props {
    features: string[];
    competitors: Competitor[];
    highlightIndex?: number;
}

export default function ComparisonTable({ features, competitors, highlightIndex = 0 }: Props) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[600px] text-xs sm:text-sm">
                <thead>
                    <tr className="bg-slate-50/80">
                        <th className="text-left px-6 py-4 text-slate-700 font-bold border-b border-slate-200 w-1/3">Key Capability</th>
                        {competitors.map((c, i) => (
                            <th key={i} className={`px-4 py-4 text-center font-bold border-b border-slate-200 ${
                                i === highlightIndex
                                    ? 'text-indigo-600 bg-indigo-50/70 border-x border-indigo-200'
                                    : 'text-slate-600'
                            }`}>
                                {i === highlightIndex && (
                                    <span className="block text-[10px] text-emerald-600 font-extrabold mb-0.5 uppercase tracking-wider">Recommended</span>
                                )}
                                {c.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {features.map((feature, fi) => (
                        <tr key={fi} className={fi % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                            <td className="px-6 py-3.5 text-slate-800 font-medium">{feature}</td>
                            {competitors.map((c, ci) => (
                                <td key={ci} className={`px-4 py-3.5 text-center ${
                                    ci === highlightIndex ? 'bg-indigo-50/30 border-x border-indigo-100' : ''
                                }`}>
                                    {c.values[fi]
                                        ? <svg className="w-5 h-5 text-emerald-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                        : <svg className="w-4 h-4 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
