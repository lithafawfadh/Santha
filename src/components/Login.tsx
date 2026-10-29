import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Eye, EyeOff, User, ArrowLeft, Coins, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ─── REUSABLE HIGH-PERFORMANCE MASCOT FACE ─────────────────────────────────
interface MascotFaceProps {
  eyeX: number;
  eyeY: number;
  isBlinking: boolean;
  isLookingDown?: boolean;
  className?: string;
}

const MascotFace: React.FC<MascotFaceProps> = ({
  eyeX,
  eyeY,
  isBlinking,
  isLookingDown = false,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center pointer-events-none select-none ${className}`}>
      {/* White Top Tuft (CSS compositor keyframe) */}
      <div className="w-5 h-6 rounded-full bg-white shadow-sm mb-1.5 tuft-sway" />

      {/* Eyebrows */}
      <div className="flex items-center justify-between w-32 sm:w-36 px-2 mb-1.5">
        <div 
          style={{
            transform: isLookingDown ? 'translateY(4px) rotate(14deg)' : 'none',
            transition: 'transform 0.18s ease-out'
          }}
          className="w-7 h-2 rounded-full bg-[#081226]"
        />
        <div 
          style={{
            transform: isLookingDown ? 'translateY(4px) rotate(-14deg)' : 'none',
            transition: 'transform 0.18s ease-out'
          }}
          className="w-7 h-2 rounded-full bg-[#081226]"
        />
      </div>

      {/* Big Expressive Interactive Eyes */}
      <div className="flex items-center justify-center space-x-4 sm:space-x-5">
        {/* Left Eye */}
        <div className="relative w-14 h-16 sm:w-16 sm:h-18 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
          {/* Eyelid Blink */}
          <div 
            className={`absolute top-0 inset-x-0 bg-[#FF7A00] z-20 transition-all duration-100 ease-in-out ${isBlinking ? 'h-full' : 'h-0'}`}
          />
          {/* Pupil */}
          <div
            style={{
              transform: `translate3d(${eyeX}px, ${eyeY}px, 0) scaleY(${isLookingDown ? 0.85 : 1})`,
              transition: 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)'
            }}
            className="w-9 h-10 sm:w-10 sm:h-11 rounded-full bg-[#081226] relative flex items-start justify-start p-1.5"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-2 right-2 opacity-80" />
          </div>
        </div>

        {/* Right Eye */}
        <div className="relative w-14 h-16 sm:w-16 sm:h-18 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
          {/* Eyelid Blink */}
          <div 
            className={`absolute top-0 inset-x-0 bg-[#FF7A00] z-20 transition-all duration-100 ease-in-out ${isBlinking ? 'h-full' : 'h-0'}`}
          />
          {/* Pupil */}
          <div
            style={{
              transform: `translate3d(${eyeX}px, ${eyeY}px, 0) scaleY(${isLookingDown ? 0.85 : 1})`,
              transition: 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)'
            }}
            className="w-9 h-10 sm:w-10 sm:h-11 rounded-full bg-[#081226] relative flex items-start justify-start p-1.5"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute bottom-2 right-2 opacity-80" />
          </div>
        </div>
      </div>

      {/* Nostrils */}
      <div className="flex space-x-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#081226]/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#081226]/40" />
      </div>
    </div>
  );
};

export default function Login() {
  const [step, setStep] = useState<'role' | 'credentials'>('role');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusTarget, setFocusTarget] = useState<'none' | 'username' | 'password'>('none');
  const [isBlinking, setIsBlinking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { login } = useApp();

  // Natural Eyelid Blink Loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

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

  // Apple HIG Sheet Presentation Velocity Spring
  const appleSheetSpring = {
    type: 'spring',
    damping: 32,
    stiffness: 380,
    mass: 0.5
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-[100dvh] bg-[#050814] flex items-center justify-center p-0 sm:p-6 lg:p-12 overflow-hidden font-sans selection:bg-orange-500/30 touch-none overscroll-none"
    >
      {/* ─── AMBIENT DESKTOP BACKGROUND GLOW ─── */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-900/20 blur-[100px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full bg-orange-600/15 blur-[100px]" />
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
        
          {/* ─── STEP 1: TOP ORGANIC GEOMETRIC CUTOUTS ─── */}
          <div className="absolute top-0 inset-x-0 h-28 pointer-events-none z-10 overflow-hidden">
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-[#FF7A00]" />
            <div className="absolute top-6 left-28 w-11 h-11 rounded-full bg-[#081226]" />
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#6C92F6]" />
          </div>

          {/* ─── STEP 1 CONTENT: HEADLINE & STACKED BUTTONS ─── */}
          <div className="absolute inset-x-0 top-0 bottom-[200px] z-10 flex flex-col justify-center px-7 sm:px-9 pt-10 text-[#081226]">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#081226] leading-[1.12]">
                Let's check <br />
                our ledger!
              </h1>
              
              <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-[300px]">
                Zero-interest emergency loans & mutual monthly contributions for our friends.
              </p>

              {/* Stacked Role Buttons */}
              <div className="mt-8 space-y-3.5">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('member')}
                  className="w-full py-4 px-6 rounded-2xl bg-[#081226] text-white font-bold text-sm tracking-wide shadow-lg shadow-black/20 flex items-center justify-center space-x-2 transition-transform active:scale-[0.97]"
                >
                  <User className="w-4 h-4 text-[#FF7A00]" />
                  <span>Member Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full py-4 px-6 rounded-2xl bg-[#FAF8F5] text-[#081226] font-bold text-sm tracking-wide border-2 border-[#081226] flex items-center justify-center space-x-2 transition-transform active:scale-[0.97]"
                >
                  <Shield className="w-4 h-4 text-[#081226]" />
                  <span>Admin Console</span>
                </button>
              </div>
            </div>
          </div>

          {/* ─── STEP 1 BOTTOM DOME (WITH VISIBLE PROMINENT EYES LOOKING UP) ─── */}
          <div className="absolute inset-x-0 bottom-0 h-[210px] bg-gradient-to-b from-[#FF7A00] via-[#FF6A00] to-[#E65100] z-20 rounded-t-[72px] shadow-[0_-12px_40px_rgba(255,122,0,0.3)] flex flex-col justify-between pt-4 overflow-hidden">
            <MascotFace 
              eyeX={0} 
              eyeY={-4} 
              isBlinking={isBlinking} 
              isLookingDown={false} 
            />

            <div 
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 14px)' }}
              className="w-full text-center text-[11px] font-semibold text-[#081226]/60 select-none pb-2"
            >
              Santha Mutual Aid • Zero-Interest Group Ledger
            </div>
          </div>

          {/* ─── STEP 2 FULL-SCREEN SHEET (100% HARDWARE-ACCELERATED GPU SLIDE) ─── */}
          {/* Slides up effortlessly on translateY at 60/120 FPS on any Android device */}
          <motion.div
            initial={false}
            animate={{
              y: step === 'credentials' ? '0%' : '100%'
            }}
            transition={appleSheetSpring}
            className="absolute inset-0 h-full w-full bg-gradient-to-b from-[#FF7A00] via-[#FF6A00] to-[#E65100] z-30 flex flex-col justify-between shadow-[0_-16px_50px_rgba(0,0,0,0.4)] transform-gpu will-change-transform"
          >
            {/* Step 2 Top Header Bar */}
            <div 
              style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)' }}
              className="w-full px-6 sm:px-7 flex items-center justify-between z-20 min-h-[52px]"
            >
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center space-x-1.5 py-1.5 px-3.5 rounded-full bg-black/15 hover:bg-black/25 text-[#081226] text-xs font-bold transition-transform active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold text-[#081226] tracking-wide shadow-sm">
                {role === 'admin' ? 'Admin Portal' : 'Member Portal'}
              </div>
            </div>

            {/* Step 2 Center Hero & Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-7 -mt-2 z-10 w-full max-w-[360px] mx-auto">
              {/* Mascot Face looking attentively down at inputs */}
              <MascotFace 
                eyeX={0} 
                eyeY={focusTarget !== 'none' ? 5 : 2} 
                isBlinking={isBlinking} 
                isLookingDown={focusTarget === 'password' && !showPassword}
                className="mb-3"
              />

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#081226] text-center mb-1">
                {role === 'admin' ? 'Enter Admin Key' : 'Enter Your Name'}
              </h2>
              <p className="text-xs font-semibold text-[#081226]/65 text-center mb-5">
                Santha Mutual Aid • LKR 300/mo Pool
              </p>

              {/* The Form */}
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
                  <div className="relative">
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
                  </div>
                )}

                {error && (
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/20 text-white text-xs font-medium text-center shadow-md animate-fadeIn">
                    {error}
                  </div>
                )}

                <button
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
                </button>
              </form>
            </div>

            {/* Step 2 Bottom Footer */}
            <div 
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
              className="w-full text-center text-[11px] font-semibold text-[#081226]/60 pt-1 select-none"
            >
              Santha Mutual Aid • Zero-Interest Group Ledger
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
