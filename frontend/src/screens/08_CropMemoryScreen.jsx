import React, { useEffect, useState } from 'react';
import { History, CloudRain, Shield, Sparkles, Plus, Clock } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { useLanguage } from '../context/LanguageContext';

export default function CropMemoryScreen() {
  const { timeline, fetchTimeline, logEvent, dashboard } = useCrop();
  const { lang, t } = useLanguage();
  const [showLogModal, setShowLogModal] = useState(false);
  const [eventType, setEventType] = useState('RAIN');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  const cropId = dashboard?.farmerCrop?.id || 1;

  useEffect(() => {
    fetchTimeline(cropId);
  }, [cropId]);

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await logEvent(cropId, {
      eventType,
      cropAgeDays: dashboard?.cropAgeDays || 45,
      title,
      notes,
      loggedBy: 'FARMER',
    });

    setTitle('');
    setNotes('');
    setShowLogModal(false);
  };

  const dummyEvents = [
    {
      eventType: 'RAIN',
      cropAgeDays: 42,
      title: 'భారీ వర్షపాతం నమోదైంది (Heavy Rain)',
      notes: 'రెండు రోజుల పాటు నిరంతర వర్షం, పొలంలో నీరు నిలిచింది.',
      eventTimestamp: '2026-08-20T10:00:00',
    },
    {
      eventType: 'FERTILIZER',
      cropAgeDays: 30,
      title: 'యూరియా మరియు DAP వేయడం జరిగింది',
      notes: 'ఎకరానికి 1 బస్తా యూరియా చల్లడం జరిగింది.',
      eventTimestamp: '2026-08-08T09:30:00',
    },
    {
      eventType: 'SOWING',
      cropAgeDays: 1,
      title: 'పత్తి విత్తనాలు నాటడం జరిగింది (Sowing)',
      notes: 'తొలకరి వర్షాల తర్వాత నాటడం ప్రారంభించాము.',
      eventTimestamp: '2026-07-10T08:00:00',
    },
  ];

  const displayList = timeline && timeline.length > 0 ? timeline : dummyEvents;

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-gray-900">పంట జ్ఞాపకాలు (Crop Memory)</h2>
          <p className="text-xs text-gray-500">మీ పొలం యొక్క కాలక్రమానుసార జ్ఞాపకాల పుస్తకం</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="px-3 py-2 bg-forest-green text-white text-xs font-bold rounded-xl shadow flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>ఘటన జోడించండి</span>
        </button>
      </div>

      {/* Memory Value Proposition Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start space-x-2.5">
        <Sparkles size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          ఈ జ్ఞాపకాలు భద్రపరచబడి, భవిష్యత్తులో ఏదైనా తెగులు వచ్చినప్పుడు కారణాన్ని సరిగ్గా విశ్లేషించడానికి ఉపయోగపడతాయి.
        </p>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
        {displayList.map((item, idx) => (
          <div key={idx} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-forest-green border-4 border-white shadow flex items-center justify-center text-white text-[10px]">
              {item.eventType === 'RAIN' ? '🌧' : item.eventType === 'FERTILIZER' ? '🧪' : '🌱'}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-forest-green">
                  {item.cropAgeDays ? `${item.cropAgeDays}వ రోజు` : 'ఇటీవల'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {item.eventTimestamp?.split('T')[0] || '2026-08-20'}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
              {item.notes && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">పంట ఘటనను నమోదు చేయండి</h3>
            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">రకం (Event Type)</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-field bg-white"
                >
                  <option value="RAIN">వర్షపాతం (Rain / Waterlogging)</option>
                  <option value="FERTILIZER">ఎరువుల వేత (Fertilizer)</option>
                  <option value="SPRAY">పిచికారీ (Spray)</option>
                  <option value="IRRIGATION">నీరు పారించడం (Irrigation)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">శీర్షిక (Title)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ఉదా: 2 గంటల పాటు భారీ వర్షం"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">వివరాలు (Notes)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="అదనపు వివరాలు..."
                  className="input-field h-20"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-600"
                >
                  రద్దు చేయండి
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-forest-green text-white font-bold text-xs rounded-xl shadow"
                >
                  భద్రపరచండి
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
