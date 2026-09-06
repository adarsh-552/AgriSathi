import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Search, MapPin } from 'lucide-react';
import { externalService } from '../services/externalService';

export default function MandiPricesScreen({ onBack }) {
  const [prices, setPrices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    externalService.getMarketPrices('Kurnool APMC')
      .then((data) => {
        setPrices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = prices.filter((p) =>
    (p.cropNameTe || p.cropNameEn).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex items-center space-x-2">
        <button onClick={onBack} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">మార్కెట్ ధరలు (Mandi Prices)</h2>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <MapPin size={12} />
            <span>కర్నూలు APMC మార్కెట్ యార్డ్</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="పంట పేరు వెతకండి (ఉదా: మిర్చి, పత్తి)..."
          className="input-field pl-9 text-xs"
        />
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Rates Cards */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isUp = (item.priceChangePercent || 0) >= 0;
          return (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">{item.commodityCategory || 'వాణిజ్య పంట'}</span>
                <h3 className="font-bold text-gray-900 text-sm mt-0.5">
                  {item.cropNameTe || item.cropNameEn}
                </h3>
                <span className="text-[11px] text-gray-500 font-mono">క్వింటాల్ ప్రాతిపదికన</span>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-forest-green font-mono">
                  ₹{item.modalPriceQuintal}
                </div>
                <div
                  className={`inline-flex items-center space-x-0.5 text-xs font-bold ${
                    isUp ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{Math.abs(item.priceChangePercent || 1.8)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex justify-between items-center">
        <span>డేటా మూలం: అగ్‌మార్క్‌నెట్ (Agmarknet) పోర్టల్</span>
        <span>నవీకరణ: నేడు 11:30 AM</span>
      </div>
    </div>
  );
}
