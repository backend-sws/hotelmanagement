import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, User, Mail, Phone, Lock, ArrowRight, ArrowLeft, ShieldCheck, Layers } from 'lucide-react';
import { useCheckUser, useSendOtp, useVerifyOtp } from '../api/useAuthMutations';
import { ModernOtpInput } from '@/components/ui/ModernOtpInput';

export default function PartnerRegisterPage() {
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otp, setOtp] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const { appName, appLogo } = useAppStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const checkUserMutation = useCheckUser();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/partner/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
      toast.success('Registration successful! Welcome to the Partner Program.');
      navigate('/partner/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    checkUserMutation.mutate({ identifier: email }, {
      onSuccess: (res) => {
        if (res.exists) {
          toast.error('This email is already registered.');
        } else {
          sendOtpMutation.mutate({ identifier: email }, {
            onSuccess: () => {
              toast.success(`OTP has been sent to ${email}`);
              setStep('OTP');
            },
            onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to send OTP')
          });
        }
      },
      onError: (err: any) => {
        const errorMsg = err.response?.data?.errors
          ? (Object.values(err.response.data.errors)[0] as any)?.[0] as string
          : err.response?.data?.message;
        toast.error(errorMsg || 'Validation failed');
      }
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    verifyOtpMutation.mutate({ identifier: email, otp }, {
      onSuccess: (res) => {
        const verificationToken = res.verification_token;
        toast.success('OTP Verified! Creating your account...');

        // Add referral code if passed in URL
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');

        registerMutation.mutate({
          name,
          email,
          phone: phone || undefined,
          company_name: companyName || undefined,
          password,
          password_confirmation: passwordConfirmation,
          referred_by: refCode || undefined,
          verification_token: verificationToken
        });
      },
      onError: (err: any) => toast.error(err.response?.data?.message || 'Invalid OTP')
    });
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
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Partner Program</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.15]">
              Grow with us <br />
              as a certified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
                partner.
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-md">
              Join our partner program and earn generous lifetime commissions for every business reference you refer to our platform.
            </p>
          </div>

          {/* Bottom Metadata */}
          <div className="relative z-10 flex gap-6 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full"/> Lifetime Commissions</span>
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> Easy Onboarding</span>
          </div>
        </div>

        {/* ── RIGHT PANEL (Signup Form) ── */}
        <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col justify-center bg-white dark:bg-slate-900/50 p-6 sm:p-10 lg:p-12 relative z-20 overflow-y-auto">
          
          {/* Mobile Header (Visible on Mobile only) */}
          <div className="flex lg:hidden flex-col items-center gap-5 mb-8 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl shadow-md shadow-primary-500/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-3.5">
              {appLogo ? (
                <img src={appLogo} alt={appName} className="max-w-full max-h-full object-contain" />
              ) : (
                <Layers className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div className="text-center">
              <h1 className="font-black text-3xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">{appName}</h1>
              <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-[0.2em] mt-2">Partner Program</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
            
            {/* Header Title */}
            <div className="space-y-1.5 mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {step === 'FORM' ? 'Partner Signup' : 'Verify Email'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                {step === 'FORM'
                  ? 'Fill in details to set up your partner workspace.'
                  : `We've sent a 6-digit secure code to ${email}`}
              </p>
            </div>

            {/* Forms Component Context wrapper */}
            <div className="relative z-10 [&_label]:text-slate-700 dark:[&_label]:text-slate-300 [&_input]:bg-slate-50 dark:[&_input]:bg-slate-950/50 [&_input]:border-slate-200 dark:[&_input]:border-white/10 [&_input]:text-slate-900 dark:[&_input]:text-white [&_input:focus]:border-primary-500 [&_input:focus]:ring-primary-500/20 [&_button]:rounded-xl [&_input]:shadow-sm">
              {step === 'FORM' ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider ml-1">Full Name *</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="E.g. John Doe"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold placeholder-slate-400 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider ml-1">Email *</label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@company.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold placeholder-slate-400 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold placeholder-slate-400 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider ml-1">Company / Agency</label>
                      <div className="relative group">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Company Name"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold placeholder-slate-400 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider ml-1">Password *</label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold placeholder-slate-400 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider ml-1">Confirm Password *</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        <input
                          type="password"
                          required
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold placeholder-slate-400 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={registerMutation.isPending || checkUserMutation.isPending}
                    className="w-full h-11 mt-4 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-md shadow-primary-500/15 active:translate-y-0.5 transition-all duration-200 border-none flex items-center justify-center gap-2"
                  >
                    {checkUserMutation.isPending || sendOtpMutation.isPending ? 'Processing...' : (
                      <>
                        Register Now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="space-y-4 mb-4">
                    <label className="text-[10px] font-black uppercase tracking-wider ml-1 text-center block">Verification Code</label>
                    <ModernOtpInput value={otp} onChange={setOtp} />
                  </div>

                  <button
                    type="submit"
                    disabled={verifyOtpMutation.isPending || registerMutation.isPending || otp.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-md shadow-primary-500/15 active:translate-y-0.5 transition-all duration-200 border-none flex items-center justify-center gap-2"
                  >
                    {verifyOtpMutation.isPending || registerMutation.isPending ? 'Verifying & Registering...' : (
                      <>
                        Verify & Register
                        <ArrowRight className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('FORM')}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center w-full gap-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Go back to details
                  </button>
                </form>
              )}
            </div>
            
            {/* Footer Login/Register text */}
            <div className="mt-8 text-center text-slate-500 text-sm font-medium">
              Already have a partner account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Log in here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
