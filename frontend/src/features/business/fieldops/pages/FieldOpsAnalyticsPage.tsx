import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Sparkles, 
  DollarSign, 
  Navigation, 
  Smartphone, 
  Activity, 
  ArrowUpRight,
  RefreshCw,
  Wallet,
  Radio,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFieldOpsAnalytics } from '../api/useRadar';

export default function FieldOpsAnalyticsPage() {
  const { data, isLoading, refetch, isFetching } = useFieldOpsAnalytics();

  const tasks = data?.tasks || {
    total: 0,
    completed: 0,
    in_transit: 0,
    completion_rate: 0,
    avg_turnaround_hrs: 0,
  };

  const mileage = data?.mileage || {
    month: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
    total_km: 0,
    total_spend: 0,
    approved_spend: 0,
    burn_rate_per_day: 0,
  };

  const aiFraud = data?.ai_fraud || {
    total_checked: 0,
    avg_confidence: 96.5,
    spoofs_prevented: 0,
    estimated_savings: 0,
  };

  const attendance = data?.attendance || {
    total_punches: 0,
    compliance_rate: 100,
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Field Operations & ROI Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Executive telemetry covering automated WhatsApp bot dispatches, Gemini 1.5 Flash fraud audits, and GPS travel expenditure.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/fieldops/radar"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-500" />
            Live Radar Map
          </Link>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh Metrics
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Task Completion Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Task Completion Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {tasks.completion_rate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({tasks.completed} / {tasks.total} done)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${tasks.completion_rate}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>In Transit: {tasks.in_transit}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ~{tasks.avg_turnaround_hrs}h avg turnaround
            </span>
          </div>
        </div>

        {/* Card 2: Travel & Mileage Burn */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Monthly Travel Spend ({mileage.month})
            </span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              ₹{mileage.total_spend.toLocaleString()}
            </span>
            <span className="text-xs text-cyan-500 font-semibold">
              {mileage.total_km.toFixed(0)} KM
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (mileage.approved_spend / (mileage.total_spend || 1)) * 100)}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Approved: ₹{mileage.approved_spend.toLocaleString()}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ₹{mileage.burn_rate_per_day.toFixed(0)}/day burn
            </span>
          </div>
        </div>

        {/* Card 3: Gemini 1.5 Flash AI Anti-Fraud */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              AI Vision Fraud Shield
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {aiFraud.spoofs_prevented}
            </span>
            <span className="text-xs text-purple-400 font-semibold">
              Intercepted Fake Proofs
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${aiFraud.avg_confidence}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{aiFraud.total_checked} Audited</span>
            <span className="font-semibold text-emerald-500">
              +₹{aiFraud.estimated_savings.toLocaleString()} Saved
            </span>
          </div>
        </div>

        {/* Card 4: Geofence Attendance Compliance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Geofence Compliance
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {attendance.compliance_rate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Compliant
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${attendance.compliance_rate}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Punches: {attendance.total_punches}</span>
            <span className="font-semibold text-emerald-500">
              Zero App Installs
            </span>
          </div>
        </div>
      </div>

      {/* Strategic Architecture & ROI Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Enterprise Architecture Comparison */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Zero-App vs Traditional Native Mobile App Model
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparative analysis of operating costs, staff compliance, and rollout speed.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
              85% Lower TCO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* WhatsApp Native Model */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Smartphone className="w-4 h-4" /> WhatsApp Native Automation (Our Model)
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero App Install:</strong> 100% of staff already have WhatsApp installed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Native Camera & GPS:</strong> Zero permission denials or battery-draining background trackers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Prepaid Wallet Metering:</strong> Transparent per-action billing with built-in retail margins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Instant Adoption:</strong> Onboarding time is under 30 seconds via WhatsApp 'Hi'.</span>
                </li>
              </ul>
            </div>

            {/* Traditional App Model */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3 opacity-80">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" /> Traditional Native App Overhead
              </div>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Play Store / App Store approvals and continual maintenance costs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Workers resist downloading heavy monitoring apps on personal phones.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>Constant OS battery optimization kills GPS daemons.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>High friction for transient, contractual, or part-time staff.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Powered by Meta WhatsApp Cloud API & Google Gemini 1.5 Flash</span>
            <Link to="/fieldops/wallet" className="text-cyan-400 hover:underline flex items-center gap-1 font-medium">
              Manage Prepaid Wallet <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Quick Action Navigation */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Operations Links
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/fieldops/radar"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 border border-slate-200 dark:border-slate-700/60 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-500">
                    Live Operations Radar
                  </div>
                  <div className="text-[11px] text-slate-500">Real-time team map & breadcrumbs</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500" />
            </Link>

            <Link
              to="/fieldops/tasks"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700/60 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">
                    Field Tasks Kanban
                  </div>
                  <div className="text-[11px] text-slate-500">Job dispatch & OTP completion</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
            </Link>

            <Link
              to="/fieldops/tada"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-200 dark:border-slate-700/60 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Navigation className="w-4 h-4 text-indigo-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500">
                    TA/DA Travel Claims
                  </div>
                  <div className="text-[11px] text-slate-500">Haversine GPS mileage sync</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
            </Link>

            <Link
              to="/fieldops/proofs"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-slate-700/60 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-4 h-4 text-purple-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-500">
                    GD Photo Watermarks
                  </div>
                  <div className="text-[11px] text-slate-500">Tamper-proof visual gallery</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
            </Link>

            <Link
              to="/fieldops/wallet"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700/60 transition-all text-xs group"
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4 text-amber-500" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500">
                    Prepaid Balance & Topup
                  </div>
                  <div className="text-[11px] text-slate-500">Usage ledger & statement</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
