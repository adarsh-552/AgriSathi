import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginScreen({ onBack, onAdminLoggedIn }) {
  const [email, setEmail] = useState('admin@agrisathi.com');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { adminLogin, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!password) {
      setLocalError('దయచేసి పాస్‌వర్డ్ నమోదు చేయండి (Enter password)');
      return;
    }

    const res = await adminLogin(email, password);
    if (res.success) {
      onAdminLoggedIn();
    } else {
      setLocalError(res.message || 'అడ్మిన్ లాగిన్ విఫలమైంది');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
      <div>
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft size={22} />
        </button>

        <div className="flex items-center space-x-2 text-forest-green mb-2">
          <ShieldCheck size={28} />
          <h2 className="text-2xl font-black text-gray-900">అడ్మిన్ పోర్టల్ (Admin Login)</h2>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          కంటెంట్ ఆమోదం, శాస్త్రీయ ధ్రువీకరణ మరియు ఆడిట్ లాగ్స్ నిర్వహణ
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              అడ్మిన్ ఈమెయిల్ (Admin Email)
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                required
              />
              <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              పాస్‌వర్డ్ (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="పాస్‌వర్డ్..."
                className="input-field pl-10"
                required
              />
              <Lock size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          {localError && (
            <div className="text-xs text-safety-red font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
              {localError}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900">
            <strong>డెమో క్రెడెన్షియల్స్:</strong> admin@agrisathi.com / Admin@AgriSathi2026
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center justify-center space-x-2 mt-4"
          >
            <span>{loading ? 'లాగిన్ అవుతోంది...' : 'అడ్మిన్‌గా లాగిన్ అవ్వండి'}</span>
          </button>
        </form>
      </div>

      <div className="pb-4 text-center text-xs text-gray-400">
        Spring Security RBAC + BCrypt ద్వారా సురక్షితమైనది
      </div>
    </div>
  );
}
