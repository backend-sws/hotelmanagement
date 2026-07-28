import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ChequeItem {
  id: number;
  cheque_number: string;
  bank_name: string;
  party_type: string;
  cheque_date: string;
  amount: number;
  status: string;
  type: string; // 'received' | 'issued'
}

interface PendingChequesWidgetProps {
  cheques: ChequeItem[];
}

export function PendingChequesWidget({ cheques = [] }: PendingChequesWidgetProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-5 bg-white dark:bg-[#11111a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Pending Bank Cheques
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Uncleared financial instruments
              </p>
            </div>
          </div>
          {cheques.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/30">
              {cheques.length} Due
            </span>
          )}
        </div>

        {/* List */}
        {cheques.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-500 flex items-center justify-center mx-auto border border-teal-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              All Cheques Cleared
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] mx-auto">
              There are no uncleared or pending cheques registered across your active business bank accounts.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[260px] overflow-y-auto pr-1">
            {cheques.map((chk) => {
              const isReceived = chk.type === 'received';
              
              return (
                <div key={chk.id} className="py-2.5 flex items-center justify-between gap-2 group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 px-1 rounded-lg transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        isReceived ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                      }`}>
                        {isReceived ? 'INFLOW' : 'OUTFLOW'}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono truncate">
                        #{chk.cheque_number}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                      <span>{chk.bank_name}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3 text-slate-400 inline" />
                      <span>Due: {chk.cheque_date}</span>
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className={`text-xs md:text-sm font-bold block ${
                      isReceived ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isReceived ? '+' : '-'}₹{chk.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-amber-500 font-medium capitalize flex items-center justify-end gap-1">
                      <Clock className="w-2.5 h-2.5" /> {chk.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <Button
          onClick={() => navigate('/cheque-register')}
          variant="ghost"
          size="sm"
          className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Open Cheque Register Suite <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
}
