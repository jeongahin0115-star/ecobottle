import React, { useState } from 'react';
import { RefreshCw, Droplet, CheckCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { CosmeticBottle } from '../types';

interface CosmeticCardProps {
  bottle: CosmeticBottle;
  onRequestPickup: (bottle: CosmeticBottle) => void;
  onRequestRefill?: (bottle: CosmeticBottle) => void;
}

export const CosmeticCard: React.FC<CosmeticCardProps> = ({
  bottle,
  onRequestPickup,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const point10Percent = Math.round(bottle.pickupPoints * 0.10);
  const refill30PercentPrice = Math.round(bottle.originalPrice * 0.70);

  const getMaterialColor = (material: string) => {
    switch (material) {
      case 'Glass':
        return 'bg-blue-50/90 text-blue-700 border-blue-200';
      case 'PET':
        return 'bg-emerald-50/90 text-emerald-700 border-emerald-200';
      case 'PP':
        return 'bg-indigo-50/90 text-indigo-700 border-indigo-200';
      case 'Aluminum':
        return 'bg-amber-50/90 text-amber-700 border-amber-200';
      case 'PE Tube':
        return 'bg-teal-50/90 text-teal-700 border-teal-200';
      default:
        return 'bg-purple-50/90 text-purple-700 border-purple-200';
    }
  };

  return (
    <div 
      id={`cosmetic-card-${bottle.id}`}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-6px_rgba(6,78,59,0.12)] transition-all duration-300 flex flex-col overflow-hidden group hover:border-emerald-300"
    >
      {/* Product Image and Badges */}
      <div className="relative h-60 bg-slate-100/80 overflow-hidden flex items-center justify-center p-4">
        <img
          src={bottle.imageUrl}
          alt={bottle.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Brand Tag Top Left */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 text-[11px] font-black bg-slate-950/85 backdrop-blur-md text-white rounded-xl shadow-xs tracking-tight">
            {bottle.brand}
          </span>
          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border backdrop-blur-xs ${getMaterialColor(bottle.material)} shadow-xs`}>
            {bottle.materialKorean}
          </span>
        </div>

        {/* Capacity Top Right */}
        <div className="absolute top-3.5 right-3.5">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-white/90 backdrop-blur-md text-slate-800 rounded-xl shadow-xs border border-slate-200/80">
            {bottle.capacity}
          </span>
        </div>

        {/* Difficulty Pill */}
        <div className="absolute bottom-3.5 left-3.5">
          <span className="px-2.5 py-0.5 text-[10px] font-bold bg-white/90 text-emerald-800 rounded-lg backdrop-blur-md border border-emerald-200/70 shadow-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>분리배출: {bottle.recyclingDifficulty}</span>
          </span>
        </div>
      </div>

      {/* Main Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">{bottle.category}</div>
          <h3 className="text-base font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {bottle.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
            {bottle.description}
          </p>
        </div>

        {/* Points & Benefits Section */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs">
          
          {/* Benefit 1: 30% Discount Refill + 10% Points */}
          <div className="flex flex-col justify-between p-2.5 rounded-xl bg-teal-50/90 border border-teal-200/90 shadow-xs">
            <div className="flex items-center gap-1 text-[11px] font-bold text-teal-900">
              <Droplet className="w-3.5 h-3.5 text-teal-600 shrink-0 fill-current" />
              <span>30% 할인 리필</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-teal-800">{refill30PercentPrice.toLocaleString()}원</span>
                <span className="text-[10px] text-teal-700 font-extrabold bg-teal-200/60 px-1 py-0.2 rounded">30%↓</span>
              </div>
              <div className="text-[10px] text-teal-800 font-bold mt-0.5">
                +{point10Percent.toLocaleString()}P(10%) 추가
              </div>
            </div>
          </div>

          {/* Benefit 2: 100% Full Eco Points */}
          <div className="flex flex-col justify-between p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 shadow-xs">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>공병 100% 포인트</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-black text-emerald-800">+{bottle.pickupPoints.toLocaleString()}</span>
                <span className="text-xs font-black text-emerald-700">P</span>
                <span className="text-[10px] text-slate-400 font-medium ml-0.5">/개</span>
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                공병 맞춤 100% 전액 적립
              </div>
            </div>
          </div>

        </div>

        {/* Action Button: Single prominent Pickup button */}
        <div className="pt-1">
          <button
            id={`pickup-btn-${bottle.id}`}
            onClick={() => onRequestPickup(bottle)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>회수 신청하기 (30%할인 리필+10%P / 100%포인트)</span>
          </button>
        </div>

        {/* Expandable Eco Details Toggle */}
        <div className="border-t border-slate-100 pt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 py-1 transition-colors cursor-pointer"
          >
            <span className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>에코 분리수거 팁 & 용기 스펙</span>
            </span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/90 text-xs text-slate-700 space-y-2 animate-fadeIn">
              <p className="leading-relaxed">
                <strong className="text-emerald-900 font-bold">💡 배출 팁: </strong>
                {bottle.ecoTip}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bottle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 text-[10px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
