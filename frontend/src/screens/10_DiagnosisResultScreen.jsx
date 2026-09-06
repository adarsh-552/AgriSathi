import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, PhoneCall, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AudioPlayer from '../components/AudioPlayer';
import SafetyWarningModal from '../components/SafetyWarningModal';

export default function DiagnosisResultScreen({ diagnosis, onBack, onEscalateClick }) {
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

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Back button */}
      <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900 flex items-center space-x-1 text-xs">
        <ArrowLeft size={16} />
        <span>మళ్ళీ పరిశీలించండి</span>
      </button>

      {/* Suspected Cause Card */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            సమస్య కారణం (Suspected Cause)
          </span>
          <AudioPlayer text={`${cause}. ${safeSteps}`} lang={lang} />
        </div>

        <h3 className="text-lg font-black text-gray-900 mb-1">{cause}</h3>
        <p className="text-xs text-gray-600 leading-relaxed">{diagnosis.differentialEvidence}</p>

        {/* Confidence Level Badge: Requirement 1 */}
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-[11px] font-semibold text-gray-500">విశ్వసనీయత రేటింగ్:</span>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
            {diagnosis.confidenceLevel}
          </span>
          <span className="text-[10px] text-gray-400">(100% వ్యాధి ఖరారు క్షేత్ర పరిశీలనకే చెందుతుంది)</span>
        </div>
      </div>

      {/* Recommended Non-Chemical Immediate Actions */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center space-x-2 text-forest-green font-bold text-sm mb-2">
          <CheckCircle size={18} />
          <h4>వెంటనే చేయవలసిన సురక్షిత చర్యలు (Safe Immediate Steps)</h4>
        </div>
        <p className="text-xs text-emerald-950 leading-relaxed font-medium">
          {safeSteps}
        </p>
      </div>

      {/* What NOT to Do Card */}
      <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4">
        <div className="flex items-center space-x-2 text-safety-red font-bold text-sm mb-2">
          <XCircle size={18} />
          <h4>చేయకూడని పనులు (What NOT to Do)</h4>
        </div>
        <p className="text-xs text-rose-950 leading-relaxed font-medium">
          {whatNotToDo}
        </p>
      </div>

      {/* Safety Gate Warning Button if chemical indicated */}
      {diagnosis.chemicalRecommended && (
        <button
          onClick={() => setShowWarningModal(true)}
          className="w-full py-3 bg-safety-red text-white text-xs font-bold rounded-xl shadow flex items-center justify-center space-x-2 animate-pulse"
        >
          <AlertTriangle size={16} />
          <span>రసాయన పిచికారీ భద్రతా హెచ్చరికలను చదవండి</span>
        </button>
      )}

      {/* Escalation Option: Requirement 1 & 7 */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 text-center space-y-2">
        <p className="text-xs text-gray-600">
          సమస్య ఇంకా అస్పష్టంగా ఉందా లేదా తగ్గలేదా?
        </p>
        <button
          onClick={onEscalateClick}
          className="w-full py-2.5 bg-forest-green text-white text-xs font-bold rounded-xl shadow flex items-center justify-center space-x-2 hover:bg-forest-green-light transition"
        >
          <PhoneCall size={16} />
          <span>KVK / వ్యవసాయ శాస్త్రవేత్తకు బదిలీ చేయండి (Escalate to KVK)</span>
        </button>
      </div>

      {/* Safety Modal */}
      <SafetyWarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="రసాయన వాడకంపై అత్యవసర భద్రతా సూచనలు"
        message="సేంద్రీయ పద్ధతులు పనిచేయనప్పుడు మాత్రమే శాస్త్రవేత్త అనుమతితో నియమిత మోతాదు వాడండి."
        toxicityBand={diagnosis.toxicityBand}
        phiDays={diagnosis.phiDays}
        mandatoryPPE={true}
      />
    </div>
  );
}
