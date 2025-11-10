import React, { useState, useEffect } from 'react';
import { Users, Shield, LogIn, User, Key, Sun, Moon, HeartHandshake, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
// We'll use a standard styled button, naming it as CustomButton for clarity
const CustomButton = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={`
      flex items-center justify-center transition-all duration-300 transform 
      shadow-lg hover:shadow-xl active:scale-[0.98] focus:ring-4 focus:ring-offset-2 
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
));

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Set initial class for dark mode (essential for the 3D dark theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Submit Logic (Kept for functionality)
  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (!username.trim()) {
      setError('Please enter your unique identifier.');
      setIsLoading(false);
      return;
    }

    if (role === 'admin' || isSignUp) {
        if (!password.trim()) {
            setError('A Security Key is required for this action.');
            setIsLoading(false);
            return;
        }
    }

    if (login(username.trim(), role, password.trim() || undefined)) {
        setError('');
    } else {
        setError('Invalid credentials or this user is not authorized.');
    }

    setIsLoading(false);
  };

  const handleSignIn = (e: React.FormEvent) => handleSubmit(e, false);
  const handleSignUp = (e: React.FormEvent) => handleSubmit(e, true);


  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-slate-900 font-sans antialiased text-white">

      {/* 3D Background - Dark Gradient with subtle volumetric effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900 opacity-95" />
      
      {/* Dynamic light spot for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-[150px] animate-slow-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full filter blur-[150px] animate-slow-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(prev => !prev)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 z-50 transition-colors"
        title="Toggle Theme"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Main Card - Floating/Elevated Effect */}
      <div className="relative z-20 w-full max-w-md mx-auto p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.5),0_0_10px_rgba(79,70,229,0.3)] bg-slate-800/80 backdrop-blur-md border border-slate-700/50">
        
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <div className="relative mb-6 mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-2xl shadow-indigo-500/50">
            <HeartHandshake className="h-10 w-10 text-white animate-bounce" style={{ animationDuration: '3s' }} />
            <Zap className="absolute top-0 right-0 h-4 w-4 text-yellow-300 animate-ping" />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-1 drop-shadow-lg">
            FORT COLLECTIVE
          </h1>
          <p className="text-sm font-light text-slate-400">
            Secure Access to the Digital Outpost
          </p>
        </div>

        {/* Role Selection (3D Toggle Buttons) */}
        <div className="mb-8 w-full">
            <div className="grid grid-cols-2 gap-4">
                <CustomButton
                    type="button"
                    onClick={() => setRole('member')}
                    className={`py-3 rounded-xl border-2 transition-all duration-300 ${
                        role === 'member'
                        ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/50'
                        : 'bg-slate-700/50 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                >
                    <User className="h-5 w-5 mr-2" /> Builder
                </CustomButton>
                <CustomButton
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-3 rounded-xl border-2 transition-all duration-300 ${
                        role === 'admin'
                        ? 'bg-violet-600 text-white border-violet-400 shadow-violet-500/50'
                        : 'bg-slate-700/50 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                >
                    <Shield className="h-5 w-5 mr-2" /> Guardian
                </CustomButton>
            </div>
        </div>

        {/* Login Form */}
        <form className="w-full space-y-6" onSubmit={handleSignIn}>
            {/* Username Input (Deep-set effect) */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">Identifier</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-indigo-400" />
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-900/70 border border-slate-700/50 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus:outline-none placeholder-slate-500 text-white shadow-inner shadow-black/30 transition-all duration-300"
                        placeholder="Enter your unique identifier"
                    />
                </div>
            </div>

            {/* Password Input (Appears 3D on hover/focus) */}
            {(role === 'admin' || password) && (
                <div className="transition-all duration-500 animate-fadeIn">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Security Key</label>
                    <div className="relative">
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-slate-900/70 border border-slate-700/50 rounded-xl focus:border-violet-500 focus:ring-violet-500 focus:ring-1 focus:outline-none placeholder-slate-500 text-white shadow-inner shadow-black/30 transition-all duration-300"
                            placeholder="Enter secure passphrase"
                        />
                    </div>
                </div>
            )}
            
            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-700/60 border border-red-500 rounded-xl shadow-inner text-center animate-shake">
                    <p className="text-sm text-red-200 font-light">{error}</p>
                </div>
            )}

            {/* Action Buttons (Raised effect) */}
            <div className="flex space-x-4 pt-6">
                <CustomButton
                    type="button"
                    onClick={handleSignUp}
                    disabled={isLoading}
                    className="flex-1 py-4 text-base font-medium rounded-xl text-indigo-300 bg-slate-700/50 border border-slate-600 hover:bg-slate-700 hover:text-white shadow-xl shadow-black/40 disabled:opacity-50"
                >
                    Sign Up
                </CustomButton>
                
                <CustomButton
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 text-base font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none shadow-2xl shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <>
                            <LogIn className="h-5 w-5 mr-2" /> Sign In
                        </>
                    )}
                </CustomButton>
            </div>
            
            {/* Forgot Password Link */}
            <div className="pt-4 text-center">
                <a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    Forgot Security Key?
                </a>
            </div>
        </form>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slow-pulse {
            animation: slow-pulse 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}