import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, ExternalLink, ShieldCheck, CheckCircle2, Building, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { schemesService } from '../services/schemesService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function SchemesScreen({ onBack }) {
  const { lang, tf } = useLanguage();
  const { profile } = useAuth();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL'); // 'ALL' | 'CENTRAL' | 'STATE'
  const [expandedId, setExpandedId] = useState(null);

  const farmerState = profile?.state || 'Andhra Pradesh';

  useEffect(() => {
    setLoading(true);
    schemesService.getSchemes(farmerState)
      .then((data) => {
        setSchemes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('పథకాల సమాచారాన్ని లోడ్ చేయడం విఫలమైంది');
        setLoading(false);
      });
  }, [farmerState]);

  const filtered = schemes.filter((s) => {
    const name = lang === 'hi' ? s.schemeNameHi : lang === 'en' ? s.schemeNameEn : s.schemeNameTe;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.schemeCode.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (scopeFilter === 'CENTRAL') return s.stateApplicability === 'ALL_INDIA';
    if (scopeFilter === 'STATE') return s.stateApplicability !== 'ALL_INDIA';
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">ప్రభుత్వ పథకాలు (Govt Schemes)</h2>
          <p className="text-xs text-gray-500">కేంద్ర & రాష్ట్ర ప్రభుత్వ వ్యవసాయ ప్రోత్సాహకాలు • {farmerState}</p>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start space-x-2">
        <ShieldCheck size={18} className="text-forest-green flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          అన్ని పథకాల వివరాలు కేంద్ర & రాష్ట్ర వ్యవసాయ శాఖ అధికారిక పోర్టల్స్ ద్వారా ధ్రువీకరించబడినవి. ఎటువంటి దళారులను ఆశ్రయించవద్దు.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="పథకం పేరు వెతకండి (ఉదా: పీఎం కిసాన్, బీమా)..."
          className="input-field pl-9 text-xs"
        />
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Scope Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'ALL', label: 'అన్నీ (All Schemes)' },
          { id: 'CENTRAL', label: 'కేంద్ర పథకాలు (Central)' },
          { id: 'STATE', label: `${farmerState} పథకాలు` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScopeFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              scopeFilter === tab.id
                ? 'bg-forest-green text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schemes List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-500">పథకాల వివరాలు లోడ్ అవుతున్నాయి...</div>
      ) : error ? (
        <div className="py-8 text-center text-xs text-rose-600 bg-rose-50 rounded-2xl p-4">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-xs text-gray-500 bg-white rounded-2xl p-6 border border-gray-100">
          ఈ వర్గంలో ఎటువంటి పథకాలు కనుగొనబడలేదు.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => {
            const isExpanded = expandedId === s.id;
            const title = lang === 'hi' ? s.schemeNameHi : lang === 'en' ? s.schemeNameEn : s.schemeNameTe;
            const desc = lang === 'hi' ? s.briefDescriptionHi : lang === 'en' ? s.briefDescriptionEn : s.briefDescriptionTe;
            const eligibility = lang === 'hi' ? s.eligibilityHi : lang === 'en' ? s.eligibilityEn : s.eligibilityTe;
            const benefits = lang === 'hi' ? s.benefitsHi : lang === 'en' ? s.benefitsEn : s.benefitsTe;

            return (
              <div key={s.id} className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden transition">
                <div
                  onClick={() => toggleExpand(s.id)}
                  className="p-4 cursor-pointer hover:bg-gray-50/60 flex items-start justify-between"
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        s.stateApplicability === 'ALL_INDIA' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {s.stateApplicability === 'ALL_INDIA' ? 'జాతీయ పథకం (Central)' : s.stateApplicability}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {s.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <button className="text-gray-400 hover:text-gray-700 mt-1 flex-shrink-0">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3 text-xs bg-emerald-50/20">
                    {/* Benefits Section */}
                    <div>
                      <span className="font-bold text-forest-green block mb-1">ప్రయోజనాలు (Key Benefits):</span>
                      <p className="text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200 leading-relaxed font-medium">
                        {benefits}
                      </p>
                    </div>

                    {/* Eligibility Section */}
                    <div>
                      <span className="font-bold text-gray-800 block mb-1">ఎవరు అర్హులు (Eligibility Criteria):</span>
                      <p className="text-gray-700 bg-white p-2.5 rounded-xl border border-gray-200 leading-relaxed">
                        {eligibility}
                      </p>
                    </div>

                    {/* Department Attribution */}
                    <div className="flex items-center space-x-1.5 text-[11px] text-gray-500">
                      <Building size={13} className="text-gray-400 flex-shrink-0" />
                      <span>శాఖ: {s.sourceDepartment}</span>
                    </div>

                    {/* Official Portal Action Button */}
                    {s.sourceUrl && (
                      <a
                        href={s.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-forest-green hover:bg-forest-green-light text-white font-bold rounded-xl shadow flex items-center justify-center space-x-2 transition mt-2"
                      >
                        <span>అధికారిక వెబ్‌సైట్ / దరఖాస్తు పోర్టల్</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
