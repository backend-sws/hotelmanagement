import { useState } from 'react';
import { Plus, Search, Users, ShieldAlert, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { Input } from '@/components/ui/input';
import { useHotelGuests } from '../api/useGuests';
import { GuestFormModal } from '../components/GuestFormModal';
import type { HotelGuest } from '../schemas/guestSchema';
import { useDebounce } from '@/hooks/useDebounce';

export function GuestsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<HotelGuest | null>(null);

  const { data: response, isLoading } = useHotelGuests(debouncedSearch, page);
  const guests: HotelGuest[] = response?.data || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Massive Fintech Mesh Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 pb-14 space-y-6 z-10">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-20">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center">
                <Users className="w-6 h-6 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  Guest Directory <span className="text-blue-600 dark:text-blue-400 text-base font-bold px-2 py-0.5 rounded-md bg-blue-500/10">Profiles</span>
                </h1>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Manage your hotel guests, corporate clients, and blacklisted profiles.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <Button onClick={() => { setEditingGuest(null); setAddOpen(true); }} className="rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 px-4 h-10 text-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              New Guest
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="w-full bg-white/80 dark:bg-[#111118]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm relative z-30">
          <div className="relative max-w-md">
            <Search className="absolute z-10 pointer-events-none left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-11 bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 rounded-xl focus-visible:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Guest Grid */}
        <div className="relative z-30">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <CardSkeleton count={8} />
            </div>
          ) : guests.length === 0 ? (
            <div className="bg-white/50 dark:bg-[#111118]/50 backdrop-blur-md border border-slate-200/80 dark:border-white/10 rounded-2xl p-16 text-center shadow-sm">
              <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-6 opacity-50" />
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No guests found</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Start by adding your first guest profile.</p>
              <Button onClick={() => { setEditingGuest(null); setAddOpen(true); }} className="bg-blue-600 hover:bg-blue-700 rounded-xl font-bold px-6">Add Guest</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  onClick={() => { setEditingGuest(guest); setAddOpen(true); }}
                  className="group relative bg-white/80 dark:bg-[#111118]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 p-5 rounded-2xl cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {/* Accent line */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${guest.is_blacklisted ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity'}`} />
                  
                  <div className="flex justify-between items-start mb-4 mt-1">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{guest.name}</h3>
                      {guest.company_name && (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full mt-1 inline-block">{guest.company_name}</span>
                      )}
                    </div>
                    {guest.is_blacklisted && (
                      <div className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 p-1.5 rounded-lg shrink-0 border border-rose-200 dark:border-rose-500/30">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 mb-5 bg-slate-50 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    {guest.phone && (
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{guest.phone}</span>
                      </div>
                    )}
                    {guest.email && (
                      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{guest.email}</span>
                      </div>
                    )}
                    {!guest.phone && !guest.email && (
                      <div className="text-xs text-slate-400 italic">No contact details provided</div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-auto bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                    <div className="text-xs">
                      <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-0.5">Total Stays</div>
                      <div className="font-black text-slate-800 dark:text-slate-200 text-base">{guest.total_stays || 0}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                    <div className="text-xs text-right">
                      <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-0.5">Total Spent</div>
                      <div className="font-black text-emerald-600 dark:text-emerald-400 text-base">₹{(guest.total_spent || 0).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <GuestFormModal
        isOpen={isAddOpen}
        onClose={() => { setAddOpen(false); setEditingGuest(null); }}
        editingGuest={editingGuest}
      />
    </div>
  );
}
