import React, { useState } from 'react';
import { useCorporateAccounts } from '../api/useCorporate';
import { Building2, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AddCorporateModal } from '../components/AddCorporateModal';

import { CardSkeleton } from '@/components/ui/skeleton-loaders';

export default function CorporateAccountsPage() {
  const { data: accounts, isLoading } = useCorporateAccounts();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-500" />
            Corporate Accounts (City Ledger)
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage B2B credit accounts and bulk billing.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Account
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton count={3} />
        </div>
      ) : accounts?.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold">No Corporate Accounts</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2">You haven't set up any credit lines for corporate clients yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts?.map((account: any) => (
            <div 
              key={account.id} 
              className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => navigate(`/hotel/corporate/${account.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 transition-colors">
                    {account.company_name}
                  </h3>
                  <div className="text-xs text-slate-500">{account.contact_person || 'No contact specified'}</div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  account.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                  account.status === 'suspended' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {account.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                  <div className="text-xs text-slate-500 mb-1">Credit Limit</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">₹{parseFloat(account.credit_limit).toLocaleString()}</div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/10 p-3 rounded-lg border border-rose-100 dark:border-rose-900/20">
                  <div className="text-xs text-rose-600 dark:text-rose-400 mb-1">Outstanding</div>
                  <div className="font-bold text-rose-700 dark:text-rose-300">₹{parseFloat(account.current_outstanding).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                View Ledger & Statement <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCorporateModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
