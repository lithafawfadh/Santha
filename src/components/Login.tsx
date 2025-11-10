import React, { useState } from 'react';
import { User, Lock, Shield, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CampingBackground from './common/CampingBackground';
import CampingScene from './common/CampingScene';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start pt-12">
      {/* Camping Background */}
      <CampingBackground />
      
      {/* Camping Scene */}
      <CampingScene />

      {/* Logo and Title */}
      <div className="relative z-20 text-center mb-12">
        {/* Logo */}
        <div className="mx-auto mb-6 relative">
          <div className="relative inline-block">
            {/* Person icon in logo */}
            <div className="w-20 h-20 mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-1 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Travel Text */}
        <h1 className="text-6xl font-bold text-white mb-2 tracking-wider drop-shadow-2xl" style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.1em' }}>
          T<span className="text-orange-400">R</span>AVEL
        </h1>
        
        {/* Underline */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-orange-400 to-orange-400 rounded-full" />
          <div className="w-3 h-3 bg-orange-400 rounded-full" />
          <div className="w-3 h-3 bg-orange-400 rounded-full" />
        </div>

        {/* Tagline */}
        <p className="text-gray-300 text-sm tracking-wider">We pursue a relaxed gaming experience</p>
      </div>

      {/* Login Form */}
      <div className="relative z-20 w-full max-w-md px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            {/* Member Button */}
            <button
              type="button"
              onClick={() => setRole('member')}
              className={`flex-1 py-4 rounded-lg backdrop-blur-md border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                role === 'member'
                  ? 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80 border-blue-400 shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800/40 border-purple-400/30 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className={`w-5 h-5 ${role === 'member' ? 'text-white' : 'text-purple-300'}`} />
              <span className={`font-medium ${role === 'member' ? 'text-white' : 'text-purple-200'}`}>
                Member
              </span>
            </button>

            {/* Admin Button */}
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-4 rounded-lg backdrop-blur-md border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500/80 to-violet-600/80 border-purple-400 shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800/40 border-purple-400/30 hover:bg-slate-800/60'
              }`}
            >
              <Shield className={`w-5 h-5 ${role === 'admin' ? 'text-white' : 'text-purple-300'}`} />
              <span className={`font-medium ${role === 'admin' ? 'text-white' : 'text-purple-200'}`}>
                Admin
              </span>
            </button>
          </div>

          {/* Username Field */}
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-purple-300" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-12 pr-4 py-4 bg-slate-800/60 backdrop-blur-md border-b-2 border-purple-400/50 text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 transition-all rounded-t-lg"
            />
          </div>

          {/* Password Field - Only show for Admin */}
          {role === 'admin' && (
            <div className="relative animate-fadeIn">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-purple-300" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/60 backdrop-blur-md border-b-2 border-purple-400/50 text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 transition-all rounded-t-lg"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center backdrop-blur-sm animate-shake">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 py-4 border-2 border-purple-400/50 text-purple-200 rounded-lg hover:bg-purple-500/20 transition-all backdrop-blur-sm font-medium"
            >
              Sign up
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Forgot Password - Only show for Admin */}
          {role === 'admin' && (
            <div className="text-center animate-fadeIn">
              <button
                type="button"
                className="text-purple-300 text-sm hover:text-purple-200 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}