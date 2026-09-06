import React, { useEffect, useState } from 'react';
import { Sprout, AlertCircle, TrendingUp, History, PhoneCall, Plus, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCrop } from '../context/CropContext';
import { externalService } from '../services/externalService';
import WeatherCard from '../components/WeatherCard';
import AudioPlayer from '../components/AudioPlayer';

export default function HomeScreen({ onNavigate, onSelectCropToSolve }) {
  const { t, lang, tf } = useLanguage();
  const { catalog, fetchCatalog, activeCrops, dashboard, fetchDashboard, selectCrop } = useCrop();
  const [weather, setWeather] = useState(null);
  const [mandi, setMandi] = useState([]);

  useEffect(() => {
    fetchCatalog();

    // Fetch live external weather & mandi data for Kurnool (MVP default)
    externalService.getWeather('Kurnool').then(setWeather).catch(console.error);
    externalService.getMarketPrices('Kurnool APMC').then(setMandi).catch(console.error);

    // If an active crop exists, fetch its dashboard
    if (activeCrops.length > 0) {
      fetchDashboard(activeCrops[0].id);
    }
  }, []);

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Weather & Spray Safety Card */}
      {weather && <WeatherCard weather={weather} />}

      {/* Active Crop Journey Widget */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌱</span>
            <h2 className="font-bold text-gray-900 text-sm">ప్రస్తుత పంట (Active Crop)</h2>
          </div>
          <button
            onClick={() => onNavigate('journey')}
            className="text-xs font-bold text-forest-green flex items-center hover:underline"
          >
            <span>వివరాలు</span>
            <ArrowRight size={14} className="ml-0.5" />
          </button>
        </div>

        {dashboard ? (
          <div>
            <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl mb-3">
              <div>
                <span className="text-base font-black text-forest-green">
                  {tf(dashboard.crop, 'name') || 'పత్తి (Cotton)'}
                </span>
                <p className="text-xs text-gray-500">
                  విత్తిన రోజు: {dashboard.farmerCrop?.sowingDate || '15 జూన్'} ({dashboard.cropAgeDays || 45} రోజులు)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold bg-forest-green text-white px-2.5 py-1 rounded-full">
                  {dashboard.currentStage?.nameTe || 'పువ్వు పూసే దశ'}
                </span>
              </div>
            </div>

            {/* Today's Tasks */}
            {dashboard.todayTasks && dashboard.todayTasks.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">ఈ రోజు పనులు (Today's Tasks):</span>
                {dashboard.todayTasks.slice(0, 2).map((task, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs bg-gray-50 p-2.5 rounded-lg">
                    <span className="w-4 h-4 rounded-full bg-forest-green text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="text-gray-800">{task.nameTe || task.nameEn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-xs text-gray-600 mb-2">మీరు ఇంకా పంట ప్రయాణాన్ని ప్రారంభించలేదు</p>
            <button
              onClick={() => onNavigate('journey')}
              className="px-4 py-2 bg-forest-green text-white font-bold text-xs rounded-xl shadow inline-flex items-center space-x-1"
            >
              <Plus size={14} />
              <span>కొత్త పంటను జోడించండి</span>
            </button>
          </div>
        )}
      </div>

      {/* 4 Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Solve Problem */}
        <button
          onClick={() => onNavigate('solver')}
          className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-2 shadow">
            <AlertCircle size={22} />
          </div>
          <h3 className="font-bold text-rose-950 text-sm">సమస్య పరిష్కారం</h3>
          <p className="text-[11px] text-rose-700 mt-0.5">లక్షణాలు గుర్తించి రసాయన రహిత సలహా</p>
        </button>

        {/* Crop Memory */}
        <button
          onClick={() => onNavigate('memory')}
          className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow">
            <History size={22} />
          </div>
          <h3 className="font-bold text-amber-950 text-sm">పంట జ్ఞాపకాలు</h3>
          <p className="text-[11px] text-amber-700 mt-0.5">వర్షం, ఎరువులు, విత్తనాల క్రమ చరిత్ర</p>
        </button>

        {/* Market Prices */}
        <button
          onClick={() => onNavigate('market')}
          className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow">
            <TrendingUp size={22} />
          </div>
          <h3 className="font-bold text-blue-950 text-sm">మార్కెట్ ధరలు</h3>
          <p className="text-[11px] text-blue-700 mt-0.5">కర్నూలు APMC ప్రస్తుత క్వింటాల్ ధరలు</p>
        </button>

        {/* KVK Expert Call */}
        <button
          onClick={() => onNavigate('escalation')}
          className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-green text-white flex items-center justify-center mb-2 shadow">
            <PhoneCall size={22} />
          </div>
          <h3 className="font-bold text-emerald-950 text-sm">KVK నిపుణుల సలహా</h3>
          <p className="text-[11px] text-emerald-700 mt-0.5">వ్యవసాయ శాస్త్రవేత్తకు నేరుగా కాల్ చేయండి</p>
        </button>
      </div>

      {/* Top Mandi Prices Preview */}
      {mandi.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
              నేటి మార్కెట్ రేట్లు (Agmarknet)
            </h3>
            <span className="text-[10px] text-gray-400">కర్నూలు APMC</span>
          </div>
          <div className="divide-y divide-gray-100">
            {mandi.slice(0, 3).map((item, i) => (
              <div key={i} className="py-2 flex justify-between items-center text-xs">
                <span className="font-medium text-gray-800">{item.cropNameTe || item.cropNameEn}</span>
                <span className="font-black text-forest-green font-mono">
                  ₹{item.modalPriceQuintal} <span className="text-[10px] font-normal text-gray-500">/ క్వింటాల్</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
