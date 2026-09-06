import React from 'react';
import { ArrowLeft, PhoneCall, ShieldCheck, MapPin, Clock } from 'lucide-react';

export default function ExpertEscalationScreen({ onBack }) {
  const kvkOfficers = [
    {
      name: 'డా. వి. శ్రీనివాసరావు',
      designation: 'సీనియర్ శాస్త్రవేత్త (సస్యరక్షణ)',
      center: 'KVK బనవాసి, యెమ్మిగనూరు, కర్నూలు',
      phone: '1800-180-1551',
      timings: 'ఉదయం 9:00 - సాయంత్రం 5:00',
    },
    {
      name: 'రైతు భరోసా కేంద్రం (RBK)',
      designation: 'గ్రామ వ్యవసాయ సహాయకుడు (VAA)',
      center: 'ఓర్వకల్లు రైతు సేవా కేంద్రం',
      phone: '155251',
      timings: 'ఉదయం 8:30 - సాయంత్రం 5:30',
    },
  ];

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">KVK నిపుణుల సలహా</h2>
          <p className="text-xs text-gray-500">కృషి విజ్ఞాన కేంద్రం & వ్యవసాయ శాస్త్రవేత్తలు</p>
        </div>
      </div>

      {/* Safety Gate Escalation Notice: Requirement 1 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed">
        <strong>బాధ్యతాయుత మార్గదర్శకం:</strong> యాప్ అంచనాలు కేవలం ప్రాథమిక సూచనలు మాత్రమే. అనుమానాస్పద తెగుళ్ళు, వైరస్ లేదా భారీ నష్టం కనిపించినప్పుడు ప్రభుత్వం నియమించిన వ్యవసాయ శాస్త్రవేత్తను నేరుగా సంప్రదించండి.
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {kvkOfficers.map((officer, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-3">
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
      </div>

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
          వారంలో 7 రోజులు ఉదయం 6:00 నుండి రాత్రి 10:00 వరకు
        </span>
      </div>
    </div>
  );
}
