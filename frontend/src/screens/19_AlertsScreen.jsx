import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, AlertTriangle, CloudRain, CheckCircle, RefreshCw, Calendar, Droplets } from 'lucide-react';
import { alertsService } from '../services/alertsService';
import { useLanguage } from '../context/LanguageContext';

export default function AlertsScreen({ onBack, onNavigate }) {
  const { lang } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SPRAY' | 'TASK'

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertsService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'SPRAY') return a.type === 'SPRAY' || a.type === 'WEATHER';
    if (filter === 'TASK') return a.type === 'TASK' || a.type === 'IRRIGATION';
    return true;
  });

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900">సమయస్ఫూర్తి హెచ్చరికలు (Alerts)</h2>
            <p className="text-xs text-gray-500">వాతావరణం, పిచికారీ & సకాలపు వ్యవసాయ పనులు</p>
          </div>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-forest-green rounded-full bg-gray-100 transition disabled:opacity-50"
          title="Refresh Alerts"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { id: 'ALL', label: 'అన్నీ (All Alerts)' },
          { id: 'SPRAY', label: 'పిచికారీ & వాతావరణం' },
          { id: 'TASK', label: 'పంట పనులు (Crop Tasks)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === tab.id
                ? 'bg-forest-green text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-gray-500">హెచ్చరికలను తనిఖీ చేస్తున్నాము...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
          <CheckCircle size={36} className="mx-auto text-emerald-500 mb-2" />
          <p className="text-sm font-bold text-gray-800">ప్రస్తుతానికి ఎటువంటి అత్యవసర హెచ్చరికలు లేవు</p>
          <p className="text-xs text-gray-500 mt-1">వాతావరణం మరియు పంట పరిస్థితులు అనుకూలంగా ఉన్నాయి.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const title = lang === 'hi' ? alert.titleHi : lang === 'en' ? alert.titleEn : alert.titleTe;
            const message = lang === 'hi' ? alert.messageHi : lang === 'en' ? alert.messageEn : alert.messageTe;

            const isHigh = alert.priority === 'HIGH';
            const isMedium = alert.priority === 'MEDIUM';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl p-4 border shadow-sm space-y-2.5 transition ${
                  isHigh
                    ? 'border-red-200 bg-red-50/20'
                    : isMedium
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-emerald-200 bg-emerald-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isHigh
                        ? 'bg-red-100 text-red-800'
                        : isMedium
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isHigh ? 'అత్యవసరం (High Priority)' : isMedium ? 'శ్రద్ధ వహించండి (Notice)' : 'సమాచారం (Info)'}
                  </span>
                  <span className="text-[10px] text-gray-400">{alert.timestamp}</span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {alert.type === 'SPRAY' || alert.type === 'WEATHER' ? (
                      <CloudRain size={20} className={isHigh ? 'text-red-500' : 'text-blue-500'} />
                    ) : alert.type === 'IRRIGATION' ? (
                      <Droplets size={20} className="text-cyan-600" />
                    ) : (
                      <Calendar size={20} className="text-forest-green" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 leading-snug">{title}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{message}</p>
                  </div>
                </div>

                {alert.actionLink && onNavigate && (
                  <div className="pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => onNavigate(alert.actionLink)}
                      className="text-xs font-bold text-forest-green hover:underline flex items-center gap-1"
                    >
                      {alert.actionLink === 'WEATHER'
                        ? 'వాతావరణ వివరాలు చూడండి &rarr;'
                        : alert.actionLink === 'JOURNEY'
                        ? 'పంట ప్రయాణం & పనులు &rarr;'
                        : 'మరిన్ని వివరాలు &rarr;'}
                    </button>
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
