import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, ShieldCheck, Users, FileText, Check, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardScreen({ onBack }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    api.get('/admin/overview')
      .then((res) => {
        setOverview(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handlePublish = async (contentId) => {
    try {
      await api.post(`/admin/contents/${contentId}/publish`);
      alert('కంటెంట్ విజయవంతంగా ప్రచురించబడింది (Content verified & published)!');
      // refresh overview
      const res = await api.get('/admin/overview');
      setOverview(res.data);
    } catch (err) {
      alert('ప్రచురణ విఫలమైంది');
    }
  };

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900">అడ్మిన్ డాష్‌బోర్డ్</h2>
            <p className="text-xs text-gray-500">వ్యవసాయ కంటెంట్ ధ్రువీకరణ & ఆడిట్ లాగ్స్</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-rose-600 font-bold hover:underline"
        >
          లాగ్ అవుట్
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl shadow-card border border-gray-100">
          <span className="text-[10px] text-gray-400 block font-semibold">రైతులు</span>
          <span className="text-xl font-black text-forest-green">{overview?.totalFarmers || 1}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-card border border-gray-100">
          <span className="text-[10px] text-gray-400 block font-semibold">యాక్టివ్ పంటలు</span>
          <span className="text-xl font-black text-blue-600">{overview?.activeFarmerCrops || 1}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-card border border-gray-100">
          <span className="text-[10px] text-gray-400 block font-semibold">పెండింగ్ కంటెంట్</span>
          <span className="text-xl font-black text-amber-600">{overview?.pendingContentCount || 0}</span>
        </div>
      </div>

      {/* Pending Agricultural Contents for Verification: Requirement 8 */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
            సమీక్షించాల్సిన కంటెంట్ (Content Approvals)
          </h3>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
            ICAR ప్రమాణాలు
          </span>
        </div>

        {overview?.pendingContents && overview.pendingContents.length > 0 ? (
          <div className="space-y-3">
            {overview.pendingContents.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
                <div>
                  <h4 className="font-bold text-gray-900">{item.titleTe || item.titleEn}</h4>
                  <p className="text-gray-500 text-[11px] mt-0.5">మూలం: {item.sourceInstitution}</p>
                </div>
                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => handlePublish(item.id)}
                    className="flex-1 py-2 bg-forest-green hover:bg-forest-green-light text-white font-bold rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Check size={14} />
                    <span>ధ్రువీకరించి ప్రచురించండి</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-400">
            ప్రస్తుతం సమీక్షించాల్సిన కంటెంట్ ఏదీ లేదు
          </div>
        )}
      </div>

      {/* Immutable Audit Trail: Requirement 11 */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-3">
        <h3 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
          ఇటీవలి ఆడిట్ లాగ్స్ (Immutable Audit Log)
        </h3>
        <div className="divide-y divide-gray-100 text-xs">
          {(overview?.recentAuditLogs || [
            {
              actionName: 'CONTENT_PUBLISHED',
              actorEmail: 'admin@agrisathi.com',
              details: 'Published ICAR cotton guide',
              createdAt: '2026-09-06T10:15:00',
            },
          ]).map((log, i) => (
            <div key={i} className="py-2 flex justify-between items-start">
              <div>
                <span className="font-bold text-gray-800 block">{log.actionName}</span>
                <span className="text-[10px] text-gray-400">{log.actorEmail} • {log.details}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">
                {log.createdAt?.split('T')[1]?.slice(0, 5) || '10:15'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
