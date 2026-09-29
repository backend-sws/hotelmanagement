import React, { useState } from 'react';

export default function RelatedArticlesAndAuthorFooter() {
    // S-21 State: Comments
    const [commentText, setCommentText] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [userComments, setUserComments] = useState<{ author: string; text: string; date: string }[]>([]);
    const [submittedComment, setSubmittedComment] = useState(false);

    const relatedArticles = [
        {
            title: "Step-by-Step Guide to NIC IRP E-Invoicing for Businesses with ₹5+ Cr Turnover",
            slug: "e-invoicing-nic-irp-mandate-guide",
            category: "E-Invoicing",
            readTime: "9 min read"
        },
        {
            title: "Bridge Your Counter POS with Tally Prime: XML/ODBC Mapping Guide for Accountants",
            slug: "tally-prime-xml-pos-sync-guide",
            category: "Accounting Bridge",
            readTime: "8 min read"
        },
        {
            title: "Highway Transit Compliance: How to Extend Expired E-Way Bills in 1 Click via Mobile",
            slug: "extend-expired-eway-bill-transit",
            category: "Logistics",
            readTime: "6 min read"
        }
    ];

    const existingComments = [
        {
            author: "Prakash Jain, CFO (Jain Textiles, Surat)",
            date: "September 15, 2026",
            text: "Very clear explanation of Section 16(2)(aa). Question: If our vendor files GSTR-1 on the 13th for QRMP, will it reflect in 2B on the 14th morning?",
            reply: "Yes, Prakash. For QRMP taxpayers using the Invoice Furnishing Facility (IFF) by the 13th, the data is processed into the recipient's GSTR-2B generated on the 14th."
        }
    ];

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() && commentAuthor.trim()) {
            setUserComments([...userComments, { author: commentAuthor, text: commentText, date: "Just now" }]);
            setCommentText('');
            setCommentAuthor('');
            setSubmittedComment(true);
        }
    };

    return (
        <section className="py-16 bg-slate-50 border-b border-slate-200/80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* ========================================================================= */}
                {/* S-19: Detailed Author Bio Card                                            */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                        AD
                    </div>
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900">Ananya Deshmukh, FCA</h3>
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                Head of Statutory Policy
                            </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Fellow Chartered Accountant (FCA) with 15+ years advising top Indian FMCG conglomerates and wholesale distribution networks on indirect tax disputes, statutory audits, and automated ERP reconciliation frameworks.
                        </p>
                        <div className="text-xs text-slate-400 pt-1">
                            Published 24+ peer-reviewed statutory articles on GST, E-Invoicing &amp; ASMT-10 defense.
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-20: Related Articles Grid                                               */}
                {/* ========================================================================= */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-900">Recommended Next Reads</h3>
                        <a href="/blog" className="text-xs font-bold text-blue-600 hover:underline">
                            View All 85+ Playbooks →
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {relatedArticles.map((rel, idx) => (
                            <a
                                key={idx}
                                href={`/blog/${rel.slug}`}
                                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                        {rel.category}
                                    </span>
                                    <h4 className="font-bold text-slate-900 text-xs mt-2 group-hover:text-blue-600 transition-colors leading-snug">
                                        {rel.title}
                                    </h4>
                                </div>
                                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                                    <span>{rel.readTime}</span>
                                    <span className="font-semibold text-blue-600">Read →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* S-21: Article Comments & Discussion                                       */}
                {/* ========================================================================= */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                        Discussion &amp; Statutory Questions ({existingComments.length + userComments.length})
                    </h3>

                    {/* Existing Comments */}
                    <div className="space-y-4">
                        {existingComments.map((c, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-slate-900">{c.author}</span>
                                    <span className="text-slate-400">{c.date}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                                {c.reply && (
                                    <div className="mt-3 pt-3 border-t border-slate-200 pl-3 border-l-2 border-l-blue-600 text-xs text-slate-700 bg-white p-3 rounded-xl">
                                        <div className="font-bold text-blue-900 mb-0.5">Author Response (Ananya Deshmukh, FCA):</div>
                                        <p>{c.reply}</p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {userComments.map((c, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold text-slate-900">{c.author}</span>
                                    <span className="text-slate-400">{c.date}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{c.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Post Question Form */}
                    <form onSubmit={handlePostComment} className="pt-2 border-t border-slate-100 space-y-3">
                        <div className="text-xs font-bold text-slate-900">Have a question on GSTR-2B or Section 16?</div>
                        <input
                            type="text"
                            required
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            placeholder="Your Name &amp; Designation (e.g. Rahul Verma, Tax Manager)..."
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                        <textarea
                            required
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Ask your statutory question or share your experience..."
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-[11px] text-slate-400">Questions are answered by our CA editorial desk.</p>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
                            >
                                Post Question
                            </button>
                        </div>
                        {submittedComment && (
                            <p className="text-xs text-emerald-600 font-bold mt-1">Thank you! Your question has been submitted.</p>
                        )}
                    </form>
                </div>

                {/* ========================================================================= */}
                {/* S-22: Weekly Newsletter Inline Teaser                                     */}
                {/* ========================================================================= */}
                <div className="p-6 bg-blue-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <div className="text-xs font-black uppercase text-amber-300">Never Miss a Tax Update</div>
                        <h4 className="text-base font-black text-white mt-0.5">Subscribe to The Weekly Nexus Ledger</h4>
                        <p className="text-xs text-blue-200">1 GST update, 1 retail inventory hack, every Tuesday on WhatsApp.</p>
                    </div>
                    <a
                        href="/blog#blog-footer-cta"
                        className="px-5 py-2.5 bg-white text-blue-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap"
                    >
                        Subscribe Free →
                    </a>
                </div>

            </div>
        </section>
    );
}
