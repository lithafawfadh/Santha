import React from 'react';

export default function ShaderBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        {/* Base animated gradient with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black animate-gradient-shift" />
        
        {/* Cyberpunk grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-background" />
        </div>
        
        {/* Animated plasma orbs */}
        <div className="absolute top-0 -left-32 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-full blur-3xl opacity-40 animate-float-1" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-3xl opacity-40 animate-float-2" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full blur-3xl opacity-40 animate-float-3" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-3xl opacity-30 animate-float-4" />
        
        {/* Scanning lines effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="scan-lines" />
        </div>
        
        {/* Holographic mesh overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="holographic-mesh" />
        </div>
        
        {/* Particle field effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
          <div className="particle particle-6" />
          <div className="particle particle-7" />
          <div className="particle particle-8" />
        </div>
        
        {/* Energy waves */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="energy-wave energy-wave-1" />
          <div className="energy-wave energy-wave-2" />
          <div className="energy-wave energy-wave-3" />
        </div>
        
        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.8 }}>
                <animate attributeName="stop-color" values="#06b6d4; #8b5cf6; #06b6d4" dur="8s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.3 }}>
                <animate attributeName="stop-color" values="#8b5cf6; #06b6d4; #8b5cf6" dur="8s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          <g className="neural-lines">
            <line x1="10%" y1="20%" x2="30%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-draw-line">
              <animate attributeName="x2" values="30%; 35%; 30%" dur="4s" repeatCount="indefinite" />
            </line>
            <line x1="40%" y1="10%" x2="60%" y2="90%" stroke="url(#lineGradient)" strokeWidth="1">
              <animate attributeName="y2" values="90%; 85%; 90%" dur="5s" repeatCount="indefinite" />
            </line>
            <line x1="70%" y1="30%" x2="90%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1">
              <animate attributeName="x1" values="70%; 68%; 70%" dur="6s" repeatCount="indefinite" />
            </line>
            <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="url(#lineGradient)" strokeWidth="1">
              <animate attributeName="opacity" values="0.3; 1; 0.3" dur="3s" repeatCount="indefinite" />
            </line>
          </g>
        </svg>
        
        {/* Glowing orbs at intersections */}
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
        <div className="glow-orb glow-orb-4" />
        
        {/* Digital rain effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="digital-rain" />
        </div>
        
        {/* Vignette with color shift */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-70" />
        
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse-slow" />
      </div>

      <style>{`
        /* Gradient animations */
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
            background-size: 400% 400%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 20s ease infinite;
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

        /* Floating orbs */
        @keyframes float-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -80px) scale(1.2);
          }
          66% {
            transform: translate(-30px, 40px) scale(0.9);
          }
        }

        @keyframes float-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-60px, 70px) scale(1.1);
          }
          66% {
            transform: translate(40px, -50px) scale(0.95);
          }
        }

        @keyframes float-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(70px, -40px) scale(1.15);
          }
          66% {
            transform: translate(-50px, 60px) scale(0.85);
          }
        }

        @keyframes float-4 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate(-40px, -70px) scale(1.1) rotate(180deg);
          }
        }

        .animate-float-1 { animation: float-1 25s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 20s ease-in-out infinite 2s; }
        .animate-float-3 { animation: float-3 23s ease-in-out infinite 4s; }
        .animate-float-4 { animation: float-4 28s ease-in-out infinite 1s; }

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

        /* Particles */
        .particle {
          position: absolute;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.8), transparent);
          border-radius: 50%;
          width: 3px;
          height: 3px;
          animation: particle-float 10s ease-in-out infinite;
        }

        .particle-1 { top: 10%; left: 15%; animation-delay: 0s; animation-duration: 12s; }
        .particle-2 { top: 30%; left: 80%; animation-delay: 2s; animation-duration: 15s; }
        .particle-3 { top: 50%; left: 25%; animation-delay: 4s; animation-duration: 18s; }
        .particle-4 { top: 70%; left: 70%; animation-delay: 1s; animation-duration: 14s; }
        .particle-5 { top: 20%; left: 50%; animation-delay: 3s; animation-duration: 16s; }
        .particle-6 { top: 60%; left: 40%; animation-delay: 5s; animation-duration: 13s; }
        .particle-7 { top: 80%; left: 60%; animation-delay: 2.5s; animation-duration: 17s; }
        .particle-8 { top: 40%; left: 90%; animation-delay: 4.5s; animation-duration: 19s; }

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

        /* Energy waves */
        .energy-wave {
          position: absolute;
          width: 200%;
          height: 200%;
          border-radius: 40%;
          border: 1px solid rgba(139, 92, 246, 0.2);
          animation: wave-pulse 8s ease-in-out infinite;
        }

        .energy-wave-1 {
          animation-delay: 0s;
        }

        .energy-wave-2 {
          animation-delay: 2.6s;
        }

        .energy-wave-3 {
          animation-delay: 5.2s;
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

        /* Glowing orbs */
        .glow-orb {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(6, 182, 212, 1), rgba(139, 92, 246, 0.5));
          box-shadow: 
            0 0 10px rgba(6, 182, 212, 0.8),
            0 0 20px rgba(139, 92, 246, 0.6),
            0 0 30px rgba(6, 182, 212, 0.4);
          animation: orb-pulse 2s ease-in-out infinite;
        }

        .glow-orb-1 { top: 20%; left: 30%; animation-delay: 0s; }
        .glow-orb-2 { top: 50%; left: 80%; animation-delay: 0.5s; }
        .glow-orb-3 { top: 70%; left: 20%; animation-delay: 1s; }
        .glow-orb-4 { top: 30%; left: 60%; animation-delay: 1.5s; }

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

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}