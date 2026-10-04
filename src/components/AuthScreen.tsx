import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Screen } from '../types';

interface AuthScreenProps {
  onNavigate: (screen: Screen) => void;
  redirectTo?: Screen;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, redirectTo = 'catalog' }) => {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, show user info and options
  if (user) {
    return (
      <div className="min-h-[80vh] pt-28 pb-16 px-4 md:px-8 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold mb-6 overflow-hidden ring-4 ring-black/5">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            (user.displayName?.[0] || user.email?.[0] || 'Z').toUpperCase()
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#191c1d] tracking-tight">
          Welcome back, {user.displayName || user.email?.split('@')[0]}
        </h1>
        <p className="text-[#76777d] mt-2 text-sm">{user.email}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => onNavigate('account')}
            className="flex-1 bg-black text-white font-semibold py-3 px-6 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer text-sm"
          >
            My Account & Orders
          </button>
          <button
            onClick={() => onNavigate(redirectTo)}
            className="flex-1 bg-[#f3f4f5] text-[#191c1d] font-semibold py-3 px-6 rounded-xl hover:bg-[#e7e8e9] transition-colors cursor-pointer text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onNavigate(redirectTo);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in was cancelled.');
      } else {
        setError(err.message || 'Failed to authenticate with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(fullName.trim(), email, password);
      }
      onNavigate(redirectTo);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account already exists with this email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign in is not enabled in Firebase console. Please use Google Sign In above.');
      } else {
        setError(err.message || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate(redirectTo)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#76777d] hover:text-black tracking-wider uppercase transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Return to Store
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] border border-[#eceeed] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Brand Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#0f1113] text-white p-10 flex-col justify-between relative overflow-hidden">
            {/* Background texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9GDejCy62fmkiK5Bl0QnkaOe5_0p4n2wiVgIA9Ccd8uDyEamSf1fG_L5YU9q0w4y2OIl6BHSABMK1wrRC8l4fZq3wsBPdLF6CpXc7jQ7i6yF3R3qix4OcvCp7QVIwuI1MMJZuPJJqwaW0pwm8tV6nBuBdaMzF43g6gt8nz1p4RIYlpxCsAeq8bX2iSUuXbcPNMzfUudYQ3C95IS1EdCuHdf81bN61C_a6-WETM6dwRG7GYszl23NtUw"
              alt="Zen X Brand"
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter grayscale contrast-125"
            />

            <div className="relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold tracking-widest uppercase mb-6 text-zinc-300">
                <span>ZEN X CLOTHING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>AUTH V2.0</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
                Architectural Essentials for the Modern Wardrobe
              </h2>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                Join our collective to unlock synchronized cart across devices, real-time shipment dispatch tracking, and private access to archival drops.
              </p>
            </div>

            <div className="relative z-20 space-y-4 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-zinc-200">local_shipping</span>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">Express Dispatch</p>
                  <p className="text-zinc-400">Next-day courier handover from Bangalore</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-zinc-200">verified_user</span>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">Secure Cloud Sync</p>
                  <p className="text-zinc-400">Authenticated via Firebase enterprise security</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px] text-zinc-200">loyalty</span>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">Member Privileges</p>
                  <p className="text-zinc-400">Automatic 10% coupon & drop alerts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#eceeed] mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 pb-4 text-sm font-semibold tracking-wide cursor-pointer transition-all border-b-2 ${
                  mode === 'signin'
                    ? 'border-black text-black'
                    : 'border-transparent text-[#76777d] hover:text-black'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 pb-4 text-sm font-semibold tracking-wide cursor-pointer transition-all border-b-2 ${
                  mode === 'signup'
                    ? 'border-black text-black'
                    : 'border-transparent text-[#76777d] hover:text-black'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#191c1d] tracking-tight">
                {mode === 'signin' ? 'Sign in to your account' : 'Create your Zen X account'}
              </h1>
              <p className="text-xs text-[#76777d] mt-1">
                {mode === 'signin'
                  ? 'Access your orders, saved addresses, and active shopping bag.'
                  : 'Start enjoying early drop access and seamless express checkout.'}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-red-500">error</span>
                <div className="flex-1">{error}</div>
              </div>
            )}

            {/* One-Click Google Authentication */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#d2d4d7] bg-white hover:bg-[#f8f9fa] text-[#1f2937] text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-[#eceeed]" />
              <span className="px-3 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                Or with email
              </span>
              <div className="flex-1 border-t border-[#eceeed]" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[18px]">
                      person
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arjun Mehta"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#d2d4d7] text-sm text-[#191c1d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#d2d4d7] text-sm text-[#191c1d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#374151] uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Please use Google Sign In if you forgot your credentials, or reach out to support@zenxapparel.in')}
                      className="text-xs text-[#76777d] hover:text-black hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-[#d2d4d7] text-sm text-[#191c1d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-black cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] text-[18px]">
                      lock_reset
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#d2d4d7] text-sm text-[#191c1d] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 h-12 bg-black text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{mode === 'signin' ? 'Sign In with Email' : 'Create Account'}</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#eceeed] text-center">
              <p className="text-xs text-[#76777d]">
                {mode === 'signin' ? (
                  <>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setError(null);
                      }}
                      className="font-semibold text-black hover:underline cursor-pointer"
                    >
                      Create one now
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setError(null);
                      }}
                      className="font-semibold text-black hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
