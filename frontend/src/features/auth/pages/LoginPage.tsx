import { useState } from 'react';
import { IdentifierForm, LoginForm, OtpForm, SetPasswordForm } from '../components/AuthForms';
import { useAppStore } from '@/store/appStore';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

type AuthStep = 'IDENTIFIER' | 'LOGIN' | 'OTP' | 'SET_PASSWORD';

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>('IDENTIFIER');
  const [identifier, setIdentifier] = useState('');
  const [otpToken, setOtpToken] = useState('');

  const { appName, appLogo } = useAppStore();

  const goBackToIdentifier = () => {
    setStep('IDENTIFIER');
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-primary-500/30">
      
      {/* ── PREMIUM BACKGROUND ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.06] mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-100/80 dark:via-transparent dark:to-[#09090b] pointer-events-none" />
        
        {/* Animated glowing orbs - very soft and large */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-300/30 dark:bg-primary-600/10 blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/30 dark:bg-blue-600/10 blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-300/30 dark:bg-purple-600/10 blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* ── FLOATING GLASS CARD ── */}
      <div className="relative z-10 w-full max-w-[1200px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] border border-white dark:border-white/10 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        
        {/* ── LEFT CANVAS (Value Proposition) ── */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12 lg:p-16 relative bg-gradient-to-br from-primary-50/50 to-blue-50/50 dark:from-primary-900/10 dark:to-blue-900/10 border-r border-slate-200/50 dark:border-white/5">
          {/* Top Left Header Logo */}
          <div className="relative z-10 flex items-center gap-5 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-md shadow-primary-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2.5">
              {appLogo ? (
                <img src={appLogo} alt={appName} className="max-w-full max-h-full object-contain" />
              ) : (
                <Layers className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <span className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">{appName}</span>
          </div>

          {/* Center Big Bold Typography Area */}
          <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-left-12 duration-1000 delay-150 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Enterprise Edition</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.15]">
              Scale your <br />
              business with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
                precision.
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-md">
              A unified ecosystem for billing, ledger management, and inventory tracking. Built for modern enterprises.
            </p>
          </div>

          {/* Bottom Metadata */}
          <div className="relative z-10 flex gap-6 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full"/> SOC2 Compliant</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> GST Ready</span>
          </div>
        </div>

        {/* ── RIGHT PANEL (Login Form) ── */}
        <div className="w-full lg:w-[480px] shrink-0 flex flex-col justify-center bg-white dark:bg-slate-900/50 p-8 sm:p-12 lg:p-16 relative z-20">
          
          {/* Mobile Header (Visible on Mobile only) */}
          <div className="flex lg:hidden flex-col items-center gap-5 mb-10 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl shadow-md shadow-primary-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-3.5">
              {appLogo ? (
                <img src={appLogo} alt={appName} className="max-w-full max-h-full object-contain" />
              ) : (
                <Layers className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div className="text-center">
              <h1 className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">{appName}</h1>
              <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-[0.2em] mt-2">Enterprise Platform</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            
            {/* Header Title */}
            <div className="space-y-1.5 mb-10">
              {step === 'IDENTIFIER' && (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Enter your credentials to access the terminal.</p>
                </>
              )}
              {step === 'LOGIN' && (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Verify password</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Logging in as <span className="text-primary-600 dark:text-primary-400 font-bold">{identifier}</span></p>
                </>
              )}
              {step === 'OTP' && (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Enter OTP</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Code sent to <span className="text-primary-600 dark:text-primary-400 font-bold">{identifier}</span></p>
                </>
              )}
              {step === 'SET_PASSWORD' && (
                <>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Setup password</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Set a strong password for account safety.</p>
                </>
              )}
            </div>

            {/* Forms Component Context wrapper for cleaner dark/light nesting */}
            <div className="relative z-10 [&_label]:text-slate-700 dark:[&_label]:text-slate-300 [&_input]:bg-slate-50 dark:[&_input]:bg-slate-950/50 [&_input]:border-slate-200 dark:[&_input]:border-white/10 [&_input]:text-slate-900 dark:[&_input]:text-white [&_input:focus]:border-primary-500 [&_input:focus]:ring-primary-500/20 [&_button]:rounded-xl [&_input]:shadow-sm">
              {step === 'IDENTIFIER' && (
                <IdentifierForm onNext={setStep} setIdentifier={setIdentifier} />
              )}

              {step === 'LOGIN' && (
                <LoginForm identifier={identifier} goBack={goBackToIdentifier} onNext={setStep} />
              )}

              {step === 'OTP' && (
                <OtpForm identifier={identifier} onNext={setStep} goBack={goBackToIdentifier} setOtpToken={setOtpToken} />
              )}

              {step === 'SET_PASSWORD' && (
                <SetPasswordForm otpToken={otpToken} />
              )}
            </div>
            
            {/* Footer Login/Register text */}
            <div className="mt-10 text-center text-slate-500 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
              Interested in our partner program?{' '}
              <Link to="/partner/register" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Register here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
