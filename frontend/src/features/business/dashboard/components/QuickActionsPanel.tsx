import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeature } from '@/hooks/useFeature';
import { useState } from 'react';
import { FeatureLockModal } from '@/features/business/core/components/FeatureLockModal';
import { 
  Receipt, ShoppingCart, ArrowRightLeft, 
  Wallet, Building, PieChart, PlusCircle,
  Crown
} from 'lucide-react';

export function QuickActionsPanel() {
  const navigate = useNavigate();
  const { hasFeature, isFeatureHidden } = useFeature();
  const [lockedFeatureName, setLockedFeatureName] = useState<string | undefined>();
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  const actions = [
    {
      label: 'New GST Invoice',
      description: 'Create bill with auto ITC & QR',
      icon: Receipt,
      color: 'from-indigo-500 to-blue-600',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50',
      route: '/invoices/new',
    },
    {
      label: 'New Purchase Bill',
      description: 'Record supplier stock & ITC',
      icon: ShoppingCart,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
      route: '/business/purchases/new',
      featureKey: 'has_purchase_bills'
    },
    {
      label: 'Stock Transfer',
      description: 'Instant multi-godown transit',
      icon: ArrowRightLeft,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50',
      route: '/stock/transfer/new',
      featureKey: 'has_stock_transfer'
    },
    {
      label: 'Cash & Bank Entry',
      description: 'Record receipt or withdrawal',
      icon: Wallet,
      color: 'from-purple-500 to-pink-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50',
      route: '/business/cash-bank',
      featureKey: 'has_cashbook'
    },
    {
      label: 'Material Consumption',
      description: 'Log site inventory utilization',
      icon: Building,
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
      route: '/business/projects',
      featureKey: 'has_projects'
    },
    {
      label: 'GST Reports Suite',
      description: 'GSTR-1, 3B & HSN summaries',
      icon: PieChart,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50',
      route: '/reports/gst',
      featureKey: 'has_gst_reports'
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Quick Executive Actions
          </h3>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30">
          1-Click Shortcuts
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {actions.map((act, idx) => {
          if (act.featureKey && isFeatureHidden(act.featureKey)) return null;

          const isLocked = act.featureKey ? !hasFeature(act.featureKey) : false;
          const Icon = act.icon;

          return (
            <button
              key={idx}
              onClick={() => {
                if (isLocked) {
                  setLockedFeatureName(act.label);
                  setIsLockModalOpen(true);
                } else {
                  navigate(act.route);
                }
              }}
              className={`relative p-4 rounded-xl border transition-all duration-200 text-left group flex flex-col justify-between hover:shadow-lg dark:bg-slate-900/40 backdrop-blur-sm ${isLocked ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 opacity-70 grayscale' : act.bgColor}`}
            >
              {isLocked && (
                <div className="absolute top-3 right-3 p-1 rounded-md bg-amber-500/20 text-amber-600">
                  <Crown className="w-4 h-4" />
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${isLocked ? 'from-slate-400 to-slate-500' : act.color} text-white shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  {act.label}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {isLocked ? 'Upgrade Plan to Unlock' : act.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <FeatureLockModal 
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        featureName={lockedFeatureName}
      />
    </div>
  );
}
