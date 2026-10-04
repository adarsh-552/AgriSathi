import React, { useEffect, useState } from 'react';
import { History, CloudRain, Shield, Sparkles, Plus, Clock, Calendar, Droplets, CheckCircle } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { useLanguage } from '../context/LanguageContext';

export default function CropMemoryScreen() {
  const { timeline, fetchTimeline, logEvent, dashboard } = useCrop();
  const { lang } = useLanguage();
  const [showLogModal, setShowLogModal] = useState(false);
  const [eventType, setEventType] = useState('RAIN');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const cropId = dashboard?.farmerCropId || dashboard?.farmerCrop?.id || 1;

  useEffect(() => {
    fetchTimeline(cropId);
  }, [cropId]);

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await logEvent(cropId, {
        eventType,
        cropAgeDays: dashboard?.cropAgeDays || 1,
        title,
        notes,
        loggedBy: 'FARMER',
      });

      setTitle('');
      setNotes('');
      setShowLogModal(false);
    } catch (err) {
      console.error(err);
      alert('ఈవెంట్ నమోదు కాలేదు. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLog = async (type, quickTitle, quickNotes) => {
    try {
      await logEvent(cropId, {
        eventType: type,
        cropAgeDays: dashboard?.cropAgeDays || 1,
        title: quickTitle,
        notes: quickNotes,
        loggedBy: 'FARMER',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'RAIN':
      case 'WATERLOGGING':
        return '🌧️';
      case 'FERTILIZER':
        return '🧪';
      case 'PESTICIDE':
      case 'SPRAY':
        return '🛡️';
      case 'WEEDING':
      case 'IRRIGATION':
        return '💧';
      case 'SYMPTOM_REPORTED':
        return '⚠️';
      case 'SOWING':
        return '🌱';
      default:
        return '📝';
    }
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-gray-900">పంట జ్ఞాపకాలు (Crop Memory Ledger)</h2>
          <p className="text-xs text-gray-500">మీ పొలం యొక్క కాలక్రమానుసార డైరీ & ఆధారాలు</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="px-3 py-2 bg-forest-green hover:bg-forest-green-light text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1 transition"
        >
          <Plus size={14} />
          <span>ఘటన జోడించండి</span>
        </button>
      </div>

      {/* Memory Value Proposition Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start space-x-2.5 shadow-sm">
        <Sparkles size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>సహజ నిర్ధారణ వ్యవస్థ:</strong> మీరు ఇక్కడ నమోదు చేసే వర్షపాతం, ఎరువులు, మరియు పిచికారీ వివరాలను భద్రపరిచి, భవిష్యత్తులో తెగుళ్లు వచ్చినప్పుడు కచ్చితమైన కారణాన్ని నిర్ధారించడానికి ఈ డేటా ఉపయోగపడుతుంది.
        </p>
      </div>

      {/* Quick Log Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">త్వరిత నమోదు (Quick Log)</span>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleQuickLog('RAIN', 'భారీ వర్షపాతం (Heavy Rainfall)', 'పొలంలో నీరు చేరింది, నేల తడిగా ఉంది.')}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 hover:border-forest-green whitespace-nowrap shadow-sm"
          >
            🌧️ వర్షపాతం నమోదైంది
          </button>
          <button
            onClick={() => handleQuickLog('FERTILIZER', 'పైపాటు ఎరువులు వేశాము (Fertilizer)', 'యూరియా / పొటాష్ సమతుల్యంగా అందించాము.')}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 hover:border-forest-green whitespace-nowrap shadow-sm"
          >
            🧪 ఎరువులు వేశాము
          </button>
          <button
            onClick={() => handleQuickLog('SPRAY', 'వేప నూనె పిచికారీ (Neem Spray)', 'రసం పీల్చే పురుగుల నివారణకు వేప నూనె 1500ppm పిచికారీ చేసాము.')}
            className="bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 hover:border-forest-green whitespace-nowrap shadow-sm"
          >
            🌿 సేంద్రీయ పిచికారీ
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      {timeline && timeline.length > 0 ? (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
          {timeline.map((item, idx) => (
            <div key={item.id || idx} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-forest-green shadow flex items-center justify-center text-xs">
                {getEventIcon(item.eventType)}
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-1 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-forest-green">
                    {item.cropAgeDays ? `పంట ${item.cropAgeDays}వ రోజు` : 'పంట దశ'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {item.eventTimestamp ? new Date(item.eventTimestamp).toLocaleDateString() : ''}
                  </span>
                </div>

                <h4 className="font-bold text-gray-900 text-sm leading-snug">{item.title}</h4>
                {item.notes && <p className="text-xs text-gray-600 leading-relaxed">{item.notes}</p>}

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-mono uppercase">{item.eventType}</span>
                  <span>నమోదు: {item.loggedBy || 'రైతు'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 space-y-3">
          <History size={40} className="mx-auto text-gray-400" />
          <div>
            <h3 className="text-sm font-bold text-gray-800">పంట జ్ఞాపకాలు ఇంకా ఖాళీగా ఉన్నాయి</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              మీ పంట విత్తిన రోజు, వర్షాలు, ఎరువులు లేదా పురుగుమందుల వాడకాన్ని నమోదు చేయండి.
            </p>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 bg-forest-green text-white text-xs font-bold rounded-xl shadow inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>మొదటి జ్ఞాపకాన్ని నమోదు చేయండి</span>
          </button>
        </div>
      )}

      {/* Add Event Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in">
            <h3 className="font-black text-gray-900 text-base">పంట ఘటనను నమోదు చేయండి</h3>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">ఘటన రకం (Event Type)</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="RAIN">🌧️ వర్షపాతం / తేమ (Rainfall / Moisture)</option>
                  <option value="FERTILIZER">🧪 ఎరువులు వేయడం (Fertilizer Application)</option>
                  <option value="SPRAY">🛡️ సస్యరక్షణ పిచికారీ (Spray Application)</option>
                  <option value="WEEDING">🌾 కలుపు తీత / అంతరకృషి (Weeding)</option>
                  <option value="IRRIGATION">💧 నీటి తడి (Irrigation)</option>
                  <option value="OTHER">📝 ఇతర చర్య (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">శీర్షిక (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ఉదా: 1 బస్తా యూరియా వేయడం జరిగింది"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">గమనికలు (Notes)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ఎకరానికి ఎంత మోతాదు? వాతావరణం ఎలా ఉంది?..."
                  className="input-field h-20 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  రద్దు చేయండి
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow disabled:opacity-50"
                >
                  {submitting ? 'భద్రపరుస్తోంది...' : 'భద్రపరచండి (Save)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
