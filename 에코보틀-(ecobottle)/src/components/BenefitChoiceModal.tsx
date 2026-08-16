import React from 'react';
import { X, Coins, Droplet, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Zap, Gift, Tag } from 'lucide-react';
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
  const tierDetails = getUserTierDetails(userStats.totalBottlesRecycled);
  const { currentTier } = tierDetails;
  
  // 1. Refill Option: 30% discount of original price + 10% Points reward
  const refillPrice = Math.round(bottle.originalPrice * 0.70); // 30% discounted price
  const discountAmount = bottle.originalPrice - refillPrice;
  const refillEarnedPoints = Math.round(bottle.pickupPoints * 0.10); // 10% points reward

  // 2. Points Option: 100% full bottle pickup points as requested ("포인트만 받는 거는 그에 맞는 포인트를 지급")
  const fullBottlePoints = bottle.pickupPoints;
  const pointTierBonus = Math.round(fullBottlePoints * (currentTier.bonusRatePercent / 100));
  const totalPointWithBonus = fullBottlePoints + pointTierBonus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        id="benefit-choice-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-6 animate-fadeIn flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#062c1e] via-[#0b3d2b] to-[#041d13] text-white p-6 sm:p-7">
          <button
            id="close-benefit-choice-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-4 h-4 text-emerald-400" />
            <span>공병 회수 혜택 선택</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            공병을 보내주시면 <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
              어떤 혜택으로 처리해 드릴까요?
            </span>
          </h2>
          <p className="text-slate-200/90 text-xs sm:text-sm mt-1.5 leading-relaxed font-normal">
            원하시는 방식을 선택하시면 맞춤 수거 및 리필 신청 단계로 안내해 드립니다.
          </p>
        </div>

        {/* Selected Cosmetic Bottle Info Strip */}
        <div className="p-4 sm:p-5 bg-slate-50/90 border-b border-slate-200/80 flex items-center gap-4">
          <img
            src={bottle.imageUrl}
            alt={bottle.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-slate-200/90 bg-white shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-900 text-white">
                {bottle.brand}
              </span>
              <span className="text-xs text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                {bottle.category}
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {bottle.capacity} • {bottle.materialKorean}
              </span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 truncate mt-1">
              {bottle.name}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>정가: <strong className="text-slate-700 font-bold">{bottle.originalPrice.toLocaleString()}원</strong></span>
              <span>•</span>
              <span>용기: <strong className="text-slate-700 font-bold">{bottle.materialKorean}</strong></span>
              <span>•</span>
              <span>분리배출: <strong className="text-slate-700 font-bold">{bottle.recyclingDifficulty}</strong></span>
            </div>
          </div>
        </div>

        {/* Main 2-Option Selection Grid */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* OPTION 1: 30% DISCOUNT REFILL + 10% POINTS (정가 30% 할인 + 10% 포인트 적립) */}
            <div 
              id="choice-option-refill-card"
              className="relative p-5 sm:p-6 rounded-3xl border-2 border-teal-400/90 hover:border-teal-600 bg-gradient-to-b from-teal-50/80 via-white to-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Highlight Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-xs font-black shadow-xs">
                  <Tag className="w-3.5 h-3.5 text-amber-200" />
                  <span>30% 할인 + 10%P 적립</span>
                </span>
                <span className="text-[11px] font-black text-teal-800">옵션 1</span>
              </div>

              {/* Title & Price */}
              <div className="space-y-2.5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-900 transition-colors flex items-center gap-1.5">
                    <span>🧴 내용물 리필 충전 받기</span>
                  </h3>
                  <p className="text-xs text-teal-900 font-bold mt-0.5">
                    정가 30% 특가 재배송 + 공병 10% 포인트 추가 적립!
                  </p>
                </div>
                
                {/* Cost Box */}
                <div className="p-3.5 bg-teal-50/80 rounded-2xl border border-teal-200/90 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-teal-900">
                    <span className="font-bold">리필 충전가 (30% 할인):</span>
                    <span className="text-xs line-through text-slate-400">정가 {bottle.originalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-teal-800">
                        {refillPrice.toLocaleString()}원
                      </span>
                      <span className="text-xs font-black text-teal-800 bg-teal-200/80 px-2 py-0.5 rounded-full ml-1">
                        30% 할인
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-800">
                        -{discountAmount.toLocaleString()}원 절약
                      </span>
                    </div>
                  </div>

                  {/* 10% Bonus Point Strip */}
                  <div className="pt-1.5 border-t border-teal-200/80 flex items-center justify-between text-xs">
                    <span className="text-teal-900 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>추가 보너스 포인트:</span>
                    </span>
                    <span className="font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
                      +{refillEarnedPoints.toLocaleString()}P (10% 적립)
                    </span>
                  </div>

                  <div className="text-[11px] text-teal-800 font-medium pt-0.5">
                    에코 클린룸 멸균 세척 + 정품 원액 100% 완충 + 무료 왕복 수거/배송
                  </div>
                </div>

                {/* Features List */}
                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>문 앞 비대면 무료 방문 수거</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>정가 대비 <strong>30% 할인된 가격({refillPrice.toLocaleString()}원)</strong>으로 재구매 효과</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>10% 포인트(+{refillEarnedPoints.toLocaleString()}P)</strong> 추가 적립</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <button
                  id="select-refill-benefit-btn"
                  onClick={() => onSelectRefill(bottle)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Droplet className="w-4 h-4 fill-current" />
                  <span>30% 할인가({refillPrice.toLocaleString()}원) + {refillEarnedPoints.toLocaleString()}P 리필 신청</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OPTION 2: 100% FULL POINTS REWARD (포인트만 받는 거는 그에 맞는 100% 포인트 지급) */}
            <div 
              id="choice-option-points-card"
              className="relative p-5 sm:p-6 rounded-3xl border-2 border-emerald-300 hover:border-emerald-500 bg-gradient-to-b from-emerald-50/50 to-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>공병 맞춤 100% 전액 적립</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">옵션 2</span>
              </div>

              {/* Title & Reward */}
              <div className="space-y-2.5">
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                    💰 공병 포인트로 받기
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    공병 회수 후 공병 맞춤 포인트를 100% 전액 계정으로 적립
                  </p>
                </div>
                
                {/* Reward Value */}
                <div className="p-3.5 bg-white rounded-2xl border border-emerald-200/90 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>수거 완료 검수 시 100% 전액 즉시 지급</span>
                    <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                      100% 적립
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                      +{fullBottlePoints.toLocaleString()}
                    </span>
                    <span className="text-sm font-black text-amber-600">P</span>
                    <span className="text-xs text-slate-400 ml-1">/ 개당 (공병 맞춤 100% 지급)</span>
                  </div>

                  {/* Tier bonus note */}
                  {currentTier.bonusRatePercent > 0 && (
                    <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-amber-700">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-600 shrink-0" />
                      <span>
                        Lv.{currentTier.level} {currentTier.name} 혜택: +{pointTierBonus}P 추가 (총 +{totalPointWithBonus.toLocaleString()}P)
                      </span>
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>전국 무료 비대면 문 앞 방문 수거</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>본품 화장품 & 리필팩</strong> 포인트 특가 구매 시 100% 현금처럼 사용</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>검수 즉시 계정으로 100% 포인트 입금</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <button
                  id="select-points-benefit-btn"
                  onClick={() => onSelectPoint(bottle)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Coins className="w-4 h-4" />
                  <span>+{fullBottlePoints.toLocaleString()}P (100%) 받고 회수 신청</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Environmental Guarantee Note */}
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-slate-100/80 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="leading-tight">
              회수된 모든 공병은 에코 클린룸 센터에서 정밀 세척 및 멸균 공정을 거쳐 안전하게 재활용 및 30% 할인가 리필 재배송됩니다.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
