import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Lock, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import ShaderBackground from './common/ShaderBackground';

export default function Login() {
  const { login } = useApp();
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            : 'Member name not found. Please check and try again.'
        );
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSwitch = (newRole: 'admin' | 'member') => {
    setRole(newRole);
    setIdentifier('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background */}
      <ShaderBackground />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Logo & Welcome */}
          <div className="text-center mb-8 space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-2xl mb-4 animate-bounce-slow">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent animate-gradient">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">
                Sign in to access your account
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Role Selector */}
            <div className="p-2 bg-white/5 border-b border-white/10">
              <div className="flex gap-2 p-1 bg-black/20 rounded-2xl">
                <button
                  onClick={() => handleRoleSwitch('member')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    role === 'member'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Member</span>
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    role === 'admin'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 animate-shake">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Identifier Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 ml-1">
                  {role === 'admin' ? 'Username' : 'Your Name'}
                </label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    role === 'admin' 
                      ? 'from-blue-500 to-purple-500' 
                      : 'from-emerald-500 to-teal-500'
                  } rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                    focusedField === 'identifier' ? 'opacity-20' : ''
                  }`} />
                  <div className="relative flex items-center">
                    <User className={`absolute left-4 h-5 w-5 transition-colors duration-300 ${
                      focusedField === 'identifier' 
                        ? role === 'admin' ? 'text-blue-400' : 'text-emerald-400'
                        : 'text-gray-500'
                    }`} />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      onFocus={() => setFocusedField('identifier')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-base"
                      placeholder={role === 'admin' ? 'Enter your username' : 'Enter your name'}
                      disabled={isLoading}
                      autoComplete="username"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field (Admin Only) */}
              {role === 'admin' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                      focusedField === 'password' ? 'opacity-20' : ''
                    }`} />
                    <div className="relative flex items-center">
                      <Lock className={`absolute left-4 h-5 w-5 transition-colors duration-300 ${
                        focusedField === 'password' ? 'text-blue-400' : 'text-gray-500'
                      }`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-base"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
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
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : role === 'admin'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:scale-105 active:scale-95'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:scale-105 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Helper Text */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-start space-x-2 text-xs text-gray-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p>
                    {role === 'admin' 
                      ? 'Admin access requires username and password authentication'
                      : 'Member access only requires your registered name'
                    }
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2026 F.O.R.T. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        /* Smooth focus transitions */
        input:focus {
          transform: scale(1.01);
        }

        /* Custom scrollbar for mobile */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Touch feedback for mobile */
        @media (hover: none) and (pointer: coarse) {
          button:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}