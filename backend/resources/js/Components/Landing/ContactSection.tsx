import { useState } from 'react';
import axios from 'axios';
import { useIntersectionObserver } from './useIntersectionObserver';

export default function ContactSection() {
    const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
    const [formData, setFormData] = useState({
        business_name: '',
        contact_person: '',
        phone: '',
        email: '',
        notes: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await axios.post('/api/v1/public/leads', formData);
            setStatus('success');
            setFormData({ business_name: '', contact_person: '', phone: '', email: '', notes: '' });
        } catch (error) {
            console.error('Failed to submit lead:', error);
            setStatus('error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <section id="contact" className="py-24 relative bg-stone-900 text-stone-100 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-900/40 to-transparent pointer-events-none blur-3xl mix-blend-screen"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Text */}
                    <div 
                        ref={ref}
                        className={`transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}
                    >
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                            Let's Talk <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-emerald-400">Business.</span>
                        </h2>
                        <p className="text-xl text-stone-400 font-medium mb-12 max-w-lg leading-relaxed">
                            Ready to upgrade your retail management system? Fill out the form below and our enterprise experts will contact you within 24 hours.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-emerald-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-200">Phone</h4>
                                    <p className="text-stone-400">+91 (800) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-orange-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-200">Email</h4>
                                    <p className="text-stone-400">hello@mobilecrm.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div 
                        className={`bg-stone-800/50 backdrop-blur-xl border border-stone-700 p-8 md:p-10 rounded-[2rem] shadow-2xl transition-all duration-1000 transform delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    >
                        {status === 'success' ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
                                <p className="text-stone-400">Thank you for your interest. We will be in touch shortly.</p>
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className="mt-8 text-emerald-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                                >
                                    Submit Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Business Name *</label>
                                    <input 
                                        required 
                                        name="business_name"
                                        value={formData.business_name}
                                        onChange={handleChange}
                                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" 
                                        placeholder="e.g. Acme Retailers"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Contact Person *</label>
                                        <input 
                                            required 
                                            name="contact_person"
                                            value={formData.contact_person}
                                            onChange={handleChange}
                                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" 
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Phone Number *</label>
                                        <input 
                                            required 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" 
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" 
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Message / Requirements</label>
                                    <textarea 
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none" 
                                        placeholder="Tell us about your business needs..."
                                    ></textarea>
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-400 text-sm font-medium">Failed to submit. Please try again later.</p>
                                )}

                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : 'Request Demo'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
