import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle, Clock, AlertCircle, Plus, Calendar, Flame, Check, ChevronRight, Layers } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import AudioPlayer from '../components/AudioPlayer';

export default function CropJourneyScreen({ onStartNewCrop, onNavigateToSolver }) {
  const { dashboard, confirmMilestone, fetchDashboard, catalog, fetchCatalog, startCropJourney, loadingDash } = useCrop();
  const { lang, tf, t } = useLanguage();
  const { profile } = useAuth();

  const [completedTasks, setCompletedTasks] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Add Crop Form State
  const [selectedCatalogCropId, setSelectedCatalogCropId] = useState('');
  const [plotName, setPlotName] = useState('Plot A');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [acres, setAcres] = useState(profile?.landAreaAcres || 2.5);
  const [submittingCrop, setSubmittingCrop] = useState(false);
  const [cropError, setCropError] = useState('');

  useEffect(() => {
    fetchDashboard();
    fetchCatalog();
  }, [fetchDashboard, fetchCatalog]);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    if (!selectedCatalogCropId) {
      setCropError('దయచేసి పంటను ఎంపిక చేసుకోండి.');
      return;
    }
    setSubmittingCrop(true);
    setCropError('');
    try {
      const res = await startCropJourney({
        cropId: Number(selectedCatalogCropId),
        plotIdentifier: plotName,
        sowingDate,
        landAreaAcres: Number(acres),
        state: profile?.state || 'Andhra Pradesh',
        district: profile?.district || 'Kurnool',
      });
      if (res.success) {
        setShowAddModal(false);
        await fetchDashboard();
      } else {
        setCropError(res.message || 'పంట నమోదు విఫలమైంది.');
      }
    } catch (err) {
      console.error(err);
      setCropError('లోపం ఏర్పడింది. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setSubmittingCrop(false);
    }
  };

  const cropName = lang === 'hi' ? dashboard?.cropNameHi : lang === 'en' ? dashboard?.cropNameEn : dashboard?.cropNameTe;
  const stageName = lang === 'hi' ? dashboard?.stageNameHi : lang === 'en' ? dashboard?.stageNameEn : dashboard?.stageNameTe;
  const inspectionPrompt = lang === 'en' ? dashboard?.inspectionPromptEn : dashboard?.inspectionPromptTe;

  const allStages = dashboard?.allStages || [];
  const stageTasks = dashboard?.stageTasks || [
    { id: 1, taskNameTe: 'మొక్కల మొదళ్ల వద్ద తేమను పరిశీలించండి', taskCategory: 'IRRIGATION' },
    { id: 2, taskNameTe: 'ఎకరానికి 10 పసుపు/నీలి జిగురు అట్టలు అమర్చండి', taskCategory: 'IPM' },
    { id: 3, taskNameTe: 'సమగ్ర పోషక నిర్వహణ (Foliar spray) చేపట్టండి', taskCategory: 'NUTRITION' },
  ];

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header Profile & GDD Banner */}
      <div className="bg-gradient-to-br from-forest-green to-forest-green-dark text-white rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-green-100">
                {dashboard?.plotIdentifier || 'Plot 1'} • {dashboard?.landAreaAcres || 2.5} ఎకరాలు
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1.5 leading-tight">
              {cropName || 'పత్తి (Cotton)'}
            </h2>
            <p className="text-xs text-green-100 mt-0.5">
              విత్తిన తేదీ: {dashboard?.sowingDate || '15 జూన్ 2026'} • వయస్సు: <strong>{dashboard?.cropAgeDays || 45} రోజులు</strong>
            </p>
          </div>
          <span className="text-4xl">🌿</span>
        </div>

        {/* GDD Heat Units Accumulation Badge */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-between border border-white/15">
          <div className="flex items-center space-x-2">
            <Flame size={20} className="text-amber-300" />
            <div>
              <div className="text-[10px] text-green-200 font-semibold uppercase">ఉష్ణ యూనిట్లు (GDD Engine)</div>
              <div className="text-sm font-black text-white">
                {dashboard?.accumulatedGdd || 780} GDD యూనిట్లు సేకరించబడ్డాయి
              </div>
            </div>
          </div>
          <span className="text-[11px] text-green-200 font-medium">వాతావరణ ఆధారితం</span>
        </div>

        {/* Add Another Crop Quick Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 border border-white/20"
        >
          <Plus size={14} />
          <span>మరొక పంటను నమోదు చేయండి (Add Crop Plot)</span>
        </button>
      </div>

      {/* Lifecycle Stage Stepper */}
      {allStages.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            పంట ఎదుగుదల దశలు (Crop Growth Stages)
          </h3>
          <div className="flex items-center justify-between pt-2">
            {allStages.map((st, idx) => {
              const isCurrent = st.isCurrent;
              const isCompleted = st.isCompleted;

              return (
                <div key={st.id} className="flex-1 flex flex-col items-center relative">
                  {idx > 0 && (
                    <div
                      className={`absolute top-3.5 -left-1/2 w-full h-1 -z-0 ${
                        isCompleted || isCurrent ? 'bg-forest-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black z-10 transition ${
                      isCurrent
                        ? 'bg-amber-400 text-forest-green ring-4 ring-amber-100 shadow'
                        : isCompleted
                        ? 'bg-forest-green text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : st.stageSequence}
                  </div>
                  <span
                    className={`text-[10px] text-center mt-1 font-bold max-w-[60px] truncate ${
                      isCurrent ? 'text-forest-green' : 'text-gray-500'
                    }`}
                  >
                    {lang === 'hi' ? st.stageNameHi : lang === 'en' ? st.stageNameEn : st.stageNameTe}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Biological Stage Inspection Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
              {dashboard?.stageSequence || 3}
            </span>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">ప్రస్తుత దశ</span>
              <h3 className="font-black text-gray-900 text-sm">{stageName || 'పువ్వు పూసే దశ'}</h3>
            </div>
          </div>
          {inspectionPrompt && <AudioPlayer text={inspectionPrompt} lang={lang} />}
        </div>

        {inspectionPrompt && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 leading-relaxed">
            <strong>క్షేత్ర పరిశీలన గమనిక:</strong> {inspectionPrompt}
          </div>
        )}

        <button
          onClick={() => confirmMilestone(dashboard?.farmerCropId || 1, dashboard?.stageCode || 'FLOWERING')}
          className="w-full py-2.5 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
        >
          <CheckCircle size={15} />
          <span>ఈ దశ లక్షణాలు కనిపించాయి (Confirm Stage Milestone)</span>
        </button>
      </div>

      {/* Dynamic Tasks Checklist */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-sm">
            ఈ దశలో సకాలపు పనులు (Dynamic Tasks)
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            {Object.values(completedTasks).filter(Boolean).length}/{stageTasks.length} పూర్తి
          </span>
        </div>

        <div className="space-y-2">
          {stageTasks.map((task) => {
            const isDone = !!completedTasks[task.id];
            const name = lang === 'hi' ? task.taskNameHi : lang === 'en' ? task.taskNameEn : task.taskNameTe;

            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  isDone
                    ? 'bg-emerald-50/80 border-emerald-300 text-gray-500 line-through'
                    : 'bg-white border-gray-200 hover:border-forest-green'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      isDone
                        ? 'bg-forest-green border-forest-green text-white'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    {isDone && <Check size={12} />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800">{name}</span>
                    {task.taskCategory && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-mono">
                        {task.taskCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Problem Diagnostic CTA */}
      {onNavigateToSolver && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-amber-900">పంటలో తెగులు లేదా ఆకుల మార్పు కనిపించిందా?</h4>
            <p className="text-[11px] text-amber-700 mt-0.5">సేంద్రీయ మరియు భద్రతా సూత్రాలతో కూడిన పరిష్కారం పొందండి.</p>
          </div>
          <button
            onClick={onNavigateToSolver}
            className="px-3 py-2 bg-forest-green text-white text-xs font-bold rounded-xl shadow hover:bg-forest-green-light whitespace-nowrap"
          >
            సమస్యను తనిఖీ చేయండి &rarr;
          </button>
        </div>
      )}

      {/* Add New Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in">
            <h3 className="font-black text-gray-900 text-base">కొత్త పంటను నమోదు చేయండి (Add Crop)</h3>

            {cropError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {cropError}
              </div>
            )}

            <form onSubmit={handleCreateCrop} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">పంట ఎంపిక (Select Crop)</label>
                <select
                  value={selectedCatalogCropId}
                  onChange={(e) => setSelectedCatalogCropId(e.target.value)}
                  className="input-field text-xs"
                  required
                >
                  <option value="">-- పంటను ఎంచుకోండి --</option>
                  {catalog.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.commonNameTe} ({c.commonNameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">చేను / ప్లాట్ పేరు (Plot Name)</label>
                <input
                  type="text"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="ఉదా: ఉత్తరం చేను / Plot 1"
                  className="input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">విత్తిన తేదీ (Sowing Date)</label>
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">విస్తీర్ణం (ఎకరాలు)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  రద్దు చేయండి
                </button>
                <button
                  type="submit"
                  disabled={submittingCrop}
                  className="flex-1 py-2.5 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow disabled:opacity-50"
                >
                  {submittingCrop ? 'నమోదు చేస్తోంది...' : 'పంట నమోదు చేయండి'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
