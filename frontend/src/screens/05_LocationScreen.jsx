import React, { useState } from 'react';
import { MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LocationScreen({ onLocationCompleted }) {
  const [state, setState] = useState('Andhra Pradesh');
  const [district, setDistrict] = useState('Kurnool');
  const [mandal, setMandal] = useState('');
  const [village, setVillage] = useState('');
  const { updateProfile } = useAuth();

  const handleComplete = (e) => {
    e.preventDefault();
    updateProfile({
      state,
      district,
      mandal: mandal || 'Mandal Center',
      village: village || 'Village',
    });
    onLocationCompleted();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
      <div>
        <div className="pt-6 mb-6">
          <span className="text-xs font-bold text-forest-green tracking-wider uppercase">
            దశ 2 / 2 (Step 2/2)
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">ప్రాంత వివరాలు</h2>
          <p className="text-xs text-gray-500 mt-1">
            మీ గ్రామానికి సరిపోయే ఖచ్చితమైన వాతావరణం మరియు మార్కెట్ ధరలను అందించడానికి మాత్రమే
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">రాష్ట్రం (State)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field bg-white"
            >
              <option value="Andhra Pradesh">ఆంధ్రప్రదేశ్ (Andhra Pradesh)</option>
              <option value="Telangana">తెలంగాణ (Telangana)</option>
              <option value="Karnataka">కర్ణాటక (Karnataka)</option>
              <option value="Maharashtra">మహారాష్ట్ర (Maharashtra)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">జిల్లా (District)</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="input-field bg-white"
            >
              <option value="Kurnool">కర్నూలు (Kurnool)</option>
              <option value="Nandyal">నంద్యాల (Nandyal)</option>
              <option value="Anantapur">అనంతపురం (Anantapur)</option>
              <option value="Guntur">గుంటూరు (Guntur)</option>
              <option value="Warangal">వరంగల్ (Warangal)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              మండలం (Mandal) - ఐచ్ఛికం
            </label>
            <input
              type="text"
              value={mandal}
              onChange={(e) => setMandal(e.target.value)}
              placeholder="ఉదా: ఓర్వకల్లు"
              className="input-field bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              గ్రామం (Village) - ఐచ్ఛికం
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="ఉదా: నన్నూరు"
              className="input-field bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 p-2.5 rounded-xl mt-2">
            <ShieldCheck size={16} className="text-forest-green flex-shrink-0" />
            <span>ఈ వివరాలు సురక్షితం. ఎటువంటి ప్రభుత్వ పత్రాలు అవసరం లేదు.</span>
          </div>

          <button
            type="submit"
            className="btn-primary flex items-center justify-center space-x-2 mt-6"
          >
            <span>ప్రారంభించండి (Enter AgriSathi)</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>

      <div className="pb-4 text-center">
        <span className="text-xs text-gray-400">రైతు కోసం... రైతు భాషలో... రైతు తోడుగా...</span>
      </div>
    </div>
  );
}
