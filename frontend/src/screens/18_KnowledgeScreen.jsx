import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, BookOpen, CheckCircle, Award, ExternalLink, Sparkles, Filter } from 'lucide-react';
import { knowledgeService } from '../services/knowledgeService';
import { useLanguage } from '../context/LanguageContext';

export default function KnowledgeScreen({ onBack, onNavigateToSolver, onNavigateToKvk }) {
  const { lang, tf } = useLanguage();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    knowledgeService.getKnowledge()
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('విజ్ఞాన సమాచారాన్ని లోడ్ చేయడం విఫలమైంది');
        setLoading(false);
      });
  }, []);

  const filteredArticles = articles.filter((item) => {
    const title = lang === 'hi' ? item.titleHi : lang === 'en' ? item.titleEn : item.titleTe;
    const body = lang === 'hi' ? item.bodyHi : lang === 'en' ? item.bodyEn : item.bodyTe;
    const institution = item.sourceInstitution || '';

    const matchesSearch = 
      (title && title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (body && body.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (institution && institution.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTopic === 'PEST') {
      return item.contentCode?.includes('BOLLWORM') || item.contentCode?.includes('THRIPS') || item.contentCode?.includes('FAW');
    }
    if (selectedTopic === 'SOIL') {
      return item.contentCode?.includes('SOIL') || item.contentCode?.includes('CARBON');
    }

    return true;
  });

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">వ్యవసాయ విజ్ఞాన వేదిక (ICAR Knowledge)</h2>
          <p className="text-xs text-gray-500">శాస్త్రీయ వ్యవసాయ పద్ధతులు & నిపుణుల సలహాలు</p>
        </div>
      </div>

      {/* Trust Seal Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 flex items-start space-x-2.5 shadow-sm">
        <Award size={20} className="text-forest-green flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold flex items-center gap-1.5 text-forest-green">
            <span>ధ్రువీకరించబడిన శాస్త్రీయ మార్గదర్శకాలు</span>
            <CheckCircle size={14} className="text-emerald-600 fill-emerald-100" />
          </div>
          <p className="mt-0.5 text-gray-600 leading-relaxed">
            ఇక్కడ అందించబడిన అన్ని మార్గదర్శకాలు ICAR, ANGRAU, PJTSAU మరియు CIBRC ద్వారా ధ్రువీకరించబడిన ప్యాకేజ్ ఆఫ్ ప్రాక్టీసెస్ (PoP) ఆధారంగా రూపొందించబడ్డాయి.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="విషయం లేదా తెగులు పేరు వెతకండి (ఉదా: గులాబీ రంగు పురుగు, తామర పురుగులు)..."
          className="input-field pl-9 text-xs"
        />
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'అన్నీ (All Topics)' },
          { id: 'PEST', label: 'చీడపీడల నివారణ (IPM)' },
          { id: 'SOIL', label: 'భూసారం & ఎరువులు (Soil)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTopic(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedTopic === tab.id
                ? 'bg-forest-green text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content List */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">
          సమాచారాన్ని లోడ్ చేస్తున్నాము...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-xs text-red-700">
          {error}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
          <BookOpen size={36} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-bold text-gray-700">ఎటువంటి వ్యాసాలు కనుగొనబడలేదు</p>
          <p className="text-xs text-gray-500 mt-1">శోధన పదాన్ని మార్చి ప్రయత్నించండి.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => {
            const title = lang === 'hi' ? article.titleHi : lang === 'en' ? article.titleEn : article.titleTe;
            const body = lang === 'hi' ? article.bodyHi : lang === 'en' ? article.bodyEn : article.bodyTe;
            const isExpanded = expandedId === article.id;

            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-4 space-y-2.5">
                  {/* Verification Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle size={10} className="mr-1" />
                      {article.verificationStatus || 'VERIFIED'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {article.contentCode}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">
                    {title}
                  </h3>

                  {/* Source Institution */}
                  <div className="flex items-center space-x-1.5 text-xs text-forest-green font-medium">
                    <Award size={14} className="flex-shrink-0" />
                    <span className="truncate">{article.sourceInstitution}</span>
                  </div>

                  {/* Scientific Citation */}
                  {article.scientificCitation && (
                    <p className="text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                      శాస్త్రీయ ఆధారాలు: {article.scientificCitation}
                    </p>
                  )}

                  {/* Body preview or expanded */}
                  <div className="text-xs text-gray-700 leading-relaxed">
                    {isExpanded ? (
                      <p className="whitespace-pre-line">{body}</p>
                    ) : (
                      <p className="line-clamp-2">{body}</p>
                    )}
                  </div>

                  {/* Action row */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : article.id)}
                      className="text-xs font-bold text-forest-green hover:underline"
                    >
                      {isExpanded ? 'తక్కువ చూడండి (Show Less)' : 'పూర్తి వివరాలు చదవండి (Read More)'}
                    </button>

                    {onNavigateToKvk && (
                      <button
                        onClick={onNavigateToKvk}
                        className="text-[11px] text-gray-500 hover:text-forest-green flex items-center gap-1 font-medium"
                      >
                        KVK నిపుణుడిని సంప్రదించండి &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
