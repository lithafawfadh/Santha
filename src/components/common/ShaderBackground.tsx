import React from 'react';

export default function ShaderBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        
        {/* Animated orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slow" />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/10 to-transparent animate-gradient-x" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
        </div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-noise" />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
            background-size: 200% 200%;
          }
          50% {
            background-position: 100% 50%;
            background-size: 200% 200%;
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(20%) translateY(10%);
          }
        }

        @keyframes gradient-y {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-10%) translateY(-20%);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 15s ease infinite;
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 18s ease-in-out infinite 2s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }

        .animate-gradient-y {
          animation: gradient-y 12s ease infinite;
        }

        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
        }
      `}</style>
    </>
  );
}