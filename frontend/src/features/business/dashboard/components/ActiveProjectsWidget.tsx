import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, HardHat, ArrowUpRight, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProjectSummary {
  id: number;
  name: string;
  project_code: string;
  client_name: string;
  contract_value: number;
  total_cost: number;
  progress: number;
}

interface ActiveProjectsWidgetProps {
  projects: ProjectSummary[];
}

export function ActiveProjectsWidget({ projects = [] }: ActiveProjectsWidgetProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-5 bg-white dark:bg-[#11111a] border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Active Running Projects
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Site consumption vs contract value BOQ
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30">
            {projects.length} Active
          </span>
        </div>

        {/* List */}
        {projects.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center mx-auto border border-blue-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No Running Site Projects
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[250px] mx-auto">
              Create a new construction or contracting project to monitor site inventory consumption and BOQ margins.
            </p>
            <Button
              onClick={() => navigate('/projects/new')}
              size="sm"
              className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Start First Project
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[260px] overflow-y-auto pr-1 space-y-3">
            {projects.map((proj) => {
              const isOverBudget = proj.total_cost > proj.contract_value && proj.contract_value > 0;

              return (
                <div 
                  key={proj.id} 
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="pt-2.5 first:pt-0 cursor-pointer group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 p-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors truncate">
                        {proj.name}
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {proj.project_code} • {proj.client_name || 'Direct Site'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        ₹{proj.total_cost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        of ₹{proj.contract_value.toLocaleString('en-IN')} budget
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, proj.progress)}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-rose-600' : proj.progress > 80 ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold w-9 text-right ${
                      isOverBudget ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {proj.progress}%
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
          onClick={() => navigate('/projects')}
          variant="ghost"
          size="sm"
          className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          View All Projects & BOQ Suite <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </Card>
  );
}
