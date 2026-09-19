import React, { useState, useEffect } from 'react';
import { ArrowLeft, PhoneCall, ShieldCheck, MapPin, Clock, Send, AlertTriangle, CheckCircle2, History, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { escalationService } from '../services/escalationService';

export default function ExpertEscalationScreen({ onBack, prefillCrop = '', prefillSymptom = '' }) {
  const { profile } = useAuth();
  const { lang, tf } = useLanguage();

  const [activeTab, setActiveTab] = useState('REQUEST'); // 'REQUEST' | 'TICKETS' | 'DIRECTORY'
  const [cropName, setCropName] = useState(prefillCrop || 'పత్తి (Cotton)');
  const [issueCategory, setIssueCategory] = useState('PEST_DISEASE');
  const [symptomsDescription, setSymptomsDescription] = useState(prefillSymptom || '');
  const [urgency, setUrgency] = useState('HIGH');
  const [contactNumber, setContactNumber] = useState(profile?.identifier || '');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const farmerState = profile?.state || 'Andhra Pradesh';
  const farmerDistrict = profile?.district || 'Kurnool';

  // Load farmer's tickets
  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const data = await escalationService.getMyEscalations();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'TICKETS') {
      loadTickets();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptomsDescription.trim()) {
      setErrorMessage('దయచేసి పంట సమస్య వివరాలను నమోదు చేయండి.');
      return;
    }
    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await escalationService.createEscalation({
        cropName,
        issueCategory,
        symptomsDescription,
        urgency,
        contactNumber,
      });
      setSubmitSuccess(res);
      setSymptomsDescription('');
      loadTickets();
    } catch (err) {
      console.error(err);
      setErrorMessage('అభ్యర్థన పంపడం విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.');
    } finally {
      setSubmitting(false);
    }
  };

  // State-specific KVK Directory Directory Lookup
  const getKvkDirectory = () => {
    if (farmerState.toLowerCase().includes('telangana')) {
      return [
        {
          name: 'డా. కె. రామకృష్ణ',
          designation: 'సీనియర్ శాస్త్రవేత్త & హెడ్ (KVK)',
          center: `KVK మాల్యాల, మహబూబాబాద్ / వరంగల్, ${farmerState}`,
          phone: '08719-240240',
          timings: 'ఉదయం 9:30 - సాయంత్రం 5:00',
        },
        {
          name: 'PJTSAU వ్యవసాయ సహాయ హెల్ప్‌లైన్',
          designation: 'ప్రొఫెసర్ జయశంకర్ తెలంగాణ వ్యవసాయ విశ్వవిద్యాలయం',
          center: 'రాజేంద్రనగర్, హైదరాబాద్',
          phone: '1800-425-0330',
          timings: 'ఉదయం 9:00 - సాయంత్రం 5:30',
        }
      ];
    }
    // Default Andhra Pradesh / National
    return [
      {
        name: 'డా. వి. శ్రీనివాసరావు',
        designation: 'సీనియర్ శాస్త్రవేత్త (సస్యరక్షణ)',
        center: `KVK బనవాసి, యెమ్మిగనూరు, ${farmerDistrict}, ${farmerState}`,
        phone: '1800-180-1551',
        timings: 'ఉదయం 9:00 - సాయంత్రం 5:00',
      },
      {
        name: 'రైతు భరోసా కేంద్రం (RBK / VAA)',
        designation: 'గ్రామ వ్యవసాయ సహాయకుడు',
        center: `${farmerDistrict} రైతు సేవా కేంద్రం`,
        phone: '155251',
        timings: 'ఉదయం 8:30 - సాయంత్రం 5:30',
      }
    ];
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">KVK నిపుణుల సలహా & ఎస్కలేషన్</h2>
          <p className="text-xs text-gray-500">వ్యవసాయ శాస్త్రవేత్తలతో నేరుగా సంప్రదింపు • {farmerDistrict}, {farmerState}</p>
        </div>
      </div>

      {/* Safety Gate Escalation Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start space-x-2">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>బాధ్యతాయుత మార్గదర్శకం:</strong> యాప్ సూచనలు కేవలం ప్రాథమిక అంచనాలు మాత్రమే. తెగుళ్ళ తీవ్రత అధికంగా ఉన్నప్పుడు లేదా తెలియని వైరస్ లక్షణాలు కనిపించినప్పుడు వెంటనే శాస్త్రవేత్తల పరిశీలన కోసం అభ్యర్థించండి.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('REQUEST')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'REQUEST'
              ? 'bg-forest-green text-white shadow'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          సమస్య నమోదు (Submit)
        </button>
        <button
          onClick={() => setActiveTab('TICKETS')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'TICKETS'
              ? 'bg-forest-green text-white shadow'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          నా అభ్యర్థనలు (My Tickets)
        </button>
        <button
          onClick={() => setActiveTab('DIRECTORY')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeTab === 'DIRECTORY'
              ? 'bg-forest-green text-white shadow'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          కేంద్రాలు & నెంబర్లు
        </button>
      </div>

      {/* TAB 1: SUBMIT ESCALATION REQUEST */}
      {activeTab === 'REQUEST' && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800">
              <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">మీ అభ్యర్థన విజయవంతంగా నమోదైంది! (Ticket #{submitSuccess.id})</p>
                <p className="mt-0.5 text-emerald-700">KVK వ్యవసాయ అధికారి మీతో ఫోన్ ద్వారా త్వరలో సంప్రదిస్తారు.</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">పంట పేరు (Crop Name)</label>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="input-field text-xs"
              placeholder="ఉదా: పత్తి, మిరప, వరి..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">సమస్య రకం (Issue Category)</label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              className="input-field text-xs"
            >
              <option value="PEST_DISEASE">చీడపీడలు & తెగుళ్ళు (Pest & Disease)</option>
              <option value="WEED_MANAGEMENT">కలుపు నివారణ (Weed Management)</option>
              <option value="SOIL_DEFICIENCY">పోషక లోపాలు / ఆకులు పసుపు రంగు (Nutrient Deficiency)</option>
              <option value="WEATHER_DAMAGE">వర్షం / వాతావరణ నష్టం (Weather Damage)</option>
              <option value="OTHER">ఇతర సమస్య (Other)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">లక్షణాల వివరాలు (Describe Symptoms)</label>
            <textarea
              value={symptomsDescription}
              onChange={(e) => setSymptomsDescription(e.target.value)}
              className="input-field text-xs min-h-[90px]"
              placeholder="మొక్కలపై మీరు గమనించిన లక్షణాలను వివరంగా రాయండి (ఉదా: ఆకుల అడుగున పురుగులు, రంగు మారడం, కాయలు రాలిపోవడం)..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">తీవ్రత (Urgency)</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="input-field text-xs"
              >
                <option value="LOW">సాధారణం (Low)</option>
                <option value="MEDIUM">మధ్యస్థం (Medium)</option>
                <option value="HIGH">అత్యవసరం (High)</option>
                <option value="EMERGENCY">తీవ్ర నష్టం (Emergency)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">సంప్రదించాల్సిన ఫోన్ నంబర్</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="input-field text-xs font-mono"
                placeholder="10 అంకెల మొబైల్ నంబర్"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Send size={15} />
            <span>{submitting ? 'నమోదు చేస్తున్నాము...' : 'KVK శాస్త్రవేత్తకు పంపండి (Submit to KVK)'}</span>
          </button>
        </form>
      )}

      {/* TAB 2: MY TICKETS LIST */}
      {activeTab === 'TICKETS' && (
        <div className="space-y-3">
          {loadingTickets ? (
            <div className="text-center py-10 text-xs text-gray-500">అభ్యర్థనలను లోడ్ చేస్తున్నాము...</div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <History size={36} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-bold text-gray-700">మీరు ఇంకా ఎలాంటి అభ్యర్థనలను పంపలేదు</p>
              <p className="text-xs text-gray-500 mt-1">పంట సమస్య ఉన్నప్పుడు 'సమస్య నమోదు' ట్యాబ్ ద్వారా పంపండి.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-green font-mono">#{t.id} • {t.cropName}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'CONTACTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status === 'RESOLVED' ? 'పరిష్కరించబడింది (Resolved)' : t.status === 'CONTACTED' ? 'సంప్రదించారు (Contacted)' : 'పరిశీలనలో ఉంది (Pending)'}
                  </span>
                </div>

                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {t.symptomsDescription}
                </p>

                {t.officerNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-900 mt-2">
                    <span className="font-bold flex items-center gap-1 text-blue-700">
                      <MessageSquare size={12} /> KVK అధికారి సూచన:
                    </span>
                    <p className="mt-0.5">{t.officerNotes}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
                  <span>తీవ్రత: <strong className="text-gray-600">{t.urgency}</strong></span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: CONTACT DIRECTORY */}
      {activeTab === 'DIRECTORY' && (
        <div className="space-y-3">
          {getKvkDirectory().map((officer, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-3">
              <div>
                <span className="text-xs font-bold text-forest-green">{officer.designation}</span>
                <h3 className="font-bold text-gray-900 text-base">{officer.name}</h3>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <MapPin size={12} />
                  <span>{officer.center}</span>
                </div>
                <div className="flex items-center space-x-1 text-[11px] text-gray-400 mt-0.5">
                  <Clock size={12} />
                  <span>పనివేళలు: {officer.timings}</span>
                </div>
              </div>

              <a
                href={`tel:${officer.phone}`}
                className="w-full py-2.5 bg-forest-green hover:bg-forest-green-light text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-2 transition"
              >
                <PhoneCall size={16} />
                <span>కాల్ చేయండి ({officer.phone})</span>
              </a>
            </div>
          ))}

          {/* Kisan Call Center National Helpline */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-800 font-semibold block mb-1">
              భారత ప్రభుత్వ జాతీయ కిసాన్ కాల్ సెంటర్ (టోల్-ఫ్రీ)
            </span>
            <a
              href="tel:18001801551"
              className="text-2xl font-black text-forest-green font-mono tracking-wider block hover:underline"
            >
              1800-180-1551
            </a>
            <span className="text-[11px] text-emerald-700 mt-1 block">
              వారంలో 7 రోజులు ఉదయం 6:00 నుండి రాత్రి 10:00 వరకు (అన్ని స్థానిక భాషల్లో)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
