import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Lock, Sparkles, Droplets, Waves, Zap, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Generate particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);

    // Mouse tracking for liquid effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animated gradient canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      const gradient = ctx.createLinearGradient(
        0, 
        0, 
        canvas.width, 
        canvas.height
      );

      const hue1 = (time * 20) % 360;
      const hue2 = (time * 20 + 120) % 360;
      const hue3 = (time * 20 + 240) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.1)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 50%, 0.1)`);
      gradient.addColorStop(1, `hsla(${hue3}, 70%, 50%, 0.1)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier.trim()) {
      setError(role === 'admin' ? 'Username required' : 'Name required');
      return;
    }

    if (role === 'admin' && !password.trim()) {
      setError('Password required');
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
        setError(role === 'admin' ? 'Invalid credentials' : 'Member not found');
      }
    } catch (err) {
      setError('Connection error');
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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${5 + particle.delay}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Liquid Blob Cursor Follower */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-1000 ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          
          {/* Floating Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse-slow" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all duration-500">
                <Sparkles className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-5xl font-black tracking-tight">
              <span className="inline-block animate-text-shimmer bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent bg-[length:200%_100%]">
                Welcome
              </span>
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Experience seamless authentication
            </p>
          </div>

          {/* Main Card with Liquid Effect */}
          <div className="relative group">
            {/* Liquid Border Animation */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-xy" />
            
            <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              
              {/* Role Morphing Selector */}
              <div className="relative p-6 pb-4">
                <div className="relative bg-black/20 rounded-2xl p-1.5 backdrop-blur-xl">
                  {/* Sliding Background */}
                  <div 
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r rounded-xl transition-all duration-500 ease-out ${
                      role === 'member'
                        ? 'left-1.5 from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50'
                        : 'left-[calc(50%+1.5px)] from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50'
                    }`}
                  />
                  
                  {/* Role Buttons */}
                  <div className="relative grid grid-cols-2 gap-2">
                    <button
                      onClick={() => switchRole('member')}
                      className={`relative py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        role === 'member' ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <span>Member</span>
                      {role === 'member' && (
                        <Waves className="h-4 w-4 animate-bounce ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => switchRole('admin')}
                      className={`relative py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        role === 'admin' ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin</span>
                      {role === 'admin' && (
                        <Zap className="h-4 w-4 animate-pulse ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
                
                {/* Error Message with Liquid Effect */}
                {error && (
                  <div className="relative overflow-hidden rounded-2xl bg-red-500/10 border border-red-500/30 backdrop-blur-xl animate-shake-gentle">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent animate-liquid-flow" />
                    <div className="relative p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <Droplets className="h-5 w-5 text-red-400" />
                      </div>
                      <p className="text-sm text-red-200 font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Identifier Field with Morphing Effect */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300 ml-1 flex items-center space-x-2">
                    <span>{role === 'admin' ? 'Username' : 'Your Name'}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </label>
                  <div className="relative group/input">
                    {/* Glow Effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur-sm opacity-0 group-hover/input:opacity-75 group-focus-within/input:opacity-100 transition-all duration-500 ${
                      role === 'admin' 
                        ? 'from-blue-500 to-purple-500' 
                        : 'from-emerald-500 to-teal-500'
                    }`} />
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className={`h-5 w-5 transition-all duration-300 ${
                          identifier ? 'text-emerald-400 scale-110' : 'text-gray-500'
                        }`} />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all duration-300 backdrop-blur-xl text-base font-medium"
                        placeholder={role === 'admin' ? 'Enter username' : 'Enter your name'}
                        disabled={isLoading}
                      />
                      
                      {/* Liquid Fill Animation */}
                      {identifier && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl transform origin-left animate-liquid-fill" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Password Field with Ripple Effect */}
                {role === 'admin' && (
                  <div className="space-y-2 animate-slide-down">
                    <label className="block text-sm font-semibold text-gray-300 ml-1 flex items-center space-x-2">
                      <span>Password</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    </label>
                    <div className="relative group/input">
                      {/* Glow Effect */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-sm opacity-0 group-hover/input:opacity-75 group-focus-within/input:opacity-100 transition-all duration-500" />
                      
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 transition-all duration-300 ${
                            password ? 'text-blue-400 scale-110' : 'text-gray-500'
                          }`} />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-black/60 transition-all duration-300 backdrop-blur-xl text-base font-medium"
                          placeholder="Enter password"
                          disabled={isLoading}
                        />
                        
                        {/* Toggle Password Button */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        
                        {/* Liquid Fill Animation */}
                        {password && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl transform origin-left animate-liquid-fill" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button with Morph Effect */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`relative w-full group/btn overflow-hidden ${
                    isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r transition-all duration-500 rounded-2xl ${
                    isLoading
                      ? 'from-gray-600 to-gray-700'
                      : role === 'admin'
                      ? 'from-blue-500 via-purple-500 to-blue-500 group-hover/btn:from-blue-600 group-hover/btn:via-purple-600 group-hover/btn:to-blue-600'
                      : 'from-emerald-500 via-teal-500 to-emerald-500 group-hover/btn:from-emerald-600 group-hover/btn:via-teal-600 group-hover/btn:to-emerald-600'
                  } bg-[length:200%_100%] animate-gradient-x`} />
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  {/* Button Content */}
                  <div className="relative py-4 px-6 flex items-center justify-center space-x-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="font-bold text-white">Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-white text-lg">Sign In</span>
                        <ArrowRight className="h-5 w-5 text-white group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                  
                  {/* Ripple Effect on Click */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-active/btn:opacity-100 transition-opacity bg-white/20" />
                </button>

                {/* Info Card */}
                <div className="relative mt-6 p-4 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur-xl">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      role === 'admin' 
                        ? 'bg-blue-500/20' 
                        : 'bg-emerald-500/20'
                    }`}>
                      {role === 'admin' ? (
                        <Shield className="h-5 w-5 text-blue-400" />
                      ) : (
                        <User className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {role === 'admin' 
                          ? 'Secure admin access with username and password protection'
                          : 'Quick member access with just your registered name'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 font-light">
              © 2026 F.O.R.T. • Powered by Innovation
            </p>
          </div>
        </div>
      </div>

      {/* Advanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.75;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes liquid-flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes liquid-fill {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }

        @keyframes shake-gentle {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-3px);
          }
          75% {
            transform: translateX(3px);
          }
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-gradient-xy {
          animation: gradient-xy 8s ease infinite;
          background-size: 200% 200%;
        }

        .animate-text-shimmer {
          animation: text-shimmer 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-liquid-flow {
          animation: liquid-flow 2s ease-in-out infinite;
        }

        .animate-liquid-fill {
          animation: liquid-fill 0.5s ease-out forwards;
        }

        .animate-shake-gentle {
          animation: shake-gentle 0.4s ease-in-out;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }

        /* Smooth transitions for all interactive elements */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }

        /* Mobile touch feedback */
        @media (hover: none) and (pointer: coarse) {
          button:active {
            transform: scale(0.98);
          }
          
          input:focus {
            transform: scale(1.01);
          }
        }

        /* Prevent zoom on input focus (iOS) */
        @supports (-webkit-touch-callout: none) {
          input {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}