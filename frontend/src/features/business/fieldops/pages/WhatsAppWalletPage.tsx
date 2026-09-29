import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  FileText,
  RefreshCw,
  Plus,
  Lock
} from 'lucide-react';
import { 
  useWhatsAppWallet, 
  useWalletTransactions, 
  useCreateRechargeOrder,
  useVerifyRechargePayment,
  useRechargeWallet,
  type RechargePack 
} from '../api/useWhatsAppWallet';
import { useTenantStore } from '@/store/tenantStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function WhatsAppWalletPage() {
  const { data: walletData, isLoading, refetch } = useWhatsAppWallet();
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState<string>('');
  const { data: txnData, isLoading: isTxnLoading } = useWalletTransactions(page, { type: filterType || undefined });
  const createOrderMutation = useCreateRechargeOrder();
  const verifyPaymentMutation = useVerifyRechargePayment();
  const { activeBusiness } = useTenantStore();
  const user = useAuthStore((state) => state.user);

  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay Checkout script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Recharge Modal State
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');

  const wallet = walletData?.wallet;
  const rates = walletData?.rates || {};
  const packs = walletData?.packs || [];
  const transactions = txnData?.data || [];
  const meta = txnData?.meta;

  const currentBalance = wallet?.balance ?? 0;
  const isLow = wallet?.is_low_balance;
  const isDepleted = wallet?.is_depleted;

  // Handle Razorpay Recharge Submission
  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

    if (!finalAmount || finalAmount < 10) {
      toast.error('Minimum recharge amount is ₹10');
      return;
    }

    if (typeof (window as any).Razorpay === 'undefined') {
      toast.error('Razorpay gateway is initializing or blocked by ad blocker. Please refresh and try again.');
      return;
    }

    try {
      setIsProcessing(true);

      // 1. Create order on server
      const orderData = await createOrderMutation.mutateAsync({ amount: finalAmount });

      // 2. Launch Razorpay modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: activeBusiness?.settings?.whitelabel_name || activeBusiness?.name || 'Billkaro ERP',
        description: `WhatsApp Prepaid Wallet Recharge ₹${finalAmount}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // 3. Cryptographically verify signature on server & credit wallet
            await verifyPaymentMutation.mutateAsync({
              amount: finalAmount,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success(`🎉 Recharge successful! ₹${finalAmount.toLocaleString('en-IN')} credited to your WhatsApp Wallet.`);
            setIsRechargeOpen(false);
            setCustomAmount('');
            refetch();
          } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Payment signature verification failed.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || activeBusiness?.name,
          email: user?.email || activeBusiness?.email,
          contact: user?.phone || activeBusiness?.phone,
        },
        theme: {
          color: '#059669', // Emerald 600
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (res: any) {
        setIsProcessing(false);
        toast.error('Payment failed: ' + (res.error?.description || 'Transaction cancelled'));
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err?.response?.data?.message || 'Failed to initiate Razorpay recharge order');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              WhatsApp Prepaid Wallet & Billing
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time balance, automated per-message deductions, recharge packs, and audit passbook.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh Balance"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedAmount(1000);
              setIsRechargeOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Recharge Wallet
          </button>
        </div>
      </div>

      {/* Low Balance Warning Alert Banner */}
      {isLow && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-amber-900 dark:text-amber-300 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-sm">Low Wallet Balance Alert!</p>
            <p className="text-amber-800 dark:text-amber-300/90">
              Your WhatsApp bot balance is below ₹{wallet?.low_balance_threshold}. Recharge soon to prevent automated attendance and task notifications from pausing.
            </p>
          </div>
        </div>
      )}

      {/* Main Balance & Overview Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Balance Hero Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-7 text-white shadow-xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Prepaid Balance
                </span>
                {isDepleted ? (
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/50 px-2.5 py-0.5 rounded-full">
                    Depleted
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Active & Ready
                  </span>
                )}
              </div>
              <ShieldCheck className="w-5 h-5 text-slate-400" />
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Available Funds</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white">
                  ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-slate-400 text-sm font-semibold">INR</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Good for approx. <span className="font-bold text-emerald-300 font-mono">{Math.max(0, Math.floor(currentBalance / 0.75))}</span> attendance punch confirmations
              </p>
            </div>

            {/* Quick Recharge Pills */}
            <div className="pt-4 border-t border-slate-700/50 flex flex-wrap items-center gap-2.5">
              <span className="text-xs text-slate-400 font-medium">Quick Top-Up:</span>
              {[500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setIsRechargeOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all hover:scale-105"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Cumulative Stats */}
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Lifetime Wallet Stats
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Recharged</p>
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  ₹{(wallet?.total_recharged ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Consumed</p>
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  ₹{(wallet?.total_consumed ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            🔒 Protected by atomic ledger locking and SSL 256-bit encryption.
          </p>
        </div>
      </div>

      {/* Section 2: Rate Card Breakdown */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-amber-500" />
          Your Business WhatsApp Tariffs
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          These per-message rates are automatically deducted from your prepaid balance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Utility */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-xl">⚡</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Utility Message</p>
            <p className="text-[11px] text-slate-500">Punch in/out, task alerts</p>
            <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
              ₹{(rates.utility?.retail_price ?? 0.75).toFixed(2)}
              <span className="text-[10px] text-slate-400 font-normal">/msg</span>
            </p>
          </div>

          {/* Auth */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-xl">🔐</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Authentication OTP</p>
            <p className="text-[11px] text-slate-500">Client completion OTP</p>
            <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
              ₹{(rates.authentication?.retail_price ?? 0.40).toFixed(2)}
              <span className="text-[10px] text-slate-400 font-normal">/msg</span>
            </p>
          </div>

          {/* Service */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-xl">💬</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Service Session</p>
            <p className="text-[11px] text-slate-500">Staff 24h reply window</p>
            <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
              ₹{(rates.service?.retail_price ?? 0.60).toFixed(2)}
              <span className="text-[10px] text-slate-400 font-normal">/window</span>
            </p>
          </div>

          {/* Marketing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-xl">📢</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Marketing Blast</p>
            <p className="text-[11px] text-slate-500">Notice & broadcast alerts</p>
            <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
              ₹{(rates.marketing?.retail_price ?? 1.40).toFixed(2)}
              <span className="text-[10px] text-slate-400 font-normal">/msg</span>
            </p>
          </div>

          {/* AI Vision */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
            <span className="text-xl">🤖</span>
            <p className="text-xs font-bold text-slate-800 dark:text-white mt-1">Gemini AI Vision</p>
            <p className="text-[11px] text-slate-500">Photo anti-fraud analysis</p>
            <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
              ₹{(rates.ai_vision?.retail_price ?? 0.25).toFixed(2)}
              <span className="text-[10px] text-slate-400 font-normal">/check</span>
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Passbook / Transaction Ledger */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Wallet Passbook & Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Transparent, line-by-line breakdown of every top-up and WhatsApp message trigger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="">All Transactions</option>
              <option value="debit">Debits Only</option>
              <option value="credit">Credits (Top-ups)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {transactions.map((tx: any) => {
                const isDebit = tx.type === 'debit';
                const amt = parseFloat(tx.amount);
                const balAfter = parseFloat(tx.balance_after);

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(tx.created_at).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-900 dark:text-white font-medium">
                      {tx.description}
                      {tx.reference_id && (
                        <span className="block text-[10px] text-slate-400 font-mono">Ref: {tx.reference_id}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isDebit 
                          ? 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      }`}>
                        {tx.category.replace('whatsapp_', '')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-xs whitespace-nowrap">
                      <span className={isDebit ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {isDebit ? '-' : '+'}₹{amt.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      ₹{balAfter.toFixed(2)}
                    </td>
                  </tr>
                );
              })}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No wallet transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharge Modal */}
      {isRechargeOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-[#18191c] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Instant Wallet Top-Up
                </span>
                <span className="text-xs text-slate-400">GST Invoice Provided</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Select WhatsApp Recharge Pack
              </h3>
            </div>

            {/* Pack Cards */}
            <div className="grid grid-cols-2 gap-3">
              {packs.map((pack) => {
                const isSelected = !customAmount && selectedAmount === pack.amount;
                return (
                  <button
                    key={pack.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(pack.amount);
                      setCustomAmount('');
                    }}
                    className={`relative p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                        Popular
                      </span>
                    )}
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{pack.label}</p>
                    <p className="text-xl font-black font-mono mt-0.5">₹{pack.amount}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{pack.tag}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Or Enter Custom Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  placeholder="e.g. 1500"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Razorpay Gateway Trust Banner */}
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Secured by Razorpay Payment Gateway
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed block">
                  Supports UPI (Google Pay, PhonePe, Paytm, QR), Debit/Credit Cards & Net Banking with 256-bit SSL encryption.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRechargeOpen(false)}
                disabled={isProcessing}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRechargeSubmit}
                disabled={isProcessing || createOrderMutation.isPending || verifyPaymentMutation.isPending}
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing || createOrderMutation.isPending || verifyPaymentMutation.isPending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Launching Razorpay...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ₹{((customAmount ? parseFloat(customAmount) : selectedAmount) || 0).toLocaleString('en-IN')} via Razorpay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
