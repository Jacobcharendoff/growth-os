'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

interface MessageState {
  type: 'error' | 'success' | null;
  text: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check if we have a recovery token in the URL hash
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setHasToken(true);
    } else {
      setMessage({
        type: 'error',
        text: 'Invalid or missing recovery token. Please request a new password reset link.',
      });
    }
  }, []);

  const clearMessage = () => {
    setMessage({ type: null, text: '' });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessage();

    // Validation
    if (!password.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter a new password.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match.',
      });
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters.',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await getSupabase().auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to reset password. Please try again.',
        });
        setLoading(false);
        return;
      }

      setMessage({
        type: 'success',
        text: 'Password reset successfully. Redirecting to login...',
      });
      setPassword('');
      setConfirmPassword('');
      setRedirecting(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="space-y-8">
      {/* Branding */}
      <div className="text-center">
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
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Set New Password</h2>
          <p className="text-sm text-slate-600 mt-1">
            Enter a new password to reset your account access.
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
          {!hasToken ? (
            <div className="space-y-4">
              <p className="text-slate-700">
                It looks like your password reset link is invalid or has expired.
              </p>
              <button
                onClick={handleBackToLogin}
                className="w-full py-2.5 px-4 bg-[#27AE60] hover:bg-[#229954] text-white font-medium rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword['new'] ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading || redirecting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword['new'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  At least 8 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password"
                    type={showPassword['confirmNew'] ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-11 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27AE60] focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading || redirecting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirmNew: !prev.confirmNew }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword['confirmNew'] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || redirecting}
                className="w-full py-2.5 px-4 bg-[#27AE60] hover:bg-[#229954] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {redirecting ? 'Success! Redirecting...' : loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {hasToken && (
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full mt-4 py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
