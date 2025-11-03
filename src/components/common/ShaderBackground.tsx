import React from 'react';

export default function ShaderBackground() {
  return (
    <>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        {/* Deep space base with dynamic gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-fuchsia-950 via-purple-900 to-black animate-gradient-morph" />
        
        {/* Aurora borealis effect */}
        <div className="absolute inset-0 opacity-70">
          <div className="aurora aurora-1" />
          <div className="aurora aurora-2" />
          <div className="aurora aurora-3" />
        </div>
        
        {/* Liquid plasma orbs with trails */}
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-3xl opacity-50 animate-liquid-1" />
        <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-600 rounded-full blur-3xl opacity-50 animate-liquid-2" />
        <div className="absolute -bottom-32 left-1/4 w-[520px] h-[520px] bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-full blur-3xl opacity-45 animate-liquid-3" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-full blur-3xl opacity-40 animate-liquid-4" />
        
        {/* Hexagonal grid with depth */}
        <div className="absolute inset-0 opacity-25">
          <div className="hexagon-grid" />
        </div>
        
        {/* Chromatic aberration scanner */}
        <div className="absolute inset-0">
          <div className="chromatic-scanner" />
        </div>
        
        {/* 3D rotating energy field */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="energy-field-container">
            <div className="energy-ring energy-ring-1" />
            <div className="energy-ring energy-ring-2" />
            <div className="energy-ring energy-ring-3" />
            <div className="energy-ring energy-ring-4" />
            <div className="energy-ring energy-ring-5" />
          </div>
        </div>
        
        {/* Advanced particle system with trails */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="advanced-particle" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Neural network with animated connections */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="neuralGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }}>
                <animate attributeName="stop-color" values="#06b6d4; #a855f7; #ec4899; #06b6d4" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0.3 }}>
                <animate attributeName="stop-color" values="#a855f7; #ec4899; #06b6d4; #a855f7" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Dynamic neural connections */}
          <g filter="url(#glow)">
            <path d="M 100 100 Q 300 200 500 150" stroke="url(#neuralGradient1)" strokeWidth="2" fill="none" className="neural-path">
              <animate attributeName="d" values="M 100 100 Q 300 200 500 150; M 100 120 Q 280 220 500 130; M 100 100 Q 300 200 500 150" dur="8s" repeatCount="indefinite" />
            </path>
            <path d="M 600 300 Q 800 150 1000 200" stroke="url(#neuralGradient1)" strokeWidth="2" fill="none" className="neural-path">
              <animate attributeName="d" values="M 600 300 Q 800 150 1000 200; M 600 280 Q 820 170 1000 220; M 600 300 Q 800 150 1000 200" dur="10s" repeatCount="indefinite" />
            </path>
            <path d="M 200 500 Q 500 400 800 550" stroke="url(#neuralGradient1)" strokeWidth="2" fill="none" className="neural-path">
              <animate attributeName="d" values="M 200 500 Q 500 400 800 550; M 200 520 Q 480 420 800 530; M 200 500 Q 500 400 800 550" dur="12s" repeatCount="indefinite" />
            </path>
            <circle cx="100" cy="100" r="6" fill="#06b6d4" className="neural-node">
              <animate attributeName="r" values="6; 10; 6" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="500" cy="150" r="6" fill="#a855f7" className="neural-node">
              <animate attributeName="r" values="6; 10; 6" dur="3s" repeatCount="indefinite" begin="1s" />
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="3s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle cx="1000" cy="200" r="6" fill="#ec4899" className="neural-node">
              <animate attributeName="r" values="6; 10; 6" dur="3s" repeatCount="indefinite" begin="2s" />
              <animate attributeName="opacity" values="0.5; 1; 0.5" dur="3s" repeatCount="indefinite" begin="2s" />
            </circle>
          </g>
        </svg>
        
        {/* Holographic data stream */}
        <div className="absolute inset-0">
          <div className="data-stream data-stream-1" />
          <div className="data-stream data-stream-2" />
          <div className="data-stream data-stream-3" />
        </div>
        
        {/* Prismatic light rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="light-ray light-ray-1" />
          <div className="light-ray light-ray-2" />
          <div className="light-ray light-ray-3" />
          <div className="light-ray light-ray-4" />
        </div>
        
        {/* Quantum field effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="quantum-field" />
        </div>
        
        {/* Depth layers with parallax */}
        <div className="absolute inset-0 opacity-10">
          <div className="depth-layer depth-layer-1" />
          <div className="depth-layer depth-layer-2" />
          <div className="depth-layer depth-layer-3" />
        </div>
        
        {/* Cosmic dust particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div 
              key={`dust-${i}`}
              className="cosmic-dust" 
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
        
        {/* Electric arcs */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path className="electric-arc" d="M 0 300 Q 200 250 400 300 T 800 300" stroke="url(#arcGradient)" strokeWidth="2" fill="none">
            <animate attributeName="d" values="M 0 300 Q 200 250 400 300 T 800 300; M 0 300 Q 200 350 400 300 T 800 300; M 0 300 Q 200 250 400 300 T 800 300" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0; 1; 0" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
        
        {/* Vignette with color shift */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-80" />
        
        {/* Edge glow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent opacity-70 animate-edge-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400 via-pink-500 to-transparent opacity-70 animate-edge-glow" style={{ animationDelay: '1s' }} />
      </div>

      <style>{`
        /* Advanced gradient morphing */
        @keyframes gradient-morph {
          0%, 100% {
            background-position: 0% 0%;
            background-size: 400% 400%;
            filter: hue-rotate(0deg) brightness(1);
          }
          25% {
            background-position: 100% 50%;
            filter: hue-rotate(30deg) brightness(1.1);
          }
          50% {
            background-position: 50% 100%;
            background-size: 500% 500%;
            filter: hue-rotate(60deg) brightness(1.2);
          }
          75% {
            background-position: 0% 50%;
            filter: hue-rotate(30deg) brightness(1.1);
          }
        }

        .animate-gradient-morph {
          animation: gradient-morph 25s ease infinite;
        }

        /* Aurora borealis effect */
        .aurora {
          position: absolute;
          width: 100%;
          height: 100%;
          filter: blur(60px);
          mix-blend-mode: screen;
        }

        .aurora-1 {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(6, 182, 212, 0.3) 20%,
            rgba(139, 92, 246, 0.3) 40%,
            rgba(236, 72, 153, 0.3) 60%,
            transparent 100%
          );
          animation: aurora-wave-1 15s ease-in-out infinite;
        }

        .aurora-2 {
          background: linear-gradient(120deg, 
            transparent 0%, 
            rgba(168, 85, 247, 0.2) 25%,
            rgba(6, 182, 212, 0.2) 50%,
            rgba(16, 185, 129, 0.2) 75%,
            transparent 100%
          );
          animation: aurora-wave-2 20s ease-in-out infinite 5s;
        }

        .aurora-3 {
          background: linear-gradient(60deg, 
            transparent 0%, 
            rgba(236, 72, 153, 0.25) 30%,
            rgba(168, 85, 247, 0.25) 60%,
            transparent 100%
          );
          animation: aurora-wave-3 18s ease-in-out infinite 10s;
        }

        @keyframes aurora-wave-1 {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.6; }
          50% { transform: translateY(-100px) scaleY(1.3); opacity: 0.9; }
        }

        @keyframes aurora-wave-2 {
          0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(80px) scaleY(1.4) rotate(5deg); opacity: 0.8; }
        }

        @keyframes aurora-wave-3 {
          0%, 100% { transform: translateY(0) scaleY(1) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-60px) scaleY(1.2) rotate(-5deg); opacity: 1; }
        }

        /* Liquid plasma animations */
        @keyframes liquid-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
          }
          25% {
            transform: translate(100px, -100px) scale(1.2) rotate(90deg);
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            transform: translate(50px, 50px) scale(0.9) rotate(180deg);
            border-radius: 50% 60% 70% 60% / 70% 50% 60% 40%;
          }
          75% {
            transform: translate(-80px, 80px) scale(1.1) rotate(270deg);
            border-radius: 30% 70% 60% 40% / 50% 60% 40% 70%;
          }
        }

        @keyframes liquid-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            border-radius: 50% 60% 40% 70% / 60% 40% 70% 50%;
          }
          33% {
            transform: translate(-120px, 90px) scale(1.15) rotate(120deg);
            border-radius: 70% 30% 60% 50% / 40% 70% 50% 60%;
          }
          66% {
            transform: translate(60px, -70px) scale(0.95) rotate(240deg);
            border-radius: 40% 70% 50% 60% / 70% 50% 40% 60%;
          }
        }

        @keyframes liquid-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            border-radius: 60% 40% 50% 70% / 50% 70% 40% 60%;
          }
          33% {
            transform: translate(90px, -110px) scale(1.25) rotate(100deg);
            border-radius: 70% 60% 40% 50% / 60% 40% 70% 50%;
          }
          66% {
            transform: translate(-70px, 70px) scale(0.85) rotate(200deg);
            border-radius: 40% 60% 70% 50% / 70% 50% 60% 40%;
          }
        }

        @keyframes liquid-4 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            border-radius: 50% 70% 60% 40% / 40% 60% 50% 70%;
          }
          50% {
            transform: translate(-90px, -90px) scale(1.2) rotate(180deg);
            border-radius: 70% 50% 40% 60% / 60% 70% 50% 40%;
          }
        }

        .animate-liquid-1 { animation: liquid-1 30s ease-in-out infinite; }
        .animate-liquid-2 { animation: liquid-2 25s ease-in-out infinite; }
        .animate-liquid-3 { animation: liquid-3 28s ease-in-out infinite; }
        .animate-liquid-4 { animation: liquid-4 32s ease-in-out infinite; }

        /* Hexagonal grid */
        .hexagon-grid {
          background-image: 
            radial-gradient(circle at center, rgba(6, 182, 212, 0.4) 1px, transparent 1px),
            radial-gradient(circle at center, rgba(168, 85, 247, 0.3) 1px, transparent 1px);
          background-size: 60px 35px, 60px 35px;
          background-position: 0 0, 30px 17.5px;
          width: 100%;
          height: 100%;
          animation: hexagon-drift 25s linear infinite;
          transform-origin: center;
        }

        @keyframes hexagon-drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(60px, 35px) rotate(360deg); }
        }

        /* Chromatic aberration scanner */
        .chromatic-scanner {
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, 
            rgba(255, 0, 0, 0.3), 
            rgba(0, 255, 0, 0.3), 
            rgba(0, 0, 255, 0.3)
          );
          filter: blur(2px);
          animation: scanner-move 6s ease-in-out infinite;
        }

        @keyframes scanner-move {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(100vh); opacity: 1; }
          90% { opacity: 0.8; }
        }

        /* 3D Energy field rings */
        .energy-field-container {
          position: relative;
          width: 500px;
          height: 500px;
          transform-style: preserve-3d;
          animation: field-rotate 40s linear infinite;
        }

        .energy-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 50%;
          transform-style: preserve-3d;
        }

        .energy-ring-1 {
          animation: ring-pulse-1 4s ease-in-out infinite;
          border-color: rgba(6, 182, 212, 0.4);
        }

        .energy-ring-2 {
          animation: ring-pulse-2 4s ease-in-out infinite 0.8s;
          border-color: rgba(168, 85, 247, 0.4);
          transform: rotateX(60deg);
        }

        .energy-ring-3 {
          animation: ring-pulse-3 4s ease-in-out infinite 1.6s;
          border-color: rgba(236, 72, 153, 0.4);
          transform: rotateY(60deg);
        }

        .energy-ring-4 {
          animation: ring-pulse-1 4s ease-in-out infinite 2.4s;
          border-color: rgba(16, 185, 129, 0.4);
          transform: rotateX(-45deg) rotateY(45deg);
        }

        .energy-ring-5 {
          animation: ring-pulse-2 4s ease-in-out infinite 3.2s;
          border-color: rgba(249, 115, 22, 0.4);
          transform: rotateX(45deg) rotateZ(45deg);
        }

        @keyframes field-rotate {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes ring-pulse-1 {
          0%, 100% { transform: scale(0.8) rotateX(60deg); opacity: 0.3; }
          50% { transform: scale(1.2) rotateX(60deg); opacity: 0.7; }
        }

        @keyframes ring-pulse-2 {
          0%, 100% { transform: scale(0.9) rotateY(60deg); opacity: 0.3; }
          50% { transform: scale(1.1) rotateY(60deg); opacity: 0.7; }
        }

        @keyframes ring-pulse-3 {
          0%, 100% { transform: scale(0.85) rotateY(60deg); opacity: 0.3; }
          50% { transform: scale(1.15) rotateY(60deg); opacity: 0.7; }
        }

        /* Advanced particles with trails */
        .advanced-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(6, 182, 212, 1), rgba(168, 85, 247, 0.5));
          border-radius: 50%;
          box-shadow: 
            0 0 10px rgba(6, 182, 212, 0.8),
            0 0 20px rgba(168, 85, 247, 0.6),
            0 0 5px rgba(236, 72, 153, 0.4);
          animation: particle-journey 20s ease-in-out infinite;
        }

        @keyframes particle-journey {
          0%, 100% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          5% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(
              calc(var(--random-x, 50vw) - 50vw), 
              calc(var(--random-y, -100vh))
            ) scale(2);
            opacity: 0.8;
          }
          95% {
            opacity: 0.3;
          }
        }

        /* Holographic data streams */
        .data-stream {
          position: absolute;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, 
            transparent 0%,
            rgba(6, 182, 212, 0.6) 20%,
            rgba(168, 85, 247, 0.8) 50%,
            rgba(236, 72, 153, 0.6) 80%,
            transparent 100%
          );
          filter: blur(1px);
          animation: stream-flow 8s linear infinite;
        }

        .data-stream-1 { left: 20%; animation-duration: 7s; }
        .data-stream-2 { left: 50%; animation-duration: 9s; animation-delay: 2s; }
        .data-stream-3 { left: 80%; animation-duration: 8s; animation-delay: 4s; }

        @keyframes stream-flow {
          0% { transform: translateY(-100%) scaleY(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(0%) scaleY(1); }
          90% { opacity: 1; }
          100% { transform: translateY(100%) scaleY(0); opacity: 0; }
        }

        /* Prismatic light rays */
        .light-ray {
          position: absolute;
          width: 2px;
          height: 100%;
          top: 0;
          background: linear-gradient(to bottom, 
            transparent 0%,
            rgba(255, 0, 255, 0.3) 50%,
            transparent 100%
          );
          filter: blur(3px);
          transform-origin: top center;
          animation: ray-sweep 20s ease-in-out infinite;
        }

        .light-ray-1 {
          left: 10%;
          animation-delay: 0s;
          background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.4), transparent);
        }

        .light-ray-2 {
          left: 35%;
          animation-delay: 5s;
          background: linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.4), transparent);
        }

        .light-ray-3 {
          left: 65%;
          animation-delay: 10s;
          background: linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.4), transparent);
        }

        .light-ray-4 {
          left: 90%;
          animation-delay: 15s;
          background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.4), transparent);
        }

        @keyframes ray-sweep {
          0%, 100% { transform: translateX(-100px) rotate(-10deg); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateX(100px) rotate(10deg); opacity: 1; }
          90% { opacity: 0.6; }
        }

        /* Quantum field effect */
        .quantum-field {
          width: 100%;
          height: 100%;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(6, 182, 212, 0.03) 2px,
              rgba(6, 182, 212, 0.03) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(168, 85, 247, 0.03) 2px,
              rgba(168, 85, 247, 0.03) 4px
            );
          animation: quantum-shift 30s linear infinite;
          opacity: 0.5;
        }

        @keyframes quantum-shift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 40px) scale(1.1); }
        }

        /* Depth layers */
        .depth-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(
            circle at center,
            rgba(168, 85, 247, 0.05) 1px,
            transparent 1px
          );
          background-size: 50px 50px;
        }

        .depth-layer-1 {
          animation: depth-float-1 40s ease-in-out infinite;
          background-size: 80px 80px;
        }

        .depth-layer-2 {
          animation: depth-float-2 50s ease-in-out infinite;
          background-size: 60px 60px;
        }

        .depth-layer-3 {
          animation: depth-float-3 60s ease-in-out infinite;
          background-size: 40px 40px;
        }

        @keyframes depth-float-1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-50px) scale(1.1); }
        }

        @keyframes depth-float-2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        @keyframes depth-float-3 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }

        /* Cosmic dust */
        .cosmic-dust {
          position: absolute;
          width: 1px;
          height: 1px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
          animation: dust-float 30s linear infinite;
        }

        @keyframes dust-float {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate(100px, -100vh) scale(0);
            opacity: 0;
          }
        }

        /* Edge glow */
        @keyframes edge-glow {
          0%, 100% {
            opacity: 0.7;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
          }
          33% {
            opacity: 1;
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.8);
          }
          66% {
            opacity: 0.8;
            box-shadow: 0 0 25px rgba(236, 72, 153, 0.7);
          }
        }

        .animate-edge-glow {
          animation: edge-glow 4s ease-in-out infinite;
        }

        /* Radial gradient */
        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0.9) 100%);
        }

        /* Neural path effect */
        .neural-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-path 10s ease-in-out infinite;
        }

        @keyframes draw-path {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -1000;
            opacity: 0.3;
          }
        }

        .neural-node {
          filter: drop-shadow(0 0 8px currentColor);
        }

        /* Electric arc */
        .electric-arc {
          filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.6));
        }
      `}</style>
    </>
  );
}