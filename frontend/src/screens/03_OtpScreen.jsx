import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OtpScreen({ identifier, onVerified, onBack }) {
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const { verifyOtp, requestOtp, loading } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (otp.length < 6) {
      setLocalError('దయచేసి 6 అంకెల OTP నమోదు చేయండి (Enter 6-digit OTP)');
      return;
    }

    const res = await verifyOtp(identifier, otp);
    if (res.success) {
      onVerified();
    } else {
      setLocalError(res.message || 'OTP సరిపోలలేదు, మళ్ళీ ప్రయత్నించండి');
    }
  };

  const handleResend = async () => {
    setLocalError('');
    const res = await requestOtp(identifier);
    if (res.success) {
      alert('కొత్త OTP పంపబడింది (OTP resent successfully)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
      <div>
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={22} />
        </button>

        <h2 className="text-2xl font-black text-forest-green mb-2">OTP ధ్రువీకరణ</h2>
        <p className="text-sm text-gray-600 mb-6">
          <span className="font-semibold text-gray-800">{identifier}</span> కు 6 అంకెల కోడ్ పంపబడింది.
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              OTP నమోదు చేయండి
            </label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="1 2 3 4 5 6"
              className="w-full text-center tracking-[0.6em] font-mono text-2xl font-bold py-3.5 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-forest-green bg-white shadow-sm"
              autoFocus
            />
          </div>

          {localError && (
            <div className="text-xs text-safety-red font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
              {localError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <CheckCircle2 size={18} />
            <span>{loading ? 'ధ్రువీకరిస్తోంది...' : 'ధ్రువీకరించండి (Verify)'}</span>
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">OTP రాలేదా?</span>
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-xs font-bold text-forest-green hover:underline flex items-center space-x-1"
          >
            <RefreshCw size={14} />
            <span>మళ్ళీ పంపండి (Resend)</span>
          </button>
        </div>
      </div>

      <div className="pb-4 text-center">
        <span className="text-xs text-gray-400">సురక్షితమైన 256-బిట్ ఎన్‌క్రిప్షన్ ద్వారా రక్షించబడింది</span>
      </div>
    </div>
  );
}
