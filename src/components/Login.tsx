import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Sparkles, Eye, EyeOff, ArrowRight, Lock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [wipeOrigin, setWipeOrigin] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { login } = useApp();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRoleSelect = (selectedRole: 'admin' | 'member', event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setWipeOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    
    setRole(selectedRole);
    setTransitioning(true);
    
    setTimeout(() => {
      setStep(2);
      setTransitioning(false);
    }, 800);
  };

  const handleCredentialsSubmit = async () => {
    setError('');

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (role === 'admin' && !password.trim()) {
      setError('Please enter your password');
      return;
    }

    // Start the wipe transition
    setTransitioning(true);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(username.trim(), role!, password.trim() || undefined)) {
      // Successful login - let transition complete
      setTimeout(() => {
        setStep(3);
      }, 500);
    } else {
      setError('Invalid credentials');
      setTransitioning(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleCredentialsSubmit();
    }
  };

  const wipeColor = role === 'admin' 
    ? 'bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600'
    : 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Color wipe overlay */}
      {transitioning && (
        <div
          className={`fixed inset-0 z-50 ${wipeColor}`}
          style={{
            clipPath: 'circle(0% at 50% 50%)',
            animation: 'wipeExpand 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards'
          }}
        />
      )}

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full max-w-md space-y-12">
            {/* Logo */}
            <div className="text-center space-y-4">
              <div className="inline-block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-3xl shadow-2xl">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                  F.O.R.T
                </h1>
                <p className="text-slate-400 text-sm tracking-widest uppercase">Collective</p>
              </div>
            </div>

            {/* Question */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-light text-white">Who are you?</h2>
              <p className="text-slate-400">Choose your path to continue</p>
            </div>

            {/* Role Cards */}
            <div className="space-y-4">
              <button
                onClick={(e) => handleRoleSelect('member', e)}
                className="w-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/40 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30">
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-4 rounded-2xl">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-semibold text-white mb-1">Builder</h3>
                      <p className="text-slate-400 text-sm">Member Access</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </button>

              <button
                onClick={(e) => handleRoleSelect('admin', e)}
                className="w-full group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-slate-900/40 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl p-8 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-purple-600 to-violet-600 p-4 rounded-2xl">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-2xl font-semibold text-white mb-1">Guardian</h3>
                      <p className="text-slate-400 text-sm">Administrator Access</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-purple-400 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Friends Organization for Resilience & Trust
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Credentials */}
      {step === 2 && (
        <div className={`min-h-screen ${role === 'admin' ? 'bg-gradient-to-br from-purple-950 via-violet-950 to-purple-900' : 'bg-gradient-to-br from-blue-950 via-cyan-950 to-blue-900'} flex items-center justify-center p-4`}>
          <div className="w-full max-w-md space-y-8">
            {/* Back indicator */}
            <div className="flex items-center gap-3 text-white/60">
              <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
              <span className="text-sm capitalize">{role} Path</span>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-4xl font-light text-white">Welcome, {role === 'admin' ? 'Guardian' : 'Builder'}</h2>
              <p className="text-white/60">Enter your credentials to continue</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Username */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white/80 text-sm uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  Identity
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-white/10 backdrop-blur-xl border-2 ${role === 'admin' ? 'border-purple-500/30 focus:border-purple-400' : 'border-blue-500/30 focus:border-blue-400'} rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all duration-300 text-lg`}
                  placeholder="Enter your username"
                  autoFocus
                />
              </div>

              {/* Password - only for admin */}
              {role === 'admin' && (
                <div className="space-y-3 animate-slideDown">
                  <label className="flex items-center gap-2 text-white/80 text-sm uppercase tracking-wider">
                    <Lock className="w-4 h-4" />
                    Security Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-white/10 backdrop-blur-xl border-2 border-purple-500/30 focus:border-purple-400 rounded-2xl px-6 py-4 pr-14 text-white placeholder-white/40 focus:outline-none focus:bg-white/20 transition-all duration-300 text-lg"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/40 rounded-2xl p-4 animate-shake">
                  <p className="text-red-200 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleCredentialsSubmit}
                disabled={isLoading}
                className={`w-full ${role === 'admin' ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-purple-500/50' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-500/50'} text-white font-semibold py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Entering Collective...</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wipeExpand {
          0% {
            clip-path: circle(0% at 50% 50%);
          }
          100% {
            clip-path: circle(150% at 50% 50%);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }

        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}