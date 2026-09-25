import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ArrowRight, 
  KeyRound,
  Loader2,
  Database
} from 'lucide-react';

export const AuthView = ({ onAuthSuccess }) => {
  const { t } = useLanguage();
  const { login, register, isSupabaseReady } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' (Step 2) or 'register' (Step 1)
  const [identifier, setIdentifier] = useState('rajesh@doorlyn.in');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [name, setName] = useState('Rajesh Kumar');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const res = await register(identifier, password, name);
        if (res && res.success === false) {
          setErrorMsg(res.error || 'Registration failed. Please try again.');
          setIsLoading(false);
          return;
        }
      } else {
        const res = await login(identifier, password);
        if (res && res.success === false) {
          setErrorMsg(res.error || 'Login failed. Please check credentials.');
          setIsLoading(false);
          return;
        }
      }

      if (onAuthSuccess) onAuthSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            D
          </div>
          <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Doorlyn AI Multilingual OS
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === 'register' ? t('step1RegisterTitle') : t('step2LoginTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'register' ? t('step1RegisterSub') : t('step2LoginSub')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {t('emailOrPhone')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 9876543210 or name@doorlyn.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                {t('enterPassword')}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-bold text-amber-600 hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {t('confirmPassword')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:bg-white"
                required
              />
            </div>
          )}

          {errorMsg && (
            <p className="text-xs font-bold text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-700 via-teal-600 to-amber-600 hover:from-teal-800 hover:to-amber-700 disabled:opacity-60 text-white rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {mode === 'register' ? t('registerBtn') : t('loginBtn')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {isSupabaseReady && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Connected to Supabase Cloud</span>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrorMsg('');
            }}
            className="text-xs font-bold text-teal-700 hover:underline"
          >
            {mode === 'login' ? t('noAccount') : t('alreadyHaveAccount')}
          </button>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
            <KeyRound className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Enter your mobile or email to receive OTP reset link.
            </p>
            {resetSent ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-bold mb-4">
                ✓ OTP reset link sent via SMS & WhatsApp!
              </div>
            ) : (
              <input
                type="text"
                placeholder="Mobile number or Email"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold mb-4"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              {!resetSent && (
                <button
                  onClick={() => setResetSent(true)}
                  className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold"
                >
                  Send Reset OTP
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
