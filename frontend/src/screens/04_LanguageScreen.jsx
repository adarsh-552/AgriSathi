import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageScreen({ onLanguageSelected }) {
  const { lang, changeLanguage, supportedLanguages } = useLanguage();

  const handleSelect = (code) => {
    changeLanguage(code);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
      <div>
        <div className="pt-6 mb-6">
          <span className="text-xs font-bold text-forest-green tracking-wider uppercase">
            దశ 1 / 2 (Step 1/2)
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">మీ భాషను ఎంచుకోండి</h2>
          <p className="text-xs text-gray-500 mt-1">Select your preferred language for all advisories & audio</p>
        </div>

        <div className="space-y-3">
          {supportedLanguages.map((l) => {
            const isSelected = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-forest-green bg-green-50/60 shadow-md'
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <span className="text-2xl">{l.flag}</span>
                  <div>
                    <span className="text-lg font-bold text-gray-900 block">{l.label}</span>
                    <span className="text-xs text-gray-500">{l.nativeName}</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-forest-green text-white flex items-center justify-center">
                    <Check size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Note on 28 states & 8 UTs readiness: Requirement 2 */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900">
          🇮🇳 <strong>భారతీయ భాషల విస్తరణ:</strong> ప్రస్తుతం తెలుగు, హిందీ, ఇంగ్లీష్ అందుబాటులో ఉన్నాయి. త్వరలో మిగిలిన అన్ని రాష్ట్రాల భాషలు అందుబాటులోకి వస్తాయి.
        </div>
      </div>

      <div className="pb-4">
        <button
          onClick={onLanguageSelected}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <span>కొనసాగించండి (Continue)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
