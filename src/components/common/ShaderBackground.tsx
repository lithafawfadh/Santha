import React, { useEffect, useState, memo } from 'react';
import { useApp } from '../../context/AppContext';

function ShaderBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode } = useApp();

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <div className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900' : 'bg-black'
      }`}>
        {/* Base animated gradient - changes with dark mode */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-indigo-950 via-purple-950 to-black'
        }`}
             style={{ 
               animation: isMobile ? 'none' : 'gradient-shift 20s ease infinite',
               backgroundSize: '400% 400%'
             }} />
        
        {/* Cyberpunk grid overlay - disabled on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-20">
            <div className="grid-background" />
          </div>
        )}
        
        {/* Animated plasma orbs - reduced for mobile and changes with dark mode */}
        <div className={`absolute top-0 -left-32 w-96 h-96 rounded-full blur-3xl transition-all duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-br from-blue-600 to-cyan-700 opacity-20'
            : 'bg-gradient-to-br from-cyan-500 to-blue-700 opacity-40'
        }`}
             style={{ 
               animation: isMobile ? 'none' : 'float-1 25s ease-in-out infinite',
               willChange: isMobile ? 'auto' : 'transform'
             }} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-700 to-fuchsia-800 opacity-20'
            : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 opacity-40'
        }`}
             style={{ 
               animation: isMobile ? 'none' : 'float-3 23s ease-in-out infinite 4s',
               willChange: isMobile ? 'auto' : 'transform'
             }} />
        
        {/* Scanning lines - disabled on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-10">
            <div className="scan-lines" />
          </div>
        )}
        
        {/* Holographic mesh - disabled on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-30">
            <div className="holographic-mesh" />
          </div>
        )}
        
        {/* Particle field - reduced on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="particle particle-1" />
            <div className="particle particle-2" />
            <div className="particle particle-3" />
            <div className="particle particle-4" />
          </div>
        )}
        
        {/* Energy waves - disabled on mobile */}
        {!isMobile && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="energy-wave energy-wave-1" />
          </div>
        )}
        
        {/* Neural network lines - disabled on mobile */}
        {!isMobile && (
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: isDarkMode ? '#3b82f6' : '#06b6d4', stopOpacity: 0.8 }}>
                  <animate attributeName="stop-color" values={isDarkMode ? '#3b82f6; #8b5cf6; #3b82f6' : '#06b6d4; #8b5cf6; #06b6d4'} dur="8s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }}>
                  <animate attributeName="stop-color" values="#8b5cf6; #06b6d4; #8b5cf6" dur="8s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <g className="neural-lines">
              <line x1="10%" y1="20%" x2="30%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1">
                <animate attributeName="x2" values="30%; 35%; 30%" dur="4s" repeatCount="indefinite" />
              </line>
              <line x1="70%" y1="30%" x2="90%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1">
                <animate attributeName="x1" values="70%; 68%; 70%" dur="6s" repeatCount="indefinite" />
              </line>
            </g>
          </svg>
        )}
        
        {/* Glowing orbs - reduced on mobile */}
        {!isMobile && (
          <>
            <div className={`glow-orb glow-orb-1 transition-all duration-500 ${
              isDarkMode ? 'opacity-50' : 'opacity-100'
            }`} />
            <div className={`glow-orb glow-orb-2 transition-all duration-500 ${
              isDarkMode ? 'opacity-50' : 'opacity-100'
            }`} />
          </>
        )}
        
        {/* Digital rain - disabled on mobile */}
        {!isMobile && (
          <div className="absolute inset-0 opacity-10">
            <div className="digital-rain" />
          </div>
        )}
        
        {/* Vignette with color shift */}
        <div className={`absolute inset-0 bg-gradient-radial from-transparent via-transparent transition-all duration-500 ${
          isDarkMode ? 'to-gray-900 opacity-80' : 'to-black opacity-70'
        }`} />
        
        {/* Top glow - simplified for mobile */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent to-transparent transition-all duration-500 ${
          isDarkMode ? 'via-blue-500 opacity-40' : 'via-cyan-400 opacity-60'
        }`}
             style={{ animation: isMobile ? 'none' : 'pulse-slow 3s ease-in-out infinite' }} />
      </div>

      <style>{`
        /* Gradient animations */
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Cyberpunk grid */
        .grid-background {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          width: 100%;
          height: 100%;
          animation: grid-scroll 20s linear infinite;
        }

        @keyframes grid-scroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        /* Floating orbs - optimized */
        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, -80px) scale(1.1);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(70px, -40px) scale(1.1);
          }
        }

        /* Scanning lines */
        .scan-lines {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(6, 182, 212, 0.1) 50%,
            transparent 100%
          );
          background-size: 100% 4px;
          height: 100%;
          animation: scan 8s linear infinite;
        }

        @keyframes scan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100vh;
          }
        }

        /* Holographic mesh */
        .holographic-mesh {
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(139, 92, 246, 0.03) 10px,
              rgba(139, 92, 246, 0.03) 20px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 10px,
              rgba(6, 182, 212, 0.03) 10px,
              rgba(6, 182, 212, 0.03) 20px
            );
          width: 100%;
          height: 100%;
          animation: mesh-shift 15s linear infinite;
        }

        @keyframes mesh-shift {
          0% {
            transform: translateX(0) translateY(0);
          }
          100% {
            transform: translateX(20px) translateY(20px);
          }
        }

        /* Particles - optimized */
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.8), transparent);
          border-radius: 50%;
          width: 3px;
          height: 3px;
          animation: particle-float 15s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .particle-1 { top: 10%; left: 15%; animation-delay: 0s; }
        .particle-2 { top: 30%; left: 80%; animation-delay: 3s; }
        .particle-3 { top: 50%; left: 25%; animation-delay: 6s; }
        .particle-4 { top: 70%; left: 70%; animation-delay: 9s; }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-100vh) translateX(50px) scale(1.5);
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
        }

        /* Energy waves - single wave for performance */
        .energy-wave {
          position: absolute;
          width: 200%;
          height: 200%;
          border-radius: 40%;
          border: 1px solid rgba(139, 92, 246, 0.2);
          animation: wave-pulse 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .energy-wave-1 {
          animation-delay: 0s;
        }

        @keyframes wave-pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        /* Glowing orbs - reduced */
        .glow-orb {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6, 182, 212, 1), rgba(139, 92, 246, 0.5));
          box-shadow: 
            0 0 10px rgba(6, 182, 212, 0.8),
            0 0 20px rgba(139, 92, 246, 0.6);
          animation: orb-pulse 2s ease-in-out infinite;
        }

        .glow-orb-1 { top: 20%; left: 30%; animation-delay: 0s; }
        .glow-orb-2 { top: 70%; left: 80%; animation-delay: 1s; }

        @keyframes orb-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        /* Digital rain */
        .digital-rain {
          background-image: 
            linear-gradient(transparent 0%, rgba(6, 182, 212, 0.05) 50%, transparent 100%);
          background-size: 2px 20px;
          background-repeat: repeat;
          width: 100%;
          height: 100%;
          animation: rain-fall 3s linear infinite;
        }

        @keyframes rain-fall {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 20px;
          }
        }

        /* Radial gradient */
        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
        }

        /* Pulse slow */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default memo(ShaderBackground);