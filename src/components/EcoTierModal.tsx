import React from 'react';
import { X, Check, ArrowRight, Zap } from 'lucide-react';
import { ECO_TIERS, getUserTierDetails } from '../data/ecoTiers';
import { UserEcoStats } from '../types';

interface EcoTierModalProps {
  userStats: UserEcoStats;
  onClose: () => void;
  onNavigateToSearch?: () => void;
}

export const EcoTierModal: React.FC<EcoTierModalProps> = ({
  userStats,
  onClose,
  onNavigateToSearch,
}) => {
  const recycledCount = userStats?.totalBottlesRecycled ?? 0;
  const tierDetails = getUserTierDetails(recycledCount);
  const { currentTier, nextTier, bottlesToNext, progressPercent } = tierDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="eco-tier-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E5E0] overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#121214] text-[#F8F8F6] p-6 sm:p-8 shrink-0 relative overflow-hidden border-b border-black/10">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-2xl shadow-inner">
                {currentTier.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight text-white font-display">에코 멤버십 티어 시스템</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF854] text-[#121214] font-mono-code font-bold">
                    Lv.{currentTier.level} {currentTier.name}
                  </span>
                </div>
                <p className="text-xs text-[#A0A0A5] mt-0.5 font-mono-code">
                  RECYCLE TIER PROGRESSION & BONUS RATES
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Tier Progress Box */}
          <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono-code">
            <div className="flex items-center justify-between text-xs font-bold text-[#A0A0A5] mb-2">
              <div className="flex items-center gap-1.5">
                <span>TOTAL RECYCLED:</span>
                <span className="text-white text-sm font-extrabold">{recycledCount} PCS</span>
              </div>
              {nextTier ? (
                <div className="text-[#EAF854]">
                  NEXT: {nextTier.name} ({bottlesToNext} LEFT)
                </div>
              ) : (
                <div className="text-[#EAF854] font-bold">
                  MAX TIER LEVEL ACHIEVED
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2.5 p-0.5 overflow-hidden">
              <div
                className="bg-[#EAF854] h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] text-[#88888D] mt-1.5">
              <span>{currentTier.name} ({currentTier.minBottles} PCS)</span>
              <span>{progressPercent}% COMPLETED</span>
              <span>{nextTier ? `${nextTier.name} (${nextTier.minBottles} PCS)` : 'MAX'}</span>
            </div>
          </div>
        </div>

        {/* Tier Tiers List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 font-mono-code">
          <div className="text-xs font-bold uppercase tracking-wider text-[#737378]">
            MEMBERSHIP TIERS
          </div>

          <div className="space-y-3">
            {ECO_TIERS.map((tier) => {
              const isCurrent = tier.id === currentTier.id;
              const isAchieved = recycledCount >= tier.minBottles;

              return (
                <div
                  key={tier.id}
                  className={`p-5 rounded-2xl border transition-all relative ${
                    isCurrent
                      ? 'bg-[#F7F7F4] border-[#121214] shadow-xs ring-1 ring-[#121214]'
                      : isAchieved
                      ? 'bg-white border-[#E5E5E0]'
                      : 'bg-white border-[#E5E5E0] opacity-60'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-3 right-3 text-[10px] font-bold bg-[#121214] text-[#EAF854] px-2.5 py-0.5 rounded-full shadow-2xs">
                      CURRENT TIER
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div className="text-2xl shrink-0 p-2.5 rounded-xl bg-white border border-[#E5E5E0] shadow-2xs flex items-center justify-center">
                      {tier.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#737378]">Lv.{tier.level}</span>
                        <h4 className="text-sm font-bold text-[#121214] font-display">{tier.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#F0F0EB] text-[#121214]">
                          {tier.maxBottles === null
                            ? `${tier.minBottles}+ PCS`
                            : `${tier.minBottles} ~ ${tier.maxBottles} PCS`}
                        </span>
                        {tier.bonusRatePercent > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#EAF854] text-[#121214] flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>+{tier.bonusRatePercent}% BONUS</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#737378] mt-1 mb-2 font-sans">
                        {tier.description}
                      </p>

                      {/* Perks */}
                      <div className="space-y-1 bg-[#FBFBF9] p-3 rounded-xl border border-[#E5E5E0] font-sans">
                        {tier.perks.map((perk, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#55555A]">
                            <Check className="w-3.5 h-3.5 text-[#121214] shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-5 bg-[#FBFBF9] border-t border-[#E5E5E0] flex items-center justify-between shrink-0 font-mono-code">
          <div className="text-xs text-[#737378] hidden sm:block">
            공병을 수거할 때마다 실시간으로 승급되며 포인트 보너스가 커집니다.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onNavigateToSearch && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSearch();
                }}
                className="px-5 py-2.5 bg-[#121214] hover:bg-[#2A2A2E] text-white font-bold text-xs rounded-full shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>RECYCLE NOW</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EAF854]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-[#F7F7F4] text-[#121214] font-bold text-xs rounded-full border border-[#E5E5E0] transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
