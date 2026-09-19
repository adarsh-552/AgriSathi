import React, { useState } from 'react';
import { ArrowLeft, User, MapPin, Globe, LogOut, Shield, Save, CheckCircle, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { INDIA_STATES_AND_UTS, getDistrictsForState, SOIL_TYPES, IRRIGATION_SOURCES } from '../data/indiaGeoData';

export default function FarmerProfileScreen({ onBack, onChangeLangClick }) {
  const { user, profile, updateProfile, logout } = useAuth();
  const { currentLanguage } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || 'రైతు సోదరుడు');
  const [state, setState] = useState(profile?.state || 'Andhra Pradesh');
  const [district, setDistrict] = useState(profile?.district || 'Kurnool');
  const [mandal, setMandal] = useState(profile?.mandal || '');
  const [village, setVillage] = useState(profile?.village || '');
  const [pincode, setPincode] = useState(profile?.pincode || '');
  const [landAreaAcres, setLandAreaAcres] = useState(profile?.landAreaAcres || 2.5);
  const [soilType, setSoilType] = useState(profile?.soilType || 'Black Cotton Soil (Regur)');
  const [irrigationSource, setIrrigationSource] = useState(profile?.irrigationSource || 'Borewell / Tube well');

  const [availableDistricts, setAvailableDistricts] = useState(() => getDistrictsForState(state));
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleStateChange = (newState) => {
    setState(newState);
    const districts = getDistrictsForState(newState);
    setAvailableDistricts(districts);
    if (districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    await updateProfile({
      fullName: fullName.trim(),
      state,
      district,
      mandal: mandal.trim(),
      village: village.trim(),
      pincode: pincode.trim(),
      landAreaAcres: parseFloat(landAreaAcres) || 2.0,
      soilType,
      irrigationSource,
    });

    setSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900">రైతు ప్రొఫైల్ (Farmer Profile)</h2>
            <p className="text-xs text-gray-500">వ్యక్తిగత మరియు భూమి సమాచారం</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center space-x-1"
        >
          <Edit3 size={13} />
          <span>{isEditing ? 'రద్దు (Cancel)' : 'సవరించండి (Edit)'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
          <span>మీ ప్రొఫైల్ వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి!</span>
        </div>
      )}

      {/* Main Identity Card */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-forest-green text-white flex items-center justify-center text-3xl shadow flex-shrink-0">
          👨‍🌾
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">
            {profile?.fullName || fullName}
          </h3>
          <p className="text-xs text-gray-500 font-mono">{user?.identifier || '9876543210'}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="bg-green-100 text-forest-green font-bold text-[10px] px-2 py-0.5 rounded-full">
              ధ్రువీకరించబడిన రైతు
            </span>
            <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
              {profile?.landAreaAcres || landAreaAcres} ఎకరాలు
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form or View Cards */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-3">
          <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
            ప్రొఫైల్ వివరాలు సవరించండి
          </h4>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">రైతు పేరు (Full Name)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field text-xs py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">రాష్ట్రం (State)</label>
              <select
                value={state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="input-field text-xs py-2 bg-white"
              >
                {INDIA_STATES_AND_UTS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">జిల్లా (District)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="input-field text-xs py-2 bg-white"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">మండలం</label>
              <input
                type="text"
                value={mandal}
                onChange={(e) => setMandal(e.target.value)}
                className="input-field text-xs py-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">గ్రామం</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="input-field text-xs py-2"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">పిన్‌కోడ్</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="input-field text-xs py-2 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">భూమి (Acres)</label>
              <input
                type="number"
                step="0.5"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(e.target.value)}
                className="input-field text-xs py-2 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">మట్టి రకం (Soil)</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="input-field text-xs py-2 bg-white"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil.id} value={soil.nameEn}>
                    {soil.nameTe}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">నీటి వనరు (Irrigation)</label>
            <select
              value={irrigationSource}
              onChange={(e) => setIrrigationSource(e.target.value)}
              className="input-field text-xs py-2 bg-white"
            >
              {IRRIGATION_SOURCES.map((irr) => (
                <option key={irr.id} value={irr.nameEn}>
                  {irr.nameTe}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-forest-green text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2 mt-2"
          >
            <Save size={15} />
            <span>{saving ? 'భద్రపరుస్తోంది...' : 'సేవ్ చేయండి (Save Changes)'}</span>
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 divide-y divide-gray-100 text-xs">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-gray-700">
              <Globe size={18} className="text-forest-green" />
              <span className="font-semibold">ఎంచుకున్న భాష (Language)</span>
            </div>
            <button
              onClick={onChangeLangClick}
              className="text-forest-green font-bold hover:underline"
            >
              {currentLanguage?.label} (మార్చండి)
            </button>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin size={18} className="text-forest-green" />
              <span className="font-semibold">ప్రాంతం (District / State)</span>
            </div>
            <span className="font-medium text-gray-800">
              {profile?.district || district}, {profile?.state || state}
            </span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600">మండలం / గ్రామం</span>
            <span className="font-medium text-gray-800">
              {profile?.mandal || mandal || '—'} / {profile?.village || village || '—'}
            </span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600">మట్టి రకం (Soil Type)</span>
            <span className="font-medium text-forest-green font-semibold">
              {profile?.soilType || soilType}
            </span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600">నీటి వనరు (Irrigation)</span>
            <span className="font-medium text-gray-800">
              {profile?.irrigationSource || irrigationSource}
            </span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 text-gray-700">
              <Shield size={18} className="text-forest-green" />
              <span className="font-semibold">గోప్యత & భద్రత</span>
            </div>
            <span className="text-emerald-700 font-medium">సురక్షితం • ఎటువంటి పత్రాలు అవసరం లేదు</span>
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center space-x-2"
      >
        <LogOut size={16} />
        <span>లాగ్ అవుట్ (Sign Out)</span>
      </button>
    </div>
  );
}
