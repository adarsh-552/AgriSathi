import React, { useEffect } from 'react';

export default function SplashScreen({ onStart }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onStart();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onStart]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-b from-forest-green to-emerald-950 text-white p-6 text-center select-none">
      <div className="my-auto flex flex-col items-center space-y-4">
        {/* App Logo */}
        <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-5xl shadow-2xl animate-pulse">
          🌾
        </div>

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">AgriSathi</h1>
          <p className="text-lg font-bold text-amber-400 mt-1">రైతు నేస్తం • कृषि साथी</p>
          <p className="text-xs text-green-200 mt-2 tracking-widest uppercase">
            Your Farm. Our Support.
          </p>
        </div>

        {/* Telugu Motto */}
        <div className="bg-white/10 px-4 py-2 rounded-full border border-white/15 text-xs text-green-100 italic">
          "రైతు కోసం... రైతు భాషలో... రైతు తోడుగా..."
        </div>
      </div>

      <div className="w-full pb-8 flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-green-300">ప్రారంభించబడుతోంది (Starting)...</span>
      </div>
    </div>
  );
}
