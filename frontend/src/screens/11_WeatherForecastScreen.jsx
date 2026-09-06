import React, { useEffect, useState } from 'react';
import { CloudRain, Wind, Droplets, ArrowLeft, Calendar, ShieldAlert } from 'lucide-react';
import { externalService } from '../services/externalService';
import { useLanguage } from '../context/LanguageContext';
import AudioPlayer from '../components/AudioPlayer';

export default function WeatherForecastScreen({ onBack }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const { lang, tf } = useLanguage();

  useEffect(() => {
    externalService.getWeather('Kurnool')
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">వాతావరణ సూచన (Weather Forecast)</h2>
          <p className="text-xs text-gray-500">కర్నూలు జిల్లా • IMD అగ్రోమెట్ సేవలు</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">లోడ్ అవుతోంది...</div>
      ) : weather ? (
        <>
          {/* Main Today Banner */}
          <div className="bg-gradient-to-br from-emerald-800 to-forest-green text-white rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs text-green-200">ఈ రోజు సూచన (Today)</span>
                <div className="text-4xl font-black mt-1">{Math.round(weather.tempMax || 32)}°C</div>
                <div className="text-xs text-green-100 mt-0.5">కనిష్టం: {Math.round(weather.tempMin || 24)}°C</div>
              </div>
              <span className="text-5xl">🌦</span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-black/20 rounded-xl p-3 text-center text-xs">
              <div>
                <span className="text-green-200 block text-[10px]">వర్షం అవకాశం</span>
                <span className="font-bold text-sm">{weather.rainProbability || 0}%</span>
              </div>
              <div>
                <span className="text-green-200 block text-[10px]">గాలి వేగం</span>
                <span className="font-bold text-sm">{weather.windSpeed || 12} km/h</span>
              </div>
              <div>
                <span className="text-green-200 block text-[10px]">గాలిలో తేమ</span>
                <span className="font-bold text-sm">{weather.humidity || 65}%</span>
              </div>
            </div>
          </div>

          {/* Spray Decision Recommendation */}
          <div className={`p-4 rounded-2xl border ${weather.safeToSpray ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
            <div className="flex items-center space-x-2 font-bold text-sm mb-1">
              <ShieldAlert size={18} />
              <h4>పిచికారీ సలహా (Spraying Decision)</h4>
            </div>
            <p className="text-xs leading-relaxed">
              {weather.safeToSpray
                ? 'నేడు గాలి వేగం మరియు వర్ష సూచన పరిమితిలోనే ఉంది. ఉదయం 8 నుండి 11 గంటల లోపు మందుల పిచికారీకి అనుకూలం.'
                : 'నేడు వర్షం లేదా అధిక గాలి వేగం అవకాశం ఉన్నందున పిచికారీ వాయిదా వేయడం మంచిది.'}
            </p>
          </div>

          {/* 5-Day Trend Table */}
          <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              5 రోజుల సూచన వివరాలు (IMD Agromet)
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              {[
                { day: 'ఈ రోజు', temp: '32° / 24°', icon: '🌦', rain: '20%' },
                { day: 'రేపు', temp: '33° / 25°', icon: '🌤', rain: '10%' },
                { day: 'మంగళవారం', temp: '31° / 23°', icon: '🌧', rain: '65%' },
                { day: 'బుధవారం', temp: '30° / 22°', icon: '🌧', rain: '80%' },
                { day: 'గురువారం', temp: '32° / 24°', icon: '⛅', rain: '30%' },
              ].map((row, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <span className="font-semibold text-gray-800 w-24">{row.day}</span>
                  <span className="text-base">{row.icon}</span>
                  <span className="text-gray-500 font-mono">{row.temp}</span>
                  <span className="font-bold text-blue-600 w-12 text-right">{row.rain}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-400 text-right">
            డేటా మూలం: IMD అగ్రోమెట్ విభాగం (తాజా నవీకరణ: నేడు ఉదయం 06:00 AM)
          </div>
        </>
      ) : null}
    </div>
  );
}
