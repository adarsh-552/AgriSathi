import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle, Clock, AlertCircle, Plus, Calendar } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { useLanguage } from '../context/LanguageContext';
import AudioPlayer from '../components/AudioPlayer';

export default function CropJourneyScreen({ onStartNewCrop }) {
  const { dashboard, confirmMilestone, loadingDash } = useCrop();
  const { lang, tf, t } = useLanguage();
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const currentStage = dashboard?.currentStage || {
    nameTe: 'పువ్వు పూసే దశ (Flowering Stage)',
    stageSequence: 3,
    inspectionPromptTe: 'ప్రతి మొక్కకు 4-5 పూత మొగ్గలు ఏర్పడ్డాయో లేదో గమనించండి. రసం పీల్చే పురుగుల ప్రభావం చూడండి.',
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Header Profile */}
      <div className="bg-forest-green text-white rounded-2xl p-4 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-green-200 uppercase font-semibold">ప్రస్తుత పంట చక్రం</span>
            <h2 className="text-xl font-black mt-0.5">
              {dashboard ? tf(dashboard.crop, 'name') : 'పత్తి (Cotton)'}
            </h2>
            <p className="text-xs text-green-100 mt-1">
              విత్తిన తేదీ: {dashboard?.farmerCrop?.sowingDate || '15 జూన్ 2026'} • వయస్సు: {dashboard?.cropAgeDays || 45} రోజులు
            </p>
          </div>
          <span className="text-3xl">🌿</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-green-200 mb-1">
            <span>దశ 3 / 6</span>
            <span>మొత్తం వ్యవధి: 160 రోజులు</span>
          </div>
          <div className="w-full bg-forest-green-dark h-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>

      {/* Biological Stage Inspection Card */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-gray-900 text-sm">{currentStage.nameTe}</h3>
          </div>
          <AudioPlayer text={currentStage.inspectionPromptTe || ''} lang={lang} />
        </div>

        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-950 leading-relaxed mb-3">
          <strong>పరిశీలన గమనిక:</strong> {currentStage.inspectionPromptTe}
        </div>

        <button
          onClick={() => confirmMilestone(dashboard?.farmerCrop?.id || 1, 'FLOWERING_START')}
          className="w-full py-2.5 bg-forest-green text-white font-bold text-xs rounded-xl shadow hover:bg-forest-green-light transition flex items-center justify-center space-x-2"
        >
          <CheckCircle size={16} />
          <span>ఈ దశ పూర్తయినట్లు ధ్రువీకరించండి (Confirm Stage)</span>
        </button>
      </div>

      {/* Dynamic Daily Tasks Checklist */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm mb-3">
          ఈ వారం పనులు (Dynamic Tasks Checklist)
        </h3>

        <div className="space-y-2.5">
          {[
            { id: 1, title: 'మొక్కల మధ్య తేమను పరిశీలించండి (Moisture check)', category: 'నీటి యాజమాన్యం' },
            { id: 2, title: 'ఎకరానికి 5 పసుపు/నీలి రంగు జిగురు అట్టలు అమర్చండి', category: 'సమగ్ర సస్యరక్షణ' },
            { id: 3, title: '19-19-19 పోషక ద్రావణం పిచికారీ చేయండి', category: 'పోషకాలు' },
          ].map((task) => {
            const isDone = !!completedTasks[task.id];
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  isDone
                    ? 'bg-green-50 border-green-200 text-gray-500 line-through'
                    : 'bg-white border-gray-200 hover:border-forest-green'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center text-white ${
                      isDone ? 'bg-forest-green border-forest-green' : 'border-gray-300'
                    }`}
                  >
                    {isDone && <CheckCircle size={14} />}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">{task.title}</span>
                    <span className="text-[10px] text-gray-400">{task.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
