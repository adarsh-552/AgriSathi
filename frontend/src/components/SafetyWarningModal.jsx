import React from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SafetyWarningModal({ isOpen, onClose, title, message, toxicityBand, phiDays, mandatoryPPE }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border-2 border-safety-red">
        {/* Header */}
        <div className="bg-safety-red text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert size={24} className="animate-bounce" />
            <h3 className="font-bold text-base">{title || t('safety_warning') || 'భద్రతా హెచ్చరిక'}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-red-700 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-gray-700">
          <div className="flex items-start space-x-3 bg-red-50 p-3 rounded-xl border border-red-100">
            <AlertTriangle size={24} className="text-safety-red flex-shrink-0 mt-0.5" />
            <p className="font-medium text-red-900 leading-relaxed">{message}</p>
          </div>

          {/* CIBRC Safety Metrics if chemical mentioned */}
          {(toxicityBand || phiDays) && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <span className="text-gray-500 block">విష తీవ్రత (Toxicity)</span>
                <span className="font-bold text-safety-red">{toxicityBand || 'YELLOW LABEL'}</span>
              </div>
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <span className="text-gray-500 block">వేచియుండవలసిన రోజులు (PHI)</span>
                <span className="font-bold text-gray-800">{phiDays || '14'} రోజులు</span>
              </div>
            </div>
          )}

          {mandatoryPPE && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
              <strong>తప్పనిసరి రక్షణ (PPE):</strong> మాస్క్, రబ్బరు చేతి తొడుగులు, పూర్తి దుస్తులు తప్పనిసరి.
            </div>
          )}

          <div className="text-[11px] text-gray-500 italic text-center">
            ICAR-NCIPM భద్రతా ప్రమాణాల ప్రకారం సూచించబడింది.
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-safety-red hover:bg-red-700 text-white font-bold rounded-xl shadow transition"
          >
            నేను అర్థం చేసుకున్నాను (I Understand)
          </button>
        </div>
      </div>
    </div>
  );
}
