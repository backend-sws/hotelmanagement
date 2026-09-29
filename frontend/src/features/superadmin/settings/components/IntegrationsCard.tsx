import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Key, CheckCircle2, AlertCircle, Sparkles, Shield, Eye, EyeOff, Copy, RefreshCw, Radio, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';
import { usePublicSettings, useUpdateSettings } from '../api/useSettings';
import api from '@/lib/api';
import { toast } from 'sonner';

export function IntegrationsCard() {
  const { data: rawSettings } = usePublicSettings();
  const updateSettings = useUpdateSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // Form State
  const [phoneId, setPhoneId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('hotel_whatsapp_bot_verify_token_2026');
  const [geminiKey, setGeminiKey] = useState('');

  // Diagnostic Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    if (rawSettings) {
      setPhoneId(rawSettings.whatsapp_phone_number_id || '');
      setAccessToken(rawSettings.whatsapp_access_token || '');
      setVerifyToken(rawSettings.whatsapp_verify_token || 'hotel_whatsapp_bot_verify_token_2026');
      setGeminiKey(rawSettings.gemini_api_key || '');
    }
  }, [rawSettings]);

  const handleTestConnection = async () => {
    if (!phoneId.trim() || !accessToken.trim()) {
      toast.error('Please enter Phone Number ID and Access Token to test connection.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.post('/superadmin/whatsapp/test-connection', {
        phone_number_id: phoneId.trim(),
        access_token: accessToken.trim(),
        test_phone: testPhone.trim() || undefined,
      });
      const data = res.data.data;
      setTestResult({
        success: true,
        message: `Verified: "${data.verified_name}" (+${data.phone_number}). Quality: ${data.quality_rating}. ${data.dispatch_status ? data.dispatch_status : ''}`,
        details: data,
      });
      toast.success('Meta WhatsApp Cloud API connection verified successfully!');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || 'Failed to connect to Meta Graph API';
      setTestResult({
        success: false,
        message: errMsg,
      });
      toast.error(errMsg);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        whatsapp_phone_number_id: phoneId.trim(),
        whatsapp_access_token: accessToken.trim(),
        whatsapp_verify_token: verifyToken.trim(),
        gemini_api_key: geminiKey.trim(),
      });
      setIsModalOpen(false);
      toast.success('WhatsApp & Gemini credentials saved successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save credentials');
    }
  };

  const isWhatsAppConfigured = Boolean(rawSettings?.whatsapp_phone_number_id && rawSettings?.whatsapp_access_token);
  const isGeminiConfigured = Boolean(rawSettings?.gemini_api_key);

  return (
    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Email Configuration */}
      <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Email Configuration (SMTP)</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">For transactional & bulk emails</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Mail className="w-5 h-5" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
            <p className="text-xs text-slate-500 font-medium">To configure your SMTP settings, please update your server's <code className="bg-slate-200 dark:bg-white/10 px-1 rounded text-slate-700 dark:text-slate-300">.env</code> file directly for security reasons.</p>
          </div>
        </div>
      </div>

      {/* WhatsApp & AI Vision Configuration */}
      <div className="bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">WhatsApp & AI Vision API</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Meta Cloud API & Gemini 1.5 Flash</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              isWhatsAppConfigured 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-400'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-400'
            }`}>
              {isWhatsAppConfigured ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />}
              <span className="truncate">{isWhatsAppConfigured ? 'Meta API Live' : 'WhatsApp Simulated'}</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              isGeminiConfigured 
                ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800/40 dark:text-purple-400'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-400'
            }`}>
              {isGeminiConfigured ? <Sparkles className="w-4 h-4 shrink-0 text-purple-500" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />}
              <span className="truncate">{isGeminiConfigured ? 'Gemini AI Active' : 'AI Simulated'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 text-xs text-slate-500 space-y-1">
            <p>Connect your official <strong>Meta WhatsApp Cloud API</strong> and <strong>Google Gemini Flash</strong> keys to dispatch live WhatsApp messages and run automated anti-cheat photo verification.</p>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Key className="w-3.5 h-3.5" />
            Configure WhatsApp & Gemini Keys
          </Button>
        </div>
      </div>

      {/* Credentials Configuration Modal */}
      {isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-[#121316] border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">API Credentials Setup</h3>
                  <p className="text-xs text-slate-500">Meta WhatsApp Cloud API & Google Gemini Vision</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Phone Number ID */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meta WhatsApp Phone Number ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 109876543210987"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Available in Meta Developer Console &gt; WhatsApp &gt; API Setup</p>
              </div>

              {/* Permanent Access Token */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    WhatsApp Cloud API Access Token
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowToken(!showToken)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showToken ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showToken ? 'text' : 'password'}
                  placeholder="EAA..."
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Meta System User Permanent Token with whatsapp_business_messaging permission</p>
              </div>

              {/* Webhook Configuration & Handshake Details */}
              <div className="p-3.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-500" />
                    Meta Webhook Handshake Setup
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                    Dual URL Ready
                  </span>
                </div>

                {/* Callback URL */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Webhook Callback URL
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/api/v1/whatsapp/webhook`;
                        navigator.clipboard.writeText(url);
                        setCopiedUrl(true);
                        toast.success('Callback URL copied!');
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedUrl ? 'Copied' : 'Copy URL'}
                    </button>
                  </div>
                  <div className="p-2 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-[11px] text-slate-700 dark:text-slate-300 select-all break-all">
                    {`${window.location.origin}/api/v1/whatsapp/webhook`}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1">Fallback URL: <span className="font-mono">{`${window.location.origin}/api/whatsapp/webhook`}</span></p>
                </div>

                {/* Webhook Verify Token */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Webhook Verify Token
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(verifyToken);
                        setCopiedToken(true);
                        toast.success('Verify Token copied!');
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      {copiedToken ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedToken ? 'Copied' : 'Copy Token'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={verifyToken}
                    onChange={(e) => setVerifyToken(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">Paste this exact token in Meta Developers &gt; WhatsApp &gt; Configuration &gt; Webhook.</p>
                </div>
              </div>

              {/* Live Connection Diagnostics */}
              <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    Meta Connection Test & Live Ping
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isTesting || !phoneId.trim() || !accessToken.trim()}
                    onClick={handleTestConnection}
                    className="h-7 text-[11px] px-3 font-semibold border-emerald-500/40 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:text-emerald-400"
                  >
                    {isTesting ? <RefreshCw className="w-3 h-3 animate-spin mr-1.5" /> : null}
                    {isTesting ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Send Live Ping to Mobile (e.g. 919876543210)"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-[11px] text-slate-900 dark:text-white outline-none"
                  />
                </div>
                {testResult && (
                  <div className={`p-2.5 rounded-xl text-[11px] font-mono leading-relaxed border ${
                    testResult.success 
                      ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300' 
                      : 'bg-rose-100/70 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300'
                  }`}>
                    {testResult.message}
                  </div>
                )}
              </div>

              {/* Gemini API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    Google Gemini API Key (Vision 1.5 Flash)
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    {showGeminiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showGeminiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Free API key from Google AI Studio (aistudio.google.com)</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2.5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  type="submit" 
                  disabled={updateSettings.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5"
                >
                  {updateSettings.isPending ? 'Saving...' : 'Save Credentials'}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

