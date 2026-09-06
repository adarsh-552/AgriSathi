import React from 'react';
import { Globe, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function HeaderBar({ title, onLanguageClick, onProfileClick }) {
  const { lang, supportedLanguages } = useLanguage();
  const { user, isAdmin } = useAuth();

  const currentLangObj = supportedLanguages.find((l) => l.code === lang);

  return (
    <header className="bg-forest-green text-white px-4 py-3 sticky top-0 z-30 shadow-md flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-forest-green font-extrabold text-lg shadow-inner">
          🌱
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight tracking-wide">
            {title || 'AgriSathi'}
          </h1>
          <p className="text-[11px] text-green-200 leading-none">రైతు నేస్తం • कृषि साथी</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Language selector button */}
        <button
          onClick={onLanguageClick}
          className="flex items-center space-x-1 bg-forest-green-dark hover:bg-forest-green-light px-2.5 py-1 rounded-full text-xs font-medium border border-green-600 transition"
        >
          <Globe size={13} />
          <span>{currentLangObj ? currentLangObj.label : 'తెలుగు'}</span>
        </button>

        {/* Profile / Admin indicator */}
        <button
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-forest-green-dark border border-green-600 flex items-center justify-center hover:bg-forest-green-light transition"
          title={user?.identifier || 'Profile'}
        >
          {isAdmin ? <ShieldCheck size={16} className="text-amber-400" /> : <User size={16} />}
        </button>
      </div>
    </header>
  );
}
