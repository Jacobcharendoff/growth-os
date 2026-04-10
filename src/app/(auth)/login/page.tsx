'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, TrendingUp, Wrench, Flame, Plug, TreePine, Home, Sparkles, Star, Shield, CheckCircle2, MapPin, Eye, EyeOff } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useLanguage } from '@/components/LanguageProvider';

type Tab = 'signin' | 'signup';
type View = 'form' | 'forgotPassword';

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface MessageState {
  type: 'error' | 'success' | null;
  text: string;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/setup';
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [view, setView] = useState<View>('form');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [signupComplete, setSignupComplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearMessage = () => {
    setMessage({ type: null, text: '' });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);

    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || t('auth.failedToSignIn'),
        });
        setLoading(false);
        return;
      }

      if (data.session) {
        setMessage({
          type: 'success',
          text: t('auth.signedInSuccessfully'),
        });
        // Use hard navigation so middleware sees the fresh auth cookies
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);
      } else {
        // Session is null — user exists but may not be confirmed
        setMessage({
          type: 'error',
          text: 'Sign-in succeeded but no session was created. Please try again or contact support.',
        });
        setLoading(false);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: t('auth.unexpectedError'),
      });
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();

    // Validation
    if (!form.fullName.trim()) {
      setMessage({
        type: 'error',
        text: t('auth.pleaseEnterFullName'),
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({
        type: 'error',
        text: t('auth.passwordsDoNotMatch'),
      });
      return;
    }

    if (form.password.length < 8) {
      setMessage({
        type: 'error',
        text: t('auth.passwordMinLength'),
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await getSupabase().auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
          },
        },
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || t('auth.failedToCreateAccount'),
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        // After successful signup, set trial flags
        const supabase = getSupabase();
        if (supabase && data.user) {
          const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
          await supabase.from('users').update({
            is_trial: true,
            trial_started_at: new Date().toISOString(),
            trial_ends_at: trialEndsAt,
            first_name: form.fullName.split(' ')[0],
          }).eq('id', data.user.id);
        }

        setSignupComplete(true);
        // Reset form
        setForm({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: t('auth.unexpectedError'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessage();
    setGoogleLoading(true);

    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || t('auth.failedToSignInGoogle'),
        });
        setGoogleLoading(false);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: t('auth.unexpectedError'),
      });
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);

    if (!resetEmail.trim()) {
      setMessage({
        type: 'error',
        text: t('auth.pleaseEnterEmail'),
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || t('auth.failedToSendReset'),
        });
        setLoading(false);
        return;
      }

      setMessage({
        type: 'success',
        text: t('auth.checkEmailForReset'),
      });
      setResetEmail('');
      setLoading(false);
    } catch (err) {
      setMessage({
        type: 'error',
        text: t('auth.unexpectedError'),
      });
      setLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    setView('form');
    clearMessage();
    setResetEmail('');
  };

  const personaCards = [
    { initials: 'MR', name: 'Mike Reynolds', trade: 'Plumbing', city: 'Toronto, ON', stat: '+47% booked jobs', gradient: 'from-blue-500 to-blue-600' },
    { initials: 'JL', name: 'Julie Lavoie', trade: 'HVAC', city: 'Montreal, QC', stat: '+$12K monthly revenue', gradient: 'from-orange-500 to-red-500' },
    { initials: 'SK', name: 'Steve Kim', trade: 'Electrical', city: 'Vancouver, BC', stat: '2x faster estimates', gradient: 'from-amber-500 to-yellow-600' },
    { initials: 'PP', name: 'Priya Patel', trade: 'Landscaping', city: 'Calgary, AB', stat: '340% ROI in 90 days', gradient: 'from-emerald-500 to-green-600' },
    { initials: 'TD', name: 'Tom Devries', trade: 'Roofing', city: 'Ottawa, ON', stat: '0 missed leads', gradient: 'from-slate-500 to-slate-700' },
    { initials: 'AR', name: 'Anna Ramos', trade: 'Cleaning', city: 'Winnipeg, MB', stat: '+89 five-star reviews', gradient: 'from-purple-500 to-violet-600' },
  ];

  const cardPositions = [
    { top: '8%', left: '3%', rotate: '-6deg', delay: '0s' },
    { top: '6%', right: '3%', rotate: '5deg', delay: '-1.5s' },
    { top: '40%', left: '1%', rotate: '-3deg', delay: '-3s' },
    { top: '38%', right: '1%', rotate: '4deg', delay: '-4.5s' },
    { bottom: '12%', left: '4%', rotate: '-5deg', delay: '-2s' },
    { bottom: '10%', right: '3%', rotate: '3deg', delay: '-3.5s' },
  ];

  return (
    <div className="space-y-8">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Gradient orbs */}
        <div className="hidden sm:block absolute top-16 right-8 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-16 left-8 w-[350px] h-[350px] bg-emerald-100/25 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-50/20 rounded-full blur-3xl" />

        {/* Floating persona cards — desktop only */}
        <div className="hidden xl:block">
          {personaCards.map((card, i) => {
            const pos = cardPositions[i];
            const { rotate, delay, ...position } = pos;
            return (
              <div
                key={card.initials}
                className="absolute bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-lg shadow-black/[0.04] border border-gray-100/80 w-52"
                style={{
                  ...position,
                  transform: `rotate(${rotate})`,
                  animation: `subtleFloat ${6 + i * 0.8}s ease-in-out infinite`,
                  animationDelay: delay,
                  opacity: 0.85,
                }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-[10px] font-bold shadow-md`}>
                    {card.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{card.name}</p>
                    <p className="text-[10px] text-gray-500">{card.trade} · {card.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-700">{card.stat}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet: smaller floating cards, fewer of them */}
        <div className="hidden md:block xl:hidden">
          {personaCards.slice(0, 4).map((card, i) => {
            const tabletPositions = [
              { top: '10%', left: '2%', rotate: '-5deg', delay: '0s' },
              { top: '8%', right: '2%', rotate: '4deg', delay: '-2s' },
              { bottom: '14%', left: '3%', rotate: '-4deg', delay: '-1s' },
              { bottom: '12%', right: '2%', rotate: '3deg', delay: '-3s' },
            ];
            const pos = tabletPositions[i];
            const { rotate, delay, ...position } = pos;
            return (
              <div
                key={card.initials}
                className="absolute bg-white/70 backdrop-blur-sm rounded-xl p-2.5 shadow-md border border-gray-100/60 w-44"
                style={{
                  ...position,
                  transform: `rotate(${rotate})`,
                  animation: `subtleFloat ${7 + i}s ease-in-out infinite`,
                  animationDelay: delay,
                  opacity: 0.7,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-[9px] font-bold`}>
                    {card.initials}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-900">{card.name}</p>
                    <p className="text-[9px] text-gray-500">{card.trade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 rounded">
                  <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="text-[9px] font-semibold text-emerald-700">{card.stat}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Branding */}
      <div className="text-center relative" style={{ zIndex: 10 }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-[#2C3E50] p-2 rounded-lg">
            <Zap className="w-6 h-6 text-[#27AE60]" strokeWidth={3} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[#2C3E50]">Stay</span>
            <span className="text-2xl font-bold text-[#27AE60]">bookt</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Stay booked. Stay paid.
        </p>

        {/* Social proof badges */}
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-slate-500 ml-1">4.9/5</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            14-day free trial
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            Built in Canada
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden" style={{ zIndex: 10 }}>
        {signupComplete ? (
          <div className="p-4 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#27AE60]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              {t('auth.accountCreated') || 'Account created!'}
            </h2>
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">
              {t('auth.checkEmailConfirmation') || 'We sent a confirmation link to your email. Open it to activate your account, then come back here to sign in.'}
            </p>
            <button
              onClick={() => {
                setSignupComplete(false);
                setTab('signin');
                clearMessage();
              }}
              className="w-full py-2.5 px-4 bg-[#27AE60] hover:bg-[#229954] text-white font-medium rounded-lg transition-colors"
            >
              {t('auth.backToSignIn') || 'Back to sign in'}
            </button>
          </div>
        ) : view === 'form' && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => {
                  setTab('signin');
                  clearMessage();
                }}
                className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                  tab === 'signin'
                    ? 'text-[#27AE60] border-b-2 border-[#27AE60] bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('auth.signIn')}
              </button>
              <button
                onClick={() => {
                  setTab('signup');
                  clearMessage();
                }}
                className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                  tab === 'signup'
                    ? 'text-[#27AE60] border-b-2 border-[#27AE60] bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('auth.signUp')}
              </button>
            </div>

            {/* Message Area */}
            {message.type && (
              <div
                className={`px-6 pt-4 ${
                  message.type === 'error'
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : 'bg-green-50 border-l-4 border-green-500'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    message.type === 'error' ? 'text-red-800' : 'text-green-800'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6">
              {tab === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email-signin"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      {t('auth.emailAddress')}
                    </label>
                    <input
                      id="email-signin"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                      placeholder={t('auth.emailPlaceholder')}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password-signin"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <input
                        id="password-signin"
                        name="password"
                        type={showPassword['signin'] ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={form.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, signin: !prev.signin }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword['signin'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgotPassword');
                        clearMessage();
                      }}
                      className="text-sm font-medium text-[#27AE60] hover:text-[#229954] transition-colors"
                    >
                      {t('auth.forgotPassword')}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#27AE60] hover:bg-[#229954] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? t('auth.signingIn') : t('auth.signIn')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      {t('auth.fullName')}
                    </label>
                    <input
                      id="fullname"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                      placeholder={t('auth.namePlaceholder')}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email-signup"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      {t('auth.emailAddress')}
                    </label>
                    <input
                      id="email-signup"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                      placeholder={t('auth.emailPlaceholder')}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password-signup"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      {t('auth.password')}
                    </label>
                    <div className="relative">
                      <input
                        id="password-signup"
                        name="password"
                        type={showPassword['signup'] ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={form.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, signup: !prev.signup }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword['signup'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {t('auth.atLeast8Characters')}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-slate-700 mb-1.5"
                    >
                      {t('auth.confirmPassword')}
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showPassword['confirm'] ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={form.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword['confirm'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#27AE60] hover:bg-[#229954] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-600 font-medium">
                    {t('auth.orContinueWith')}
                  </span>
                </div>
              </div>

              {/* OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {googleLoading ? t('auth.signingIn') : t('auth.continueWithGoogle')}
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-center text-slate-600 leading-relaxed">
                {t('auth.termsPrefix')} {tab === 'signup' ? t('auth.signingUpAgreement') : t('auth.signingInAgreement')} {t('auth.youAgree')}{' '}
                <a
                  href="#"
                  className="font-medium text-[#27AE60] hover:text-[#229954] transition-colors"
                >
                  {t('auth.termsOfService')}
                </a>{' '}
                {t('auth.and')}{' '}
                <a
                  href="#"
                  className="font-medium text-[#27AE60] hover:text-[#229954] transition-colors"
                >
                  {t('auth.privacyPolicy')}
                </a>
              </p>
            </div>
          </>
        )}

        {view === 'forgotPassword' && (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">{t('auth.resetPassword')}</h2>
              <p className="text-sm text-slate-600 mt-1">
                {t('auth.resetPasswordDesc')}
              </p>
            </div>

            {/* Message Area */}
            {message.type && (
              <div
                className={`px-6 pt-4 ${
                  message.type === 'error'
                    ? 'bg-red-50 border-l-4 border-red-500'
                    : 'bg-green-50 border-l-4 border-green-500'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    message.type === 'error' ? 'text-red-800' : 'text-green-800'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="p-4 sm:p-6">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    {t('auth.emailAddress')}
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                    placeholder={t('auth.emailPlaceholder')}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#27AE60] hover:bg-[#229954] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? t('auth.sending') : t('auth.sendResetLink')}
                </button>
              </form>

              <button
                type="button"
                onClick={handleBackToSignIn}
                className="w-full mt-4 py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                {t('auth.backToSignIn')}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile testimonial strip — horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide" style={{ zIndex: 10 }}>
        {personaCards.slice(0, 4).map((card) => (
          <div key={card.initials} className="flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-md border border-gray-100 w-44">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-[9px] font-bold`}>
                {card.initials}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-900">{card.name}</p>
                <p className="text-[9px] text-gray-500">{card.trade} · {card.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 rounded">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-600" />
              <span className="text-[9px] font-semibold text-emerald-700">{card.stat}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
