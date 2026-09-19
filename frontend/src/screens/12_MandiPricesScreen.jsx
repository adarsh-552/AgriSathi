import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Search, MapPin, RefreshCw, Building2 } from 'lucide-react';
import { externalService } from '../services/externalService';
import { useLanguage } from '../context/LanguageContext';

export default function MandiPricesScreen({ onBack }) {
  const { lang } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('Kurnool');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPrices = (market) => {
    setLoading(true);
    externalService.getMarketPrices(market)
      .then((data) => {
        setPrices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrices(selectedMarket);
  }, [selectedMarket]);

  const filtered = prices.filter((p) => {
    const name = lang === 'hi' ? p.commodityHi : lang === 'en' ? p.commodityEn : p.commodityTe;
    const matchesSearch = 
      (name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.commodityEn && p.commodityEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.marketName && p.marketName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'COMMERCIAL') return p.category === 'COMMERCIAL' || p.commodityEn?.includes('Cotton') || p.commodityEn?.includes('Chilli');
    if (selectedCategory === 'GRAINS') return p.category === 'CEREALS' || p.commodityEn?.includes('Paddy') || p.commodityEn?.includes('Maize');
    if (selectedCategory === 'PULSES') return p.category === 'PULSES' || p.commodityEn?.includes('Gram');

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
            <h2 className="text-xl font-black text-gray-900">మార్కెట్ ధరలు (Mandi Prices)</h2>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin size={12} className="text-forest-green" />
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="bg-transparent font-bold text-forest-green underline focus:outline-none cursor-pointer"
              >
                <option value="Kurnool">కర్నూలు APMC (Kurnool)</option>
                <option value="Warangal">వరంగల్ వ్యవసాయ మార్కెట్ (Warangal)</option>
                <option value="Guntur">గుంటూరు మిర్చి యార్డ్ (Guntur)</option>
                <option value="Khammam">ఖమ్మం APMC (Khammam)</option>
                <option value="Nizamabad">నిజామాబాద్ మార్కెట్ (Nizamabad)</option>
                <option value="Adoni">ఆదోని పత్తి మార్కెట్ (Adoni)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchPrices(selectedMarket)}
          disabled={loading}
          className="p-2 text-gray-600 hover:text-forest-green rounded-full bg-gray-100 transition disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="పంట పేరు వెతకండి (ఉదా: పత్తి, మిరప, వరి, మొక్కజొన్న)..."
          className="input-field pl-9 text-xs"
        />
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'అన్నీ (All Crops)' },
          { id: 'COMMERCIAL', label: 'వాణిజ్య పంటలు (Cotton/Chilli)' },
          { id: 'GRAINS', label: 'ధాన్యాలు (Paddy/Maize)' },
          { id: 'PULSES', label: 'పప్పుధాన్యాలు (Pulses)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === tab.id
                ? 'bg-forest-green text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rates Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs text-gray-500">ధరల వివరాలను లోడ్ చేస్తున్నాము...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
          <Building2 size={36} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-bold text-gray-700">ధరలు లభించలేదు</p>
          <p className="text-xs text-gray-500 mt-1">వేరొక మార్కెట్ లేదా పంట పేరుతో వెతకండి.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, idx) => {
            const isUp = (item.modalPrice >= item.minPrice + (item.maxPrice - item.minPrice) * 0.5);
            const name = lang === 'hi' ? item.commodityHi : lang === 'en' ? item.commodityEn : item.commodityTe;

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-forest-green tracking-wider block">
                    {item.variety || item.marketName || 'APMC మార్కెట్'}
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm mt-0.5">
                    {name || item.commodityEn}
                  </h3>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    పరిధి: ₹{item.minPrice} - ₹{item.maxPrice} / క్వింటాల్
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-400">సగటు ధర (Modal)</div>
                  <div className="text-lg font-black text-forest-green font-mono">
                    ₹{item.modalPrice}
                  </div>
                  <div
                    className={`inline-flex items-center space-x-0.5 text-[11px] font-bold ${
                      isUp ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    <span>{isUp ? 'స్థిరమైన గిరాకీ' : 'స్వల్ప తగ్గుదల'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agmarknet Portal Attribution */}
      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex justify-between items-center">
        <span>డేటా మూలం: అగ్‌మార్క్‌నెట్ (Agmarknet) పోర్టల్</span>
        <span>నవీకరణ: రోజువారీ ధరలు</span>
      </div>
    </div>
  );
}
