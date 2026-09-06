import React, { useState } from 'react';
import { Smartphone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginScreen({ onOtpRequested, onAdminLoginClick }) {
  const [identifier, setIdentifier] = useState('');
  const [localError, setLocalError] = useState('');
  const { requestOtp, loading } = useAuth();
  const { t } = useLanguage();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLocalError('');

    const clean = identifier.trim();
    if (!clean) {
      setLocalError('దయచేసి మొబైల్ లేదా ఈమెయిల్ నమోదు చేయండి (Enter mobile or email)');
      return;
    }

    const res = await requestOtp(clean);
    if (res.success) {
      onOtpRequested(clean);
    } else {
      setLocalError(res.message || 'OTP పంపడం విఫలమైంది');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
      <div className="pt-8">
        {/* Brand Banner */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest-green flex items-center justify-center text-2xl text-white shadow-md">
            🌱
          </div>
          <div>
            <h2 className="text-2xl font-black text-forest-green">AgriSathi</h2>
            <p className="text-xs text-gray-500">సులభమైన నమోదు (Zero Friction Registration)</p>
          </div>
        </div>

        {/* Informative Note: Requirement 3 */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
          <h3 className="font-bold text-emerald-950 text-sm mb-1">
            కేవలం ఒక్క దశలోనే నమోదు (Single-Step)
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            ఆధార్, భూమి విస్తీర్ణం లేదా ఇతర ధ్రువీకరణ పత్రాలు ఏవీ అవసరం లేదు. మీ ఫోన్ నంబర్ సరిపోతుంది.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              మొబైల్ నంబర్ లేదా ఈమెయిల్ (Mobile / Email)
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="9876543210 లేదా farmer@example.com"
                className="input-field pl-11"
                disabled={loading}
              />
              <div className="absolute left-3.5 top-3.5 text-gray-400">
                {identifier.includes('@') ? <Mail size={20} /> : <Smartphone size={20} />}
              </div>
            </div>
          </div>

          {localError && (
            <div className="text-xs text-safety-red font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
              {localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'పంపుతోంది...' : 'OTP పొందండి (Get OTP)'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[11px] text-gray-500">
            పరీక్ష కోసం డెమో OTP: <span className="font-mono font-bold text-forest-green">123456</span>
          </span>
        </div>
      </div>

      {/* Admin Login Link */}
      <div className="pb-4 text-center border-t border-gray-200 pt-4">
        <button
          onClick={onAdminLoginClick}
          className="inline-flex items-center space-x-1.5 text-xs text-gray-600 hover:text-forest-green font-medium"
        >
          <ShieldCheck size={16} />
          <span>అధికారుల / అడ్మిన్ లాగిన్ (Admin Portal)</span>
        </button>
      </div>
    </div>
  );
}
