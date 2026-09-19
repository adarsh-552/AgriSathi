import React, { useEffect, useState } from 'react';
import { CloudRain, Wind, Droplets, ArrowLeft, Calendar, ShieldAlert, MapPin, RefreshCw } from 'lucide-react';
import { externalService } from '../services/externalService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioPlayer from '../components/AudioPlayer';

export default function WeatherForecastScreen({ onBack, onNavigateToAlerts }) {
  const { profile } = useAuth();
  const { lang, tf } = useLanguage();

  const [district, setDistrict] = useState(profile?.district || 'Kurnool');
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeather = (dist) => {
    setLoading(true);
    externalService.getWeather(dist)
      .then((data) => {
        const list = Array.isArray(data) ? data : [data];
        setWeatherList(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const today = weatherList.length > 0 ? weatherList[0] : null;

  const getDayName = (dateStr, idx) => {
    if (idx === 0) return 'ఈ రోజు (Today)';
    if (idx === 1) return 'రేపు (Tomorrow)';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'en' ? 'en-US' : 'te-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return `డే ${idx + 1}`;
    }
  };

  const getDayIcon = (rainProb) => {
    if (rainProb >= 60) return '🌧️';
    if (rainProb >= 30) return '🌦️';
    return '☀️';
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900">వాతావరణ సూచన (Weather Forecast)</h2>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin size={12} className="text-forest-green" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="bg-transparent font-bold text-forest-green underline focus:outline-none cursor-pointer"
              >
                {['Kurnool', 'Guntur', 'Anantapur', 'Warangal', 'Nalgonda', 'Khammam', 'Karimnagar', 'Krishna'].map((d) => (
                  <option key={d} value={d} className="text-gray-900 font-normal">
                    {d} జిల్లా
                  </option>
                ))}
              </select>
              <span>• IMD అగ్రోమెట్</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchWeather(district)}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-forest-green rounded-full bg-gray-100 transition disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">వాతావరణ సూచనను లోడ్ చేస్తున్నాము...</div>
      ) : today ? (
        <>
          {/* Main Today Banner */}
          <div className="bg-gradient-to-br from-emerald-800 to-forest-green text-white rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-green-200 uppercase font-semibold tracking-wider">ఈ రోజు సూచన (Today) • {district}</span>
                <div className="text-4xl font-black mt-1">{Math.round(today.tempMax || 32)}°C</div>
                <div className="text-xs text-green-100 mt-0.5">కనిష్ట ఉష్ణోగ్రత: {Math.round(today.tempMin || 24)}°C</div>
              </div>
              <span className="text-5xl">{getDayIcon(today.rainProbability)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-black/20 backdrop-blur-sm rounded-2xl p-3 text-center text-xs">
              <div>
                <span className="text-green-200 block text-[10px] uppercase font-semibold">వర్షం అవకాశం</span>
                <span className="font-bold text-sm text-white">{today.rainProbability || 0}%</span>
              </div>
              <div>
                <span className="text-green-200 block text-[10px] uppercase font-semibold">గాలి వేగం</span>
                <span className="font-bold text-sm text-white">{Math.round(today.windSpeedKmh || 12)} km/h</span>
              </div>
              <div>
                <span className="text-green-200 block text-[10px] uppercase font-semibold">గాలిలో తేమ</span>
                <span className="font-bold text-sm text-white">{today.humidityPercent || 65}%</span>
              </div>
            </div>
          </div>

          {/* Spray Decision Recommendation */}
          <div className={`p-4 rounded-2xl border ${today.safeToSpray ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <ShieldAlert size={18} className={today.safeToSpray ? 'text-forest-green' : 'text-rose-600'} />
                <h4>పిచికారీ సలహా (Spraying Decision)</h4>
              </div>
              <AudioPlayer
                text={today.operationalAdvisoryTe || (today.safeToSpray ? 'నేడు మందుల పిచికారీకి అనుకూలం.' : 'పిచికారీ వాయిదా వేయండి.')}
                lang={lang}
              />
            </div>
            <p className="text-xs leading-relaxed font-medium">
              {today.operationalAdvisoryTe || (today.safeToSpray
                ? 'నేడు గాలి వేగం మరియు వర్ష సూచన పరిమితిలోనే ఉన్నాయి. ఉదయం 8 నుండి 11 గంటల లోపు సస్యరక్షణ మందుల పిచికారీకి అనుకూలం.'
                : 'నేడు వర్షం లేదా అధిక గాలి వేగం ఉన్నందున పిచికారీ వాయిదా వేయడం మంచిది.')}
            </p>
          </div>

          {/* 5-Day Trend Table */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              5 రోజుల సూచన వివరాలు (IMD Agromet)
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              {weatherList.slice(0, 5).map((row, idx) => (
                <div key={row.id || idx} className="py-2.5 flex justify-between items-center">
                  <span className="font-bold text-gray-800 w-28 truncate">{getDayName(row.forecastDate, idx)}</span>
                  <span className="text-lg">{getDayIcon(row.rainProbability)}</span>
                  <span className="text-gray-600 font-mono font-medium">
                    {Math.round(row.tempMax)}° / {Math.round(row.tempMin)}°
                  </span>
                  <span className={`font-bold w-12 text-right ${row.rainProbability >= 40 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {row.rainProbability}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Agromet Attribution */}
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex justify-between items-center">
            <span>మూలం: {today.source || 'IMD Agromet Advisory Services'}</span>
            <span>నవీకరణ: లైవ్</span>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-500">
          వాతావరణ వివరాలు అందుబాటులో లేవు.
        </div>
      )}
    </div>
  );
}
