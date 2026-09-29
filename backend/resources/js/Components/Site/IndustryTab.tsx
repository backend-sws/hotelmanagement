import { useState, type ReactNode } from 'react';

export interface IndustryTabItem {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

interface Props {
    tabs: IndustryTabItem[];
    defaultTab?: string;
    className?: string;
}

export default function IndustryTab({ tabs, defaultTab, className = '' }: Props) {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || '');

    if (!tabs || tabs.length === 0) return null;

    const currentItem = tabs.find((t) => t.id === activeTab) || tabs[0];

    return (
        <div className={`w-full ${className}`}>
            {/* Scrollable Tab bar */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar">
                <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
                    {tabs.map((tab) => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                                    isActive
                                        ? 'bg-white text-indigo-600 shadow-md shadow-slate-200/80 border border-slate-200/80'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                {tab.icon && (
                                    <span className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`}>
                                        {tab.icon}
                                    </span>
                                )}
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content Panel */}
            <div className="mt-8 transition-all duration-300">
                <div key={currentItem.id} className="animate-fadeIn">
                    {currentItem.content}
                </div>
            </div>
        </div>
    );
}
