import React from 'react';
import { 
  Leaf, 
  Search, 
  RefreshCw, 
  ShoppingBag, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  TreePine, 
  CheckCircle2, 
  Zap, 
  ChevronRight
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
  onOpenRefillModal,
  onOpenTierModal,
  onSelectSearchKeyword,
}) => {
  const tierDetails = getUserTierDetails(userStats.totalBottlesRecycled);
  const { currentTier, nextTier, bottlesToNext, progressPercent } = tierDetails;

  return (
    <div className="space-y-12 animate-fadeIn pb-6">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062c1e] via-[#0b3d2b] to-[#041d13] text-white p-7 sm:p-11 shadow-[0_12px_40px_-15px_rgba(6,78,59,0.35)] border border-emerald-700/30">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          
          {/* User Tier Greeting Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-xs">
            <span className="text-base">{currentTier.icon}</span>
            <span className="font-extrabold text-white">김에코님</span>
            <span className="text-slate-300 font-normal">• 현재 등급:</span>
            <button 
              onClick={onOpenTierModal}
              className="text-amber-300 font-black underline underline-offset-2 hover:text-amber-200 transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              <span>Lv.{currentTier.level} {currentTier.name}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              다 쓴 화장품 공병, <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                문 앞에서 회수하고 포인트와 리필
              </span>
              로 바꾸세요!
            </h1>
            <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              어떤 화장품이든 검색 한 번으로 수거 포인트를 확인하고 비대면 수거를 신청하세요. 
              수거된 공병은 100% 재자원화되며 최대 20% 추가 보너스 등급 혜택이 주어집니다.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="home-cta-search-btn"
              onClick={() => onNavigateTab('search')}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>공병 검색 & 회수 신청하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="home-cta-shop-btn"
              onClick={() => onNavigateTab('shop')}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-extrabold text-sm rounded-2xl border border-white/20 flex items-center gap-2 transition-all backdrop-blur-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>포인트 특가 마켓</span>
            </button>

            <button
              onClick={onOpenTierModal}
              className="px-4 py-3.5 text-xs text-emerald-300 hover:text-white font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>등급별 혜택 확인</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. USER ECO TIER & STATUS CARD */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTier.icon}</span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">내 에코 등급 및 회수 현황</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black border border-emerald-200">
                {currentTier.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              공병을 회수할 때마다 승급하며 수거 포인트 보너스가 증가합니다.
            </p>
          </div>

          <button
            id="home-view-tier-modal-btn"
            onClick={onOpenTierModal}
            className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-extrabold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>전체 5단계 등급 혜택표</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tier Progress & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1 & 2: Level Progress Meter */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 border border-emerald-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">현재 회수한 공병 누적</div>
                <div className="text-2xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{userStats.totalBottlesRecycled}개</span>
                  {currentTier.bonusRatePercent > 0 && (
                    <span className="text-xs font-black text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-500 text-amber-600" />
                      <span>수거 포인트 +{currentTier.bonusRatePercent}% 추가 적립 중</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">보유 포인트</div>
                <div className="text-2xl font-black text-emerald-800 flex items-center justify-end gap-1 mt-0.5">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span>{userStats.points.toLocaleString()}</span>
                  <span className="text-sm text-emerald-600">P</span>
                </div>
              </div>
            </div>

            {/* Progress Bar to next tier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-emerald-900 font-black">
                  Lv.{currentTier.level} {currentTier.name} ({currentTier.minBottles}개)
                </span>
                {nextTier ? (
                  <span className="text-slate-600">
                    다음 <strong className="text-emerald-800 font-extrabold">{nextTier.name}</strong>까지 <strong className="text-amber-700 font-black">{bottlesToNext}개</strong> 남음
                  </span>
                ) : (
                  <span className="text-purple-700 font-black">최고 등급 달성!</span>
                )}
              </div>

              <div className="w-full bg-slate-200/90 rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>달성도 {progressPercent}%</span>
                <span>{nextTier ? `목표: ${nextTier.minBottles}개 이상` : '명예의 전당'}</span>
              </div>
            </div>

            {/* Current Tier Perks Highlights */}
            <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentTier.perks.slice(0, 2).map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Environmental Contribution */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#062c1e] to-[#041d13] text-white flex flex-col justify-between space-y-4 shadow-sm border border-emerald-800/40">
            <div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <TreePine className="w-4 h-4" />
                <span>나의 누적 환경 보호 기여도</span>
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-1">
                작은 공병 하나가 만드는 큰 변화
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-slate-300">탄소(CO₂) 배출 감축량</span>
                <span className="font-black text-amber-300 text-sm">
                  {userStats.co2SavedKg.toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-slate-300">재자원화 플라스틱/유리</span>
                <span className="font-black text-teal-200 text-sm">
                  {userStats.plasticGlassSavedKg.toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-white/10 p-3 rounded-2xl border border-white/10">
                <span className="text-slate-300">살려낸 소나무</span>
                <span className="font-black text-emerald-300 text-sm">
                  {userStats.treesSaved.toFixed(1)} 그루
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('guide')}
              className="text-xs text-emerald-300 hover:text-white font-bold flex items-center justify-between pt-1 cursor-pointer transition-colors"
            >
              <span>에코 가이드 및 배출 기준 보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. 3-STEP HOW IT WORKS */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
            EASY 3 STEPS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">비대면 공병 회수 3단계 프로세스</h2>
          <p className="text-xs text-slate-500">
            문 앞에 두시기만 하면 전담 기사님이 무료로 수거하고 포인트를 즉시 적립해 드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3.5 relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg shadow-xs">
              01
            </div>
            <h3 className="text-base font-black text-slate-900">공병 검색 및 무료 수거 신청</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              다 쓴 화장품 공병을 검색하여 예상 포인트를 확인하고 희망하는 수거 날짜와 장소를 입력합니다.
            </p>
            <div className="pt-2 text-xs font-extrabold text-emerald-700 flex items-center gap-1">
              <span>수거 비용 100% 무료</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3.5 relative overflow-hidden group hover:border-teal-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg shadow-xs">
              02
            </div>
            <h3 className="text-base font-black text-slate-900">비대면 문 앞 보관</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              내용물을 비우고 가볍게 헹군 공병을 쇼핑백이나 상자에 담아 문 앞에 놓아두시면 기사님이 방문 수거합니다.
            </p>
            <div className="pt-2 text-xs font-extrabold text-teal-700 flex items-center gap-1">
              <span>안전한 비대면 회수</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-3.5 relative overflow-hidden group hover:border-amber-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg shadow-xs">
              03
            </div>
            <h3 className="text-base font-black text-slate-900">검수 완료 & 포인트 즉시 지급</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              업사이클 센터 검수 즉시 계정으로 포인트가 입금되며, 적립된 포인트로 리필팩과 에코 상품을 초특가로 구매할 수 있습니다.
            </p>
            <div className="pt-2 text-xs font-extrabold text-amber-700 flex items-center gap-1">
              <span>1P = 1원 현금성 포인트</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR COLLECTABLE COSMETICS (HOT PICKS) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight">실시간 최다 회수 공병 HOT</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              지금 많은 분들이 문 앞에서 회수 신청하고 있는 대표 화장품 공병입니다.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-extrabold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>전체 {popularBottles.length}개 공병 보러가기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularBottles.slice(0, 4).map((bottle) => (
            <div 
              key={bottle.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-slate-100/80 overflow-hidden">
                  <img
                    src={bottle.imageUrl}
                    alt={bottle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-slate-950/80 text-white text-[10px] font-black rounded-lg backdrop-blur-sm">
                    {bottle.category}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-black rounded-lg shadow-xs">
                    30%리필+10%P / 100%P
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-tight">{bottle.brand}</div>
                  <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1 leading-snug">{bottle.name}</h4>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500 font-medium">{bottle.materialKorean}</span>
                    <span className="text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      30%할인 + 10%P
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onOpenPickupModal(bottle)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>회수 신청하기 (선택)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ECO MARKET HIGHLIGHT BANNER */}
      <section className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-teal-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2.5 text-center md:text-left">
          <span className="px-3.5 py-1 bg-white/20 text-white text-xs font-black rounded-full backdrop-blur-sm inline-flex items-center gap-1.5 border border-white/20">
            <Coins className="w-3.5 h-3.5 text-amber-200" />
            <span>포인트 전용 특가 혜택</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            공병 수거로 모은 포인트로 본품 화장품 & 리필팩 최대 70% 할인!
          </h3>
          <p className="text-xs text-amber-100 max-w-lg leading-relaxed">
            시중 정가의 인기 정품 본품 화장품, 친환경 리필 파우치, 평생 재사용 앰버 글래스 소품을 포인트로 알뜰 결제하세요.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('shop')}
          className="px-6 py-4 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shrink-0 flex items-center gap-2 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>에코 마켓 특가 구경하기</span>
        </button>
      </section>

    </div>
  );
};
