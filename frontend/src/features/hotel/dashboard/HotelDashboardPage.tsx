import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  BedDouble, Users, CheckSquare, Clock, Wrench, BarChart3,
  TrendingUp, ArrowRight, ArrowLeft, RefreshCw, Wifi, Ban,
  IndianRupee, CalendarCheck, LogOut, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { useCheckInBooking } from '../bookings/api/useBookings';
import {
  useHotelDashboardStats,
  useHotelRoomGrid,
  useTodayArrivals,
  useTodayDepartures,
  type RoomGridItem,
} from './api/useHotelDashboard';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  available:   { label: 'Available',    bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-500/40', dot: 'bg-emerald-500' },
  occupied:    { label: 'Occupied',     bg: 'bg-rose-50 dark:bg-rose-500/10',       text: 'text-rose-700 dark:text-rose-400',       border: 'border-rose-300 dark:border-rose-500/40',       dot: 'bg-rose-500' },
  reserved:    { label: 'Reserved',     bg: 'bg-amber-50 dark:bg-amber-500/10',     text: 'text-amber-700 dark:text-amber-400',     border: 'border-amber-300 dark:border-amber-500/40',     dot: 'bg-amber-500' },
  dirty:       { label: 'Dirty',        bg: 'bg-slate-100 dark:bg-slate-800/60',    text: 'text-slate-600 dark:text-slate-400',     border: 'border-slate-300 dark:border-slate-600',        dot: 'bg-slate-400' },
  maintenance: { label: 'Maintenance',  bg: 'bg-orange-50 dark:bg-orange-500/10',   text: 'text-orange-700 dark:text-orange-400',   border: 'border-orange-300 dark:border-orange-500/40',   dot: 'bg-orange-500' },
  blocked:     { label: 'Blocked',      bg: 'bg-purple-50 dark:bg-purple-500/10',   text: 'text-purple-700 dark:text-purple-400',   border: 'border-purple-300 dark:border-purple-500/40',   dot: 'bg-purple-500' },
};

function RoomCard({ room, onClick }: { room: RoomGridItem; onClick: () => void }) {
  const cfg = STATUS_CONFIG[room.status] ?? STATUS_CONFIG.available;
  return (
    <button
      onClick={onClick}
      className={`relative group rounded-2xl border-2 p-3 text-left transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${cfg.bg} ${cfg.border}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-lg font-black ${cfg.text}`}>{room.room_number}</span>
        <span className={`w-2.5 h-2.5 rounded-full mt-1 ${cfg.dot}`} />
      </div>
      <div className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text} opacity-70 mb-1`}>
        {room.room_type || '—'}
      </div>
      {room.guest_name && (
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
          {room.guest_name}
        </div>
      )}
      {room.check_out_date && room.status === 'occupied' && (
        <div className="text-[10px] text-slate-500 mt-0.5">
          Out: {format(new Date(room.check_out_date), 'dd MMM')}
        </div>
      )}
      {room.balance_due && room.balance_due > 0 ? (
        <div className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
          ₹{room.balance_due.toLocaleString()}
        </div>
      ) : null}
    </button>
  );
}

export function HotelDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const checkIn = useCheckInBooking();

  const { data: stats, isLoading: statsLoading } = useHotelDashboardStats();
  const { data: roomGrid = [], isLoading: gridLoading } = useHotelRoomGrid();
  const { data: arrivals = [], isLoading: arrivalsLoading } = useTodayArrivals();
  const { data: departures = [], isLoading: departuresLoading } = useTodayDepartures();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['hotel-dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['hotel-room-grid'] });
    queryClient.invalidateQueries({ queryKey: ['hotel-today-arrivals'] });
    queryClient.invalidateQueries({ queryKey: ['hotel-today-departures'] });
    toast.success('Dashboard refreshed');
  };

  const handleQuickCheckIn = async (bookingId: number) => {
    if (!confirm('Check in this guest now?')) return;
    try {
      await checkIn.mutateAsync(bookingId);
      toast.success('Checked in successfully!');
      handleRefresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  // Group rooms by floor
  const floorGroups = roomGrid.reduce((acc: Record<string, RoomGridItem[]>, room) => {
    const floor = room.floor || 'Ground';
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {});

  const kpiCards = [
    { label: 'Total Rooms', value: stats?.total_rooms ?? '—', icon: <BedDouble />, glowColor: 'blue' as const },
    { label: 'Occupied', value: stats?.occupied ?? '—', icon: <Users />, glowColor: 'rose' as const },
    { label: 'Available', value: stats?.available ?? '—', icon: <CheckSquare />, glowColor: 'emerald' as const },
    { label: 'Reserved', value: stats?.reserved ?? '—', icon: <Clock />, glowColor: 'amber' as const },
    { label: 'Dirty', value: stats?.dirty ?? '—', icon: <RefreshCw />, glowColor: 'indigo' as const },
    { label: 'Occupancy', value: stats ? `${stats.occupancy_percent}%` : '—', icon: <BarChart3 />, glowColor: 'purple' as const },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100">

      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hotel Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Live property overview · Auto-refreshes every 30s · {format(new Date(), 'dd MMM yyyy, HH:mm')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="rounded-xl font-bold">
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </Button>
            <Button size="sm" onClick={() => navigate('/hotel/front-desk')} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white">
              <BedDouble className="w-4 h-4 mr-2" />Front Desk
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiCards.map(card => (
            <CustomKpiCard
              key={card.label}
              title={card.label}
              value={statsLoading ? '...' : card.value}
              icon={card.icon}
              glowColor={card.glowColor}
            />
          ))}
        </div>

        {/* Revenue + Arrivals/Departures quick info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/60 dark:border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2.5 rounded-xl">
              <IndianRupee className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Revenue</div>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {statsLoading ? '...' : `₹${(stats?.revenue_today ?? 0).toLocaleString()}`}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-200/60 dark:border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-500/20 p-2.5 rounded-xl">
              <LogIn className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Arrivals Today</div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">
                {statsLoading ? '...' : stats?.arrivals_today ?? 0}
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-200/60 dark:border-rose-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-rose-100 dark:bg-rose-500/20 p-2.5 rounded-xl">
              <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Departures Today</div>
              <div className="text-xl font-black text-rose-700 dark:text-rose-400">
                {statsLoading ? '...' : stats?.departures_today ?? 0}
              </div>
            </div>
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

          {/* Room Grid */}
          <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-blue-500" />Live Room Grid
              </h2>
              {/* Legend */}
              <div className="hidden sm:flex flex-wrap gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />{cfg.label}
                  </div>
                ))}
              </div>
            </div>

            {gridLoading ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 animate-pulse">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-100 dark:bg-white/5 rounded-2xl" />
                ))}
              </div>
            ) : roomGrid.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <BedDouble className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No rooms configured yet</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/hotel/rooms')}>
                  Add Rooms
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(floorGroups).sort(([a], [b]) => a.localeCompare(b)).map(([floor, rooms]) => (
                  <div key={floor}>
                    <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                      {floor} Floor
                      <span className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-2">
                      {rooms.map(room => (
                        <RoomCard
                          key={room.id}
                          room={room}
                          onClick={() => room.booking_id ? navigate(`/hotel/bookings/${room.booking_id}`) : navigate('/hotel/front-desk')}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Today's Arrivals + Departures */}
          <div className="space-y-4">

            {/* Arrivals */}
            <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <div className="bg-blue-100 dark:bg-blue-500/20 p-1.5 rounded-lg">
                  <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Expected Arrivals · {arrivals.length}
              </h3>
              {arrivalsLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-white/5 rounded-xl" />)}
                </div>
              ) : arrivals.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No expected arrivals today</p>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                  {arrivals.map((booking: any) => (
                    <div key={booking.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl hover:border-blue-200 dark:hover:border-blue-500/30 transition-all">
                      <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black text-sm w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                        {booking.room?.room_number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{booking.guest?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{booking.booking_number} · {booking.total_nights}N</div>
                      </div>
                      <Button
                        size="sm"
                        className="text-xs h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 shrink-0"
                        onClick={() => handleQuickCheckIn(booking.id)}
                      >
                        Check In
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Departures */}
            <div className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <div className="bg-rose-100 dark:bg-rose-500/20 p-1.5 rounded-lg">
                  <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                Expected Departures · {departures.length}
              </h3>
              {departuresLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 dark:bg-white/5 rounded-xl" />)}
                </div>
              ) : departures.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-6">No expected departures today</p>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                  {departures.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-xl hover:border-rose-200 dark:hover:border-rose-500/30 transition-all cursor-pointer"
                      onClick={() => navigate(`/hotel/bookings/${booking.id}`)}
                    >
                      <div className="bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-black text-sm w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                        {booking.room?.room_number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{booking.guest?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{booking.booking_number} · Balance: ₹{(booking.balance_due || 0).toLocaleString()}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
