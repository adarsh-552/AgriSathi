import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, PhoneCall, ArrowLeft, CheckCircle, XCircle, Clock, ShieldAlert, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AudioPlayer from '../components/AudioPlayer';
import SafetyWarningModal from '../components/SafetyWarningModal';

export default function DiagnosisResultScreen({ diagnosis, onBack, onEscalateClick, onNavigateToKnowledge }) {
  const { lang, tf } = useLanguage();
  const [showWarningModal, setShowWarningModal] = useState(false);

  if (!diagnosis) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-600 mb-4">విశ్లేషణ వివరాలు లభించలేదు.</p>
        <button onClick={onBack} className="btn-primary">వెనుకకు వెళ్ళండి</button>
      </div>
    );
  }

  const cause = tf(diagnosis, 'suspectedCause') || diagnosis.suspectedCauseTe || diagnosis.suspectedCauseEn;
  const safeSteps = tf(diagnosis, 'safeImmediateSteps') || diagnosis.safeImmediateStepsTe || diagnosis.safeImmediateStepsEn;
  const whatNotToDo = tf(diagnosis, 'whatNotToDo') || diagnosis.whatNotToDoTe || diagnosis.whatNotToDoEn;
  const phiDays = diagnosis.preHarvestIntervalDays ?? diagnosis.phiDays ?? 0;
  const toxicityBand = diagnosis.toxicityBand || 'GREEN';

  const getToxicityBandBadge = () => {
    switch (toxicityBand) {
      case 'BLUE':
        return { label: 'నీలి రంగు త్రిభుజం (Blue Band - Moderately Toxic)', bg: 'bg-blue-100 text-blue-900 border-blue-300', dot: 'bg-blue-600' };
      case 'YELLOW':
        return { label: 'పసుపు త్రిభుజం (Yellow Band - Highly Toxic)', bg: 'bg-amber-100 text-amber-900 border-amber-300', dot: 'bg-amber-600' };
      case 'RED':
        return { label: 'ఎరుపు త్రిభుజం (Red Band - Extremely Toxic)', bg: 'bg-red-100 text-red-900 border-red-300', dot: 'bg-red-600' };
      default:
        return { label: 'ఆకుపచ్చ త్రిభుజం (Green Band - Slightly Toxic / Eco-Safe)', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', dot: 'bg-emerald-600' };
    }
  };

  const bandInfo = getToxicityBandBadge();

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Back button */}
      <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-xs">
        <ArrowLeft size={16} />
        <span>మళ్ళీ పరిశీలించండి (Back to Solver)</span>
      </button>

      {/* Suspected Cause Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-2.5">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            సమస్య కారణం (Suspected Cause)
          </span>
          <AudioPlayer text={`${cause}. ${safeSteps}`} lang={lang} />
        </div>

        <h3 className="text-lg font-black text-gray-900 leading-snug">{cause}</h3>
        {diagnosis.differentialEvidence && (
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <strong>విశ్లేషణ ఆధారం:</strong> {diagnosis.differentialEvidence}
          </p>
        )}

        {/* Confidence Level Badge */}
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-[11px] font-semibold text-gray-500">విశ్వసనీయత రేటింగ్:</span>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            diagnosis.confidenceLevel === 'HIGH'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {diagnosis.confidenceLevel}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">(CIBRC/ICAR సూత్రాల ప్రకారం)</span>
        </div>
      </div>

      {/* Recommended Non-Chemical Immediate Actions */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-forest-green font-bold text-sm">
          <CheckCircle size={18} />
          <h4>వెంటనే చేయవలసిన సురక్షిత చర్యలు (Safe Immediate Steps)</h4>
        </div>
        <div className="text-xs text-emerald-950 leading-relaxed font-medium whitespace-pre-line">
          {safeSteps}
        </div>
      </div>

      {/* What NOT to Do Card */}
      <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 space-y-2">
        <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
          <XCircle size={18} />
          <h4>చేయకూడని పనులు (What NOT to Do)</h4>
        </div>
        <div className="text-xs text-rose-950 leading-relaxed font-medium whitespace-pre-line">
          {whatNotToDo}
        </div>
      </div>

      {/* Chemical Threshold & Safety Gate Notice */}
      {diagnosis.chemicalRecommended && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 space-y-3">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <ShieldAlert size={18} className="text-amber-600" />
            <span>రసాయన పిచికారీ భద్రతా నియమాలు (CIBRC Safety Gate)</span>
          </div>

          {diagnosis.chemicalActiveIngredient && (
            <div className="text-xs text-amber-950">
              <span className="font-bold">సిఫార్సు చేసిన మందు (Active Ingredient): </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 font-bold text-gray-800">
                {diagnosis.chemicalActiveIngredient}
              </span>
            </div>
          )}

          {/* CIBRC Toxicity Band */}
          <div className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-bold ${bandInfo.bg}`}>
            <span className={`w-3 h-3 rounded-full ${bandInfo.dot}`} />
            <span>{bandInfo.label}</span>
          </div>

          {/* Pre-Harvest Interval (PHI) */}
          {phiDays > 0 && (
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-900 bg-white p-2.5 rounded-xl border border-amber-200">
              <Clock size={16} className="text-amber-600 flex-shrink-0" />
              <span>
                <strong>కోత నిరీక్షణ కాలం (PHI):</strong> మందు పిచికారీ చేసిన తర్వాత <strong>{phiDays} రోజుల</strong> వరకు పంట కోయరాదు.
              </span>
            </div>
          )}

          <button
            onClick={() => setShowWarningModal(true)}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center space-x-2 transition"
          >
            <AlertTriangle size={15} />
            <span>భద్రతా సాధనాలు (PPE) & పిచికారీ జాగ్రత్తలు</span>
          </button>
        </div>
      )}

      {/* Action Buttons: KVK Escalation & Knowledge Link */}
      <div className="space-y-2">
        <button
          onClick={() => onEscalateClick && onEscalateClick(cause)}
          className="w-full py-3 bg-forest-green hover:bg-forest-green-light text-white text-xs font-bold rounded-xl shadow flex items-center justify-center space-x-2 transition"
        >
          <PhoneCall size={16} />
          <span>KVK / వ్యవసాయ శాస్త్రవేత్తకు బదిలీ చేయండి (Escalate to KVK)</span>
        </button>

        {onNavigateToKnowledge && (
          <button
            onClick={onNavigateToKnowledge}
            className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <BookOpen size={16} className="text-forest-green" />
            <span>ICAR శాస్త్రీయ మార్గదర్శకాలను చదవండి</span>
          </button>
        )}
      </div>

      {/* Safety Modal */}
      <SafetyWarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="రసాయన వాడకంపై అత్యవసర భద్రతా సూచనలు"
        message="సేంద్రీయ పద్ధతులు పనిచేయనప్పుడు మాత్రమే శాస్త్రవేత్త అనుమతితో నియమిత మోతాదు వాడండి."
        toxicityBand={toxicityBand}
        phiDays={phiDays}
        mandatoryPPE={true}
      />
    </div>
  );
}
