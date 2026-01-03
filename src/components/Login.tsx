import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500">
      {/* Animated Pattern Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="2" opacity="0.4" className="animate-float-1" />
              <rect x="50" y="10" width="30" height="30" rx="8" fill="none" stroke="white" strokeWidth="2" opacity="0.4" className="animate-float-2" />
              <path d="M 70 60 Q 80 70 70 80 Q 60 70 70 60" fill="none" stroke="white" strokeWidth="2" opacity="0.4" className="animate-float-3" />
              <ellipse cx="25" cy="70" rx="12" ry="8" fill="none" stroke="white" strokeWidth="2" opacity="0.4" className="animate-float-4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Welcome Page */}
      <div className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        currentPage === 'welcome' && !isTransitioning
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="relative h-full flex flex-col">
          {/* Pink Background Section - Takes 40% of screen */}
          <div className="flex-[4] relative overflow-hidden">
            {/* Content can go here if needed */}
          </div>

          {/* White Card Section - Takes 60% of screen */}
          <div className="flex-[6] relative">
            {/* Liquid Wave Shape */}
            <div className="absolute top-0 left-0 right-0 h-32 transform -translate-y-full">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full h-full"
              >
                <path
                  d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z"
                  className="fill-white"
                />
                <path
                  d="M0,10 C300,90 900,90 1200,10 L1200,120 L0,120 Z"
                  fill="rgba(255, 255, 255, 0.5)"
                  className="animate-wave"
                />
              </svg>
            </div>

            {/* White Card Content */}
            <div className="relative h-full bg-white rounded-t-[60px] overflow-hidden">
              <div className="h-full flex flex-col justify-between p-8 pt-16 safe-area-inset">
                <div className="space-y-6 animate-fade-in-up">
                  {/* Logo */}
                  <div className="inline-block">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Welcome Text */}
                  <div className="space-y-3">
                    <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                      Welcome
                    </h1>
                    <p className="text-gray-500 text-base leading-relaxed">
                      Sign in to access your F.O.R.T account and manage your finances seamlessly
                    </p>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="group flex items-center justify-between w-full animate-fade-in-up-delay"
                >
                  <span className="text-rose-400 font-semibold text-lg group-hover:text-rose-500 transition-colors duration-300">
                    Continue
                  </span>
                  <div className="w-14 h-14 bg-rose-400 rounded-full flex items-center justify-center shadow-lg group-hover:bg-rose-500 group-active:scale-95 transition-all duration-300">
                    <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
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
        <div className="relative h-full flex flex-col">
          {/* Pink Background Section - Takes 20% of screen */}
          <div className="flex-[2] relative overflow-hidden">
            {/* Content can go here if needed */}
          </div>

          {/* White Card Section - Takes 80% of screen */}
          <div className="flex-[8] relative">
            {/* Liquid Wave Shape */}
            <div className="absolute top-0 left-0 right-0 h-32 transform -translate-y-full">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full h-full"
              >
                <path
                  d="M0,120 C300,40 900,40 1200,120 L1200,0 L0,0 Z"
                  className="fill-white"
                />
              </svg>
            </div>

            {/* White Card Content */}
            <div className="relative h-full bg-white rounded-t-[60px] overflow-auto">
              <div className="min-h-full p-8 pt-12 pb-safe safe-area-inset">
                {/* Sign In Title */}
                <div className="mb-8 animate-fade-in-up">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
                  <div className="w-12 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" />
                </div>

                {/* Role Selector */}
                <div className="mb-8 animate-fade-in-up-delay">
                  <div className="flex gap-3 p-1.5 bg-gray-100 rounded-2xl">
                    <button
                      onClick={() => switchRole('member')}
                      className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        role === 'member'
                          ? 'bg-white text-gray-900 shadow-lg scale-[1.02]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <User className={`h-5 w-5 transition-transform duration-300 ${
                          role === 'member' ? 'scale-110' : ''
                        }`} />
                        <span>Member</span>
                      </div>
                    </button>
                    <button
                      onClick={() => switchRole('admin')}
                      className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        role === 'admin'
                          ? 'bg-white text-gray-900 shadow-lg scale-[1.02]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className={`h-5 w-5 transition-transform duration-300 ${
                          role === 'admin' ? 'scale-110' : ''
                        }`} />
                        <span>Admin</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl animate-shake">
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  {/* Identifier Field */}
                  <div className="space-y-3 animate-fade-in-up-delay-2">
                    <label className="block text-sm font-semibold text-gray-700 ml-1">
                      {role === 'admin' ? 'Your Username' : 'Your Name'}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <User className={`h-5 w-5 transition-all duration-300 ${
                          identifier ? 'text-rose-400 scale-110' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="relative w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:bg-white focus:shadow-lg transition-all duration-300 text-base"
                        placeholder={role === 'admin' ? 'Enter your username' : 'Enter your name'}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field (Admin Only) */}
                  {role === 'admin' && (
                    <div className="space-y-3 animate-slide-down">
                      <label className="block text-sm font-semibold text-gray-700 ml-1">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Lock className={`h-5 w-5 transition-all duration-300 ${
                            password ? 'text-rose-400 scale-110' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="relative w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:bg-white focus:shadow-lg transition-all duration-300 text-base"
                          placeholder="Enter your password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors z-10"
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
                      className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-xl transition-all duration-300 active:scale-[0.98] ${
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 hover:shadow-2xl'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        'Login'
                      )}
                    </button>
                  </div>

                  {/* Helper Text */}
                  <div className="pt-2 text-center">
                    <p className="text-sm text-gray-500">
                      {role === 'admin' 
                        ? 'Quick access with your name'
                        : 'Quick access with your name'
                      }
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apple-like Smooth Animations */}
      <style jsx>{`
        /* Safe area support for notches */
        .safe-area-inset {
          padding-left: max(2rem, env(safe-area-inset-left));
          padding-right: max(2rem, env(safe-area-inset-right));
        }

        .pb-safe {
          padding-bottom: max(2rem, env(safe-area-inset-bottom));
        }

        .pt-safe {
          padding-top: max(3rem, env(safe-area-inset-top));
        }

        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(5px, -5px) rotate(5deg);
          }
          50% {
            transform: translate(-3px, 3px) rotate(-3deg);
          }
          75% {
            transform: translate(3px, 5px) rotate(3deg);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-5px, 5px) rotate(-5deg);
          }
          66% {
            transform: translate(5px, -3px) rotate(5deg);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-8px, 8px);
          }
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(5px, -5px) scale(1.1);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25px);
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

        @keyframes bounce-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
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

        .animate-float-1 {
          animation: float-1 8s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 10s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
        }

        .animate-float-4 {
          animation: float-4 9s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 3s ease-in-out infinite;
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
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        .animate-slide-down {
          animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Apple-like easing for all transitions */
        * {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Remove tap highlight */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Prevent input zoom on iOS */
        @supports (-webkit-touch-callout: none) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }

        /* Hide scrollbar but keep functionality */
        .overflow-auto {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .overflow-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}