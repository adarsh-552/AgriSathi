import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDIA_STATES_AND_UTS, getDistrictsForState, SOIL_TYPES, IRRIGATION_SOURCES } from '../data/indiaGeoData';

export default function LocationScreen({ onLocationCompleted }) {
  const { profile, updateProfile } = useAuth();

  const [state, setState] = useState(profile?.state || 'Andhra Pradesh');
  const [district, setDistrict] = useState(profile?.district || 'Kurnool');
  const [mandal, setMandal] = useState(profile?.mandal || '');
  const [village, setVillage] = useState(profile?.village || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [landAreaAcres, setLandAreaAcres] = useState(profile?.landAreaAcres || 2.5);
  const [soilType, setSoilType] = useState(profile?.soilType || 'Black Cotton Soil (Regur)');
  const [irrigationSource, setIrrigationSource] = useState(profile?.irrigationSource || 'Borewell / Tube well');

  const [availableDistricts, setAvailableDistricts] = useState(() => getDistrictsForState(state));
  const [userHasEdited, setUserHasEdited] = useState(false);

  useEffect(() => {
    if (profile && !userHasEdited) {
      if (profile.state) {
        setState(profile.state);
        const dists = getDistrictsForState(profile.state);
        setAvailableDistricts(dists);
        if (profile.district) setDistrict(profile.district);
      }
      if (profile.mandal) setMandal(profile.mandal);
      if (profile.village) setVillage(profile.village);
      if (profile.pincode) setPincode(profile.pincode);
      if (profile.landAreaAcres) setLandAreaAcres(profile.landAreaAcres);
      if (profile.soilType) setSoilType(profile.soilType);
      if (profile.irrigationSource) setIrrigationSource(profile.irrigationSource);
    }
  }, [profile, userHasEdited]);

  // Whenever state changes, update available districts
  const handleStateChange = (newState) => {
    setUserHasEdited(true);
    setState(newState);
    const districts = getDistrictsForState(newState);
    setAvailableDistricts(districts);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    await updateProfile({
      state,
      district,
      mandal: mandal || 'Mandal Center',
      village: village || 'Village',
      pincode: pincode || '',
      landAreaAcres: parseFloat(landAreaAcres) || 2.0,
      soilType,
      irrigationSource,
    });
    onLocationCompleted();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
      <div className="pb-8">
        <div className="pt-4 mb-4">
          <span className="text-xs font-bold text-forest-green tracking-wider uppercase">
            వ్యవసాయ వివరాలు (Agricultural Setup)
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-1">ప్రాంతం & పొలం వివరాలు</h2>
          <p className="text-xs text-gray-500 mt-1">
            28 రాష్ట్రాలు & 8 కేంద్రపాలిత ప్రాంతాలు • మీ స్థానిక వాతావరణం, మట్టి మరియు మార్కెట్ ధరల కోసం
          </p>
        </div>

        <form onSubmit={handleComplete} className="space-y-3.5">
          {/* State Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              రాష్ట్రం / కేంద్రపాలిత ప్రాంతం (State / UT)
            </label>
            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="input-field bg-white font-medium text-xs py-2.5"
            >
              {INDIA_STATES_AND_UTS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.nameTe ? `${s.nameTe} (${s.name})` : s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic District Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              జిల్లా (District)
            </label>
            <select
              value={district}
              onChange={(e) => {
                setUserHasEdited(true);
                setDistrict(e.target.value);
              }}
              className="input-field bg-white font-medium text-xs py-2.5"
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Mandal & Village in 2 columns */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                మండలం (Mandal/Taluk)
              </label>
              <input
                type="text"
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                placeholder="ఉదా: ఓర్వకల్లు"
                className="input-field bg-white text-xs py-2.5"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                పిన్ కోడ్ (Pincode)
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="518001"
                className="input-field bg-white text-xs py-2.5 font-mono"
              />
            </div>
          </div>

          {/* Land Area & Soil Type in 2 columns */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                భూమి విస్తీర్ణం (Acres)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(e.target.value)}
                placeholder="2.5"
                className="input-field bg-white text-xs py-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                మట్టి రకం (Soil Type)
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="input-field bg-white text-xs py-2.5"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil.id} value={soil.nameEn}>
                    {soil.nameTe} ({soil.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Irrigation Source */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              నీటి వనరు (Irrigation Source)
            </label>
            <select
              value={irrigationSource}
              onChange={(e) => setIrrigationSource(e.target.value)}
              className="input-field bg-white text-xs py-2.5"
            >
              {IRRIGATION_SOURCES.map((irr) => (
                <option key={irr.id} value={irr.nameEn}>
                  {irr.nameTe} ({irr.nameEn})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 p-2.5 rounded-xl mt-1">
            <ShieldCheck size={16} className="text-forest-green flex-shrink-0" />
            <span>ఆధార్ లేదా అధికారిక పత్రాలు అవసరం లేదు. ఎప్పుడైనా మార్చుకోవచ్చు.</span>
          </div>

          <button
            type="submit"
            className="btn-primary flex items-center justify-center space-x-2 mt-4"
          >
            <span>ప్రారంభించండి (Continue to Home)</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
