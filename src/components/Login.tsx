import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff, Loader2, Sparkles, TrendingUp } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [currentPage, setCurrentPage] = useState<'welcome' | 'login'>('welcome');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContinue = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage('login');
      setTimeout(() => setIsTransitioning(false), 100);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim()) {
      setError(role === 'admin' ? 'Please enter your username' : 'Please enter your name');
      return;
    }

    if (role === 'admin' && !password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(
        identifier.trim(),
        role,
        role === 'admin' ? password : undefined
      );

      if (!success) {
        setError(
          role === 'admin' 
            ? 'Invalid username or password' 
            : 'Member name not found'
        );
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (newRole: 'admin' | 'member') => {
    setRole(newRole);
    setIdentifier('');
    setPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow-delayed" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" opacity="0.3" />
              <circle cx="0" cy="0" r="2" fill="white" opacity="0.2" />
              <circle cx="60" cy="0" r="2" fill="white" opacity="0.2" />
              <circle cx="0" cy="60" r="2" fill="white" opacity="0.2" />
              <circle cx="60" cy="60" r="2" fill="white" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Welcome Page */}
      <div className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        currentPage === 'welcome' && !isTransitioning
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="relative h-full flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md space-y-12 animate-fade-in-up">
            {/* Logo Section */}
            <div className="text-center space-y-6">
              {/* Logo Icon */}
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse-gentle" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Brand Name */}
              <div className="space-y-3">
                <h1 className="text-5xl font-bold text-white tracking-wider">
                  F.O.R.T
                </h1>
                <p className="text-xl font-light text-blue-200/80 tracking-wide">
                  COLLECTIVE
                </p>
              </div>

              {/* Tagline */}
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <p className="text-sm font-medium">
                  Friends Organization for Resilience & Trust
                </p>
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>

            {/* Identity Section */}
            <div className="space-y-4 animate-fade-in-up-delay">
              <label className="block text-sm font-bold text-white/90 tracking-wide uppercase">
                Identity
              </label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 text-base"
                placeholder="Enter your unique identifier"
                disabled
              />
            </div>

            {/* Choose Path Section */}
            <div className="space-y-5 animate-fade-in-up-delay-2">
              <h3 className="text-center text-sm font-bold text-white/90 tracking-wide uppercase">
                Choose Your Path
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Guardian/Admin Button */}
                <button
                  onClick={handleContinue}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-8 w-8 text-white/80 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white mb-1">Guardian</p>
                      <p className="text-xs text-white/60">Administrator</p>
                    </div>
                  </div>
                </button>

                {/* Builder/Member Button */}
                <button
                  onClick={handleContinue}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 backdrop-blur-xl border border-blue-400/30 p-6 hover:from-blue-600/50 hover:to-purple-600/50 hover:border-blue-400/50 transition-all duration-300 shadow-lg shadow-blue-500/20"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User className="h-8 w-8 text-white group-hover:text-blue-200 transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white mb-1">Builder</p>
                      <p className="text-xs text-blue-200/80">Member</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Page */}
      <div className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        currentPage === 'login' && !isTransitioning
          ? 'opacity-100 translate-y-0'
          : currentPage === 'login'
          ? 'opacity-0 translate-y-full'
          : 'opacity-0 translate-y-full pointer-events-none'
      }`}>
        <div className="relative h-full flex items-center justify-center px-6 py-12 overflow-auto">
          <div className="w-full max-w-md space-y-8 animate-fade-in-up">
            {/* Logo */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-50" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-sm text-white/60">Sign in to continue to F.O.R.T</p>
            </div>

            {/* Role Selector */}
            <div className="p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => switchRole('member')}
                  className={`relative py-3 px-4 rounded-xl font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    role === 'member'
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Member</span>
                  </div>
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className={`relative py-3 px-4 rounded-xl font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    role === 'admin'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-white/60 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Admin</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl animate-shake">
                  <p className="text-sm text-red-300 font-medium text-center">{error}</p>
                </div>
              )}

              {/* Identifier Field */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-white/90 tracking-wide uppercase">
                  {role === 'admin' ? 'Username' : 'Your Name'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className={`h-5 w-5 transition-all duration-300 ${
                      identifier ? 'text-blue-400' : 'text-white/40'
                    }`} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="relative w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-300 text-base"
                    placeholder={role === 'admin' ? 'Enter your username' : 'Enter your name'}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field (Admin Only) */}
              {role === 'admin' && (
                <div className="space-y-3 animate-slide-down">
                  <label className="block text-sm font-bold text-white/90 tracking-wide uppercase">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock className={`h-5 w-5 transition-all duration-300 ${
                        password ? 'text-purple-400' : 'text-white/40'
                      }`} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative w-full pl-12 pr-12 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300 text-base"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/80 transition-colors z-10"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative w-full py-4 rounded-2xl font-bold text-white text-lg overflow-hidden group transition-all duration-300 active:scale-[0.98] ${
                    isLoading
                      ? 'bg-white/10 cursor-not-allowed'
                      : role === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/30'
                  }`}
                >
                  {!isLoading && (
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </button>
              </div>

              {/* Helper Text */}
              <div className="text-center">
                <p className="text-xs text-white/50">
                  {role === 'admin' 
                    ? 'Secure admin access with credentials'
                    : 'Quick member access with your name'
                  }
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slow-delayed {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delay {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards;
          opacity: 0;
        }

        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .animate-slide-down {
          animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        @supports (-webkit-touch-callout: none) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}