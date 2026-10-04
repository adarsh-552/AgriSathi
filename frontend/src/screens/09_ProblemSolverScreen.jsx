import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, ArrowRight, Check, Droplets } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { diagnosticService } from '../services/diagnosticService';

export default function ProblemSolverScreen({ onDiagnosed, onEscalateClick }) {
  const { dashboard } = useCrop();
  const [symptomCategory, setSymptomCategory] = useState('LEAF_YELLOWING');
  const [symptomLocation, setSymptomLocation] = useState('LOWER_OLD_LEAVES');
  const [soilWaterlogged, setSoilWaterlogged] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const cropId = dashboard?.farmerCropId || dashboard?.farmerCrop?.id || 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await diagnosticService.evaluateProblem(cropId, {
        symptomCategory,
        symptomLocation,
        soilWaterlogged,
        description: description || 'పంట ఆకులపై లక్షణాలు గమనించబడ్డాయి',
      });
      onDiagnosed(result);
    } catch (err) {
      console.error(err);
      alert('సమస్య విశ్లేషణ విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'LEAF_YELLOWING', label: 'ఆకులు పసుపు పారడం (Yellowing)', desc: 'నత్రజని / జింక్ లోపం లేదా వైరస్', icon: '🍂' },
    { id: 'SUCKING_PEST', label: 'రసం పీల్చే పురుగులు (Sucking Pests)', desc: 'తామర, తెల్లదోమ, పేనుబంక, ఆకు ముడుత', icon: '🐛' },
    { id: 'WILTING', label: 'మొక్క వడలిపోవడం (Wilting)', desc: 'వేరుకుళ్లు లేదా శిలీంధ్ర దాడి', icon: '🥀' },
    { id: 'BOLL_DAMAGE', label: 'కాయ తొలుచు పురుగు (Bollworm)', desc: 'గులాబీ రంగు పురుగు, పూత/కాయ రాలడం', icon: '🌰' },
    { id: 'LEAF_SPOT', label: 'ఆకుమచ్చ తెగులు (Leaf Spot/Blight)', desc: 'ఆకులపై గోధుమ/నలుపు వలయాల మచ్చలు', icon: '🟤' },
  ];

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-gray-900">సమస్య పరిష్కారి (Diagnostic Safety Gate)</h2>
        <p className="text-xs text-gray-500">
          లక్షణాలు చెప్పండి. పంట జ్ఞాపకాల ఆధారంగా సురక్షిత IPM పరిష్కారం పొందండి.
        </p>
      </div>

      {/* Safety Gate Guarantee Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start space-x-3">
        <ShieldAlert size={20} className="text-forest-green flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 leading-relaxed">
          <strong>భద్రతా హామీ (Safety Gate):</strong> మేము నేరుగా ఖరీదైన విష రసాయనాలను సిఫార్సు చేయము. మొదట సేంద్రీయ, నిర్వహణ పద్ధతులు (IPM) మరియు CIBRC నిబంధనల ప్రకారమే సూచనలు ఇస్తాము.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Category */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
            1. సమస్య ప్రధాన లక్షణం ఏమిటి? (Symptom Category)
          </label>
          <div className="space-y-2">
            {categories.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setSymptomCategory(opt.id)}
                className={`w-full p-3 rounded-xl border text-left flex items-start space-x-3 transition ${
                  symptomCategory === opt.id
                    ? 'border-forest-green bg-emerald-50/50 shadow-sm font-bold text-forest-green'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mt-0.5">{opt.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-900">{opt.label}</div>
                  <div className="text-[11px] text-gray-500 font-normal">{opt.desc}</div>
                </div>
                {symptomCategory === opt.id && (
                  <Check size={16} className="text-forest-green mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Affected Plant Part */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
            2. మొక్కలో ఏ భాగంలో కనిపిస్తోంది? (Location)
          </label>
          <div className="space-y-2">
            {[
              { id: 'LOWER_OLD_LEAVES', label: 'క్రింది పాత ఆకుల్లో మాత్రమే (దిగువ భాగం)' },
              { id: 'UPPER_NEW_LEAVES', label: 'కొత్తగా వచ్చిన పై చిగురు ఆకుల్లో' },
              { id: 'WHOLE_PLANT', label: 'మొత్తం మొక్క అంతటా లేదా కాండం/కాయలపై' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  symptomLocation === opt.id
                    ? 'border-forest-green bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xs font-medium text-gray-800">{opt.label}</span>
                <input
                  type="radio"
                  name="symptomLocation"
                  value={opt.id}
                  checked={symptomLocation === opt.id}
                  onChange={() => setSymptomLocation(opt.id)}
                  className="accent-forest-green"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Soil Moisture / Waterlogging */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soilWaterlogged}
              onChange={(e) => setSoilWaterlogged(e.target.checked)}
              className="w-4 h-4 rounded text-forest-green accent-forest-green"
            />
            <div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <Droplets size={14} className="text-blue-500" />
                <span>పొలంలో నీరు నిలిచి ఉందా? లేదా ఇటీవల భారీ వర్షం పడిందా?</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                నీటి నిల్వ వల్ల వేర్లు ఊపిరాడక పసుపు రంగులోకి మారే అవకాశం ఉంది.
              </p>
            </div>
          </label>
        </div>

        {/* Optional photo / description note */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            3. అదనపు వివరాలు (ఐచ్ఛికం)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ఎన్ని రోజులుగా ఈ సమస్య ఉంది? పురుగులు లేదా మచ్చలు ఏవైనా ప్రత్యేకంగా కనిపించాయా..."
            className="input-field h-20 text-xs"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2 transition disabled:opacity-50"
        >
          <span>{loading ? 'విశ్లేషిస్తోంది...' : 'సురక్షిత పరిష్కారాన్ని చూడండి (Analyze Problem)'}</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
