import React, { useEffect, useState } from 'react';
import { Sprout, AlertCircle, TrendingUp, History, PhoneCall, Plus, Calendar, ArrowRight, ShieldCheck, BookOpen, Bell, CloudRain, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCrop } from '../context/CropContext';
import { useAuth } from '../context/AuthContext';
import { externalService } from '../services/externalService';
import { alertsService } from '../services/alertsService';
import WeatherCard from '../components/WeatherCard';
import AudioPlayer from '../components/AudioPlayer';

export default function HomeScreen({ onNavigate }) {
  const { t, lang, tf } = useLanguage();
  const { catalog, fetchCatalog, activeCrops, dashboard, fetchDashboard } = useCrop();
  const { profile } = useAuth();

  const [weather, setWeather] = useState(null);
  const [mandi, setMandi] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);

  const district = profile?.district || 'Kurnool';

  useEffect(() => {
    fetchCatalog();
    fetchDashboard();

    // Fetch live external weather & mandi data
    externalService.getWeather(district)
      .then((data) => {
        const list = Array.isArray(data) ? data : [data];
        if (list.length > 0) setWeather(list[0]);
      })
      .catch(console.error);

    externalService.getMarketPrices(district)
      .then((data) => {
        setMandi(Array.isArray(data) ? data : []);
      })
      .catch(console.error);

    // Fetch dynamic alerts
    alertsService.getAlerts()
      .then((data) => {
        setActiveAlerts(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, [district, fetchCatalog, fetchDashboard]);

  const highPriorityAlert = activeAlerts.find(a => a.priority === 'HIGH');
  const cropName = lang === 'hi' ? dashboard?.cropNameHi : lang === 'en' ? dashboard?.cropNameEn : dashboard?.cropNameTe;
  const stageName = lang === 'hi' ? dashboard?.stageNameHi : lang === 'en' ? dashboard?.stageNameEn : dashboard?.stageNameTe;

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Dynamic Urgent Alert Banner */}
      {highPriorityAlert && (
        <div
          onClick={() => onNavigate('alerts')}
          className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 shadow-sm flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bell size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">ముఖ్యమైన హెచ్చరిక</span>
              <p className="text-xs font-bold text-gray-900 line-clamp-1">
                {lang === 'hi' ? highPriorityAlert.titleHi : lang === 'en' ? highPriorityAlert.titleEn : highPriorityAlert.titleTe}
              </p>
            </div>
          </div>
          <ArrowRight size={16} className="text-amber-700 flex-shrink-0 ml-2" />
        </div>
      )}

      {/* Weather & Spray Safety Card */}
      {weather && (
        <div onClick={() => onNavigate('weather')} className="cursor-pointer">
          <WeatherCard weather={weather} />
        </div>
      )}

      {/* Active Crop Journey Widget */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌱</span>
            <h2 className="font-bold text-gray-900 text-sm">ప్రస్తుత పంట (Active Crop)</h2>
          </div>
          <button
            onClick={() => onNavigate('journey')}
            className="text-xs font-bold text-forest-green flex items-center hover:underline"
          >
            <span>పూర్తి వివరాలు &rarr;</span>
          </button>
        </div>

        {dashboard?.hasActiveCrop ? (
          <div className="space-y-3">
            <div
              onClick={() => onNavigate('journey')}
              className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3 rounded-xl cursor-pointer hover:shadow-sm transition"
            >
              <div>
                <span className="text-base font-black text-forest-green">
                  {cropName || 'పత్తి (Cotton)'}
                </span>
                <p className="text-xs text-gray-600 mt-0.5">
                  {dashboard.plotIdentifier || 'Plot 1'} • వయస్సు: <strong>{dashboard.cropAgeDays || 45} రోజులు</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold bg-forest-green text-white px-2.5 py-1 rounded-full inline-block shadow-sm">
                  {stageName || 'పువ్వు పూసే దశ'}
                </span>
                {dashboard.accumulatedGdd && (
                  <div className="text-[10px] text-amber-700 font-bold mt-1">
                    🔥 {dashboard.accumulatedGdd} GDD
                  </div>
                )}
              </div>
            </div>

            {/* Today's Task snippet */}
            {dashboard.todayTaskNameTe && (
              <div className="flex items-start space-x-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="w-4 h-4 rounded-full bg-forest-green text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <span className="font-bold text-gray-800">నేటి ముఖ్యమైన పని: </span>
                  <span className="text-gray-700">
                    {lang === 'hi' ? dashboard.todayTaskNameHi : lang === 'en' ? dashboard.todayTaskNameEn : dashboard.todayTaskNameTe}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-xs text-gray-600 mb-2">మీరు ఇంకా పంట ప్రయాణాన్ని ప్రారంభించలేదు</p>
            <button
              onClick={() => onNavigate('journey')}
              className="px-4 py-2 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow inline-flex items-center space-x-1.5 transition"
            >
              <Plus size={14} />
              <span>కొత్త పంటను నమోదు చేయండి (Add Crop)</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid: 6 Core Practical Farmer Features */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. Problem Solver */}
        <button
          onClick={() => onNavigate('solver')}
          className="bg-rose-50 border border-rose-200 p-3.5 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-2 shadow">
            <AlertCircle size={22} />
          </div>
          <h3 className="font-bold text-rose-950 text-xs">సమస్య పరిష్కారం</h3>
          <p className="text-[10px] text-rose-700 mt-0.5">తెగుళ్ళ నిర్ధారణ & సేంద్రీయ సలహా</p>
        </button>

        {/* 2. Crop Memory */}
        <button
          onClick={() => onNavigate('memory')}
          className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow">
            <History size={22} />
          </div>
          <h3 className="font-bold text-amber-950 text-xs">పంట జ్ఞాపకాలు</h3>
          <p className="text-[10px] text-amber-700 mt-0.5">వర్షం, ఎరువులు, డైరీ రికార్డు</p>
        </button>

        {/* 3. Govt Schemes */}
        <button
          onClick={() => onNavigate('schemes')}
          className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-forest-green text-white flex items-center justify-center mb-2 shadow">
            <ShieldCheck size={22} />
          </div>
          <h3 className="font-bold text-emerald-950 text-xs">ప్రభుత్వ పథకాలు</h3>
          <p className="text-[10px] text-emerald-700 mt-0.5">PM-కిసాన్, బీమా & సబ్సిడీలు</p>
        </button>

        {/* 4. ICAR Knowledge */}
        <button
          onClick={() => onNavigate('knowledge')}
          className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 shadow">
            <BookOpen size={22} />
          </div>
          <h3 className="font-bold text-indigo-950 text-xs">వ్యవసాయ విజ్ఞానం</h3>
          <p className="text-[10px] text-indigo-700 mt-0.5">ICAR శాస్త్రీయ ప్యాకేజ్ ఆఫ్ ప్రాక్టీస్</p>
        </button>

        {/* 5. Mandi Prices */}
        <button
          onClick={() => onNavigate('market')}
          className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 shadow">
            <TrendingUp size={22} />
          </div>
          <h3 className="font-bold text-blue-950 text-xs">మార్కెట్ ధరలు</h3>
          <p className="text-[10px] text-blue-700 mt-0.5">APMC లైవ్ క్వింటాల్ ధరలు</p>
        </button>

        {/* 6. KVK Scientist Escalation */}
        <button
          onClick={() => onNavigate('escalation')}
          className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl text-left hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 shadow">
            <PhoneCall size={22} />
          </div>
          <h3 className="font-bold text-teal-950 text-xs">KVK నిపుణుల సలహా</h3>
          <p className="text-[10px] text-teal-700 mt-0.5">వ్యవసాయ శాస్త్రవేత్తకు టికెట్ పంపండి</p>
        </button>
      </div>

      {/* Top Mandi Prices Preview */}
      {mandi.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
              నేటి మార్కెట్ ధరలు (Agmarknet)
            </h3>
            <button
              onClick={() => onNavigate('market')}
              className="text-[11px] font-bold text-forest-green hover:underline"
            >
              అన్ని ధరలు &rarr;
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {mandi.slice(0, 3).map((item, i) => (
              <div key={item.id || i} className="py-2 flex justify-between items-center text-xs">
                <span className="font-medium text-gray-800">
                  {lang === 'hi' ? item.commodityHi : lang === 'en' ? item.commodityEn : item.commodityTe}
                </span>
                <span className="font-black text-forest-green font-mono">
                  ₹{item.modalPrice} <span className="text-[10px] font-normal text-gray-500">/ క్వింటాల్</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
