import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Sparkles, Eye, EyeOff, Zap, Lock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { login } = useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1200));

    if (!username.trim()) {
      setError('Username required');
      setIsLoading(false);
      return;
    }

    if (role === 'admin' && !password.trim()) {
      setError('Password required');
      setIsLoading(false);
      return;
    }

    if (login(username.trim(), role, password.trim() || undefined)) {
      setError('');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main container */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="w-full max-w-md">
          {/* Logo section */}
          <div className="text-center mb-12 space-y-6">
            <div className={`inline-block transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-3xl shadow-2xl">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            
            <div className={`space-y-2 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                F.O.R.T
              </h1>
              <p className="text-slate-400 text-sm tracking-widest uppercase">Collective</p>
            </div>
          </div>

          {/* Role selector - Card style */}
          <div className={`mb-8 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl p-2 border border-slate-800/50 shadow-2xl">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`relative py-4 px-6 rounded-2xl transition-all duration-500 ${
                    role === 'member'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/50'
                      : 'bg-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <UserCheck className={`w-6 h-6 transition-all duration-300 ${role === 'member' ? 'text-white scale-110' : 'text-slate-500'}`} />
                    <span className={`text-sm font-medium transition-colors ${role === 'member' ? 'text-white' : 'text-slate-400'}`}>
                      Builder
                    </span>
                  </div>
                  {role === 'member' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 animate-ping"></div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`relative py-4 px-6 rounded-2xl transition-all duration-500 ${
                    role === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-500/50'
                      : 'bg-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Shield className={`w-6 h-6 transition-all duration-300 ${role === 'admin' ? 'text-white scale-110' : 'text-slate-500'}`} />
                    <span className={`text-sm font-medium transition-colors ${role === 'admin' ? 'text-white' : 'text-slate-400'}`}>
                      Guardian
                    </span>
                  </div>
                  {role === 'admin' && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 animate-ping"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Username field */}
                <div className="space-y-2">
                  <label className="text-slate-400 text-xs uppercase tracking-wider font-medium flex items-center gap-2">
                    <User className="w-3 h-3" />
                    Identity
                  </label>
                  <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'transform scale-105' : ''}`}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-300"
                      placeholder="Enter your username"
                    />
                    {focusedField === 'username' && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10 blur-xl"></div>
                    )}
                  </div>
                </div>

                {/* Password field - only for admin */}
                {role === 'admin' && (
                  <div className="space-y-2 animate-slideIn">
                    <label className="text-slate-400 text-xs uppercase tracking-wider font-medium flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Security Key
                    </label>
                    <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl px-4 py-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-slate-800/80 transition-all duration-300"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      {focusedField === 'password' && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 -z-10 blur-xl"></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 animate-shake">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full relative overflow-hidden rounded-2xl py-4 font-semibold text-white transition-all duration-300 ${
                    isLoading
                      ? 'bg-slate-700 cursor-not-allowed'
                      : role === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-95 shadow-lg shadow-purple-500/50'
                      : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95 shadow-lg shadow-blue-500/50'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Zap className="w-5 h-5" />
                      <span>Enter Collective</span>
                    </div>
                  )}
                  
                  {!isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  )}
                </button>
              </form>

              {/* Bottom accent */}
              <div className={`h-1 bg-gradient-to-r ${role === 'admin' ? 'from-purple-600 via-purple-500 to-purple-600' : 'from-blue-600 via-blue-500 to-blue-600'} transition-all duration-500`}></div>
            </div>
          </div>

          {/* Footer text */}
          <div className={`text-center mt-8 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-slate-500 text-sm">
              Friends Organization for Resilience & Trust
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}