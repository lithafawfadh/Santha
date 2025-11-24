import React from 'react';

export default function CampingScene() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none">
      {/* Forest Background - Dark silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-64">
        <svg viewBox="0 0 1200 300" className="w-full h-full">
          {/* Trees */}
          {[...Array(15)].map((_, i) => {
            const x = (i * 80) + (Math.random() * 40 - 20);
            const height = 180 + Math.random() * 60;
            return (
              <polygon
                key={i}
                points={`${x},300 ${x - 30},${300 - height} ${x + 30},300`}
                fill="#1a2e1a"
                opacity={0.8 - (i % 3) * 0.1}
              />
            );
          })}
        </svg>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#2a3f2a] to-transparent" />

      {/* Camping Area */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl flex items-end justify-center space-x-12 px-8">
        
        {/* Rocks - Left */}
        <div className="flex space-x-2 mb-4">
          <div className="w-8 h-6 bg-gray-600 rounded-lg transform rotate-12" />
          <div className="w-6 h-5 bg-gray-700 rounded-lg transform -rotate-6" />
          <div className="w-7 h-7 bg-gray-600 rounded-lg" />
        </div>

        {/* Campfire */}
        <div className="relative flex flex-col items-center mb-4">
          {/* Fire glow */}
          <div className="absolute -inset-8 bg-orange-500/30 rounded-full blur-2xl animate-pulse" />
          
          {/* Flames */}
          <div className="relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-300 rounded-full animate-fire-1" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-200 rounded-full animate-fire-2" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-yellow-500 via-yellow-300 to-yellow-100 rounded-full animate-fire-3" />
          </div>

          {/* Wood logs */}
          <div className="relative mt-12 flex items-center justify-center">
            <div className="absolute w-16 h-3 bg-amber-900 rounded-full transform -rotate-12" />
            <div className="absolute w-16 h-3 bg-amber-800 rounded-full transform rotate-12" />
            <div className="absolute w-12 h-2 bg-amber-950 rounded-full z-10" />
          </div>

          {/* Smoke particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gray-400/20 rounded-full animate-smoke"
              style={{
                bottom: '3rem',
                left: '50%',
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Car */}
        <div className="relative mb-4 transform scale-90">
          {/* Car body */}
          <div className="relative">
            {/* Main body */}
            <div className="w-28 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg" />
            
            {/* Roof */}
            <div className="absolute -top-8 left-4 w-20 h-10 bg-gradient-to-br from-amber-800 to-amber-950 rounded-t-lg" />
            
            {/* Windows */}
            <div className="absolute top-1 left-5 w-8 h-6 bg-blue-900/60 rounded" />
            <div className="absolute top-1 right-5 w-8 h-6 bg-blue-900/60 rounded" />
            
            {/* Wheels */}
            <div className="absolute -bottom-2 left-3 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600">
              <div className="absolute inset-2 bg-gray-700 rounded-full" />
            </div>
            <div className="absolute -bottom-2 right-3 w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600">
              <div className="absolute inset-2 bg-gray-700 rounded-full" />
            </div>

            {/* Headlights */}
            <div className="absolute top-8 right-0 w-2 h-2 bg-yellow-200 rounded-full" />
          </div>
        </div>

        {/* Tent */}
        <div className="relative mb-4 transform scale-90">
          {/* Tent body */}
          <div className="relative">
            {/* Main tent structure */}
            <div className="w-24 h-20 bg-gradient-to-br from-orange-600 to-orange-800">
              <div style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom right, #ea580c, #c2410c)',
              }} />
            </div>

            {/* Tent entrance */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-gradient-to-b from-orange-900 to-amber-950">
              <div style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #78350f, #451a03)',
              }} />
            </div>

            {/* Tent entrance flap */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-10 bg-yellow-900/40">
              <div style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                width: '100%',
                height: '100%',
                background: 'rgba(120, 53, 15, 0.6)',
              }} />
            </div>

            {/* Tent windows/vents */}
            <div className="absolute top-4 left-3 w-4 h-3 bg-yellow-600/40 rounded-sm" />
            <div className="absolute top-4 right-3 w-4 h-3 bg-yellow-600/40 rounded-sm" />
          </div>
        </div>

        {/* Rocks - Right */}
        <div className="flex space-x-2 mb-4">
          <div className="w-7 h-6 bg-gray-600 rounded-lg transform -rotate-12" />
          <div className="w-6 h-5 bg-gray-700 rounded-lg transform rotate-6" />
        </div>
      </div>

      {/* Grass/Ground details */}
      <div className="absolute bottom-0 left-0 w-full h-24">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-px h-4 bg-green-900/40"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 16 + 8}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}