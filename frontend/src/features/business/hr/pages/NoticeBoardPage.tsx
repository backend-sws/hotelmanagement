import React, { useState, useMemo } from 'react';
import { formatDistanceToNow, parseISO, format } from 'date-fns';
import {
  useNotices, useCreateNotice, useDeleteNotice,
  useMarkNoticeRead, useTogglePin,
} from '../api/useNotices';
import { useStaff } from '../../staff/api/useStaff';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { CustomKpiCard } from '@/components/ui/CustomKpiCard';
import { FilterContainer, FilterSearch } from '@/components/ui/filter-controls';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuthStore } from '@/store/authStore';
import {
  Bell, Plus, Trash2, Pin, PinOff, Users,
  Lock, RefreshCw, Megaphone, CheckCheck,
  Calendar, Clock, User, Sparkles, Filter, AlertCircle,
} from 'lucide-react';

const VISIBILITY_CONFIG = {
  public: { label: 'Public', icon: Users, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  private: { label: 'Private', icon: Lock, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
};

export default function NoticeBoardPage() {
  const user = useAuthStore(s => s.user);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [search, setSearch] = useState('');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    body: '',
    visibility: 'public' as 'public' | 'private',
    target_user_id: '',
    is_pinned: false,
    expires_at: '',
  });

  const params = filter === 'all' ? {} : { visibility: filter };
  const { data: noticesData, isLoading, refetch, isFetching } = useNotices(params);
  const { data: staffList } = useStaff();
  const createMutation = useCreateNotice();
  const deleteMutation = useDeleteNotice();
  const markReadMutation = useMarkNoticeRead();
  const pinMutation = useTogglePin();

  const allNotices: any[] = noticesData?.data || noticesData || [];

  const isManager = !!user?.roles?.some((r: any) =>
    ['admin', 'manager', 'Business Admin', 'Superadmin'].includes(r.name)
  );

  // Summary Metrics
  const stats = useMemo(() => {
    const total = allNotices.length;
    const pinned = allNotices.filter(n => n.is_pinned).length;
    const publicCount = allNotices.filter(n => n.visibility === 'public').length;
    const privateCount = allNotices.filter(n => n.visibility === 'private').length;
    const unread = allNotices.filter(n => !n.is_read).length;
    return { total, pinned, publicCount, privateCount, unread };
  }, [allNotices]);

  // Client-side search and pinned filter
  const filteredNotices = useMemo(() => {
    let list = allNotices;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(n =>
        n.title?.toLowerCase().includes(q) ||
        n.body?.toLowerCase().includes(q) ||
        n.posted_by_user?.name?.toLowerCase().includes(q)
      );
    }
    if (pinnedOnly) {
      list = list.filter(n => n.is_pinned);
    }
    return list;
  }, [allNotices, search, pinnedOnly]);

  const pinnedNotices = filteredNotices.filter(n => n.is_pinned);
  const regularNotices = filteredNotices.filter(n => !n.is_pinned);
  const hasActiveFilters = search.trim() !== '' || filter !== 'all' || pinnedOnly;

  const handleCompose = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    createMutation.mutate({
      ...form,
      target_user_id: form.target_user_id ? parseInt(form.target_user_id) : undefined,
      expires_at: form.expires_at || undefined,
    }, {
      onSuccess: () => {
        setIsComposeOpen(false);
        setForm({ title: '', body: '', visibility: 'public', target_user_id: '', is_pinned: false, expires_at: '' });
      },
    });
  };

  const handleOpenNotice = (notice: any) => {
    setSelectedNotice(notice);
    if (!notice.is_read) markReadMutation.mutate(notice.id);
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilter('all');
    setPinnedOnly(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-200">
      {/* Subtle Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -right-[10%] w-[45%] h-[45%] bg-primary-500/5 dark:bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute top-[35%] -left-[15%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      <PageHeader
        title="Notice Board"
        subtitle="Company announcements, official bulletins, and confidential staff messages"
        icon={Bell}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-10 px-3.5 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? 'animate-spin text-primary-500' : ''}`} />
              Refresh
            </Button>
            {isManager && (
              <Button
                variant="brand"
                size="sm"
                onClick={() => setIsComposeOpen(true)}
                className="h-10 px-4 text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Compose Notice
              </Button>
            )}
          </div>
        }
      />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 pb-12 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomKpiCard
            title="Total Notices"
            value={stats.total}
            icon={<Megaphone className="w-5 h-5 text-white" />}
            glowColor="primary"
            subtitle="Active announcements"
          />
          <CustomKpiCard
            title="Pinned Notices"
            value={stats.pinned}
            icon={<Pin className="w-5 h-5 text-white" />}
            glowColor="amber"
            subtitle="High-priority bulletins"
          />
          <CustomKpiCard
            title="Public Updates"
            value={stats.publicCount}
            icon={<Users className="w-5 h-5 text-white" />}
            glowColor="blue"
            subtitle="All employees visible"
          />
          <CustomKpiCard
            title={isManager ? "Private Messages" : "Unread Notices"}
            value={isManager ? stats.privateCount : stats.unread}
            icon={isManager ? <Lock className="w-5 h-5 text-white" /> : <Bell className="w-5 h-5 text-white" />}
            glowColor={isManager ? "purple" : "rose"}
            subtitle={isManager ? "Confidential direct notices" : "Awaiting your attention"}
          />
        </div>

        {/* Filter Controls Bar */}
        <FilterContainer>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Search notice title, author, or content..."
            wrapperClassName="w-72 sm:w-80"
          />

          {/* Segmented Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-zinc-700/60">
            {(['all', 'public', 'private'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {f === 'all' ? (
                  <Megaphone className="w-3.5 h-3.5 text-primary-500" />
                ) : f === 'public' ? (
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>{f}</span>
                <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  filter === f ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400' : 'bg-slate-200/60 dark:bg-zinc-700/60 text-slate-500'
                }`}>
                  {f === 'all' ? stats.total : f === 'public' ? stats.publicCount : stats.privateCount}
                </span>
              </button>
            ))}
          </div>

          {/* Pinned Only Toggle */}
          <button
            type="button"
            onClick={() => setPinnedOnly(!pinnedOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              pinnedOnly
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${pinnedOnly ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>Pinned Only</span>
          </button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold ml-auto cursor-pointer"
            >
              Reset Filters
            </Button>
          )}
        </FilterContainer>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
            <p className="text-xs font-medium text-slate-400">Loading notices...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm p-8">
            <EmptyState
              icon={<Bell className="w-6 h-6 text-primary-500" />}
              title={hasActiveFilters ? "No matching notices" : "No notices yet"}
              description={
                hasActiveFilters
                  ? "No announcements matched your search criteria. Try clearing or adjusting your filters."
                  : "Keep your team updated by broadcasting company news, urgent alerts, and team bulletins."
              }
              action={
                hasActiveFilters ? (
                  <Button variant="outline" size="sm" onClick={handleResetFilters} className="font-bold cursor-pointer">
                    Clear Filters
                  </Button>
                ) : isManager ? (
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={() => setIsComposeOpen(true)}
                    className="font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Compose First Notice
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Notices Section */}
            {pinnedNotices.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" />
                    Pinned Announcements ({pinnedNotices.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {pinnedNotices.map((notice: any) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      isManager={isManager}
                      onOpen={handleOpenNotice}
                      onDelete={id => deleteMutation.mutate(id)}
                      onPin={id => pinMutation.mutate(id)}
                      userId={user?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notices Section */}
            {regularNotices.length > 0 && (
              <div className="space-y-3">
                {pinnedNotices.length > 0 && (
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-primary-500" />
                    General Bulletins ({regularNotices.length})
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {regularNotices.map((notice: any) => (
                    <NoticeCard
                      key={notice.id}
                      notice={notice}
                      isManager={isManager}
                      onOpen={handleOpenNotice}
                      onDelete={id => deleteMutation.mutate(id)}
                      onPin={id => pinMutation.mutate(id)}
                      userId={user?.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notice Detail View Modal */}
      {selectedNotice && (
        <Modal
          isOpen={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          title={
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <span className="truncate">{selectedNotice.title}</span>
            </div>
          }
          description="Detailed announcement details and metadata"
          maxWidth="2xl"
        >
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={VISIBILITY_CONFIG[selectedNotice.visibility as 'public' | 'private']?.color || ''}>
                {selectedNotice.visibility === 'public' ? (
                  <Users className="w-3 h-3 mr-1" />
                ) : (
                  <Lock className="w-3 h-3 mr-1" />
                )}
                {VISIBILITY_CONFIG[selectedNotice.visibility as 'public' | 'private']?.label}
              </Badge>

              {selectedNotice.target_user && (
                <Badge className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-zinc-700">
                  <User className="w-3 h-3 mr-1 text-primary-500" />
                  To: {selectedNotice.target_user.name}
                </Badge>
              )}

              {selectedNotice.is_pinned && (
                <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
                  <Pin className="w-3 h-3 mr-1" /> Pinned
                </Badge>
              )}

              {selectedNotice.expires_at && (
                <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
                  <Clock className="w-3 h-3 mr-1" /> Expires: {format(parseISO(selectedNotice.expires_at), 'dd MMM yyyy')}
                </Badge>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800">
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedNotice.body}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-600 dark:text-primary-400 font-bold flex items-center justify-center text-[11px]">
                  {selectedNotice.posted_by_user?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span>Posted by <strong className="text-slate-800 dark:text-slate-200">{selectedNotice.posted_by_user?.name || 'Management'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{format(parseISO(selectedNotice.created_at), 'dd MMM yyyy, hh:mm a')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedNotice(null)} className="cursor-pointer">
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Compose Notice Modal */}
      <Modal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <span>Post New Announcement</span>
          </div>
        }
        description="Share company news, notices, or direct confidential bulletins with your team."
        maxWidth="xl"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Notice Title *
            </label>
            <Input
              placeholder="e.g., Annual Team Offsite 2026, Office Holiday Notification..."
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Notice Content *
            </label>
            <textarea
              rows={4}
              placeholder="Write the full announcement details here..."
              value={form.body}
              onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
              className="w-full p-3 text-sm rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
            />
          </div>

          {/* Visibility Options */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
              Audience & Visibility
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['public', 'private'] as const).map(v => {
                const isSelected = form.visibility === v;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, visibility: v, target_user_id: '' }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500/40 shadow-xs'
                        : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-zinc-700 text-slate-500'
                    }`}>
                      {v === 'public' ? <Users className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold capitalize">{v} Notice</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                        {v === 'public' ? 'Visible to all staff' : 'Target a specific member'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Staff Selection for Private Notices */}
          {form.visibility === 'private' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Target Staff Member *
              </label>
              <select
                value={form.target_user_id}
                onChange={e => setForm(p => ({ ...p, target_user_id: e.target.value }))}
                className="w-full h-10 px-3 text-xs font-medium rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select staff recipient...</option>
                {staffList?.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.designation || 'Staff'})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Pinned Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Pin to Top</span>
                  <span className="text-[10px] text-slate-500">Keep highlighted</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, is_pinned: !p.is_pinned }))}
                className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                  form.is_pinned ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-700'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  form.is_pinned ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Expiry Date (Optional)
              </label>
              <Input
                type="date"
                value={form.expires_at}
                onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
                className="bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/80 dark:border-zinc-800">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setIsComposeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleCompose}
              disabled={createMutation.isPending || !form.title.trim() || !form.body.trim()}
              isLoading={createMutation.isPending}
              className="cursor-pointer font-bold"
            >
              <Bell className="w-4 h-4 mr-1.5" />
              Post Notice
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Notice Card Component ──────────────────────────────────────────────────

function NoticeCard({ notice, isManager, onOpen, onDelete, onPin, userId }: {
  notice: any;
  isManager: boolean;
  onOpen: (n: any) => void;
  onDelete: (id: number) => void;
  onPin: (id: number) => void;
  userId?: number;
}) {
  const visConfig = VISIBILITY_CONFIG[notice.visibility as 'public' | 'private'] || VISIBILITY_CONFIG.public;
  const VisIcon = visConfig.icon;

  return (
    <div
      onClick={() => onOpen(notice)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
        notice.is_pinned
          ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.07] border-amber-400/50 dark:border-amber-500/30 ring-1 ring-amber-400/20'
          : notice.is_read
          ? 'bg-white/90 dark:bg-zinc-900/80 border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
          : 'bg-white dark:bg-zinc-900/90 border-primary-300 dark:border-primary-500/40 ring-1 ring-primary-500/20 shadow-xs'
      }`}
    >
      {/* Header section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${visConfig.color}`}>
              <VisIcon className="w-3 h-3" />
              {visConfig.label}
            </span>
            {notice.is_pinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {!notice.is_read && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary-500/15 text-primary-600 dark:text-primary-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-ping" />
                New
              </span>
            )}
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500">
              {formatDistanceToNow(parseISO(notice.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {notice.title}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {notice.body}
          </p>
        </div>
      </div>

      {/* Target user notice */}
      {notice.target_user && (
        <div className="mt-3 py-1 px-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <User className="w-3 h-3 text-primary-500" />
          <span>Direct to: <strong className="text-slate-800 dark:text-white">{notice.target_user.name}</strong></span>
        </div>
      )}

      {/* Footer info & management actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 font-extrabold flex items-center justify-center text-[10px]">
            {notice.posted_by_user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[120px]">
            {notice.posted_by_user?.name || 'Admin'}
          </span>
          {notice.is_read && (
            <span title="Read by you" className="inline-flex items-center text-emerald-500">
              <CheckCheck className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* Manager Actions */}
        {(isManager || notice.posted_by === userId) && (
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {isManager && (
              <button
                type="button"
                onClick={() => onPin(notice.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all cursor-pointer"
                title={notice.is_pinned ? 'Unpin Notice' : 'Pin to Top'}
              >
                {notice.is_pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notice.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
              title="Delete Notice"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
