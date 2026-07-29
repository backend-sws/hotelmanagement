import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Receipt, Loader2, Check, X, Search } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/superadmin/subscriptions');
      setPayments(res.data.data);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = payments.filter(p => 
    p.business?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      <PageHeader 
        icon={Receipt}
        title="Subscription Logs"
        subtitle="View all SaaS subscription payments from businesses"
        breadcrumbs={[
          { label: 'Home', onClick: () => navigate('/superadmin/dashboard') },
          { label: 'Subscriptions', active: true }
        ]}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">All Payments</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search business or order ID..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-xl">Date</th>
                    <th className="px-6 py-4">Business</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4 rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No payments found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-6 py-4">
                          {format(new Date(payment.created_at), 'dd MMM yyyy, p')}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {payment.business?.name}
                        </td>
                        <td className="px-6 py-4">
                          {payment.plan?.name} <span className="text-xs text-slate-500">({payment.billing_cycle})</span>
                        </td>
                        <td className="px-6 py-4 font-bold">
                          ₹{payment.amount}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {payment.razorpay_order_id || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {payment.status === 'successful' ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                              <Check className="w-3.5 h-3.5" /> Success
                            </span>
                          ) : payment.status === 'failed' ? (
                            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase">
                              <X className="w-3.5 h-3.5" /> Failed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
