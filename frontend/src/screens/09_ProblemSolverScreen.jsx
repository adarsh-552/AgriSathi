import React, { useState } from 'react';
import { AlertCircle, Camera, Check, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { diagnosticService } from '../services/diagnosticService';

export default function ProblemSolverScreen({ onDiagnosed, onEscalateClick }) {
  const { dashboard } = useCrop();
  const [symptomCategory, setSymptomCategory] = useState('LEAF_YELLOWING');
  const [symptomLocation, setSymptomLocation] = useState('LOWER_LEAVES');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const cropId = dashboard?.farmerCrop?.id || 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await diagnosticService.evaluateProblem(cropId, {
        symptomCategory,
        symptomLocation,
        description: description || 'ఆకులు పసుపు రంగులోకి మారుతున్నాయి',
        affectedAreaFraction: 0.15,
      });
      onDiagnosed(result);
    } catch (err) {
      console.error(err);
      alert('సమస్య విశ్లేషణ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-gray-900">సమస్య పరిష్కారి (Problem Solver)</h2>
        <p className="text-xs text-gray-500">
          లక్షణాలు చెప్పండి. పంట జ్ఞాపకాల ఆధారంగా సురక్షిత పరిష్కారం పొందండి.
        </p>
      </div>

      {/* Safety Gate Guarantee Banner: Requirement 7 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start space-x-3">
        <ShieldAlert size={20} className="text-forest-green flex-shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong>భద్రతా హామీ (Safety Gate):</strong> మేము వెంటనే ఖరీదైన విష రసాయనాలను సిఫార్సు చేయము. మొదట సేంద్రీయ, నిర్వహణ పద్ధతులను మాత్రమే సూచిస్తాము.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Category */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
            1. సమస్య లక్షణం ఏమిటి? (Symptom Category)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'LEAF_YELLOWING', label: 'ఆకులు పసుపు పారడం', icon: '🍂' },
              { id: 'SUCKING_PEST', label: 'రసం పీల్చే పురుగులు', icon: '🐛' },
              { id: 'WILTING', label: 'మొక్క వడలిపోవడం', icon: '🥀' },
              { id: 'BOLL_ROT', label: 'కాయ కుళ్లు / మచ్చలు', icon: '🟤' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setSymptomCategory(opt.id)}
                className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition ${
                  symptomCategory === opt.id
                    ? 'border-forest-green bg-green-50/50 shadow-sm font-bold text-forest-green'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span className="text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Affected Plant Part */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
            2. మొక్కలో ఏ భాగంలో కనిపిస్తోంది? (Location)
          </label>
          <div className="space-y-2">
            {[
              { id: 'LOWER_LEAVES', label: 'క్రింది ఆకుల్లో మాత్రమే (దిగువ భాగం)' },
              { id: 'UPPER_LEAVES', label: 'కొత్తగా వచ్చిన పై చిగురు ఆకుల్లో' },
              { id: 'WHOLE_PLANT', label: 'మొత్తం మొక్క అంతటా ఒకేసారి' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  symptomLocation === opt.id
                    ? 'border-forest-green bg-green-50/50'
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

        {/* Optional photo / description note: Requirement 9 */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
            3. అదనపు వివరాలు (ఐచ్ఛికం)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ఎన్ని రోజులుగా ఈ సమస్య ఉంది? ఏవైనా ప్రత్యేక లక్షణాలు ఉన్నాయా..."
            className="input-field h-20 text-xs"
          />
          <div className="mt-2 text-[11px] text-gray-400 italic">
            గమనిక: ఫోటో లేదా వివరణ మాత్రమే 100% వ్యాధిని ఖరారు చేయదు; క్షేత్ర పరిశీలన ముఖ్యం.
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center justify-center space-x-2"
        >
          <span>{loading ? 'విశ్లేషిస్తోంది...' : 'పరిష్కారాన్ని చూడండి (Analyze Problem)'}</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
