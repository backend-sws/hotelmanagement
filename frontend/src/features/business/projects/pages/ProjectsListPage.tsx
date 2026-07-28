import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Plus, Search, Filter, Layers, TrendingUp, DollarSign, 
  LayoutGrid, List, AlertCircle, RefreshCw, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { EmptyState } from '@/components/ui/empty-state';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { projectService, type Project } from '../api/projectService';
import { ProjectCard } from '../components/ProjectCard';
import { formatCurrency } from '@/lib/formatters';

export default function ProjectsListPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: projects = [], isLoading, refetch, isError } = useQuery({
    queryKey: ['projects', statusFilter !== 'all' ? statusFilter : undefined, searchQuery],
    queryFn: () => projectService.getProjects({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined,
    }),
  });

  const stats = useMemo(() => {
    let activeCount = 0;
    let totalContract = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    projects.forEach(p => {
      if (p.status === 'active') activeCount++;
      totalContract += (p.contract_value || 0);
      const net = p.net_profit || 0;
      if (net >= 0) totalProfit += net;
      else totalLoss += Math.abs(net);
    });

    return { activeCount, totalContract, totalProfit, totalLoss };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchClient = p.client_name?.toLowerCase().includes(q);
        const matchCode = p.project_code?.toLowerCase().includes(q);
        const matchCity = p.city?.toLowerCase().includes(q);
        if (!matchName && !matchClient && !matchCode && !matchCity) return false;
      }
      return true;
    });
  }, [projects, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0A0A10] text-slate-900 dark:text-slate-100 pb-16 relative overflow-x-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-float2" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-12 space-y-6 z-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Projects & Sites Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Track site progress, real-time material consumption, BOQs, and profitability
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/projects/new')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 rounded-xl font-bold h-10 px-4 text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Project
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Active Projects"
            value={`${stats.activeCount} Sites`}
            icon={<Building2 className="w-5 h-5 text-white" />}
            glowColor="blue"
          />
          <CustomKpiCard
            title="Total Contract Value"
            value={formatCurrency(stats.totalContract)}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            glowColor="emerald"
          />
          <CustomKpiCard
            title="Total Estimated Profit"
            value={formatCurrency(stats.totalProfit)}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            glowColor="purple"
          />
          <CustomKpiCard
            title="Projects in Loss / Deficit"
            value={formatCurrency(stats.totalLoss)}
            icon={<AlertCircle className="w-5 h-5 text-white" />}
            glowColor="rose"
          />
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'active', label: '🟢 Active' },
              { id: 'planning', label: '🔵 Planning' },
              { id: 'on_hold', label: '🟡 On Hold' },
              { id: 'completed', label: '✅ Completed' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
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
                placeholder="Search projects, clients..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
                title="Kanban Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
                }`}
                title="Tabular List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl h-8 text-xs px-2.5">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={6} />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title="No Projects Found"
            description={searchQuery || statusFilter !== 'all' ? "Try adjusting your search query or status filters." : "Create your first site or construction project to get started."}
            icon={<Building2 className="w-12 h-12 text-slate-300" />}
            action={
              <Button onClick={() => navigate('/projects/new')} className="bg-blue-600 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            }
          />
        ) : viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111118] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Code / Project</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">City</th>
                    <th className="p-4 text-right">Contract Value</th>
                    <th className="p-4 text-right">Est. Profit</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-medium">
                  {filteredProjects.map(project => {
                    const profit = project.net_profit ?? 0;
                    return (
                      <tr
                        key={project.id}
                        onClick={() => navigate(`/business/projects/${project.id}`)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                      >
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                          <span className="text-xs font-mono text-slate-400 block mb-0.5">{project.project_code || 'PROJ'}</span>
                          {project.name}
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">
                          {project.client_name || 'N/A'}
                          {project.client_phone && <span className="block text-xs text-slate-400">{project.client_phone}</span>}
                        </td>
                        <td className="p-4 text-slate-500">{project.city || 'Primary'}</td>
                        <td className="p-4 text-right font-bold text-slate-800 dark:text-slate-200">
                          {formatCurrency(project.contract_value || 0)}
                        </td>
                        <td className={`p-4 text-right font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {formatCurrency(profit)}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            project.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            project.status === 'completed' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {project.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
