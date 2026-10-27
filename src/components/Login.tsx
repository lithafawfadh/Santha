import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusTarget, setFocusTarget] = useState<'none' | 'username' | 'password'>('none');
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { login } = useApp();

  // Natural Blink Loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4200);
    return () => clearInterval(blinkInterval);
  }, []);

  // Interactive Eye Tracking (Mouse / Touch)
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (focusTarget !== 'none') return; // Field focus takes priority

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // In Step 1, character is at the bottom, so eyes look slightly upward by default
      const defaultY = step === 'role' ? -3 : 0;
      const deltaX = Math.max(-7, Math.min(7, ((clientX - centerX) / centerX) * 8));
      const deltaY = Math.max(-6, Math.min(6, defaultY + ((clientY - centerY) / centerY) * 7));

      setEyePos({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [focusTarget, step]);

  // Adjust eye direction when focusing inputs
  useEffect(() => {
    if (focusTarget === 'username') {
      setEyePos({ x: Math.min(5, Math.max(-5, (username.length - 6) * 0.8)), y: 6 });
    } else if (focusTarget === 'password') {
      setEyePos({ x: showPassword ? 3 : -6, y: showPassword ? 5 : -4 });
    } else if (step === 'role') {
      // In Step 1, eyes look upward toward the buttons
      setEyePos({ x: 0, y: -4 });
    }
  }, [focusTarget, username, showPassword, step]);

  const handleRoleSelect = (selectedRole: 'admin' | 'member') => {
    setRole(selectedRole);
    setError('');
    setStep('credentials');
  };

  const handleBack = () => {
    setError('');
    setStep('role');
    setFocusTarget('none');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your member username');
      return;
    }

    if (role === 'admin' && !password.trim()) {
      setError('Please enter your admin password');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username.trim(), role, password.trim() || undefined);
      if (!success) {
        setError('Invalid credentials. Check your username' + (role === 'admin' ? ' and password' : '') + '.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // Buttery iOS spring easing
  const springConfig = {
    type: 'spring',
    stiffness: 300,
    damping: 28,
    mass: 0.85
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-[100dvh] w-full bg-[#050814] flex items-center justify-center p-0 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-orange-500/30"
    >
      {/* ─── AMBIENT DESKTOP BACKGROUND GLOW ─── */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-900/25 blur-[120px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full bg-orange-600/20 blur-[130px]" />
      </div>

      {/* ─── THE CARD SHELL (EDGE-TO-EDGE ON MOBILE, FLOATING PHONE ON DESKTOP) ─── */}
      <div className="relative z-10 w-full h-[100dvh] sm:h-[720px] max-w-none sm:max-w-[420px] rounded-none sm:rounded-[48px] shadow-none sm:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden bg-[#FAF8F5]">
        
        {/* ─── TOP ORGANIC GEOMETRIC CUTOUTS (Step 1) ─── */}
        <motion.div 
          animate={{
            y: step === 'credentials' ? -130 : 0,
            opacity: step === 'credentials' ? 0 : 1,
            scale: step === 'credentials' ? 0.8 : 1,
          }}
          transition={springConfig}
          className="absolute top-0 inset-x-0 h-28 pointer-events-none z-10 overflow-hidden"
        >
          {/* Organic Amber Left Blob */}
          <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-[#FF7A00]" />
          
          {/* Deep Navy Circle Cutout */}
          <div className="absolute top-6 left-28 w-11 h-11 rounded-full bg-[#081226]" />
          
          {/* Light Royal Blue Right Cutout */}
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#6C92F6]" />
        </motion.div>

        {/* ─── STEP 1 CONTENT: HEADLINE & STACKED BUTTONS ─── */}
        <motion.div
          animate={{
            opacity: step === 'role' ? 1 : 0,
            y: step === 'role' ? 0 : -40,
            filter: step === 'role' ? 'blur(0px)' : 'blur(4px)',
            pointerEvents: step === 'role' ? 'auto' : 'none',
          }}
          transition={springConfig}
          className="absolute inset-x-0 top-0 bottom-44 z-20 flex flex-col justify-center px-7 sm:px-9 pt-10 text-[#081226]"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#081226] leading-[1.12]">
              Let's check <br />
              our ledger!
            </h1>
            
            <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-[300px]">
              Zero-interest emergency loans & mutual monthly contributions for our friends.
            </p>

            {/* The Stacked Role Buttons */}
            <div className="mt-8 space-y-3.5">
              {/* Member Access Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect('member')}
                className="w-full py-4 px-6 rounded-2xl bg-[#081226] text-white font-bold text-sm tracking-wide shadow-lg shadow-black/20 flex items-center justify-center space-x-2 transition-all hover:bg-[#0D1B3A]"
              >
                <User className="w-4 h-4 text-[#FF7A00]" />
                <span>Member Access</span>
              </motion.button>

              {/* Admin Console Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRoleSelect('admin')}
                className="w-full py-4 px-6 rounded-2xl bg-[#FAF8F5] text-[#081226] font-bold text-sm tracking-wide border-2 border-[#081226] flex items-center justify-center space-x-2 transition-all hover:bg-[#F2EDE4]"
              >
                <Shield className="w-4 h-4 text-[#081226]" />
                <span>Admin Console</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ─── THE UNIFIED MASCOT DOME (ATTACHED BODY & EYES TOGETHER) ─── */}
        {/* In Step 1: Anchored to the bottom (h-[185px]) with eyes looking up. */}
        {/* In Step 2: Smoothly expands to fill 100% height, and face glides seamlessly atop the form! */}
        <motion.div
          animate={{
            height: step === 'credentials' ? '100%' : '185px',
            borderTopLeftRadius: step === 'credentials' ? '0px' : '90px',
            borderTopRightRadius: step === 'credentials' ? '0px' : '90px',
          }}
          transition={springConfig}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#FF7A00] via-[#FF6A00] to-[#E65100] z-30 shadow-[0_-12px_40px_rgba(255,122,0,0.3)] overflow-hidden flex flex-col justify-between"
        >
          {/* ─── STEP 2 TOP HEADER BAR (Only visible in credentials step) ─── */}
          <div className="w-full pt-4 sm:pt-6 px-6 sm:px-7 flex items-center justify-between z-20">
            {step === 'credentials' ? (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center space-x-1.5 py-1.5 px-3.5 rounded-full bg-black/15 hover:bg-black/25 text-[#081226] text-xs font-bold transition-all shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </motion.button>

                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-[#081226] tracking-wide shadow-sm"
                >
                  {role === 'admin' ? 'Admin Portal' : 'Member Portal'}
                </motion.div>
              </>
            ) : <div className="h-7" />}
          </div>

          {/* ─── OPTION 1: THE UNIFIED CENTERED HERO & FORM BLOCK ─── */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-7 -mt-4 z-10 w-full max-w-[360px] mx-auto">
            
            {/* Animated Mascot Facial Features */}
            {/* In Step 1: Sits at 12px from dome top (looking up). In Step 2: Smoothly positions right above the title (looking down). */}
            <motion.div
              animate={{
                y: step === 'credentials' ? 0 : 0,
                scale: step === 'credentials' ? 1.05 : 1,
                marginBottom: step === 'credentials' ? '14px' : '0px',
              }}
              transition={springConfig}
              className="flex flex-col items-center pointer-events-none select-none"
            >
              {/* White Top Tuft */}
              <motion.div 
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-5 h-6 rounded-full bg-white shadow-sm mb-1.5"
              />

              {/* Eyebrows */}
              <div className="flex items-center justify-between w-32 sm:w-36 px-2 mb-1.5">
                <motion.div 
                  animate={{ 
                    y: focusTarget === 'password' && !showPassword ? 5 : 0,
                    rotate: focusTarget === 'password' && !showPassword ? 16 : 0 
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-7 h-2 rounded-full bg-[#081226]"
                />
                <motion.div 
                  animate={{ 
                    y: focusTarget === 'password' && !showPassword ? 5 : 0,
                    rotate: focusTarget === 'password' && !showPassword ? -16 : 0 
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-7 h-2 rounded-full bg-[#081226]"
                />
              </div>

              {/* Big Expressive Interactive Eyes */}
              <div className="flex items-center justify-center space-x-4 sm:space-x-5">
                {/* Left Eye */}
                <div className="relative w-14 h-16 sm:w-16 sm:h-18 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={{ height: isBlinking ? '100%' : '0%' }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-0 inset-x-0 bg-[#FF7A00] z-20"
                  />
                  <motion.div
                    animate={{ 
                      x: eyePos.x, 
                      y: eyePos.y,
                      scaleY: focusTarget === 'password' && !showPassword ? 0.35 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="w-9 h-10 sm:w-10 sm:h-11 rounded-full bg-[#081226] relative flex items-start justify-start p-1.5"
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-2 right-2 opacity-80" />
                  </motion.div>
                </div>

                {/* Right Eye */}
                <div className="relative w-14 h-16 sm:w-16 sm:h-18 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={{ height: isBlinking ? '100%' : '0%' }}
                    transition={{ duration: 0.12 }}
                    className="absolute top-0 inset-x-0 bg-[#FF7A00] z-20"
                  />
                  <motion.div
                    animate={{ 
                      x: eyePos.x, 
                      y: eyePos.y,
                      scaleY: focusTarget === 'password' && !showPassword ? 0.35 : 1
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className="w-9 h-10 sm:w-10 sm:h-11 rounded-full bg-[#081226] relative flex items-start justify-start p-1.5"
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-2 right-2 opacity-80" />
                  </motion.div>
                </div>
              </div>

              {/* Nostrils */}
              <div className="flex space-x-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#081226]/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#081226]/40" />
              </div>
            </motion.div>

            {/* Step 2 Form Content (Directly below the Mascot with zero awkward gap) */}
            <motion.div
              animate={{
                opacity: step === 'credentials' ? 1 : 0,
                y: step === 'credentials' ? 0 : 25,
                height: step === 'credentials' ? 'auto' : 0,
                pointerEvents: step === 'credentials' ? 'auto' : 'none',
              }}
              transition={springConfig}
              className="w-full flex flex-col items-center"
            >
              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#081226] text-center mb-1">
                {role === 'admin' ? 'Enter Admin Key' : 'Enter Your Name'}
              </h2>
              <p className="text-xs font-semibold text-[#081226]/65 text-center mb-5">
                Santha Mutual Aid • LKR 300/mo Pool
              </p>

              {/* The Form Fields */}
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                {/* Username Input */}
                <div className="relative">
                  <input
                    id="username-field"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onFocus={() => setFocusTarget('username')}
                    onBlur={() => setFocusTarget('none')}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={role === 'admin' ? 'Admin username' : 'Your member username'}
                    className="w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-white/25 placeholder-[#081226]/50 text-[#081226] font-semibold text-sm border border-white/30 focus:outline-none focus:ring-4 focus:ring-black/15 focus:bg-white/35 transition-all shadow-inner text-center"
                  />
                </div>

                {/* Password Input (Admin Only) */}
                {role === 'admin' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative"
                  >
                    <input
                      id="password-field"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onFocus={() => setFocusTarget('password')}
                      onBlur={() => setFocusTarget('none')}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Admin security password"
                      className="w-full pl-5 pr-11 py-3.5 sm:py-4 rounded-2xl bg-white/25 placeholder-[#081226]/50 text-[#081226] font-semibold text-sm border border-white/30 focus:outline-none focus:ring-4 focus:ring-black/15 focus:bg-white/35 transition-all shadow-inner text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#081226]/70 hover:text-[#081226] transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </motion.div>
                )}

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-xs font-medium text-center shadow-md"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Primary Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#081226] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-black/25 flex items-center justify-center space-x-2 mt-2 hover:bg-[#0D1B3A] transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>{role === 'admin' ? 'Authorize Admin' : 'Enter Santha'}</span>
                      <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Subtitle Footer */}
          <div className="w-full text-center text-[11px] font-semibold text-[#081226]/60 pb-4 pt-1">
            Santha Mutual Aid • Zero-Interest Group Ledger
          </div>
        </motion.div>

      </div>
    </div>
  );
}