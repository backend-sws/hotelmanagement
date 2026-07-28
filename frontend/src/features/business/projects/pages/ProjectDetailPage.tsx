import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Building2, ArrowLeft, Plus, MapPin, User, Calendar, DollarSign, 
  Layers, HardHat, Receipt, FileText, PieChart, ExternalLink, Printer, Edit, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { projectService } from '../api/projectService';
import { consumptionService } from '../api/consumptionService';
import { ProjectPnlCard } from '../components/ProjectPnlCard';
import { RecordLabourPaymentModal } from '../components/RecordLabourPaymentModal';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'expenses' | 'consumptions' | 'boq' | 'labour'>('overview');
  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);

  const { data: project, isLoading: projectLoading, refetch: refetchProject } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id!),
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ['project-stats', id],
    queryFn: () => projectService.getStats(id!),
    enabled: !!id,
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['project-invoices', id],
    queryFn: () => projectService.getInvoices(id!),
    enabled: !!id && (activeTab === 'overview' || activeTab === 'invoices'),
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['project-expenses', id],
    queryFn: () => projectService.getExpenses(id!),
    enabled: !!id && (activeTab === 'overview' || activeTab === 'expenses' || activeTab === 'labour'),
  });

  const { data: consumptions = [], isLoading: consumptionsLoading } = useQuery({
    queryKey: ['project-consumptions', id],
    queryFn: () => consumptionService.getConsumptions({ project_id: Number(id) }),
    enabled: !!id && (activeTab === 'overview' || activeTab === 'consumptions'),
  });

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] p-6 max-w-[1600px] mx-auto space-y-6">
        <CardSkeleton count={3} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] p-6 max-w-[1600px] mx-auto">
        <EmptyState
          title="Project Not Found"
          description="The requested project or site does not exist or has been deleted."
          icon={<Building2 className="w-12 h-12 text-slate-300" />}
          action={<Button onClick={() => navigate('/business/projects')}>Back to Projects</Button>}
        />
      </div>
    );
  }

  const labourExpenses = expenses.filter((e: any) => {
    const cat = e.category?.name ? e.category.name.toLowerCase() : '';
    const title = e.title ? e.title.toLowerCase() : '';
    return cat.includes('labour') || title.includes('labour');
  });

  const otherExpenses = expenses.filter((e: any) => {
    const cat = e.category?.name ? e.category.name.toLowerCase() : '';
    const title = e.title ? e.title.toLowerCase() : '';
    return !cat.includes('labour') && !title.includes('labour');
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] text-slate-900 dark:text-slate-100 pb-20 relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/business/projects')}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-0.5 rounded-md">
                  {project.project_code || 'PROJ'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  project.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                  project.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {project.status.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                {project.name}
              </h1>
              {project.client_name && (
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  Client: <strong className="text-slate-800 dark:text-slate-200">{project.client_name}</strong> {project.client_phone ? `(${project.client_phone})` : ''}
                  {project.site_address && ` • Site: ${project.site_address}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Button
              onClick={() => navigate(`/projects/${project.id}/consumptions/new`)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs h-10 px-4 shadow-sm"
            >
              <Layers className="w-4 h-4 mr-1.5" />
              Record Material Used
            </Button>
            <Button
              onClick={() => navigate(`/boq/new?project_id=${project.id}`)}
              variant="outline"
              className="rounded-xl font-bold text-xs h-10 px-4 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            >
              <FileText className="w-4 h-4 mr-1.5 text-blue-600" />
              Create BOQ
            </Button>
          </div>
        </div>

        {/* Real-Time P&L 360 Card */}
        <ProjectPnlCard summary={stats || project.summary} />

        {/* Navigation Tabs */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview & Details', count: null },
            { id: 'invoices', label: '🧾 Sales Invoices', count: invoices.length },
            { id: 'consumptions', label: '🧱 Material Consumed', count: consumptions.length },
            { id: 'expenses', label: '💸 Site Expenses', count: otherExpenses.length },
            { id: 'labour', label: '👷‍♂️ Labour & Wages', count: labourExpenses.length },
            { id: 'boq', label: '📋 BOQs / Quotations', count: null },
          ].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-[#111118] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Project Specification & Scope
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-semibold mb-1">Site Godown / Location</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {project.location?.name || 'Main Warehouse'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block uppercase font-semibold mb-1">City / Territory</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {project.city || 'Gurgaon / NCR'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block uppercase font-semibold mb-1">Start Date</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block uppercase font-semibold mb-1">Target Completion</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Ongoing'}
                  </span>
                </div>
              </div>

              {project.notes && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block uppercase font-semibold mb-1">Scope & Notes</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    {project.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#111118] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
                ⚡ Quick Site Actions
              </h3>
              <div className="space-y-2.5">
                <Button 
                  onClick={() => navigate(`/projects/${project.id}/consumptions/new`)}
                  className="w-full justify-start bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold text-xs h-11"
                >
                  <Layers className="w-4 h-4 mr-2.5 text-emerald-600" />
                  Record Material Consumed (Stock Out)
                </Button>
                <Button 
                  onClick={() => navigate(`/invoices/new?project_id=${project.id}`)}
                  className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl font-bold text-xs h-11"
                >
                  <FileText className="w-4 h-4 mr-2.5 text-blue-600" />
                  Create Sales Invoice for Site
                </Button>
                <Button 
                  onClick={() => navigate(`/expenses/new?project_id=${project.id}`)}
                  className="w-full justify-start bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-bold text-xs h-11"
                >
                  <Receipt className="w-4 h-4 mr-2.5 text-rose-600" />
                  Record Site Expense / Petty Cash
                </Button>
                <Button 
                  onClick={() => navigate(`/boq?project_id=${project.id}`)}
                  className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl font-bold text-xs h-11"
                >
                  <PieChart className="w-4 h-4 mr-2.5 text-purple-600" />
                  View Room-wise BOQs
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Sales Invoices */}
        {activeTab === 'invoices' && (
          <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Invoices Billed for this Project
              </h3>
              <Button onClick={() => navigate(`/invoices/new?project_id=${project.id}`)} size="sm" className="bg-blue-600 text-white rounded-xl text-xs font-bold">
                <Plus className="w-4 h-4 mr-1.5" /> New Invoice
              </Button>
            </div>
            {invoicesLoading ? (
              <div className="p-6"><CardSkeleton count={2} /></div>
            ) : invoices.length === 0 ? (
              <EmptyState title="No Invoices Linked" description="No sales invoices have been billed against this project yet." icon={<FileText className="w-10 h-10 text-slate-300" />} />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4 text-right">Total Amount</th>
                    <th className="p-4 text-right">Paid</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-4 font-bold text-blue-600">{inv.invoice_number}</td>
                      <td className="p-4 text-slate-600">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="p-4 text-slate-800 font-medium">{inv.customer?.name || project.client_name}</td>
                      <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200">{formatCurrency(inv.final_amount)}</td>
                      <td className="p-4 text-right font-bold text-emerald-600">{formatCurrency(inv.paid_amount)}</td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">{inv.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Content 3: Material Consumptions */}
        {activeTab === 'consumptions' && (
          <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" />
                Material Consumption Slips (Stock Deducted)
              </h3>
              <Button onClick={() => navigate(`/projects/${project.id}/consumptions/new`)} size="sm" className="bg-emerald-600 text-white rounded-xl text-xs font-bold">
                <Plus className="w-4 h-4 mr-1.5" /> Record Material
              </Button>
            </div>
            {consumptionsLoading ? (
              <div className="p-6"><CardSkeleton count={2} /></div>
            ) : consumptions.length === 0 ? (
              <EmptyState title="No Material Consumed" description="No cement, steel, bricks, or fixtures have been recorded as consumed on this site yet." icon={<Layers className="w-10 h-10 text-slate-300" />} />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Slip #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Items Count</th>
                    <th className="p-4">Issued By</th>
                    <th className="p-4 text-right font-bold">Total Cost (₹)</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {consumptions.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-4 font-bold font-mono text-emerald-600">{c.consumption_number}</td>
                      <td className="p-4 text-slate-600">{new Date(c.date).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{c.total_items_count || c.items?.length || 0} Items</td>
                      <td className="p-4 text-slate-600">{c.entered_by_user?.name || 'Supervisor'}</td>
                      <td className="p-4 text-right font-bold text-rose-600">{formatCurrency(c.total_cost || 0)}</td>
                      <td className="p-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(`/api/v1/business/material-consumptions/${c.id}/slip`, '_blank')} 
                          className="h-8 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <Printer className="w-3.5 h-3.5 mr-1" /> Print Slip
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Content 4: Site Expenses */}
        {activeTab === 'expenses' && (
          <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-500" />
                Other Site Expenses & Petty Cash
              </h3>
              <Button onClick={() => navigate(`/expenses/new?project_id=${project.id}`)} size="sm" className="bg-rose-600 text-white rounded-xl text-xs font-bold">
                <Plus className="w-4 h-4 mr-1.5" /> Record Expense
              </Button>
            </div>
            {otherExpenses.length === 0 ? (
              <EmptyState title="No Site Expenses" description="No petty cash, transport, or site overhead expenses recorded yet." icon={<Receipt className="w-10 h-10 text-slate-300" />} />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Date</th>
                    <th className="p-4">Category / Title</th>
                    <th className="p-4">Payment Mode</th>
                    <th className="p-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {otherExpenses.map((exp: any) => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-4 text-slate-600">{new Date(exp.expense_date || exp.created_at).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {exp.description || exp.title || 'Expense'}
                        {exp.category && <span className="block text-xs font-normal text-slate-400">{typeof exp.category === 'string' ? exp.category : exp.category?.name || 'General'}</span>}
                      </td>
                      <td className="p-4 text-slate-600">{exp.payment_method || 'Cash'}</td>
                      <td className="p-4 text-right font-bold text-rose-600">{formatCurrency(exp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Content 5: Labour & Wages */}
        {activeTab === 'labour' && (
          <div className="bg-white dark:bg-[#111118] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-amber-500" />
                Worker Wages & Daily Labour Expenses
              </h3>
              <Button onClick={() => setIsLabourModalOpen(true)} size="sm" className="bg-amber-600 text-white rounded-xl text-xs font-bold">
                <Plus className="w-4 h-4 mr-1.5" /> Record Labour Wage
              </Button>
            </div>
            {labourExpenses.length === 0 ? (
              <EmptyState title="No Labour Payments" description="No daily wages or contractor payments recorded for this site yet." icon={<HardHat className="w-10 h-10 text-slate-300" />} />
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4">Date</th>
                    <th className="p-4">Worker / Description</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {labourExpenses.map((exp: any) => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="p-4 text-slate-600">{new Date(exp.expense_date || exp.created_at).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {exp.description || exp.title || 'Labour Wage'}
                        {exp.notes && <span className="block text-xs font-normal text-slate-500">{exp.notes}</span>}
                      </td>
                      <td className="p-4 text-slate-600">{exp.payment_method || 'Cash'}</td>
                      <td className="p-4 text-right font-bold text-amber-600">{formatCurrency(exp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab Content 6: BOQ */}
        {activeTab === 'boq' && (
          <div className="bg-white dark:bg-[#111118] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <PieChart className="w-12 h-12 text-purple-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Room-Wise BOQ Suite</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Create detailed itemized quotations grouped by rooms or sections (e.g., Living Room, Kitchen, Electricals) and convert them to invoices with 1-click.
            </p>
            <Button onClick={() => navigate(`/boq?project_id=${project.id}`)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 rounded-xl">
              Open BOQ Builder
            </Button>
          </div>
        )}
      </div>

      <RecordLabourPaymentModal
        isOpen={isLabourModalOpen}
        onClose={() => setIsLabourModalOpen(false)}
        defaultProjectId={Number(id)}
      />
    </div>
  );
}
