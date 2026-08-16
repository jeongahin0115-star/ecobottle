import React from 'react';
import { 
  Search, 
  RefreshCw, 
  ShoppingBag, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  TreePine, 
  Check, 
  Zap, 
  ChevronRight,
  Droplet
} from 'lucide-react';
import { CosmeticBottle, UserEcoStats } from '../types';
import { getUserTierDetails } from '../data/ecoTiers';

interface HomeViewProps {
  userStats: UserEcoStats;
  popularBottles: CosmeticBottle[];
  onNavigateTab: (tab: 'search' | 'shop' | 'activity' | 'guide') => void;
  onOpenPickupModal: (bottle: CosmeticBottle) => void;
  onOpenRefillModal: (bottle: CosmeticBottle) => void;
  onOpenTierModal: () => void;
  onSelectSearchKeyword: (keyword: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userStats,
  popularBottles,
  onNavigateTab,
  onOpenPickupModal,
  onOpenTierModal,
}) => {
  const tierDetails = getUserTierDetails(userStats?.totalBottlesRecycled ?? 0);
  const { currentTier, nextTier, bottlesToNext, progressPercent } = tierDetails;
  const userPoints = userStats?.points ?? 0;
  const totalRecycled = userStats?.totalBottlesRecycled ?? 0;
  const co2Saved = userStats?.co2SavedKg ?? 0;
  const plasticGlassSaved = userStats?.plasticGlassSavedKg ?? 0;
  const treesSaved = userStats?.treesSaved ?? 0;

  return (
    <div className="space-y-12 animate-fadeIn pb-8">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-[#121214] text-[#F8F8F6] p-8 sm:p-14 border border-black/10 shadow-2xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAF854]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          
          {/* User Tier Greeting Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-[#EAF854] font-mono-code backdrop-blur-md">
            <span>{currentTier.icon}</span>
            <span className="font-bold text-white">USER ARCHIVE</span>
            <span className="text-[#A0A0A5]">•</span>
            <button 
              onClick={onOpenTierModal}
              className="text-[#EAF854] font-bold underline underline-offset-4 hover:opacity-80 transition-opacity flex items-center gap-0.5 cursor-pointer"
            >
              <span>Lv.{currentTier.level} {currentTier.name}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight text-white font-display">
              다 쓴 화장품 공병, <br />
              <span className="text-[#EAF854]">
                30% 리필 할인과 100% 포인트
              </span>
              로 회수하세요.
            </h1>
            <p className="text-[#A0A0A5] text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              어떤 화장품이든 검색 한 번으로 수거 포인트를 확인하고 비대면 수거를 예약하세요. 
              수거된 공병은 멸균 세척되어 정가 대비 30% 할인가 원액 충전 또는 100% 전액 포인트로 즉시 전환됩니다.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono-code">
            <button
              id="home-cta-search-btn"
              onClick={() => onNavigateTab('search')}
              className="px-8 py-4 bg-[#EAF854] hover:bg-[#D8E645] active:scale-[0.98] text-[#121214] font-bold text-xs sm:text-sm rounded-full shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#121214]" />
              <span>SEARCH & RECYCLE BOTTLES</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="home-cta-shop-btn"
              onClick={() => onNavigateTab('shop')}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-full border border-white/15 flex items-center gap-2 transition-all backdrop-blur-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#EAF854]" />
              <span>POINT MARKET</span>
            </button>

            <button
              onClick={onOpenTierModal}
              className="px-4 py-4 text-xs text-[#A0A0A5] hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#EAF854]" />
              <span>TIER PRIVILEGES</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. USER ECO TIER & STATUS CARD */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <h2 className="text-xl font-extrabold text-[#121214] tracking-tight font-display">내 에코 등급 및 회수 현황</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#121214] text-[#EAF854] font-mono-code font-bold">
                {currentTier.name}
              </span>
            </div>
            <p className="text-xs text-[#737378] mt-1 font-mono-code">
              MEMBERSHIP TIER & SUSTAINABILITY IMPACT
            </p>
          </div>

          <button
            id="home-view-tier-modal-btn"
            onClick={onOpenTierModal}
            className="self-start sm:self-auto px-4 py-2 bg-[#F7F7F4] hover:bg-[#EBEBE8] text-[#121214] text-xs font-mono-code font-bold rounded-full border border-[#E5E5E0] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>VIEW ALL 5 TIERS</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tier Progress & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Level Progress Meter */}
          <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-[#F7F7F4] border border-[#E5E5E0] space-y-5 font-mono-code">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#737378]">TOTAL BOTTLES RECYCLED</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#121214] flex items-center gap-2 mt-0.5">
                  <span>{totalRecycled} PCS</span>
                  {currentTier.bonusRatePercent > 0 && (
                    <span className="text-[10px] font-bold text-[#121214] bg-[#EAF854] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-[#121214]" />
                      <span>+{currentTier.bonusRatePercent}% BONUS RATE</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-[#737378]">MY BALANCE</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#121214] flex items-center justify-end gap-1 mt-0.5">
                  <Coins className="w-5 h-5 text-[#121214]" />
                  <span>{userPoints.toLocaleString()}</span>
                  <span className="text-sm font-bold text-[#737378]">P</span>
                </div>
              </div>
            </div>

            {/* Progress Bar to next tier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#121214]">
                  Lv.{currentTier.level} {currentTier.name} ({currentTier.minBottles} PCS)
                </span>
                {nextTier ? (
                  <span className="text-[#737378]">
                    NEXT: <strong className="text-[#121214]">{nextTier.name}</strong> ({bottlesToNext} LEFT)
                  </span>
                ) : (
                  <span className="text-[#121214] font-bold">MAX TIER ACHIEVED</span>
                )}
              </div>

              <div className="w-full bg-[#E5E5E0] rounded-full h-2.5 p-0.5 overflow-hidden">
                <div 
                  className="bg-[#121214] h-full rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#88888D]">
                <span>{progressPercent}% COMPLETED</span>
                <span>{nextTier ? `TARGET: ${nextTier.minBottles}+ PCS` : 'LEGEND'}</span>
              </div>
            </div>

            {/* Current Tier Perks Highlights */}
            <div className="pt-3 border-t border-[#E5E5E0] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              {currentTier.perks.slice(0, 2).map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#55555A]">
                  <Check className="w-3.5 h-3.5 text-[#121214] shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Environmental Contribution */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#121214] text-[#F8F8F6] flex flex-col justify-between space-y-4 border border-black/10">
            <div>
              <div className="text-[11px] font-mono-code font-bold text-[#EAF854] flex items-center gap-1.5 uppercase">
                <TreePine className="w-4 h-4" />
                <span>ECO IMPACT METRICS</span>
              </div>
              <div className="text-sm font-medium text-white/90 mt-1 font-display">
                작은 공병 하나가 만드는 자원 순환
              </div>
            </div>

            <div className="space-y-2 font-mono-code">
              <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[#A0A0A5]">CO₂ SAVED</span>
                <span className="font-extrabold text-white text-sm">
                  {co2Saved.toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[#A0A0A5]">RECYCLED MASS</span>
                <span className="font-extrabold text-white text-sm">
                  {plasticGlassSaved.toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white/5 p-3 rounded-2xl border border-white/10">
                <span className="text-[#A0A0A5]">TREES SAVED</span>
                <span className="font-extrabold text-[#EAF854] text-sm">
                  {treesSaved.toFixed(1)} TREES
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('guide')}
              className="text-xs font-mono-code text-[#EAF854] hover:underline flex items-center justify-between pt-1 cursor-pointer"
            >
              <span>[RECYCLE GUIDELINES]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. 3-STEP HOW IT WORKS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono-code font-bold text-[#121214] bg-[#F0F0EB] px-3 py-1 rounded-full uppercase tracking-wider">
            3-STEP RECYCLE PROCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121214] tracking-tight font-display">비대면 공병 회수 3단계</h2>
          <p className="text-xs text-[#737378]">
            문 앞에 두시기만 하면 전담 기사님이 무료로 수거하고 혜택을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E5E5E0] shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#121214] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#121214] text-[#EAF854] flex items-center justify-center font-mono-code font-extrabold text-sm shadow-2xs">
              01
            </div>
            <h3 className="text-base font-bold text-[#121214] font-display">공병 검색 및 무료 수거 신청</h3>
            <p className="text-xs text-[#737378] leading-relaxed">
              다 쓴 화장품 공병을 검색하여 예상 포인트를 확인하고 희망하는 수거 날짜와 장소를 입력합니다.
            </p>
            <div className="pt-2 text-xs font-mono-code font-bold text-[#121214]">
              FREE 100% DISPATCH
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E5E5E0] shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#121214] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#121214] text-[#EAF854] flex items-center justify-center font-mono-code font-extrabold text-sm shadow-2xs">
              02
            </div>
            <h3 className="text-base font-bold text-[#121214] font-display">비대면 문 앞 보관</h3>
            <p className="text-xs text-[#737378] leading-relaxed">
              내용물을 비우고 가볍게 헹군 공병을 쇼핑백이나 상자에 담아 문 앞에 놓아두시면 기사님이 방문 수거합니다.
            </p>
            <div className="pt-2 text-xs font-mono-code font-bold text-[#121214]">
              CONTACTLESS PICKUP
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E5E5E0] shadow-2xs space-y-3 relative overflow-hidden group hover:border-[#121214] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#121214] text-[#EAF854] flex items-center justify-center font-mono-code font-extrabold text-sm shadow-2xs">
              03
            </div>
            <h3 className="text-base font-bold text-[#121214] font-display">검수 및 30% 리필 / 100% 포인트</h3>
            <p className="text-xs text-[#737378] leading-relaxed">
              검수 즉시 계정으로 포인트가 입금되거나 30% 할인가 정품 리필 완충품이 무료 재배송됩니다.
            </p>
            <div className="pt-2 text-xs font-mono-code font-bold text-[#121214]">
              INSTANT REWARD (1P = 1 KRW)
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR COLLECTABLE COSMETICS (HOT PICKS) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#121214]" />
              <h2 className="text-xl font-extrabold text-[#121214] tracking-tight font-display">실시간 최다 회수 공병</h2>
            </div>
            <p className="text-xs text-[#737378] mt-0.5">
              지금 많은 분들이 문 앞에서 회수 신청하고 있는 대표 화장품 공병입니다.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-mono-code font-bold text-[#121214] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>VIEW ALL {popularBottles.length} ITEMS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularBottles.slice(0, 4).map((bottle) => {
            const refillPrice = Math.round((bottle?.originalPrice ?? 0) * 0.70);
            const bottlePoints = bottle?.pickupPoints ?? 0;

            return (
              <div 
                key={bottle.id}
                className="bg-white rounded-3xl border border-[#E5E5E0] overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#121214] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 bg-[#F7F7F4] overflow-hidden">
                    <img
                      src={bottle.imageUrl}
                      alt={bottle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#121214] text-white text-[10px] font-mono-code font-bold rounded-full">
                      {bottle.brand}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#EAF854] text-[#121214] text-[10px] font-mono-code font-bold rounded-full shadow-2xs">
                      +{bottlePoints.toLocaleString()}P
                    </span>
                  </div>

                  <div className="p-5 space-y-1.5">
                    <div className="text-[10px] font-mono-code font-bold text-[#737378] uppercase">{bottle.category}</div>
                    <h4 className="text-xs font-bold text-[#121214] line-clamp-1 font-display">{bottle.name}</h4>
                    <div className="flex items-center justify-between text-[11px] pt-1 font-mono-code">
                      <span className="text-[#737378]">{bottle.materialKorean}</span>
                      <span className="text-[#121214] font-bold">
                        30% 리필 {refillPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onOpenPickupModal(bottle)}
                    className="w-full py-3 bg-[#121214] hover:bg-[#2A2A2E] text-white text-xs font-mono-code font-bold rounded-full shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#EAF854]" />
                    <span>회수 혜택 신청</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ECO MARKET HIGHLIGHT BANNER */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#121214] text-[#F8F8F6] flex flex-col md:flex-row items-center justify-between gap-6 border border-black/10 shadow-xl">
        <div className="space-y-3 text-center md:text-left">
          <span className="px-3.5 py-1 bg-white/10 text-[#EAF854] text-xs font-mono-code font-bold rounded-full inline-flex items-center gap-1.5 border border-white/10">
            <Coins className="w-3.5 h-3.5 text-[#EAF854]" />
            <span>ECO POINT REWARDS</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            공병 수거 포인트로 본품 화장품 & 리필팩 알뜰 구매
          </h3>
          <p className="text-xs text-[#A0A0A5] max-w-lg leading-relaxed font-normal">
            시중 정가의 인기 정품 본품 화장품, 친환경 리필 파우치, 평생 재사용 앰버 글래스 소품을 포인트로 100% 현금처럼 결제하세요.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('shop')}
          className="px-7 py-4 bg-[#EAF854] hover:bg-[#D8E645] active:scale-[0.98] text-[#121214] font-mono-code font-extrabold text-xs sm:text-sm rounded-full shadow-md shrink-0 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-[#121214]" />
          <span>VISIT POINT SHOP</span>
          <ArrowRight className="w-4 h-4 text-[#121214]" />
        </button>
      </section>

    </div>
  );
};
