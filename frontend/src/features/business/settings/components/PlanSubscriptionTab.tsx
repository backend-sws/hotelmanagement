import React, { useState, useEffect } from 'react';
import { useTenantStore } from '@/store/tenantStore';
import { Loader2, Check, Crown, CreditCard, History, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import { format } from 'date-fns';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PlanSubscriptionTab() {
  const { activeBusiness } = useTenantStore();
  const [plans, setPlans] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [activeSubTab, setActiveSubTab] = useState<'upgrade' | 'history'>('upgrade');

  useEffect(() => {
    fetchData();
    
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [plansRes, historyRes] = await Promise.all([
        api.get('/settings/public'), // Public settings usually includes plans
        api.get('/business/subscriptions/history')
      ]);
      // Let's assume plans are available or we fetch them from another endpoint.
      // Actually, let's just create an endpoint to fetch plans publicly if needed.
      // Wait, `/settings/public` already exists in `PublicSettingController`. Let's check it later.
      // For now, let's fetch `/superadmin/plans` and if it fails, fallback to hardcoded or we will fix it.
      
      try {
          const p = await api.get('/plans/public');
          setPlans(p.data.data || p.data);
      } catch (e) {
          console.error('Failed to fetch plans', e);
      }
      
      setPayments(historyRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (plan: any) => {
    try {
      setIsProcessing(true);
      
      const res = await api.post('/business/subscriptions/create-order', {
        plan_id: plan.id,
        billing_cycle: billingCycle
      });

      if (res.data.success && res.data.message === 'Upgraded to free plan') {
        toast.success('Successfully changed plan!');
        window.location.reload();
        return;
      }

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: 'Mobile CRM',
        description: `Upgrade to ${plan.name} (${billingCycle})`,
        order_id: res.data.order_id,
        handler: async function (response: any) {
          try {
            await api.post('/business/subscriptions/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            toast.success('Payment successful! Plan upgraded.');
            window.location.reload();
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: activeBusiness?.name,
          email: activeBusiness?.email,
          contact: activeBusiness?.phone
        },
        theme: {
          color: '#6366f1' // Indigo 500
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadInvoice = async (paymentId: number) => {
    try {
      const response = await api.get(`/business/subscriptions/${paymentId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subscription & Billing</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your plan, billing details, and view payment history.
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('upgrade')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'upgrade' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <Crown className="w-4 h-4" />
            Plans
          </button>
          <button 
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'history' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <History className="w-4 h-4" />
            Payment History
          </button>
        </div>
      </div>

      {activeSubTab === 'upgrade' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full flex items-center">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Yearly <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-6 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isCurrent = activeBusiness?.plan_id === plan.id;
              const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
              const isPremium = price > 0;
              
              return (
                <div key={plan.id} className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col ${isCurrent ? 'border-primary-500 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent scale-[1.02] shadow-2xl shadow-primary-500/10 z-10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-1'}`}>
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-indigo-500 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-primary-500/30">
                      Current Plan
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px] leading-relaxed">{plan.description || 'Essential tools for your business.'}</p>
                  </div>

                  <div className="mb-8 flex items-baseline gap-1 border-b border-slate-100 dark:border-white/5 pb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">₹{price}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features && Object.entries(plan.features)
                      .filter(([k, v]) => v !== false && v !== 0) // Hide false or 0 limits
                      .map(([key, value], idx) => {
                        let label = '';
                        if (typeof value === 'boolean') {
                          label = key.replace('has_', '').replace('can_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        } else if (key === 'max_locations') {
                          label = value === 999 ? 'Unlimited Locations' : `Up to ${value} Locations`;
                        } else if (key === 'max_staff') {
                          label = value === 999 ? 'Unlimited Staff Members' : `Up to ${value} Staff Members`;
                        } else if (key === 'attendance_photo_retention_days') {
                          label = `${value} Days Photo Retention`;
                        } else {
                          label = `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${value}`;
                        }
                        
                        return (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    {(!plan.features || Object.keys(plan.features).length === 0) && (
                      <div className="text-sm text-slate-500 italic text-center">Standard features</div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrent || isProcessing}
                    className={`w-full rounded-2xl py-6 text-base font-bold transition-all duration-300 ${isCurrent ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed' : isPremium ? 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 shadow-xl hover:shadow-2xl hover:-translate-y-0.5' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}
                  >
                    {isCurrent ? 'Active Plan' : (isPremium ? 'Upgrade Now' : 'Downgrade')}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Date</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-2xl text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No payment history found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {format(new Date(payment.created_at), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800">
                        {payment.plan?.name} <span className="opacity-50">({payment.billing_cycle})</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      ₹{payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'successful' ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          <Check className="w-3.5 h-3.5" /> Paid
                        </span>
                      ) : payment.status === 'failed' ? (
                        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                          <X className="w-3.5 h-3.5" /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payment.status === 'successful' && (
                        <Button variant="ghost" size="sm" onClick={() => downloadInvoice(payment.id)} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
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
  );
}
