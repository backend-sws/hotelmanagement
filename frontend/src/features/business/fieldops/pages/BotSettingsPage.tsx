import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Radio,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  RefreshCw,
  Sliders,
  Smartphone,
  QrCode,
  ExternalLink,
  Save,
  Camera,
  Car,
  Bike,
  Bus,
  Coins,
  Flame,
  ChevronRight,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import {
  useBotSettings,
  useUpdateBotSettings,
  useSendTestBotMessage,
  type BotSettings
} from '../api/useBotSettings';

export default function BotSettingsPage() {
  const { data, isLoading, refetch } = useBotSettings();
  const updateMutation = useUpdateBotSettings();
  const testMessageMutation = useSendTestBotMessage();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'automation' | 'commands' | 'simulator'>('automation');
  const [testPhone, setTestPhone] = useState('');
  const [testSuccessMsg, setTestSuccessMsg] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Simulator Chat State
  const [simulatorMessages, setSimulatorMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '🙏 नमस्ते! होटल और फील्ड ऑप्स बॉट में आपका स्वागत है।\n\nविकल्प चुनें:\n1️⃣ 📍 Punch In (हाज़िरी लगाएं)\n2️⃣ 📋 My Tasks (आज के कार्य)\n3️⃣ 🚗 My Mileage (टीए/डीए क्लेम)\n4️⃣ 🏖️ Leave Balance (छुट्टी जानकारी)',
      time: '09:00 AM'
    }
  ]);
  const [simInput, setSimInput] = useState('');

  // Local Form State
  const [form, setForm] = useState<BotSettings>({
    bot_enabled: true,
    require_selfie: true,
    ai_vision_enabled: true,
    require_client_otp: true,
    auto_dispatch_whatsapp: true,
    auto_tada_tracking: true,
    two_wheeler_rate: 3.50,
    four_wheeler_rate: 8.00,
    public_transit_rate: 2.50,
    watermark_branding: '',
    geofence_radius: 100,
    site_lat: 19.0760,
    site_lng: 72.8777,
    site_name: 'Base HQ / Hotel',
    shift_start_time: '09:30',
    shift_end_time: '18:30',
    late_grace_minutes: 15,
  });

  useEffect(() => {
    if (data?.settings) {
      setForm(data.settings);
    }
  }, [data]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            site_lat: parseFloat(position.coords.latitude.toFixed(6)),
            site_lng: parseFloat(position.coords.longitude.toFixed(6)),
          }));
        },
        () => alert('Could not fetch current GPS coordinates.')
      );
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(form);
      setSaveSuccessMsg('Bot automation settings updated successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update settings');
    }
  };

  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;
    try {
      const res = await testMessageMutation.mutateAsync(testPhone);
      setTestSuccessMsg(res?.message || 'Test message dispatched to WhatsApp!');
      setTimeout(() => setTestSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to dispatch test message');
    }
  };

  const handleSimulateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = simInput.trim();
    if (!query) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let reply = '';
    const qLower = query.toLowerCase();

    if (qLower === '1' || qLower.includes('punch in') || qLower.includes('in')) {
      reply = '📍 कृपया अपनी लाइव लोकेशन शेयर करें और कैमरे से सेल्फी भेजें ताकि हाज़िरी (Punch In) दर्ज की जा सके।\n\n🏢 बेस: ' + form.site_name + ' (दायरा: ' + form.geofence_radius + 'm)';
    } else if (qLower === '2' || qLower.includes('punch out') || qLower.includes('out')) {
      reply = '✅ आज का Punch Out दर्ज किया गया।\n🚗 कुल जीपीएस यात्रा: 14.8 KM\n💰 स्वीकृत TA/DA भत्ता: ₹51.80 (2-Wheeler @ ₹' + form.two_wheeler_rate + '/KM)';
    } else if (qLower.includes('task') || qLower === '3' || qLower.includes('kaam')) {
      reply = '📋 आज के सौंपे गए कार्य:\n\n1. [Task #102] AC Filter Servicing\n📍 Site: Grand Suite #402\n🕒 Due: 02:30 PM\n\nशुरू करने के लिए "Start 102" लिखें।';
    } else if (qLower.startsWith('start')) {
      reply = '🚗 यात्रा शुरू हुई! ग्राहक को अलर्ट भेजा गया कि आप निकल चुके हैं। साइट पहुँचने पर "Reached" भेजें।';
    } else if (qLower.includes('reached')) {
      reply = '📍 साइट लोकेशन सत्यापित! कृपया काम पूरा होने पर फोटो भेजें और ग्राहक से 4-अंकों का OTP प्राप्त करें।';
    } else if (qLower.includes('balance') || qLower.includes('leave')) {
      reply = '🏖️ आपका अवकाश संतुलन:\n• Casual Leave (CL): 3 दिन\n• Sick Leave (SL): 5 दिन\n• Earned Leave (EL): 8 दिन\n\nआवेदन के लिए "Apply Leave" लिखें।';
    } else {
      reply = '🙏 मुख्य मेनू के लिए "Menu" या "Help" लिखें। आप सीधे 1 (Punch In), Tasks (कार्य), या Leave (छुट्टी) लिख सकते हैं।';
    }

    const botMsg = {
      sender: 'bot' as const,
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSimulatorMessages((prev) => [...prev, userMsg, botMsg]);
    setSimInput('');
  };

  const botInfo = data?.bot_info;
  const commandDirectory = data?.command_directory || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0c0e] text-slate-900 dark:text-slate-100 p-6 space-y-6">
      {/* Toast Notifications */}
      {saveSuccessMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-sm">{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-600 dark:text-emerald-400 hover:opacity-80">
            &times;
          </button>
        </div>
      )}

      {testSuccessMsg && (
        <div className="bg-cyan-500/15 border border-cyan-500/30 text-cyan-800 dark:text-cyan-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span className="font-medium text-sm">{testSuccessMsg}</span>
          </div>
          <button onClick={() => setTestSuccessMsg(null)} className="text-cyan-600 dark:text-cyan-400 hover:opacity-80">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#121316] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                WhatsApp Bot Automation & Rules Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {form.bot_enabled ? 'Active Online' : 'Paused'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Configure automated WhatsApp dispatch, geofence radius, anti-spoof selfie capture, client OTPs, and mileage rates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition border border-slate-200 dark:border-white/10 flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Bot Service Status</span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${form.bot_enabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            {form.bot_enabled ? 'Online & Active' : 'Service Paused'}
          </p>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
            Automated Staff Dispatch Ready
          </span>
        </div>

        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">AI Vision Engine</span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Gemini 1.5 Flash
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 block">
            Anti-Fraud Verification ON
          </span>
        </div>

        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Tenant Bot Wallet</span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{Number(botInfo?.wallet_balance || 0).toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
            Per-message auto debit
          </span>
        </div>

        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 p-4 rounded-xl shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Geofence Base HQ</span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
            {form.site_name}
          </p>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium mt-0.5 block">
            {form.geofence_radius}m Radius Active
          </span>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/5 pb-3">
        <button
          onClick={() => setActiveTab('automation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'automation'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#121316] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Automation Rules & Rates
        </button>

        <button
          onClick={() => setActiveTab('commands')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'commands'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#121316] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Command Directory ({commandDirectory.length})
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-[#121316] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Live Interactive Simulator
        </button>
      </div>

      {/* TAB 1: AUTOMATION RULES & RATES */}
      {activeTab === 'automation' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Core Bot Toggles */}
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Core WhatsApp Bot Automation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Master switches for bot engagement and auto-dispatch</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Enable WhatsApp Bot Engine</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">When enabled, incoming staff messages trigger automatic workflows</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.bot_enabled}
                    onChange={(e) => setForm({ ...form, bot_enabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Mandatory Live Camera Selfie</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Technicians must take a live camera photo during Punch In / Out</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.require_selfie}
                    onChange={(e) => setForm({ ...form, require_selfie: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Gemini 1.5 Flash Vision AI Verification</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Auto-scan photo proofs for spoof detection and equipment verification</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.ai_vision_enabled}
                    onChange={(e) => setForm({ ...form, ai_vision_enabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Client 4-Digit OTP on Task Completion</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Staff must ask the guest/client for an OTP to complete high-priority jobs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.require_client_otp}
                    onChange={(e) => setForm({ ...form, require_client_otp: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Auto-Dispatch Alert upon Assignment</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Instantly send WhatsApp notification when dispatcher assigns task</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.auto_dispatch_whatsapp}
                    onChange={(e) => setForm({ ...form, auto_dispatch_whatsapp: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 2. Geofence & Shift Timings */}
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="p-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Base HQ Geofencing & Shift Schedule</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Staff must be within this boundary to check in</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Base Facility / Hotel Name
                  </label>
                  <input
                    type="text"
                    value={form.site_name}
                    onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Grand Heritage Hotel & Resort"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.site_lat}
                      onChange={(e) => setForm({ ...form, site_lat: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.site_lng}
                      onChange={(e) => setForm({ ...form, site_lng: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Navigation className="w-3 h-3" />
                    Use My Current Device GPS
                  </button>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Coords: {form.site_lat.toFixed(4)}, {form.site_lng.toFixed(4)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Geofence Radius (Meters)
                    </label>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{form.geofence_radius} Meters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[50, 100, 250, 500, 1000].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm({ ...form, geofence_radius: r })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                          form.geofence_radius === r
                            ? 'bg-cyan-600 text-white border-cyan-600'
                            : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {r}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Shift Start
                    </label>
                    <input
                      type="time"
                      value={form.shift_start_time}
                      onChange={(e) => setForm({ ...form, shift_start_time: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Shift End
                    </label>
                    <input
                      type="time"
                      value={form.shift_end_time}
                      onChange={(e) => setForm({ ...form, shift_end_time: e.target.value })}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Late Grace (Min)
                    </label>
                    <input
                      type="number"
                      value={form.late_grace_minutes}
                      onChange={(e) => setForm({ ...form, late_grace_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Travel Allowance (TA/DA) Rates */}
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Travel Allowance (TA/DA) Reimbursement Rules</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Automated per-kilometer payout calculations on punch out</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Auto GPS Distance Tracking</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Accumulate real waypoint distances as technician checks in across sites</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.auto_tada_tracking}
                    onChange={(e) => setForm({ ...form, auto_tada_tracking: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                      <Bike className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Two-Wheeler
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        step="0.10"
                        value={form.two_wheeler_rate}
                        onChange={(e) => setForm({ ...form, two_wheeler_rate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">per KM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                      <Car className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Four-Wheeler
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        step="0.10"
                        value={form.four_wheeler_rate}
                        onChange={(e) => setForm({ ...form, four_wheeler_rate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">per KM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-semibold">
                      <Bus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Public Transit
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        step="0.10"
                        value={form.public_transit_rate}
                        onChange={(e) => setForm({ ...form, public_transit_rate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">per KM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Watermark & Branding */}
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Watermarking & Security Stamping</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cryptographic watermark stamped onto completed task photos</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custom Watermark Brand Name
                  </label>
                  <input
                    type="text"
                    value={form.watermark_branding}
                    onChange={(e) => setForm({ ...form, watermark_branding: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                    placeholder="e.g. Grand Hotel Field Ops"
                  />
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Stamp Template Preview:
                  </span>
                  <p className="text-[11px] font-mono text-purple-800 dark:text-purple-300">
                    [VERIFIED PROOF] | {form.watermark_branding || 'Business Name'} | Tech: John Doe (ID: #4) | GPS: 19.0760, 72.8777 | Time: 2026-09-17 13:40:04 | Anti-Fraud Score: 98%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving Automation Rules...' : 'Save All Automation Rules'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: COMMAND DIRECTORY */}
      {activeTab === 'commands' && (
        <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Field Staff WhatsApp Command Directory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff members can message any of these keywords to the WhatsApp Bot to trigger operations.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Hindi & English Supported
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commandDirectory.map((cmd, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 hover:border-emerald-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                    {cmd.command}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {cmd.category}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {cmd.description}
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  "{cmd.description_hi}"
                </p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Triggers:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{cmd.keywords}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE INTERACTIVE SIMULATOR & TEST DISPATCH */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Phone Mockup (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live In-App Bot Simulator</h3>
              </div>
              <button
                type="button"
                onClick={() => setSimulatorMessages([
                  {
                    sender: 'bot',
                    text: '🙏 नमस्ते! होटल और फील्ड ऑप्स बॉट में आपका स्वागत है।\n\nविकल्प चुनें:\n1️⃣ 📍 Punch In\n2️⃣ 📋 My Tasks\n3️⃣ 🚗 My Mileage\n4️⃣ 🏖️ Leave Balance',
                    time: '09:00 AM'
                  }
                ])}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Reset Chat
              </button>
            </div>

            {/* Phone Screen Mockup */}
            <div className="w-full max-w-md mx-auto bg-[#0b141a] rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[460px]">
              {/* WhatsApp Header */}
              <div className="bg-[#1f2c34] p-3 flex items-center gap-3 border-b border-slate-700">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{form.site_name} Bot</h4>
                  <span className="text-[10px] text-emerald-400">Online 24/7 (AI Verified)</span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-cover bg-center" style={{ backgroundColor: '#0b141a' }}>
                {simulatorMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col max-w-[82%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl text-xs whitespace-pre-line leading-relaxed shadow ${
                        msg.sender === 'user'
                          ? 'bg-[#005c4b] text-white rounded-tr-none'
                          : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSimulateMessage} className="p-2 bg-[#202c33] flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type '1', 'tasks', 'start 102', 'leave'..."
                  value={simInput}
                  onChange={(e) => setSimInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#2a3942] text-xs text-white rounded-lg focus:outline-none placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Real WhatsApp Test & Staff Onboarding (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Real Dispatch Card */}
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send Real WhatsApp Test</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Dispatches an interactive test greeting to any phone</p>
                </div>
              </div>

              <form onSubmit={handleSendTestMessage} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number (10 digits)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 font-bold">
                      +91
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="9876543210"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-mono text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={testMessageMutation.isPending}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {testMessageMutation.isPending ? 'Sending WhatsApp...' : 'Dispatch Test Message Now'}
                </button>
              </form>
            </div>

            {/* Staff WhatsApp Onboarding Guide Card */}
            <div className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Staff WhatsApp Onboarding Guide</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">How field staff and technicians connect with the bot</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Direct Link Banner */}
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Direct WhatsApp Bot Chat
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-200/60 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      1-Tap Connect
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                    Share this direct WhatsApp link with field staff so they can start chatting with the bot in one tap:
                  </p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <a
                      href={botInfo?.wa_link || 'https://wa.me/?text=Hi'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Chat
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopy('botlink', botInfo?.wa_link || 'https://wa.me/?text=Hi')}
                      className="px-3 py-1.5 bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/15 transition flex items-center gap-1.5"
                    >
                      {copiedKey === 'botlink' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3-Step Setup Instructions */}
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                    3-Step Staff Setup:
                  </span>
                  <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong className="text-slate-800 dark:text-slate-200">Register Mobile:</strong> Add technician's WhatsApp number in the <strong>Staff / Users</strong> directory.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong className="text-slate-800 dark:text-slate-200">Send Greeting:</strong> Technician taps the link or sends <strong>"Hi"</strong> or <strong>"Menu"</strong> on WhatsApp.
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong className="text-slate-800 dark:text-slate-200">Bilingual Guided Menu:</strong> Bot automatically identifies their name, verifies GPS & selfie, and guides tasks.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
