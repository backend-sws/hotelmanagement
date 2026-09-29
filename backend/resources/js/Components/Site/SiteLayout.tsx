import type { ReactNode } from 'react';
import SiteNavbar from './SiteNavbar';
import SiteFooter from './SiteFooter';
import DemoBanner from './DemoBanner';

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
            <SiteNavbar />
            <main>
                {children}
            </main>
            <SiteFooter />
            <DemoBanner />
        </div>
    );
}
