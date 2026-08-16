import React from 'react';
import { Home, Leaf, Coins, Package, ShoppingBag, BookOpen, Sparkles, PlusCircle } from 'lucide-react';
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
  const tierDetails = getUserTierDetails(userStats?.totalBottlesRecycled ?? 0);
  const { currentTier } = tierDetails;
  const userPoints = userStats?.points ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-[#121214] text-[#F8F8F6] border-b border-black/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Slogan */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-white text-[#121214] flex items-center justify-center font-extrabold shadow-md group-hover:scale-105 transition-all duration-300">
              <Leaf className="w-5 h-5 text-[#121214] transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-display group-hover:text-[#EAF854] transition-colors">
                  ECOBOTTLE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#EAF854] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#A0A0A5] font-mono-code uppercase tracking-wider">
                COSMETIC RECYCLE ARCHIVE
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            <button
              id="nav-home-tab"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-white text-[#121214] shadow-xs'
                  : 'text-[#A0A0A5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>HOME</span>
            </button>

            <button
              id="nav-search-tab"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white text-[#121214] shadow-xs'
                  : 'text-[#A0A0A5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>SEARCH</span>
            </button>

            <button
              id="nav-shop-tab"
              onClick={() => setActiveTab('shop')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'shop'
                  ? 'bg-white text-[#121214] shadow-xs'
                  : 'text-[#A0A0A5] hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>SHOP</span>
              <span className="text-[9px] bg-[#EAF854] text-[#121214] font-extrabold px-1.5 py-0.2 rounded-full">
                SALE
              </span>
            </button>

            <button
              id="nav-activity-tab"
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code font-bold rounded-full transition-all duration-200 relative cursor-pointer ${
                activeTab === 'activity'
                  ? 'bg-white text-[#121214] shadow-xs'
                  : 'text-[#A0A0A5] hover:text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>STATUS</span>
              {pendingPickupsCount > 0 && (
                <span className="min-w-4 h-4 px-1 bg-[#EAF854] text-[#121214] rounded-full text-[9px] flex items-center justify-center font-bold">
                  {pendingPickupsCount}
                </span>
              )}
            </button>

            <button
              id="nav-guide-tab"
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-white text-[#121214] shadow-xs'
                  : 'text-[#A0A0A5] hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>GUIDE</span>
            </button>
          </nav>

          {/* Right Action: Tier Badge, Point Badge & Custom Add */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Eco Tier Badge CTA */}
            <button
              id="header-eco-tier-badge"
              onClick={onOpenTierModal}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-white/30 transition-all cursor-pointer group"
              title="클릭하여 내 에코 등급 및 혜택 조회"
            >
              <span className="text-base">{currentTier.icon}</span>
              <div className="text-left hidden sm:block font-mono-code">
                <div className="text-[9px] text-[#A0A0A5] uppercase tracking-wider leading-none">
                  TIER
                </div>
                <div className="text-xs font-bold text-white group-hover:text-[#EAF854] leading-tight mt-0.5">
                  Lv.{currentTier.level} {currentTier.name.split(' ')[1] || currentTier.name}
                </div>
              </div>
            </button>

            {/* Point Balance Badge */}
            <button
              id="header-point-badge"
              onClick={() => onOpenActivity('points')}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer group font-mono-code"
              title="클릭하여 포인트 적립/사용 내역 확인"
            >
              <Coins className="w-3.5 h-3.5 text-[#EAF854]" />
              <div className="text-left">
                <div className="text-xs font-extrabold text-white group-hover:text-[#EAF854] flex items-center gap-0.5 leading-tight">
                  <span>{userPoints.toLocaleString()}</span>
                  <span className="text-[10px] text-[#EAF854]">P</span>
                </div>
              </div>
            </button>

            {/* Custom Bottle Add CTA */}
            <button
              id="header-custom-bottle-btn"
              onClick={onOpenCustomBottle}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code font-bold bg-[#EAF854] text-[#121214] hover:bg-[#D8E645] rounded-full transition-all cursor-pointer shadow-2xs"
              title="검색에 없는 공병 직접 등록"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ 등록</span>
            </button>

            {/* Test quick bonus trigger */}
            <button
              id="header-quick-bonus-btn"
              onClick={onQuickAddBonusPoints}
              className="p-2 text-[#A0A0A5] hover:text-[#EAF854] hover:bg-white/10 rounded-full transition-all cursor-pointer"
              title="테스트 보너스 +1,000P 지급"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-white/10 text-[10px] font-mono-code bg-[#121214]">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer transition-colors ${
              activeTab === 'home' ? 'text-[#EAF854] font-bold' : 'text-[#A0A0A5]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>HOME</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer transition-colors ${
              activeTab === 'search' ? 'text-[#EAF854] font-bold' : 'text-[#A0A0A5]'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>SEARCH</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer transition-colors ${
              activeTab === 'shop' ? 'text-[#EAF854] font-bold' : 'text-[#A0A0A5]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>SHOP</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 relative cursor-pointer transition-colors ${
              activeTab === 'activity' ? 'text-[#EAF854] font-bold' : 'text-[#A0A0A5]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>STATUS</span>
            {pendingPickupsCount > 0 && (
              <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-[#EAF854] text-[#121214] rounded-full text-[8px] flex items-center justify-center font-bold">
                {pendingPickupsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 cursor-pointer transition-colors ${
              activeTab === 'guide' ? 'text-[#EAF854] font-bold' : 'text-[#A0A0A5]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>GUIDE</span>
          </button>
        </div>

      </div>
    </header>
  );
};
