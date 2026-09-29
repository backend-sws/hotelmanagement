import type { ReactNode } from 'react';

interface Step {
    number: number;
    title: string;
    description: string;
    icon?: ReactNode;
}

export default function StepFlow({ steps }: { steps: Step[] }) {
    return (
        <div className="relative">
            {/* Connecting line — visible on md+ */}
            <div className="hidden md:block absolute top-7 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
                {steps.map((step, i) => (
                    <div key={i} className="flex flex-col items-start md:items-center md:text-center gap-4">
                        {/* Numbered circle */}
                        <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/25">
                                {step.icon || step.number}
                            </div>
                            {/* Connector dot for mobile */}
                            {i < steps.length - 1 && (
                                <div className="md:hidden absolute left-7 top-14 w-0.5 h-8 bg-gradient-to-b from-indigo-300 to-transparent" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
