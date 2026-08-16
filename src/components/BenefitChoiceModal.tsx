import React from 'react';
import { X, Coins, Droplet, Sparkles, ShieldCheck, ArrowRight, Check, Zap } from 'lucide-react';
import { CosmeticBottle, UserEcoStats } from '../types';
import { getUserTierDetails } from '../data/ecoTiers';

interface BenefitChoiceModalProps {
  bottle: CosmeticBottle;
  userStats: UserEcoStats;
  onClose: () => void;
  onSelectPoint: (bottle: CosmeticBottle) => void;
  onSelectRefill: (bottle: CosmeticBottle) => void;
}

export const BenefitChoiceModal: React.FC<BenefitChoiceModalProps> = ({
  bottle,
  userStats,
  onClose,
  onSelectPoint,
  onSelectRefill,
}) => {
  const tierDetails = getUserTierDetails(userStats?.totalBottlesRecycled ?? 0);
  const { currentTier } = tierDetails;
  
  const originalPrice = bottle?.originalPrice ?? 0;
  const pickupPoints = bottle?.pickupPoints ?? 0;

  // 1. Refill Option: 30% discount of original price + 10% Points reward
  const refillPrice = Math.round(originalPrice * 0.70);
  const discountAmount = originalPrice - refillPrice;
  const refillEarnedPoints = Math.round(pickupPoints * 0.10);

  // 2. Points Option: 100% full bottle pickup points + tier bonus
  const fullBottlePoints = pickupPoints;
  const bonusRate = currentTier?.bonusRatePercent ?? 0;
  const pointTierBonus = Math.round(fullBottlePoints * (bonusRate / 100));
  const totalPointWithBonus = fullBottlePoints + pointTierBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="benefit-choice-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E5E0] overflow-hidden my-6 animate-fadeIn flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-[#121214] text-[#F8F8F6] p-6 sm:p-8 border-b border-black/10">
          <button
            id="close-benefit-choice-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-[#EAF854] text-[11px] font-mono-code uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EAF854]" />
            <span>SELECT RECYCLE BENEFIT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            공병을 보내주시면 <br className="sm:hidden" />
            어떤 혜택으로 처리해 드릴까요?
          </h2>
          <p className="text-[#A0A0A5] text-xs sm:text-sm mt-1 leading-relaxed">
            원하시는 방식을 선택하시면 맞춤 수거 및 리필 신청 단계로 이동합니다.
          </p>
        </div>

        {/* Selected Cosmetic Bottle Info Strip */}
        <div className="p-5 bg-[#FBFBF9] border-b border-[#E5E5E0] flex items-center gap-4">
          <img
            src={bottle.imageUrl}
            alt={bottle.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-[#E5E5E0] bg-white shadow-2xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap font-mono-code">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#121214] text-white uppercase">
                {bottle.brand}
              </span>
              <span className="text-xs text-[#121214] bg-[#F0F0EB] px-2.5 py-0.5 rounded-full border border-[#E5E5E0] font-bold">
                {bottle.category}
              </span>
              <span className="text-xs text-[#737378]">
                {bottle.capacity} • {bottle.materialKorean}
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-[#121214] truncate mt-1">
              {bottle.name}
            </div>
            <div className="text-xs text-[#737378] mt-0.5 flex items-center gap-2 font-mono-code">
              <span>정가: {originalPrice.toLocaleString()}원</span>
              <span>•</span>
              <span>배출: {bottle.recyclingDifficulty}</span>
            </div>
          </div>
        </div>

        {/* Main 2-Option Selection Grid */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[65vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* OPTION 1: 30% DISCOUNT REFILL */}
            <div 
              id="choice-option-refill-card"
              className="p-6 rounded-3xl border border-[#E5E5E0] hover:border-[#121214] bg-white shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono-code">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#121214] text-[#EAF854] text-[10px] font-bold">
                    <span>OPTION 01</span>
                  </span>
                  <span className="text-xs font-bold text-[#121214] bg-[#EAF854] px-2 py-0.5 rounded-full">-30% REFILL</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#121214] font-display flex items-center gap-1.5">
                      <span>내용물 리필 충전</span>
                    </h3>
                    <p className="text-xs text-[#737378] mt-0.5">
                      정가 30% 할인 완충 + 10% 추가 적립
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F7F4] rounded-2xl border border-[#E5E5E0] space-y-2 font-mono-code">
                    <div className="flex items-center justify-between text-xs text-[#737378]">
                      <span>REFILL PRICE (-30%):</span>
                      <span className="line-through">{originalPrice.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-extrabold text-[#121214]">
                        {refillPrice.toLocaleString()}원
                      </span>
                      <span className="text-xs font-bold text-[#737378]">
                        -{discountAmount.toLocaleString()}원 절약
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#E5E5E0] flex items-center justify-between text-xs">
                      <span className="text-[#737378] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#121214]" />
                        <span>BONUS REWARD:</span>
                      </span>
                      <span className="font-bold text-[#121214] bg-[#EAF854] px-2 py-0.5 rounded-full">
                        +{refillEarnedPoints.toLocaleString()} P
                      </span>
                    </div>
                  </div>

                  <ul className="text-xs text-[#55555A] space-y-1.5 pt-1">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#121214] shrink-0 mt-0.5" />
                      <span>문 앞 비대면 무료 방문 수거 & 세척</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#121214] shrink-0 mt-0.5" />
                      <span>정가 대비 <strong>30% 할인된 가격({refillPrice.toLocaleString()}원)</strong></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#121214] shrink-0 mt-0.5" />
                      <span><strong>10% 포인트(+{refillEarnedPoints.toLocaleString()}P)</strong> 추가 적립</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-5">
                <button
                  id="select-refill-benefit-btn"
                  onClick={() => onSelectRefill(bottle)}
                  className="w-full py-3.5 px-4 rounded-full bg-[#121214] hover:bg-[#2A2A2E] text-white font-mono-code font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 text-[#EAF854]" />
                  <span>30% 리필 및 10% 적립 신청</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#EAF854]" />
                </button>
              </div>
            </div>

            {/* OPTION 2: 100% FULL POINTS REWARD */}
            <div 
              id="choice-option-points-card"
              className="p-6 rounded-3xl border border-[#E5E5E0] hover:border-[#121214] bg-white shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-mono-code">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#121214] text-[#EAF854] text-[10px] font-bold">
                    <span>OPTION 02</span>
                  </span>
                  <span className="text-xs font-bold text-[#121214] bg-[#EAF854] px-2 py-0.5 rounded-full">100% POINTS</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#121214] font-display">
                      공병 포인트로 전액 받기
                    </h3>
                    <p className="text-xs text-[#737378] mt-0.5">
                      공병 맞춤 포인트를 100% 전액 계정으로 적립
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F7F4] rounded-2xl border border-[#E5E5E0] space-y-2 font-mono-code">
                    <div className="flex items-center justify-between text-xs text-[#737378]">
                      <span>100% FULL REWARD:</span>
                      <span className="text-[#121214] font-bold">1P = 1 KRW</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-[#121214]">
                        +{fullBottlePoints.toLocaleString()}
                      </span>
                      <span className="text-sm font-extrabold text-[#737378]">P</span>
                      <span className="text-xs text-[#737378] ml-1">/ PCS</span>
                    </div>

                    {bonusRate > 0 && (
                      <div className="pt-2 border-t border-[#E5E5E0] flex items-center justify-between text-xs text-[#121214]">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Lv.{currentTier.level} 등급 보너스:</span>
                        </span>
                        <span className="font-bold">+{pointTierBonus} P (총 +{totalPointWithBonus.toLocaleString()} P)</span>
                      </div>
                    )}
                  </div>

                  <ul className="text-xs text-[#55555A] space-y-1.5 pt-1">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#121214] shrink-0 mt-0.5" />
                      <span>전국 무료 비대면 문 앞 방문 수거</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#121214] shrink-0 mt-0.5" />
                      <span><strong>본품 화장품 & 리필팩</strong> 포인트 특가 구매 시 100% 사용</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#121214] shrink-0 mt-0.5" />
                      <span>검수 즉시 계정으로 100% 포인트 입금</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-5">
                <button
                  id="select-points-benefit-btn"
                  onClick={() => onSelectPoint(bottle)}
                  className="w-full py-3.5 px-4 rounded-full bg-[#121214] hover:bg-[#2A2A2E] text-white font-mono-code font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5 text-[#EAF854]" />
                  <span>+{fullBottlePoints.toLocaleString()}P (100%) 적립 회수 신청</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#EAF854]" />
                </button>
              </div>
            </div>

          </div>

          {/* Guarantee Note */}
          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0] text-xs text-[#737378]">
            <ShieldCheck className="w-4 h-4 text-[#121214] shrink-0" />
            <p className="leading-relaxed">
              회수된 모든 공병은 에코 클린룸 센터에서 정밀 멸균 세척 공정을 거쳐 안전하게 재활용 및 30% 할인가 리필 완충됩니다.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
