import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Calendar, DollarSign, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import type { Project } from '../api/projectService';
import { formatCurrency } from '@/lib/formatters';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">🔵 Planning</span>;
      case 'active':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Active</span>;
      case 'on_hold':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">🟡 On Hold</span>;
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">✅ Completed</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const profit = project.net_profit ?? 0;
  const isProfit = profit >= 0;

  return (
    <div 
      onClick={() => navigate(`/business/projects/${project.id}`)}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold font-mono tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {project.project_code || 'PROJ'}
          </span>
          {getStatusBadge(project.status)}
        </div>

        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="truncate">{project.name}</span>
        </h3>

        {project.client_name && (
          <p className="text-sm text-slate-600 flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{project.client_name} {project.client_phone ? `(${project.client_phone})` : ''}</span>
          </p>
        )}

        {project.start_date && (
          <p className="text-xs text-slate-500 flex items-center gap-2 mb-4">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-slate-50/50 -mx-5 -mb-5 p-5 rounded-b-2xl">
        <div>
          <span className="text-xs text-slate-500 block mb-0.5">Contract Value</span>
          <span className="text-sm font-bold text-slate-800 flex items-center gap-0.5">
            {formatCurrency(project.contract_value || 0)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block mb-0.5">Est. Net Profit</span>
          <span className={`text-sm font-bold flex items-center justify-end gap-1 ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatCurrency(profit)}
          </span>
        </div>
      </div>
    </div>
  );
};
