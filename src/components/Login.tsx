import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CampingBackground from './common/CampingBackground';
import CampingScene from './common/CampingScene';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

    if (login(username.trim(), 'member', password.trim() || undefined)) {
      setError('');
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start pt-20">
      {/* Camping Background */}
      <CampingBackground />
      
      {/* Camping Scene */}
      <CampingScene />

      {/* Logo and Title */}
      <div className="relative z-20 text-center mb-16">
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

          {/* Password Field */}
          <div className="relative">
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

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center backdrop-blur-sm">
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
              className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30 font-medium disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className="text-purple-300 text-sm hover:text-purple-200 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}