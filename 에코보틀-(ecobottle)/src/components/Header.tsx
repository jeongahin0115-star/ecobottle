import React from 'react';
import { Home, Leaf, Coins, Package, ShoppingBag, BookOpen, Sparkles, PlusCircle, Award } from 'lucide-react';
import { UserEcoStats } from '../types';
import { getUserTierDetails } from '../data/ecoTiers';

interface HeaderProps {
  activeTab: 'home' | 'search' | 'shop' | 'activity' | 'guide';
  setActiveTab: (tab: 'home' | 'search' | 'shop' | 'activity' | 'guide') => void;
  userStats: UserEcoStats;
  onOpenActivity: (tab?: 'pickups' | 'refills' | 'points') => void;
  onOpenTierModal: () => void;
  onOpenCustomBottle: () => void;
  onQuickAddBonusPoints: () => void;
  pendingPickupsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  onOpenActivity,
  onOpenTierModal,
  onOpenCustomBottle,
  onQuickAddBonusPoints,
  pendingPickupsCount,
}) => {
  const tierDetails = getUserTierDetails(userStats.totalBottlesRecycled);
  const { currentTier } = tierDetails;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Slogan */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 group-hover:shadow-emerald-600/30 transition-all duration-300">
              <Leaf className="w-5.5 h-5.5 text-white/95 transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  에코보틀
                </span>
                <span className="text-[10px] px-2 py-0.5 font-extrabold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 rounded-full border border-emerald-300/60">
                  EcoBottle
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
                화장품 공병 비대면 회수 & 리필 플랫폼
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              id="nav-home-tab"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-emerald-800 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>홈</span>
            </button>

            <button
              id="nav-search-tab"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white text-emerald-800 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Leaf className={`w-4 h-4 ${activeTab === 'search' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>공병 검색 & 신청</span>
            </button>

            <button
              id="nav-shop-tab"
              onClick={() => setActiveTab('shop')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-white text-amber-800 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${activeTab === 'shop' ? 'text-amber-600' : 'text-amber-500/80'}`} />
              <span>포인트 특가 마켓</span>
              <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-md border border-amber-200/80">
                특가
              </span>
            </button>

            <button
              id="nav-activity-tab"
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 relative cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-white text-teal-800 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Package className={`w-4 h-4 ${activeTab === 'activity' ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>신청/배송 내역</span>
              {pendingPickupsCount > 0 && (
                <span className="min-w-5 h-5 px-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-[10px] flex items-center justify-center font-black shadow-xs">
                  {pendingPickupsCount}
                </span>
              )}
            </button>

            <button
              id="nav-guide-tab"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-emerald-800 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeTab === 'guide' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>수거 가이드</span>
            </button>
          </nav>

          {/* Right Action: Tier Badge, Point Badge & Custom Add */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Eco Tier Badge CTA */}
            <button
              id="header-eco-tier-badge"
              onClick={onOpenTierModal}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/90 rounded-2xl hover:border-emerald-400 hover:shadow-sm hover:scale-[1.02] transition-all cursor-pointer group"
              title="클릭하여 내 에코 등급 및 혜택 조회"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{currentTier.icon}</span>
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-emerald-700/80 font-bold uppercase tracking-wider leading-none">
                  에코 등급
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-emerald-800 leading-tight mt-0.5">
                  Lv.{currentTier.level} {currentTier.name.split(' ')[1] || currentTier.name}
                </div>
              </div>
            </button>

            {/* Point Balance Badge */}
            <button
              id="header-point-badge"
              onClick={() => onOpenActivity('points')}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-amber-50/90 to-amber-100/50 border border-amber-200/90 rounded-2xl hover:border-amber-400 hover:shadow-sm hover:scale-[1.02] transition-all cursor-pointer group"
              title="클릭하여 포인트 적립/사용 내역 확인"
            >
              <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center font-bold shadow-xs">
                <Coins className="w-3.5 h-3.5 text-amber-950" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-amber-800/80 font-bold uppercase tracking-wider leading-none hidden sm:block">
                  보유 포인트
                </div>
                <div className="text-xs font-black text-slate-900 group-hover:text-amber-800 flex items-center gap-0.5 leading-tight mt-0.5">
                  <span>{userStats.points.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-amber-600">P</span>
                </div>
              </div>
            </button>

            {/* Custom Bottle Add CTA */}
            <button
              id="header-custom-bottle-btn"
              onClick={onOpenCustomBottle}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/80 border border-slate-200/90 hover:border-emerald-300 rounded-xl transition-all cursor-pointer shadow-xs"
              title="검색에 없는 공병 직접 등록"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>공병등록</span>
            </button>

            {/* Test quick bonus trigger for preview testers */}
            <button
              id="header-quick-bonus-btn"
              onClick={onQuickAddBonusPoints}
              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50/80 rounded-xl transition-all cursor-pointer"
              title="테스트 보너스 +1,000P 지급"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-100 text-[11px] bg-white">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-medium cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>홈</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-medium cursor-pointer transition-colors ${
              activeTab === 'search' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>공병검색</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-medium cursor-pointer transition-colors ${
              activeTab === 'shop' ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>포인트마켓</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-medium relative cursor-pointer transition-colors ${
              activeTab === 'activity' ? 'text-teal-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>신청현황</span>
            {pendingPickupsCount > 0 && (
              <span className="absolute -top-1 right-2 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {pendingPickupsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 font-medium cursor-pointer transition-colors ${
              activeTab === 'guide' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>가이드</span>
          </button>
        </div>

      </div>
    </header>
  );
};

