import React, { useState, useEffect } from 'react';
import { Users, Shield, LogIn, UserCheck, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from './common/GlassCard';
import GlassButton from './common/GlassButton';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeParticles, setActiveParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const { login } = useApp();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveParticles(prev => [
        ...prev.slice(-15),
        { id: Date.now(), x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!username.trim()) {
      setError('Please enter your username');
      setIsLoading(false);
      return;
    }

    if (role === 'admin' && !password.trim()) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    if (login(username.trim(), role, password.trim() || undefined)) {
      setError('');
    } else {
      setError('Invalid credentials. Please check your username' + (role === 'admin' ? ' and password' : '') + '.');
    }
    setIsLoading(false);
  };

  const quickLogin = (userUsername: string, userRole: 'admin' | 'member', userPassword?: string) => {
    setUsername(userUsername);
    setPassword(userPassword || '');
    setRole(userRole);
    login(userUsername, userRole, userPassword);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic gradient background */}
      <div 
        className="absolute inset-0 opacity-80 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, 
            rgba(99, 102, 241, 0.15) 0%, 
            rgba(139, 92, 246, 0.1) 25%, 
            rgba(59, 130, 246, 0.08) 50%, 
            transparent 70%),
            linear-gradient(135deg, 
              #f8fafc 0%, 
              #e2e8f0 25%, 
              #cbd5e1 50%, 
              #94a3b8 100%)`
        }}
      />

      {/* Floating particles */}
      {activeParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-violet-500 rounded-full opacity-60 animate-pulse pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            animation: `float 4s ease-in-out infinite, fadeOut 4s ease-in-out forwards`
          }}
        />
      ))}

      {/* Morphing shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-violet-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse transform rotate-12"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse transform -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-blue-500/10 rounded-full blur-3xl animate-bounce transform rotate-45" style={{ animationDuration: '6s' }}></div>
      </div>

      {/* Main card */}
      <GlassCard variant="gradient" className="max-w-lg w-full relative z-10 overflow-hidden">
        <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/40 via-blue-500/40 to-emerald-500/40 rounded-3xl blur-xl animate-pulse"></div>
        
        <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-violet-500 to-blue-500 opacity-30" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 to-emerald-500 opacity-20" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
              
              <GlassCard variant="highlight" className="relative mx-auto h-24 w-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-600/20 to-blue-600/20 border border-violet-400/30 shadow-2xl backdrop-blur-xl">
                <Heart className="h-12 w-12 text-violet-600 animate-bounce" style={{ animationDuration: '3s' }} />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-ping" />
              </GlassCard>
            </div>
            
            <h1 className="text-5xl font-extralight tracking-wider text-slate-800 dark:text-white mb-2 font-serif">
              <span className="bg-gradient-to-r from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 bg-clip-text text-transparent">
                F.O.R.T
              </span>
            </h1>
            <h2 className="text-2xl font-light text-slate-700 dark:text-gray-300 mb-4 tracking-widest">
              COLLECTIVE
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <p className="text-slate-600 dark:text-gray-400 font-light tracking-wider text-sm">
                Friends Organization for Resllience & Trust
              </p>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Username */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-4 tracking-widest uppercase">
                  Identity
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-6 py-5 backdrop-blur-2xl bg-white/30 dark:bg-gray-900/40 border border-white/40 placeholder-slate-500 dark:placeholder-gray-500 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-500 shadow-xl font-light tracking-wider group-hover:shadow-2xl group-hover:bg-white/40"
                    placeholder="Enter your unique identifier"
                  />
                </div>
              </div>

              {/* Password */}
              {role === 'admin' && (
                <div className="group animate-fadeIn">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-4 tracking-widest uppercase">
                    Security Key
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-6 py-5 backdrop-blur-2xl bg-white/30 dark:bg-gray-900/40 border border-white/40 placeholder-slate-500 dark:placeholder-gray-500 text-slate-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all duration-500 shadow-xl font-light tracking-wider group-hover:shadow-2xl group-hover:bg-white/40"
                      placeholder="Enter your secure passphrase"
                    />
                  </div>
                </div>
              )}

              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-6 tracking-widest uppercase text-center">
                  Choose Your Path
                </label>
                <div className="grid grid-cols-2 gap-6">
                  {/* Guardian */}
                  <div className="relative group">
                    <GlassButton
                      variant={role === 'admin' ? 'primary' : 'secondary'}
                      onClick={() => setRole('admin')}
                      className={`relative w-full flex flex-col items-center justify-center px-6 py-8 transition-all duration-500 rounded-2xl backdrop-blur-2xl shadow-xl font-light tracking-wider ${
                        role === 'admin'
                          ? 'ring-2 ring-violet-500/40 bg-gradient-to-br from-violet-500/20 to-purple-600/20'
                          : 'hover:bg-white/20'
                      }`}
                    >
                      <Shield className={`h-8 w-8 mb-3 ${role === 'admin' ? 'text-violet-600 animate-pulse' : 'text-slate-600 dark:text-gray-400'}`} />
                      <span className="text-sm text-slate-800 dark:text-white">Guardian</span>
                      <span className="text-xs opacity-70 mt-1 text-slate-600 dark:text-gray-400">Administrator</span>
                    </GlassButton>
                  </div>
                  
                  {/* Builder */}
                  <div className="relative group">
                    <GlassButton
                      variant={role === 'member' ? 'accent' : 'secondary'}
                      onClick={() => setRole('member')}
                      className={`relative w-full flex flex-col items-center justify-center px-6 py-8 transition-all duration-500 rounded-2xl backdrop-blur-2xl shadow-xl font-light tracking-wider ${
                        role === 'member'
                          ? 'ring-2 ring-blue-500/40 bg-gradient-to-br from-blue-500/20 to-cyan-600/20'
                          : 'hover:bg-white/20'
                      }`}
                    >
                      <UserCheck className={`h-8 w-8 mb-3 ${role === 'member' ? 'text-blue-600 animate-bounce' : 'text-slate-600 dark:text-gray-400'}`} />
                      <span className="text-sm text-slate-800 dark:text-white">Builder</span>
                      <span className="text-xs opacity-70 mt-1 text-slate-600 dark:text-gray-400">Member</span>
                    </GlassButton>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <GlassCard className="p-6 bg-red-500/20 border-red-400/40 border rounded-2xl backdrop-blur-2xl shadow-xl animate-shake">
                <p className="text-sm text-red-700 dark:text-red-400 font-light tracking-wider text-center">{error}</p>
              </GlassCard>
            )}

            {/* Submit */}
            <GlassButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-6 text-lg font-light transition-all duration-500 hover:shadow-2xl rounded-2xl backdrop-blur-2xl shadow-xl tracking-widest uppercase hover:scale-105 bg-gradient-to-r from-violet-600/80 to-blue-600/80 border-2 border-white/30"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6 mr-4" />
                  Enter Collective
                </>
              )}
            </GlassButton>
          </form>
        </div>
      </GlassCard>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeOut {
          0% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
