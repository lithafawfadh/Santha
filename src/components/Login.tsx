import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Eye, EyeOff, User, ArrowLeft, Coins, HeartHandshake, CheckCircle2 } from 'lucide-react';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const { login } = useApp();

  // Natural Blink Loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Hardware-accelerated Smooth Eye Tracking (RAF Throttled)
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (focusTarget !== 'none') return;

      if (rafId.current !== null) return;

      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;

        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect();
          centerX = rect.left + rect.width / 2;
          centerY = rect.top + rect.height * 0.7;
        }

        const defaultY = step === 'role' ? -3 : 0;
        const deltaX = Math.max(-7, Math.min(7, ((clientX - centerX) / (window.innerWidth / 2)) * 8));
        const deltaY = Math.max(-6, Math.min(6, defaultY + ((clientY - centerY) / (window.innerHeight / 2)) * 7));

        setEyePos({ x: deltaX, y: deltaY });
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [focusTarget, step]);

  // Adjust eye direction when focusing inputs
  useEffect(() => {
    if (focusTarget === 'username') {
      setEyePos({ x: Math.min(5, Math.max(-5, (username.length - 6) * 0.8)), y: 6 });
    } else if (focusTarget === 'password') {
      setEyePos({ x: showPassword ? 3 : -6, y: showPassword ? 5 : -4 });
    } else if (step === 'role') {
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

  // Ultra-fluid, buttery native iOS/Android spring
  const fluidSpring = {
    type: 'spring',
    stiffness: 420,
    damping: 36,
    mass: 0.55
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-[100dvh] bg-[#050814] flex items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden font-sans selection:bg-orange-500/30 touch-none overscroll-none"
    >
      {/* ─── AMBIENT DESKTOP BACKGROUND GLOW ─── */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-900/20 blur-[130px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full bg-orange-600/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />
      </div>

      {/* ─── MAIN RESPONSIVE CONTAINER: EDGE-TO-EDGE ON MOBILE, 2-COLUMN SPLIT ON DESKTOP ─── */}
      <div className="relative z-10 w-full h-full sm:h-auto max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 xl:gap-16">

        {/* ─── LEFT COLUMN: DESKTOP BRANDING & HIGHLIGHTS (HIDDEN ON MOBILE) ─── */}
        <div className="hidden lg:flex flex-col flex-1 max-w-lg xl:max-w-xl text-left select-none">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md mb-6 w-fit shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FFE600] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#FFE600] uppercase">
              SANTHA LEDGER PROTOCOL
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.12]">
            Mutual Aid &amp; <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FFA149] to-[#FFE600]">
              Zero-Interest
            </span> <br />
            Group Fund.
          </h1>

          <p className="text-sm xl:text-base text-zinc-400 mt-4 leading-relaxed max-w-md">
            A transparent digital ledger built for our close-knit circle. Empowering friends with emergency relief, predictable monthly pooling, and collective accountability.
          </p>

          <div className="mt-8 space-y-3.5">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/15">
              <div className="w-9 h-9 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00] shrink-0 mt-0.5">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  LKR 300 / Month Pooled Contribution
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Predictable, transparent mutual fund contributions collected every monthly cycle from active members.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/15">
              <div className="w-9 h-9 rounded-xl bg-[#06D6A0]/15 border border-[#06D6A0]/30 flex items-center justify-center text-[#06D6A0] shrink-0 mt-0.5">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  0% Interest Emergency Loans
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Fast emergency loans with zero interest, zero hidden fees, and flexible 2 to 4 month repayment terms.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/15">
              <div className="w-9 h-9 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Real-Time Transparent Ledger
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                  Every contribution, loan balance, exit refund, and meeting resolution is clearly audited and recorded.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/10 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Peer-to-Peer</span>
            </span>
            <span>•</span>
            <span>Zero Intermediary Fees</span>
            <span>•</span>
            <span>Community Governed</span>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: THE CARD SHELL (100% FULL BLEED ON MOBILE, ZERO GAPS) ─── */}
        <div 
          ref={cardRef}
          className="relative z-10 w-full h-full sm:h-[720px] max-w-none sm:max-w-[420px] shrink-0 rounded-none sm:rounded-[48px] shadow-none sm:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden bg-[#FAF8F5] transform-gpu"
        >
        
        {/* ─── TOP ORGANIC GEOMETRIC CUTOUTS (Step 1) ─── */}
        <motion.div 
          animate={{
            y: step === 'credentials' ? -140 : 0,
            opacity: step === 'credentials' ? 0 : 1,
            scale: step === 'credentials' ? 0.85 : 1,
          }}
          transition={fluidSpring}
          className="absolute top-0 inset-x-0 h-28 pointer-events-none z-10 overflow-hidden transform-gpu"
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
            y: step === 'role' ? 0 : -35,
            pointerEvents: step === 'role' ? 'auto' : 'none',
          }}
          transition={fluidSpring}
          className="absolute inset-x-0 top-0 bottom-44 z-20 flex flex-col justify-center px-7 sm:px-9 pt-10 text-[#081226] transform-gpu"
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
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect('member')}
                className="w-full py-4 px-6 rounded-2xl bg-[#081226] text-white font-bold text-sm tracking-wide shadow-lg shadow-black/20 flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
              >
                <User className="w-4 h-4 text-[#FF7A00]" />
                <span>Member Access</span>
              </motion.button>

              {/* Admin Console Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleRoleSelect('admin')}
                className="w-full py-4 px-6 rounded-2xl bg-[#FAF8F5] text-[#081226] font-bold text-sm tracking-wide border-2 border-[#081226] flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
              >
                <Shield className="w-4 h-4 text-[#081226]" />
                <span>Admin Console</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ─── THE UNIFIED MASCOT DOME (Hardware Accelerated GPU Motion) ─── */}
        <motion.div
          animate={{
            height: step === 'credentials' ? '100%' : '185px',
            borderTopLeftRadius: step === 'credentials' ? '0px' : '90px',
            borderTopRightRadius: step === 'credentials' ? '0px' : '90px',
          }}
          transition={fluidSpring}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#FF7A00] via-[#FF6A00] to-[#E65100] z-30 shadow-[0_-12px_40px_rgba(255,122,0,0.3)] overflow-hidden flex flex-col justify-between transform-gpu will-change-[height,border-radius]"
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
                  className="inline-flex items-center space-x-1.5 py-1.5 px-3.5 rounded-full bg-black/15 hover:bg-black/25 text-[#081226] text-xs font-bold transition-all shadow-sm active:scale-95"
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
            <motion.div
              animate={{
                scale: step === 'credentials' ? 1.04 : 1,
                marginBottom: step === 'credentials' ? '14px' : '0px',
              }}
              transition={fluidSpring}
              className="flex flex-col items-center pointer-events-none select-none transform-gpu"
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
                  transition={{ duration: 0.18 }}
                  className="w-7 h-2 rounded-full bg-[#081226]"
                />
                <motion.div 
                  animate={{ 
                    y: focusTarget === 'password' && !showPassword ? 5 : 0,
                    rotate: focusTarget === 'password' && !showPassword ? -16 : 0 
                  }}
                  transition={{ duration: 0.18 }}
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
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="w-9 h-10 sm:w-10 sm:h-11 rounded-full bg-[#081226] relative flex items-start justify-start p-1.5 transform-gpu"
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
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="w-9 h-10 sm:w-10 sm:h-11 rounded-full bg-[#081226] relative flex items-start justify-start p-1.5 transform-gpu"
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

            {/* Step 2 Form Content */}
            <motion.div
              animate={{
                opacity: step === 'credentials' ? 1 : 0,
                y: step === 'credentials' ? 0 : 20,
                height: step === 'credentials' ? 'auto' : 0,
                pointerEvents: step === 'credentials' ? 'auto' : 'none',
              }}
              transition={fluidSpring}
              className="w-full flex flex-col items-center transform-gpu"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#081226] text-center mb-1">
                {role === 'admin' ? 'Enter Admin Key' : 'Enter Your Name'}
              </h2>
              <p className="text-xs font-semibold text-[#081226]/65 text-center mb-5">
                Santha Mutual Aid • LKR 300/mo Pool
              </p>

              {/* The Form Fields */}
              <form onSubmit={handleSubmit} className="w-full space-y-3">
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

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-xs font-medium text-center shadow-md"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#081226] text-white font-extrabold text-sm tracking-wide shadow-xl shadow-black/25 flex items-center justify-center space-x-2 mt-2 hover:bg-[#0D1B3A] transition-transform active:scale-[0.98]"
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
          <div 
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
            className="w-full text-center text-[11px] font-semibold text-[#081226]/60 pt-1"
          >
            Santha Mutual Aid • Zero-Interest Group Ledger
          </div>
        </motion.div>

        </div>
      </div>
    </div>
  );
}
