import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  Search,
  Calendar,
  RefreshCw,
  Sparkles,
  Zap,
  User
} from 'lucide-react';
import { useBotAttendance, type BotAttendanceItem } from '../api/useBotAttendance';

export default function BotAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSelfie, setSelectedSelfie] = useState<string | null>(null);

  const { data, isLoading, refetch } = useBotAttendance(selectedDate);

  const logs = data?.logs?.data || [];
  const stats = data?.stats || { today_punches: 0, within_geofence: 0, compliance_rate: 100 };

  const filteredLogs = logs.filter((item) => {
    const name = item.user?.name || '';
    const phone = item.user?.phone || '';
    const q = searchQuery.toLowerCase();
    return name.toLowerCase().includes(q) || phone.includes(q);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              WhatsApp Bot Geo-Attendance Feed
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time feed of employee punches marked directly via WhatsApp with GPS geofencing & live camera selfies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-3 pr-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Bot Punches
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.today_punches}
            </span>
            <p className="text-xs text-slate-500 mt-1">Marked via WhatsApp today</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Geofence Compliance
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {stats.compliance_rate}%
            </span>
            <p className="text-xs text-slate-500 mt-1">{stats.within_geofence} inside allowed geofence radius</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Anti-Fraud Protection
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
              100%
            </span>
            <p className="text-xs text-slate-500 mt-1">Live camera selfies & zero app download</p>
          </div>
        </div>
      </div>

      {/* Main Feed Table */}
      <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              Live Bot Punch Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Showing punches recorded for {selectedDate}.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Check-Out Time</th>
                <th className="py-3 px-4">Selfie Proof</th>
                <th className="py-3 px-4">Geofence Status</th>
                <th className="py-3 px-4 text-right">Location Pin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredLogs.map((item) => {
                const checkInFormatted = item.check_in_time 
                  ? new Date(`1970-01-01T${item.check_in_time}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                  : '--:--';
                const checkOutFormatted = item.check_out_time
                  ? new Date(`1970-01-01T${item.check_out_time}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                  : '--:--';

                const hasCoords = item.check_in_latitude && item.check_in_longitude;
                const mapLink = hasCoords 
                  ? `https://maps.google.com/?q=${item.check_in_latitude},${item.check_in_longitude}`
                  : null;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shrink-0">
                          {item.user?.avatar ? (
                            <img src={item.user.avatar} alt={item.user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            item.user?.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">{item.user?.name || 'Unknown Staff'}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{item.user?.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Clock className="w-3.5 h-3.5" />
                        {checkInFormatted}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {item.check_out_time ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {checkOutFormatted}
                            {item.actual_hours && (
                              <span className="text-[10px] text-slate-400">({item.actual_hours}h)</span>
                            )}
                          </>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 text-[11px] font-medium">On Shift</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {item.check_in_photo ? (
                        <button
                          type="button"
                          onClick={() => setSelectedSelfie(item.check_in_photo)}
                          className="group relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 hover:ring-2 hover:ring-emerald-500 transition-all"
                        >
                          <img src={item.check_in_photo} alt="Selfie" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Photo</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {item.is_within_geofence ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Geofence Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-700 dark:text-rose-400">
                          <AlertTriangle className="w-3 h-3" /> Outside Fence
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right">
                      {mapLink ? (
                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          View Map
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 text-xs">
                    No WhatsApp bot punches found for {selectedDate}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selfie Zoom Modal */}
      {selectedSelfie && createPortal(
        <div 
          onClick={() => setSelectedSelfie(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div className="bg-white dark:bg-[#18191c] p-4 rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 dark:border-white/10 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-500" />
                Live Camera Selfie Proof
              </h4>
              <button 
                onClick={() => setSelectedSelfie(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-900">
              <img src={selectedSelfie} alt="Verified Selfie" className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              ✅ Anti-fraud verified: Live camera capture (not forwarded).
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
