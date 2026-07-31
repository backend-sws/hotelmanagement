import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  PieChart, Plus, Search, FileText, CheckCircle2, AlertCircle, 
  Copy, ArrowRight, Printer, Trash2, RefreshCw, X, Building2, User, Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { EmptyState } from '@/components/ui/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { boqService, type BoqTemplate } from '../api/boqService';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export default function BoqListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('project_id');

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: boqs = [], isLoading, refetch } = useQuery({
    queryKey: ['boqs', statusFilter !== 'all' ? statusFilter : undefined, projectIdParam, searchQuery],
    queryFn: () => boqService.getBoqs({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      project_id: projectIdParam ? Number(projectIdParam) : undefined,
      search: searchQuery || undefined,
    }),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: number) => boqService.duplicateBoq(id),
    onSuccess: (newBoq) => {
      toast.success(`BOQ duplicated as "${newBoq.name}"`);
      queryClient.invalidateQueries({ queryKey: ['boqs'] });
    },
    onError: () => toast.error('Failed to duplicate BOQ'),
  });

  const convertMutation = useMutation({
    mutationFn: (id: number) => boqService.convertToInvoice(id),
    onSuccess: (res) => {
      toast.success('BOQ converted to Draft Sales Invoice successfully!');
      queryClient.invalidateQueries({ queryKey: ['boqs'] });
      queryClient.invalidateQueries({ queryKey: ['project-invoices'] });
      if (res?.sale?.id) {
        navigate(`/invoices/${res.sale.id}`);
      } else {
        navigate('/invoices');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to convert BOQ to invoice');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => boqService.deleteBoq(id),
    onSuccess: () => {
      toast.success('BOQ deleted');
      queryClient.invalidateQueries({ queryKey: ['boqs'] });
    },
    onError: () => toast.error('Failed to delete BOQ'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => boqService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('BOQ status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['boqs'] });
    },
    onError: () => toast.error('Failed to update BOQ status'),
  });

  // Download PDF handler
  const handleDownloadPdf = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      toast.info('Generating BOQ PDF...');
      const blob = await boqService.generatePdfData(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `BOQ-${id.toString().padStart(4, '0')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('BOQ PDF downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download PDF');
    }
  };

  const stats = useMemo(() => {
    let totalValue = 0;
    let approvedCount = 0;
    let draftCount = 0;

    boqs.forEach(b => {
      totalValue += parseFloat(b.total_amount?.toString() || '0');
      if (b.status === 'approved') approvedCount++;
      if (b.status === 'draft') draftCount++;
    });

    return { totalValue, approvedCount, draftCount, totalCount: boqs.length };
  }, [boqs]);

  const filteredBoqs = useMemo(() => {
    return boqs.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = b.name.toLowerCase().includes(q);
        const clientMatch = b.client_name?.toLowerCase().includes(q);
        const projMatch = b.project_name?.toLowerCase().includes(q) || b.project?.name.toLowerCase().includes(q);
        if (!nameMatch && !clientMatch && !projMatch) return false;
      }
      return true;
    });
  }, [boqs, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] text-slate-900 dark:text-slate-100 pb-16 relative overflow-x-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-float2" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6 z-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Bill of Quantities (BOQ) & Quotation Suite
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Create room-wise itemized estimates, duplicate templates, and convert approved BOQs to invoices in 1 click
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => navigate(projectIdParam ? `/boq/new?project_id=${projectIdParam}` : '/boq/new')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/20 rounded-xl font-bold h-10 px-4 text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create New BOQ
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total BOQs Created"
            value={`${stats.totalCount} Estimates`}
            icon={<PieChart className="w-5 h-5 text-white" />}
            glowColor="purple"
          />
          <CustomKpiCard
            title="Total Quoted Value"
            value={formatCurrency(stats.totalValue)}
            icon={<FileText className="w-5 h-5 text-white" />}
            glowColor="blue"
          />
          <CustomKpiCard
            title="Approved BOQs"
            value={`${stats.approvedCount} Ready`}
            icon={<CheckCircle2 className="w-5 h-5 text-white" />}
            glowColor="emerald"
          />
          <CustomKpiCard
            title="Draft Estimates"
            value={`${stats.draftCount} Pending`}
            icon={<AlertCircle className="w-5 h-5 text-white" />}
            glowColor="amber"
          />
        </div>

        {/* Filters */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Estimates' },
              { id: 'draft', label: '📝 Draft' },
              { id: 'sent', label: '📤 Sent to Client' },
              { id: 'approved', label: '✅ Approved' },
              { id: 'rejected', label: '❌ Rejected' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search BOQ name, client, site..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl h-8 text-xs px-2.5">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6"><CardSkeleton count={4} /></div>
          ) : filteredBoqs.length === 0 ? (
            <EmptyState
              title="No BOQs / Estimates Found"
              description="Create your first room-wise Bill of Quantities to send standardized quotations to construction and interior clients."
              icon={<PieChart className="w-12 h-12 text-slate-300" />}
              action={
                <Button onClick={() => navigate('/boq/new')} className="bg-purple-600 text-white rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Create First BOQ
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">BOQ / Estimate Name</th>
                    <th className="p-4">Client & Project</th>
                    <th className="p-4">Validity Date</th>
                    <th className="p-4 text-right">Total Amount (₹)</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {filteredBoqs.map(boq => (
                    <tr key={boq.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        <span className="text-xs font-mono text-purple-600 block mb-0.5">BOQ-{String(boq.id).padStart(4, '0')}</span>
                        {boq.name}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" /> {boq.client_name || 'General Client'}
                        </span>
                        {(boq.project_name || boq.project?.name) && (
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-500" /> {boq.project_name || boq.project?.name}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-600">
                        {boq.validity_date ? new Date(boq.validity_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-slate-100 text-base">
                        {formatCurrency(boq.total_amount || 0)}
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={boq.status}
                          onChange={(e) => statusMutation.mutate({ id: boq.id, status: e.target.value })}
                          disabled={statusMutation.isPending}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer appearance-none text-center ${
                            boq.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            boq.status === 'rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            boq.status === 'sent' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <option value="draft">DRAFT</option>
                          <option value="sent">SENT</option>
                          <option value="approved">APPROVED</option>
                          <option value="rejected">REJECTED</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/boq/${boq.id}/edit`)}
                            title="Edit BOQ"
                            className="h-8 w-8 p-0 text-slate-500 hover:text-amber-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateMutation.mutate(boq.id)}
                            disabled={duplicateMutation.isPending}
                            title="Duplicate BOQ Template"
                            className="h-8 w-8 p-0 text-slate-500 hover:text-purple-600"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDownloadPdf(e, boq.id)}
                            title="Print / View PDF Data"
                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => convertMutation.mutate(boq.id)}
                            disabled={convertMutation.isPending}
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2.5 font-bold shadow-sm"
                            title="Convert to Sales Invoice"
                          >
                            <ArrowRight className="w-3.5 h-3.5 mr-1" />
                            To Invoice
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete BOQ "${boq.name}"?`)) {
                                deleteMutation.mutate(boq.id);
                              }
                            }}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
