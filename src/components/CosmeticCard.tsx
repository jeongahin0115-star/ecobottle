import React, { useState } from 'react';
import { RefreshCw, Droplet, Coins, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';
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
  const pickupPoints = bottle?.pickupPoints ?? 0;
  const originalPrice = bottle?.originalPrice ?? 0;
  const point10Percent = Math.round(pickupPoints * 0.10);
  const refill30PercentPrice = Math.round(originalPrice * 0.70);

  return (
    <div 
      id={`cosmetic-card-${bottle.id}`}
      className="bg-white rounded-3xl border border-[#E5E5E0] shadow-2xs hover:shadow-xl hover:border-[#121214] transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Product Image and Badges */}
      <div className="relative h-64 bg-[#F7F7F4] overflow-hidden flex items-center justify-center p-4">
        <img
          src={bottle.imageUrl}
          alt={bottle.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Brand Tag Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-3 py-1 text-[10px] font-mono-code font-bold bg-[#121214] text-white rounded-full shadow-2xs uppercase tracking-wider">
            {bottle.brand}
          </span>
          <span className="px-2.5 py-0.5 text-[10px] font-mono-code font-bold rounded-full bg-white/95 text-[#121214] border border-black/10 shadow-2xs">
            {bottle.materialKorean}
          </span>
        </div>

        {/* Capacity Top Right */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 text-[11px] font-mono-code font-bold bg-white/95 text-[#121214] rounded-full shadow-2xs border border-black/10">
            {bottle.capacity}
          </span>
        </div>

        {/* Difficulty Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 text-[10px] font-mono-code font-bold bg-[#121214]/85 text-[#EAF854] rounded-full backdrop-blur-xs shadow-2xs flex items-center gap-1">
            <span>배출: {bottle.recyclingDifficulty}</span>
          </span>
        </div>
      </div>

      {/* Main Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono-code font-bold text-[#737378] uppercase tracking-wider">{bottle.category}</div>
          <h3 className="text-base font-bold text-[#121214] line-clamp-2 leading-snug font-display">
            {bottle.name}
          </h3>
          <p className="text-xs text-[#737378] line-clamp-2 leading-relaxed font-normal">
            {bottle.description}
          </p>
        </div>

        {/* Points & Benefits Section */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0] text-xs font-mono-code">
          
          {/* Benefit 1: 30% Discount Refill + 10% Points */}
          <div className="flex flex-col justify-between p-2.5 rounded-xl bg-white border border-[#E5E5E0] shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#121214]">
              <Droplet className="w-3 h-3 text-[#121214] fill-current" />
              <span>30% REFILL</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-[#121214]">{refill30PercentPrice.toLocaleString()}원</span>
                <span className="text-[9px] text-[#121214] font-bold bg-[#EAF854] px-1 py-0.2 rounded-full">-30%</span>
              </div>
              <div className="text-[10px] text-[#737378] mt-0.5">
                +{point10Percent.toLocaleString()}P (10%)
              </div>
            </div>
          </div>

          {/* Benefit 2: 100% Full Eco Points */}
          <div className="flex flex-col justify-between p-2.5 rounded-xl bg-[#121214] text-white border border-black/10 shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#EAF854]">
              <Coins className="w-3 h-3 text-[#EAF854]" />
              <span>100% POINTS</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-extrabold text-white">+{pickupPoints.toLocaleString()}</span>
                <span className="text-xs font-bold text-[#EAF854]">P</span>
              </div>
              <div className="text-[10px] text-white/70 mt-0.5">
                전액 100% 지급
              </div>
            </div>
          </div>

        </div>

        {/* Action Button: Single prominent Pickup button */}
        <div className="pt-1">
          <button
            id={`pickup-btn-${bottle.id}`}
            onClick={() => onRequestPickup(bottle)}
            className="w-full py-3.5 px-4 rounded-full bg-[#121214] hover:bg-[#2A2A2E] text-white font-mono-code font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#EAF854] group-hover/btn:rotate-180 transition-transform duration-500" />
            <span>수거 & 리필 신청 (혜택 선택)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#EAF854]" />
          </button>
        </div>

        {/* Expandable Eco Details Toggle */}
        <div className="border-t border-[#E5E5E0] pt-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-xs text-[#737378] hover:text-[#121214] py-1 transition-colors cursor-pointer font-mono-code"
          >
            <span className="font-bold flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#121214]" />
              <span>에코 분리배출 팁 & 사양</span>
            </span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0] text-xs text-[#55555A] space-y-2 animate-fadeIn">
              <p className="leading-relaxed">
                <strong className="text-[#121214] font-bold">💡 배출 팁: </strong>
                {bottle.ecoTip}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bottle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-white border border-[#E5E5E0] text-[#121214] text-[10px] font-mono-code font-medium"
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
