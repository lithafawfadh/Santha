import React, { useState, useEffect } from 'react';
import { Users, Shield, LogIn, User, Key, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
// Assuming GlassButton is a standard button now, but keeping the name for simplicity if it has essential wrappers.
// If you don't need a specific wrapper, you can replace GlassButton with a standard <button>.
// I will style GlassButton aggressively to look like the buttons in the image.
import GlassButton from './common/GlassButton';

// NOTE: You will need to make sure the background image (yejing1.webp) is accessible.
// For a ready-to-paste solution in Bolt.new, I'll use a CSS gradient that *mimics* the dark night sky and forest colors
// since including a local image file directly in the code is not possible.
// I've also added a dark/light mode toggle purely for functionality, as the design is strongly dark-mode based.

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Use 'member' as the default for the main login button, matching the image's structure.
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useApp();
  // State to manage dark mode (the design is inherently dark, but a toggle adds flexibility)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Set initial class for dark/light mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Mock particle effect for night sky ambience (simpler than the original)
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number}>>([]);
  
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // % width
          y: Math.random() * 100, // % height
          size: Math.random() * 2 + 1, // 1px to 3px
        });
      }
      setStars(newStars);
    };
    generateStars();
  }, []);


  const handleSubmit = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!username.trim()) {
      setError('Please enter your unique identifier.');
      setIsLoading(false);
      return;
    }

    // Password is only required for 'admin' sign in and for all sign-ups
    if (role === 'admin' || isSignUp) {
        if (!password.trim()) {
            setError('A Security Key is required for this action.');
            setIsLoading(false);
            return;
        }
    }


    // Mock login logic - replace with your actual API call
    if (login(username.trim(), role, password.trim() || undefined)) {
        setError('');
        // Successful login handled by useApp context
    } else {
        setError('Invalid credentials or this user is not authorized.');
    }

    setIsLoading(false);
  };

  // Helper function to match the image's sign-up/sign-in structure
  const handleSignIn = (e: React.FormEvent) => handleSubmit(e, false);
  const handleSignUp = (e: React.FormEvent) => handleSubmit(e, true);


  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start pt-16 md:pt-20 p-4 font-sans antialiased text-white">

      {/* Background and Stars (Mimicking the image) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900 to-indigo-900/90 dark:opacity-100 opacity-80 transition-opacity duration-500" />
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-80 animate-pulse pointer-events-none"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 0,
          }}
        />
      ))}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('/yejing1.webp')`, backgroundSize: 'cover', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat', backgroundBlendMode: 'soft-light', opacity: 0.8 }} />
      {/* Fallback low-poly forest/camping graphics will need to be part of the actual image or a complex CSS layer */}
      {/* For this code, we rely on the dark gradient and a high-opacity overlay to keep the focus on the form. */}
      
      {/* Dark Overlay for Form Readability */}
      <div className="absolute inset-0 bg-slate-900/50 z-10" />

      {/* Theme Toggle (Optional, for developer utility) */}
      <button
        onClick={() => setIsDarkMode(prev => !prev)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 z-50 transition-colors"
        title="Toggle Theme"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-sm mx-auto">
        
        {/* Logo Section */}
        <div className="text-center mb-10 mt-4">
          <h1 className="text-7xl font-extrabold tracking-widest text-white drop-shadow-lg">
            <span className="text-white">TR</span>
            <span className="text-yellow-400">A</span>
            <span className="text-white">VEL</span>
            {/* Mimics the small icon/face in the logo */}
            <span className="inline-block relative -top-3 left-1 text-2xl">😊</span>
          </h1>
          <p className="text-sm font-light text-slate-300 mt-2 tracking-wider">
            We pursue a relaxed gaming experience
          </p>
        </div>

        {/* Role Selection (Kept outside the form for a cleaner look) */}
        <div className="mb-6 w-full px-4">
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => setRole('member')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        role === 'member'
                        ? 'bg-blue-600/70 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                    }`}
                >
                    <User className="inline h-4 w-4 mr-2" /> Builder
                </button>
                <button
                    onClick={() => setRole('admin')}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        role === 'admin'
                        ? 'bg-violet-600/70 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                    }`}
                >
                    <Shield className="inline h-4 w-4 mr-2" /> Guardian
                </button>
            </div>
        </div>

        {/* Login Form */}
        <form className="w-full space-y-6" onSubmit={handleSignIn}>
            {/* Username Input (Stylized like the image input fields) */}
            <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-black/30 border-b-2 border-white/50 focus:border-white focus:outline-none placeholder-slate-400 text-white tracking-wider rounded-none transition-colors duration-300 text-lg"
                    placeholder="Username"
                />
            </div>

            {/* Password Input (Only shows for Admin or during a Sign Up attempt) */}
            {(role === 'admin' || password) && (
                <div className="relative transition-all duration-500">
                    <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-black/30 border-b-2 border-white/50 focus:border-white focus:outline-none placeholder-slate-400 text-white tracking-wider rounded-none transition-colors duration-300 text-lg"
                        placeholder="Password"
                    />
                </div>
            )}
            
            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-800/60 border border-red-500 rounded-lg shadow-md animate-shake">
                    <p className="text-sm text-red-100 font-light text-center">{error}</p>
                </div>
            )}

            {/* Sign Up / Sign In Buttons (Matching the image layout) */}
            <div className="flex space-x-4 pt-6">
                <GlassButton
                    type="button"
                    onClick={handleSignUp}
                    disabled={isLoading}
                    // The image has dark buttons with light text and a light border
                    className="flex-1 justify-center py-4 text-base font-normal tracking-widest uppercase rounded-lg border-2 border-white/60 bg-black/40 text-white hover:bg-black/60 transition-all duration-300 disabled:opacity-50"
                >
                    Sign up
                </GlassButton>
                
                <GlassButton
                    type="submit"
                    disabled={isLoading}
                    // The image has dark buttons with light text and a light border
                    className="flex-1 justify-center py-4 text-base font-normal tracking-widest uppercase rounded-lg border-2 border-white/60 bg-black/40 text-white hover:bg-black/60 transition-all duration-300 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        "Sign in"
                    )}
                </GlassButton>
            </div>
            
            {/* Forgot Password Link */}
            <div className="pt-4 text-center">
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Forgot Password?
                </a>
            </div>
        </form>
      </div>

      {/* Animations (Simplified) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}