import React from 'react';
import { X, Award, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Gift, Zap } from 'lucide-react';
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
  const tierDetails = getUserTierDetails(userStats.totalBottlesRecycled);
  const { currentTier, nextTier, bottlesToNext, progressPercent } = tierDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div 
        id="eco-tier-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner">
                {currentTier.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">에코 등급 시스템</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-extrabold">
                    Lv.{currentTier.level} {currentTier.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  회수한 공병 개수에 따라 등급이 올라가며 수거 포인트 추가 보너스와 특별 혜택이 주어집니다.
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
          <div className="mt-5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
              <div className="flex items-center gap-1.5">
                <span>현재 회수한 공병:</span>
                <span className="text-amber-300 text-sm font-extrabold">{userStats.totalBottlesRecycled}개</span>
              </div>
              {nextTier ? (
                <div className="text-emerald-300">
                  다음 <span className="font-extrabold">{nextTier.name}</span>까지 <span className="underline font-black">{bottlesToNext}개</span> 남음
                </div>
              ) : (
                <div className="text-purple-300 font-extrabold">
                  🎉 최고 등급 달성 완료!
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
              <span>{currentTier.name} ({currentTier.minBottles}개)</span>
              <span>{progressPercent}% 달성</span>
              <span>{nextTier ? `${nextTier.name} (${nextTier.minBottles}개)` : 'MAX'}</span>
            </div>
          </div>
        </div>

        {/* Tier Tiers List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            전체 5단계 에코 등급 및 혜택 안내
          </div>

          <div className="space-y-3">
            {ECO_TIERS.map((tier) => {
              const isCurrent = tier.id === currentTier.id;
              const isAchieved = userStats.totalBottlesRecycled >= tier.minBottles;

              return (
                <div
                  key={tier.id}
                  className={`p-4.5 rounded-2xl border transition-all relative ${
                    isCurrent
                      ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                      : isAchieved
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-white border-slate-200/80 opacity-80'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-3 right-3 text-[11px] font-extrabold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>현재 내 등급</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div className="text-3xl shrink-0 p-2 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center">
                      {tier.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">Lv.{tier.level}</span>
                        <h4 className="text-base font-extrabold text-slate-900">{tier.name}</h4>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {tier.maxBottles === null
                            ? `${tier.minBottles}개 이상 회수`
                            : `${tier.minBottles} ~ ${tier.maxBottles}개 회수`}
                        </span>
                        {tier.bonusRatePercent > 0 && (
                          <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                            <span>수거 포인트 +{tier.bonusRatePercent}% 추가</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 mb-2 font-medium">
                        {tier.description}
                      </p>

                      {/* Perks */}
                      <div className="space-y-1 bg-white/70 p-2.5 rounded-xl border border-slate-200/60">
                        {tier.perks.map((perk, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="font-medium">{perk}</span>
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
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            공병을 수거할 때마다 실시간으로 승급되며 포인트 보너스가 커집니다.
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToSearch && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToSearch();
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>공병 수거하고 승급하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
