import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  twinkleDelay: number;
}

export default function CampingBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [moonPosition, setMoonPosition] = useState(0);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 2 + 1,
      twinkleDelay: Math.random() * 3,
    }));
    setStars(newStars);

    // Animate moon
    const interval = setInterval(() => {
      setMoonPosition((prev) => (prev + 0.1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Night Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#2a2f4a]" />

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.twinkleDelay}s`,
          }}
        />
      ))}

      {/* Moon */}
      <div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_0_60px_20px_rgba(255,255,255,0.3)] transition-all duration-1000"
        style={{
          right: `${moonPosition}%`,
          top: '10%',
        }}
      >
        {/* Moon craters */}
        <div className="absolute w-3 h-3 rounded-full bg-gray-400/30 top-4 left-6" />
        <div className="absolute w-2 h-2 rounded-full bg-gray-400/20 top-8 left-10" />
        <div className="absolute w-4 h-4 rounded-full bg-gray-400/25 top-10 left-4" />
      </div>

      {/* Distant stars (smaller, faint) */}
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`distant-${i}`}
            className="absolute w-px h-px bg-blue-200/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}