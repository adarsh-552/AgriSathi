import React from 'react';
import { Home, Sprout, AlertCircle, CloudSun, TrendingUp, History } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav({ activeTab, onSelectTab }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('nav_home') || 'హోమ్', icon: Home },
    { id: 'journey', label: t('nav_journey') || 'పంట ప్రయాణం', icon: Sprout },
    { id: 'solver', label: t('nav_problems') || 'సమస్య పరిష్కారం', icon: AlertCircle },
    { id: 'memory', label: t('nav_memory') || 'జ్ఞాపకాలు', icon: History },
    { id: 'weather', label: t('nav_weather') || 'వాతావరణం', icon: CloudSun },
    { id: 'market', label: t('nav_market') || 'ధరలు', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-bottom-nav z-40">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive
                  ? 'text-forest-green font-bold scale-105'
                  : 'text-gray-500 hover:text-forest-green'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] mt-1 truncate max-w-[64px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
