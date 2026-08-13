import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCorporateAccount, useCorporateStatement } from '../api/useCorporate';
import { ArrowLeft, Building2, Download, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordPaymentModal } from '../components/RecordPaymentModal';
import { PageLoadingSkeleton } from '@/components/ui/PageLoadingSkeleton';

export default function CorporateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const { data: account, isLoading: isAccountLoading } = useCorporateAccount(id);
  const { data: statement, isLoading: isStatementLoading } = useCorporateStatement(id);

  if (isAccountLoading || isStatementLoading) {
    return <PageLoadingSkeleton />;
  }

  if (!account) {
    return <div className="p-6">Account not found</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/hotel/corporate')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {account.company_name}
            </h1>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  account.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
              {account.status}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">{account.contact_person} • {account.contact_phone}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsPaymentModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Receipt className="w-4 h-4 mr-2" /> Record Payment
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Download Statement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              Financial Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-500">Total Outstanding</div>
                <div className="text-3xl font-black text-rose-600">₹{parseFloat(account.current_outstanding).toLocaleString()}</div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium">Credit Utilization</div>
                  <div className="text-sm font-bold">
                    {Math.round((parseFloat(account.current_outstanding) / parseFloat(account.credit_limit)) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (parseFloat(account.current_outstanding) / parseFloat(account.credit_limit)) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Limit: ₹{parseFloat(account.credit_limit).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statement / Payments */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Payments (Credits)</h3>
            </div>
            
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Ref ID</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {statement?.payments?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No payments recorded yet.</td>
                  </tr>
                ) : (
                  statement?.payments?.map((payment: any) => (
                    <tr key={payment.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-500">{payment.transaction_ref || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 px-2 py-0.5 rounded text-xs">
                          {payment.payment_mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                        +₹{parseFloat(payment.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {id && (
        <RecordPaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)} 
          accountId={id}
        />
      )}
    </div>
  );
}
