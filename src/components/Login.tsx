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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500">
      {/* Animated Pattern Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              {/* Abstract shapes */}
              <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="2" opacity="0.3" className="animate-float-1" />
              <rect x="50" y="10" width="30" height="30" rx="8" fill="none" stroke="white" strokeWidth="2" opacity="0.3" className="animate-float-2" />
              <path d="M 70 60 Q 80 70 70 80 Q 60 70 70 60" fill="none" stroke="white" strokeWidth="2" opacity="0.3" className="animate-float-3" />
              <ellipse cx="25" cy="70" rx="12" ry="8" fill="none" stroke="white" strokeWidth="2" opacity="0.3" className="animate-float-4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-end sm:items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4 pb-8 sm:pb-0">
          
          {/* Welcome Page */}
          <div className={`transition-all duration-700 ease-out ${
            currentPage === 'welcome' && !isTransitioning
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-[-100vh] pointer-events-none absolute'
          }`}>
            {/* Liquid Shape Container */}
            <div className="relative">
              {/* Main Card with Liquid Bottom */}
              <div className="relative bg-white rounded-t-[60px] shadow-2xl overflow-hidden min-h-[70vh] sm:min-h-[500px] animate-slide-up">
                {/* Content */}
                <div className="relative z-10 pt-16 px-8 pb-12 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    {/* Logo/Icon */}
                    <div className="inline-block">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-gentle">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-3">
                      <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight animate-fade-in-up">
                        Welcome
                      </h1>
                      <p className="text-gray-500 text-base leading-relaxed max-w-sm animate-fade-in-up-delay">
                        Sign in to access your F.O.R.T account and manage your finances seamlessly
                      </p>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    className="group flex items-center justify-between w-full mt-auto"
                  >
                    <span className="text-rose-400 font-semibold text-lg group-hover:text-rose-500 transition-colors">
                      Continue
                    </span>
                    <div className="w-14 h-14 bg-rose-400 rounded-full flex items-center justify-center shadow-lg group-hover:bg-rose-500 group-active:scale-95 transition-all duration-300">
                      <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>

                {/* Liquid Wave Shape at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 w-full h-full"
                  >
                    <path
                      d="M0,0 C300,100 900,100 1200,0 L1200,120 L0,120 Z"
                      fill="url(#wave-gradient)"
                      className="animate-wave"
                    />
                    <defs>
                      <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(251, 113, 133, 0.1)" />
                        <stop offset="50%" stopColor="rgba(244, 114, 182, 0.1)" />
                        <stop offset="100%" stopColor="rgba(251, 113, 133, 0.1)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Login Page */}
          <div className={`transition-all duration-700 ease-out ${
            currentPage === 'login' && !isTransitioning
              ? 'opacity-100 translate-y-0'
              : currentPage === 'login'
              ? 'opacity-0 translate-y-[100vh]'
              : 'opacity-0 translate-y-[100vh] pointer-events-none absolute'
          }`}>
            {/* Liquid Shape Container */}
            <div className="relative">
              {/* Main Card with Liquid Top */}
              <div className="relative bg-white rounded-t-[60px] shadow-2xl overflow-visible min-h-[70vh] sm:min-h-[500px]">
                {/* Liquid Wave Shape at Top */}
                <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden transform translate-y-[-99%]">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="absolute top-0 w-full h-full"
                  >
                    <path
                      d="M0,120 C300,20 900,20 1200,120 L1200,0 L0,0 Z"
                      className="fill-white"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-12 px-8 pb-12">
                  {/* Sign In Title */}
                  <div className="mb-8 animate-fade-in-up">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h2>
                    <div className="w-12 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" />
                  </div>

                  {/* Role Selector */}
                  <div className="mb-8 animate-fade-in-up-delay">
                    <div className="flex gap-3 p-1 bg-gray-100 rounded-2xl">
                      <button
                        onClick={() => switchRole('member')}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-500 ease-out ${
                          role === 'member'
                            ? 'bg-white text-gray-900 shadow-md scale-105'
                            : 'text-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Member</span>
                        </div>
                      </button>
                      <button
                        onClick={() => switchRole('admin')}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-500 ease-out ${
                          role === 'admin'
                            ? 'bg-white text-gray-900 shadow-md scale-105'
                            : 'text-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>Admin</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Identifier Field */}
                    <div className="space-y-3 animate-fade-in-up-delay-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        {role === 'admin' ? 'Username' : 'Your Name'}
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className={`h-5 w-5 transition-colors duration-300 ${
                            identifier ? 'text-rose-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:bg-white transition-all duration-300 text-base"
                          placeholder={role === 'admin' ? 'Enter username' : 'Enter your name'}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Password Field (Admin Only) */}
                    {role === 'admin' && (
                      <div className="space-y-3 animate-slide-down">
                        <label className="block text-sm font-semibold text-gray-700">
                          Password
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className={`h-5 w-5 transition-colors duration-300 ${
                              password ? 'text-rose-400' : 'text-gray-400'
                            }`} />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:bg-white transition-all duration-300 text-base"
                            placeholder="Enter password"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-8 ${
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 active:scale-[0.98]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span className="text-lg">Login</span>
                      )}
                    </button>

                    {/* Helper Text */}
                    <div className="pt-4 text-center">
                      <p className="text-sm text-gray-500">
                        {role === 'admin' 
                          ? 'Secure access with credentials'
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
      </div>

      {/* Apple-like Smooth Animations */}
      <style jsx>{`
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

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

        /* Apple-like easing */
        * {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Remove tap highlight on mobile */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Prevent input zoom on iOS */
        @supports (-webkit-touch-callout: none) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* Smooth transforms */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}