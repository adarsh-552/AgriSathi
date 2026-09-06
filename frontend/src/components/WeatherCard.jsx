import React from 'react';
import { CloudRain, Wind, Droplets, Thermometer, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AudioPlayer from './AudioPlayer';

export default function WeatherCard({ weather }) {
  const { lang, tf, t } = useLanguage();

  if (!weather) return null;

  const advisoryText = tf(weather, 'operationalAdvisory') || weather.operationalAdvisoryTe || weather.operationalAdvisoryEn;

  return (
    <div className="bg-gradient-to-br from-emerald-800 to-forest-green text-white rounded-2xl p-4 shadow-lg mb-4">
      {/* Top row: Location & Spray Advisory Flag */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs text-green-200 tracking-wider uppercase font-semibold">
            {weather.district}, {weather.state}
          </span>
          <div className="flex items-baseline space-x-2 mt-0.5">
            <span className="text-3xl font-black">{Math.round(weather.tempMax || 32)}°C</span>
            <span className="text-xs text-green-200">కనిష్టం: {Math.round(weather.tempMin || 24)}°C</span>
          </div>
        </div>

        {/* Spray status badge */}
        <div
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
            weather.safeToSpray
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
              : 'bg-rose-500/20 text-rose-200 border-rose-400/30'
          }`}
        >
          {weather.safeToSpray ? (
            <>
              <CheckCircle size={14} className="text-emerald-300" />
              <span>మందుల పిచికారీకి అనుకూలం</span>
            </>
          ) : (
            <>
              <AlertTriangle size={14} className="text-rose-300" />
              <span>పిచికారీ చేయవద్దు</span>
            </>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 bg-black/20 backdrop-blur-sm rounded-xl p-2.5 mb-3 text-center">
        <div className="flex flex-col items-center">
          <CloudRain size={16} className="text-blue-300 mb-1" />
          <span className="text-[10px] text-green-200">వర్ష సూచన</span>
          <span className="text-xs font-bold">{weather.rainProbability || 0}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Droplets size={16} className="text-teal-300 mb-1" />
          <span className="text-[10px] text-green-200">తేమ (గాలిలో)</span>
          <span className="text-xs font-bold">{weather.humidity || 65}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={16} className="text-amber-200 mb-1" />
          <span className="text-[10px] text-green-200">గాలి వేగం</span>
          <span className="text-xs font-bold">{weather.windSpeed || 12} km/h</span>
        </div>
      </div>

      {/* Operational advisory with voice readout */}
      {advisoryText && (
        <div className="bg-white/10 rounded-xl p-3 border border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-amber-300">వ్యవసాయ సూచన (IMD):</span>
            <AudioPlayer text={advisoryText} lang={lang} />
          </div>
          <p className="text-xs leading-relaxed text-green-50">{advisoryText}</p>
        </div>
      )}

      {/* Attribution */}
      <div className="text-[10px] text-green-300/70 text-right mt-2">
        మూలం: {weather.source || 'IMD Agromet Advisory Services'}
      </div>
    </div>
  );
}
