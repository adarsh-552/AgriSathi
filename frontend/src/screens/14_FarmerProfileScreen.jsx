import React from 'react';
import { ArrowLeft, User, MapPin, Globe, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerProfileScreen({ onBack, onChangeLangClick }) {
  const { user, profile, logout } = useAuth();
  const { currentLanguage } = useLanguage();

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">రైతు ప్రొఫైల్ (Profile)</h2>
          <p className="text-xs text-gray-500">వ్యక్తిగత మరియు ప్రాంత సమాచారం</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-forest-green text-white flex items-center justify-center text-3xl shadow">
          👨‍🌾
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            {profile?.fullName || 'రైతు సోదరుడు (Farmer)'}
          </h3>
          <p className="text-xs text-gray-500 font-mono">{user?.identifier || '9876543210'}</p>
          <span className="inline-block mt-1 bg-green-100 text-forest-green font-bold text-[10px] px-2 py-0.5 rounded-full">
            ధ్రువీకరించబడిన రైతు
          </span>
        </div>
      </div>

      {/* Settings list */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 divide-y divide-gray-100 text-xs">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-gray-700">
            <Globe size={18} className="text-forest-green" />
            <span className="font-semibold">ఎంచుకున్న భాష</span>
          </div>
          <button
            onClick={onChangeLangClick}
            className="text-forest-green font-bold hover:underline"
          >
            {currentLanguage?.label} (మార్చండి)
          </button>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-gray-700">
            <MapPin size={18} className="text-forest-green" />
            <span className="font-semibold">ప్రాంతం (District)</span>
          </div>
          <span className="font-medium text-gray-800">
            {profile?.district || 'కర్నూలు'}, {profile?.state || 'ఆంధ్రప్రదేశ్'}
          </span>
        </div>

        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 text-gray-700">
            <Shield size={18} className="text-forest-green" />
            <span className="font-semibold">గోప్యత & భద్రత</span>
          </div>
          <span className="text-emerald-700 font-medium">సురక్షితం</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center space-x-2"
      >
        <LogOut size={16} />
        <span>లాగ్ అవుట్ (Sign Out)</span>
      </button>
    </div>
  );
}
