import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../api/invoiceService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FileText, RotateCcw } from 'lucide-react';

export default function CreditNoteListPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['credit-notes'],
    queryFn: () => invoiceService.list({ invoice_type: 'credit_note' }),
  });

  const creditNotes = data?.data || [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-14">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-rose-500" /> Credit Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sales returns and rate corrections</p>
        </div>
        <Button onClick={() => navigate('/credit-notes/new')}>
          <Plus className="w-4 h-4 mr-2" /> New Credit Note
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/[0.03]">
              <tr>
                <th className="p-3 text-left font-semibold text-xs uppercase text-slate-500">CN #</th>
                <th className="p-3 text-left font-semibold text-xs uppercase text-slate-500">Date</th>
                <th className="p-3 text-left font-semibold text-xs uppercase text-slate-500">Customer</th>
                <th className="p-3 text-left font-semibold text-xs uppercase text-slate-500">Against Invoice</th>
                <th className="p-3 text-right font-semibold text-xs uppercase text-slate-500">Amount</th>
                <th className="p-3 text-right font-semibold text-xs uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-3"><Skeleton className="h-10 w-full" /></td></tr>
                ))
              ) : creditNotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    <RotateCcw className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No credit notes yet</p>
                  </td>
                </tr>
              ) : (
                creditNotes.map((cn: any) => (
                  <tr key={cn.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-semibold text-rose-600 cursor-pointer" onClick={() => navigate(`/invoices/${cn.id}`)}>
                      {cn.invoice_number}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {new Date(cn.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 font-medium">{cn.customer?.name || '—'}</td>
                    <td className="p-3 text-slate-500">
                      {cn.parent_id ? `#${cn.parent_id}` : '—'}
                    </td>
                    <td className="p-3 text-right font-bold text-rose-600">-₹{Number(cn.final_amount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/invoices/${cn.id}`)}>
                        <FileText className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
