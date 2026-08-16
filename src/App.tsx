import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { COSMETIC_BOTTLES } from './data/cosmetics';
import { SHOP_PRODUCTS } from './data/shopProducts';
import { getUserTierDetails } from './data/ecoTiers';
import { 
  CosmeticBottle, 
  PickupRequest, 
  RefillOrder, 
  PointHistoryItem, 
  UserEcoStats, 
  ShopProduct 
} from './types';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { SearchHero } from './components/SearchHero';
import { CosmeticCard } from './components/CosmeticCard';
import { BenefitChoiceModal } from './components/BenefitChoiceModal';
import { PickupModal } from './components/PickupModal';
import { RefillModal } from './components/RefillModal';
import { MyActivityModal } from './components/MyActivityModal';
import { EcoTierModal } from './components/EcoTierModal';
import { ShopView } from './components/ShopView';
import { EcoGuideView } from './components/EcoGuideView';
import { CustomBottleModal } from './components/CustomBottleModal';
import { Toast } from './components/Toast';
import { Leaf, RefreshCw, Sparkles, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

const INITIAL_USER_STATS: UserEcoStats = {
  points: 2500,
  totalBottlesRecycled: 3,
  co2SavedKg: 1.8,
  plasticGlassSavedKg: 0.9,
  treesSaved: 0.4,
  ecoLevel: '에코 그린 실버',
  ecoTierId: 'tier-2-green',
  bonusRatePercent: 5,
};

const INITIAL_PICKUPS: PickupRequest[] = [
  {
    id: 'pickup-demo-1',
    createdAt: '2026-08-15',
    bottle: COSMETIC_BOTTLES[1], // 라운드랩 독도 토너
    quantity: 2,
    extraBottlesCount: 1,
    totalPoints: 2300, // 900*2 + 500
    pickupAddress: {
      roadAddress: '서울특별시 강남구 테헤란로 152',
      detailAddress: '101동 1204호',
      zipCode: '06236'
    },
    pickupDate: '2026-08-17',
    pickupTimeSlot: '비대면 문 앞 보관 (오전 07:00 이전 수거)',
    contactName: '김에코',
    contactPhone: '010-9876-5432',
    doorPassword: '공동현관 #1234*',
    memo: '문 앞 쇼핑백에 담아두었습니다.',
    status: '수거진행',
    pointsCredited: false,
    trackingNumber: 'EC-20260815-9921',
  },
  {
    id: 'pickup-demo-2',
    createdAt: '2026-08-10',
    bottle: COSMETIC_BOTTLES[0], // 이니스프리 그린티 세럼
    quantity: 1,
    totalPoints: 1200,
    pickupAddress: {
      roadAddress: '서울특별시 강남구 테헤란로 152',
      detailAddress: '101동 1204호',
      zipCode: '06236'
    },
    pickupDate: '2026-08-11',
    pickupTimeSlot: '비대면 문 앞 보관',
    contactName: '김에코',
    contactPhone: '010-9876-5432',
    status: '수거완료 (포인트지급)',
    pointsCredited: true,
    trackingNumber: 'EC-20260810-1842',
  }
];

const INITIAL_REFILLS: RefillOrder[] = [
  {
    id: 'refill-demo-1',
    createdAt: '2026-08-12',
    bottle: COSMETIC_BOTTLES[0],
    quantity: 1,
    unitPrice: 19800,
    totalPrice: 19800,
    pointsUsed: 5000,
    finalPaidAmount: 14800,
    earnedPoints: 2000,
    deliveryAddress: {
      roadAddress: '서울특별시 강남구 테헤란로 152',
      detailAddress: '101동 1204호',
      zipCode: '06236'
    },
    preferredDate: '2026-08-14',
    deliveryMemo: '문 앞에 안전 배송 부탁드립니다.',
    status: '배송완료',
    trackingNumber: 'REFILL-8839-2910',
  }
];

const INITIAL_POINT_HISTORY: PointHistoryItem[] = [
  {
    id: 'pt-1',
    date: '2026-08-10 14:30',
    title: '공병 회수 검수 완료 포인트 지급',
    type: 'earn',
    amount: 1200,
    balanceAfter: 5500,
    detail: '이니스프리 그린티 세럼 1개 회수 완료',
  },
  {
    id: 'pt-2',
    date: '2026-08-12 10:15',
    title: '리필팩 구매 포인트 결제 차감',
    type: 'use',
    amount: 5000,
    balanceAfter: 500,
    detail: '그린티 세럼 리필 파우치 구매 시 사용',
  },
  {
    id: 'pt-3',
    date: '2026-08-12 10:15',
    title: '리필팩 주문 특별 적립금',
    type: 'earn',
    amount: 2000,
    balanceAfter: 2500,
    detail: '친환경 리필팩 구매 보너스 적립',
  },
];

export default function App() {
  // Navigation & view states
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'shop' | 'activity' | 'guide'>('home');
  const [activityInitialTab, setActivityInitialTab] = useState<'pickups' | 'refills' | 'points'>('pickups');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedMaterial, setSelectedMaterial] = useState('all');

  // Bottle Catalogue & Shop
  const [bottles, setBottles] = useState<CosmeticBottle[]>(() => {
    try {
      const saved = localStorage.getItem('ecobottle_catalogue');
      return saved ? JSON.parse(saved) : COSMETIC_BOTTLES;
    } catch {
      return COSMETIC_BOTTLES;
    }
  });

  // User Stats & Histories
  const [userStats, setUserStats] = useState<UserEcoStats>(() => {
    try {
      const saved = localStorage.getItem('ecobottle_user_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        const tier = getUserTierDetails(parsed.totalBottlesRecycled || 0);
        return {
          ...parsed,
          ecoTierId: tier.currentTier.id,
          bonusRatePercent: tier.currentTier.bonusRatePercent,
          ecoLevel: tier.currentTier.name,
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_USER_STATS;
  });

  const [pickups, setPickups] = useState<PickupRequest[]>(() => {
    try {
      const saved = localStorage.getItem('ecobottle_pickups');
      return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
    } catch {
      return INITIAL_PICKUPS;
    }
  });

  const [refills, setRefills] = useState<RefillOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ecobottle_refills');
      return saved ? JSON.parse(saved) : INITIAL_REFILLS;
    } catch {
      return INITIAL_REFILLS;
    }
  });

  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ecobottle_points_history');
      return saved ? JSON.parse(saved) : INITIAL_POINT_HISTORY;
    } catch {
      return INITIAL_POINT_HISTORY;
    }
  });

  // Modals active targets
  const [benefitChoiceBottle, setBenefitChoiceBottle] = useState<CosmeticBottle | null>(null);
  const [pickupBenefitType, setPickupBenefitType] = useState<'free_refill' | 'points'>('points');
  const [pickupModalBottle, setPickupModalBottle] = useState<CosmeticBottle | null>(null);
  const [refillModalBottle, setRefillModalBottle] = useState<CosmeticBottle | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showCustomBottleModal, setShowCustomBottleModal] = useState(false);
  const [toastInfo, setToastInfo] = useState<{ message: string; points?: number } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('ecobottle_catalogue', JSON.stringify(bottles));
  }, [bottles]);

  useEffect(() => {
    localStorage.setItem('ecobottle_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('ecobottle_pickups', JSON.stringify(pickups));
  }, [pickups]);

  useEffect(() => {
    localStorage.setItem('ecobottle_refills', JSON.stringify(refills));
  }, [refills]);

  useEffect(() => {
    localStorage.setItem('ecobottle_points_history', JSON.stringify(pointHistory));
  }, [pointHistory]);

  // Confetti trigger helper
  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EAF854', '#121214', '#ffffff', '#2A2A2E'],
    });
  };

  // 1. Filtered Cosmetic Bottles List
  const filteredBottles = bottles.filter((bottle) => {
    const matchesQuery =
      bottle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bottle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bottle.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bottle.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === '전체' || bottle.category === selectedCategory;

    const matchesMaterial =
      selectedMaterial === 'all' || bottle.material === selectedMaterial;

    return matchesQuery && matchesCategory && matchesMaterial;
  });

  // Helper to handle search tag click from Home or Hero
  const handleSelectSearchKeyword = (keyword: string) => {
    setSearchQuery(keyword);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. Actions: Request Pickup & Benefit Choice
  const handleOpenPickupModal = (bottle: CosmeticBottle) => {
    setBenefitChoiceBottle(bottle);
  };

  const handleSubmitPickup = (
    requestData: Omit<PickupRequest, 'id' | 'createdAt' | 'status' | 'pointsCredited' | 'trackingNumber'>
  ) => {
    const newPickup: PickupRequest = {
      ...requestData,
      id: `pickup-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: '신청완료',
      pointsCredited: false,
      trackingNumber: `EC-${Date.now().toString().slice(-8)}`,
    };

    setPickups([newPickup, ...pickups]);
    setPickupModalBottle(null);

    const totalPts = requestData.totalPoints ?? 0;

    if (requestData.benefitType === 'free_refill') {
      setToastInfo({
        message: `${requestData.bottle?.name || '공병'} 30% 할인가 리필 신청 접수 완료!`,
      });
    } else {
      setToastInfo({
        message: `${requestData.bottle?.name || '공병'} 공병 회수 신청 접수 완료! (+${totalPts.toLocaleString()}P 대기)`,
      });
    }

    setActivityInitialTab('pickups');
    setShowActivityModal(true);
  };

  // 3. Actions: Request Refill
  const handleOpenRefillModal = (bottle: CosmeticBottle) => {
    setRefillModalBottle(bottle);
  };

  const handleSubmitRefill = (
    orderData: Omit<RefillOrder, 'id' | 'createdAt' | 'status' | 'trackingNumber'>
  ) => {
    const newOrder: RefillOrder = {
      ...orderData,
      id: `refill-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: '주문완료',
      trackingNumber: `REFILL-${Date.now().toString().slice(-8)}`,
    };

    let currentPts = userStats?.points ?? 0;
    const newHistories: PointHistoryItem[] = [...pointHistory];

    if (orderData.pointsUsed > 0) {
      currentPts -= orderData.pointsUsed;
      newHistories.unshift({
        id: `pt-use-${Date.now()}`,
        date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        title: '리필팩 구매 포인트 결제',
        type: 'use',
        amount: orderData.pointsUsed,
        balanceAfter: currentPts,
        detail: `${orderData.bottle?.name || '화장품'} 리필팩 주문 결제`,
      });
    }

    currentPts += orderData.earnedPoints;
    newHistories.unshift({
      id: `pt-earn-${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      title: '리필팩 구매 에코 보너스 적립',
      type: 'earn',
      amount: orderData.earnedPoints,
      balanceAfter: currentPts,
      detail: `${orderData.bottle?.brand || '브랜드'} 리필팩 신청 보너스`,
    });

    setUserStats({
      ...userStats,
      points: currentPts,
    });

    setPointHistory(newHistories);
    setRefills([newOrder, ...refills]);
    setRefillModalBottle(null);

    triggerConfetti();
    setToastInfo({
      message: '리필팩 신청 및 배송 요청이 완료되었습니다!',
      points: orderData.earnedPoints,
    });

    setActivityInitialTab('refills');
    setShowActivityModal(true);
  };

  // 4. Confirm Pickup and Deposit Points
  const handleConfirmPickupAndCreditPoints = (pickupId: string) => {
    const target = pickups.find((p) => p.id === pickupId);
    if (!target || target.pointsCredited) return;

    const addedBottles = target.quantity + (target.extraBottlesCount || 0);
    const newRecycledCount = (userStats?.totalBottlesRecycled ?? 0) + addedBottles;
    
    const tierDetails = getUserTierDetails(newRecycledCount);
    const { currentTier } = tierDetails;

    const newCo2 = (userStats?.co2SavedKg ?? 0) + addedBottles * 0.45;
    const newPlastic = (userStats?.plasticGlassSavedKg ?? 0) + addedBottles * 0.25;
    const newTrees = (userStats?.treesSaved ?? 0) + addedBottles * 0.12;

    if (target.benefitType === 'free_refill') {
      const base10PercentPoints = target.totalPoints > 0 
        ? target.totalPoints 
        : Math.round((target.bottle?.pickupPoints ?? 0) * 0.10) * target.quantity;
      
      const tierBonusRate = currentTier.bonusRatePercent ?? 0;
      const tierBonusPoints = Math.round(base10PercentPoints * (tierBonusRate / 100));
      const totalEarnedPoints = base10PercentPoints + tierBonusPoints;
      const newTotalPoints = (userStats?.points ?? 0) + totalEarnedPoints;

      setPickups(
        pickups.map((p) =>
          p.id === pickupId
            ? { ...p, status: '수거완료 (포인트지급)', pointsCredited: true }
            : p
        )
      );

      setUserStats({
        ...userStats,
        points: newTotalPoints,
        totalBottlesRecycled: newRecycledCount,
        co2SavedKg: newCo2,
        plasticGlassSavedKg: newPlastic,
        treesSaved: newTrees,
        ecoLevel: currentTier.name,
        ecoTierId: currentTier.id,
        bonusRatePercent: currentTier.bonusRatePercent,
      });

      setPointHistory([
        {
          id: `pt-${Date.now()}`,
          date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          title: `30% 할인 리필 보너스 포인트 (10% 적립 + ${currentTier.name} ${tierBonusRate}% 등급 보너스)`,
          type: 'earn',
          amount: totalEarnedPoints,
          balanceAfter: newTotalPoints,
          detail: `${target.bottle?.name || '공병'} (${target.quantity}개) 30% 할인가 리필 완충 및 10% 적립`,
        },
        ...pointHistory,
      ]);

      triggerConfetti();
      setToastInfo({
        message: `${target.bottle?.name || '공병'} 30% 할인가 리필 발송 및 10% 보너스 포인트(+${totalEarnedPoints.toLocaleString()}P)가 적립되었습니다!`,
        points: totalEarnedPoints,
      });
    } else {
      const baseFullPoints = target.totalPoints > 0 
        ? target.totalPoints 
        : (target.bottle?.pickupPoints ?? 0) * target.quantity + (target.extraBottlesCount ? target.extraBottlesCount * 500 : 0);
      
      const tierBonusRate = currentTier.bonusRatePercent ?? 0;
      const tierBonusPoints = Math.round(baseFullPoints * (tierBonusRate / 100));
      const totalEarnedPoints = baseFullPoints + tierBonusPoints;

      const newTotalPoints = (userStats?.points ?? 0) + totalEarnedPoints;

      setPickups(
        pickups.map((p) =>
          p.id === pickupId
            ? { ...p, status: '수거완료 (포인트지급)', pointsCredited: true }
            : p
        )
      );

      setUserStats({
        ...userStats,
        points: newTotalPoints,
        totalBottlesRecycled: newRecycledCount,
        co2SavedKg: newCo2,
        plasticGlassSavedKg: newPlastic,
        treesSaved: newTrees,
        ecoLevel: currentTier.name,
        ecoTierId: currentTier.id,
        bonusRatePercent: currentTier.bonusRatePercent,
      });

      setPointHistory([
        {
          id: `pt-${Date.now()}`,
          date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          title: `공병 회수 맞춤 포인트 (100% 전액 적립 + ${currentTier.name} ${tierBonusRate}% 등급 보너스)`,
          type: 'earn',
          amount: totalEarnedPoints,
          balanceAfter: newTotalPoints,
          detail: `${target.bottle?.name || '공병'} (${target.quantity}개) 회수 검수 완료 (100% 전액 적립)`,
        },
        ...pointHistory,
      ]);

      triggerConfetti();
      setToastInfo({
        message: `공병 회수 검수 완료! 100% 전액 포인트 +${totalEarnedPoints.toLocaleString()}P가 계정으로 입금되었습니다!`,
        points: totalEarnedPoints,
      });
    }
  };

  // 5. Step Progression
  const handleAdvancePickupStep = (pickupId: string) => {
    setPickups(
      pickups.map((p) => {
        if (p.id !== pickupId) return p;
        if (p.status === '신청완료') return { ...p, status: '기사배정' };
        if (p.status === '기사배정') return { ...p, status: '수거진행' };
        if (p.status === '수거진행') return { ...p, status: '검수중' };
        if (p.status === '검수중') {
          handleConfirmPickupAndCreditPoints(pickupId);
          return { ...p, status: '수거완료 (포인트지급)', pointsCredited: true };
        }
        return p;
      })
    );
  };

  // 6. Shop Purchase
  const handleBuyWithPoints = (
    product: ShopProduct,
    quantity: number,
    pointsUsed: number,
    paidCash: number
  ) => {
    let currentPts = (userStats?.points ?? 0) - pointsUsed;
    const newHistories: PointHistoryItem[] = [...pointHistory];

    if (pointsUsed > 0) {
      newHistories.unshift({
        id: `pt-shop-${Date.now()}`,
        date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        title: '에코 마켓 포인트 특가 결제',
        type: 'use',
        amount: pointsUsed,
        balanceAfter: currentPts,
        detail: `${product.name} (${quantity}개) 구매`,
      });
    }

    currentPts += (product.pointsRewarded ?? 0) * quantity;
    newHistories.unshift({
      id: `pt-shop-reward-${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      title: '에코 마켓 구매 적립금',
      type: 'earn',
      amount: (product.pointsRewarded ?? 0) * quantity,
      balanceAfter: currentPts,
      detail: `${product.name} 구매 보너스 적립`,
    });

    setUserStats({
      ...userStats,
      points: currentPts,
    });
    setPointHistory(newHistories);

    triggerConfetti();
    setToastInfo({
      message: `${product.name} 특가 주문이 완료되었습니다!`,
      points: (product.pointsRewarded ?? 0) * quantity,
    });
  };

  // 7. Custom Bottle Registration
  const handleAddCustomBottle = (newBottle: CosmeticBottle) => {
    setBottles([newBottle, ...bottles]);
    setShowCustomBottleModal(false);
    setPickupModalBottle(newBottle);
  };

  const pendingPickupsCount = pickups.filter((p) => !p.pointsCredited).length;

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-[#121214] flex flex-col font-sans selection:bg-[#EAF854] selection:text-[#121214]">
      
      {/* 1. Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        onOpenActivity={(tab) => {
          if (tab) setActivityInitialTab(tab);
          setShowActivityModal(true);
        }}
        onOpenTierModal={() => setShowTierModal(true)}
        onOpenCustomBottle={() => setShowCustomBottleModal(true)}
        onQuickAddBonusPoints={() => {
          const newPts = (userStats?.points ?? 0) + 1000;
          setUserStats({ ...userStats, points: newPts });
          setPointHistory([
            {
              id: `pt-bonus-${Date.now()}`,
              date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              title: '테스트 체험 보너스 포인트 지급',
              type: 'earn',
              amount: 1000,
              balanceAfter: newPts,
              detail: '에코보틀 체험용 보너스 적립',
            },
            ...pointHistory,
          ]);
          triggerConfetti();
          setToastInfo({ message: '체험용 보너스 포인트가 지급되었습니다!', points: 1000 });
        }}
        pendingPickupsCount={pendingPickupsCount}
      />

      {/* 2. Main Body Content by Active Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* VIEW 0: HOME VIEW */}
        {activeTab === 'home' && (
          <HomeView
            userStats={userStats}
            popularBottles={bottles}
            onNavigateTab={setActiveTab}
            onOpenPickupModal={handleOpenPickupModal}
            onOpenRefillModal={handleOpenRefillModal}
            onOpenTierModal={() => setShowTierModal(true)}
            onSelectSearchKeyword={handleSelectSearchKeyword}
          />
        )}

        {/* VIEW 1: SEARCH & BOTTLE DIRECTORY */}
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Search Hero */}
            <SearchHero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              onOpenCustomBottle={() => setShowCustomBottleModal(true)}
              totalResultsCount={filteredBottles.length}
              availableBottles={bottles}
            />

            {/* Quick Summary Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E5E5E0] shadow-2xs font-mono-code">
              <div className="flex items-center gap-2 text-xs text-[#737378]">
                <span className="font-bold text-[#121214]">TOTAL RESULTS:</span>
                <span className="font-extrabold text-[#121214] bg-[#EAF854] px-2 py-0.5 rounded-full">{filteredBottles.length} ITEMS</span>
                <span className="text-[11px] hidden sm:inline text-[#88888D]">
                  (소재 및 브랜드별 포인트 / 리필가 자동 적용)
                </span>
              </div>

              {pendingPickupsCount > 0 && (
                <button
                  onClick={() => {
                    setActivityInitialTab('pickups');
                    setShowActivityModal(true);
                  }}
                  className="text-xs font-bold text-[#121214] bg-[#F0F0EB] hover:bg-[#E5E5E0] px-4 py-2 rounded-full border border-[#E5E5E0] flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>진행 중인 회수 {pendingPickupsCount}건 조회</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Cosmetic Bottles Grid */}
            {filteredBottles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBottles.map((bottle) => (
                  <CosmeticCard
                    key={bottle.id}
                    bottle={bottle}
                    onRequestPickup={handleOpenPickupModal}
                    onRequestRefill={handleOpenRefillModal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E5E0] p-8 space-y-4">
                <Leaf className="w-12 h-12 text-[#A0A0A5] mx-auto" />
                <h3 className="text-lg font-bold text-[#121214] font-display">
                  '{searchQuery}'에 해당하는 공병을 찾지 못했습니다.
                </h3>
                <p className="text-xs text-[#737378] max-w-md mx-auto">
                  에코보틀에 아직 등록되지 않은 화장품이라도 직접 등록하여 무료 수거 및 포인트를 받으실 수 있습니다.
                </p>
                <button
                  onClick={() => setShowCustomBottleModal(true)}
                  className="px-6 py-3.5 bg-[#121214] hover:bg-[#2A2A2E] text-white font-mono-code font-bold text-xs rounded-full shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#EAF854]" />
                  <span>REGISTER UNLISTED BOTTLE</span>
                </button>
              </div>
            )}

            {/* Bottom Info Banner */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#121214] text-[#F8F8F6] flex flex-col md:flex-row items-center justify-between gap-6 border border-black/10 shadow-2xl">
              <div className="space-y-2 text-center md:text-left">
                <div className="text-xs font-mono-code text-[#EAF854] font-bold flex items-center justify-center md:justify-start gap-1.5 uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CLOSED-LOOP RECYCLING SYSTEM</span>
                </div>
                <h4 className="text-lg sm:text-xl font-extrabold font-display">
                  회수된 공병은 100% 전문 업사이클링 센터에서 새 용기로 재탄생합니다.
                </h4>
                <p className="text-xs text-[#A0A0A5]">
                  문 앞에 놓아두시면 비대면 수거 기사님이 방문 수거 후 검수 즉시 계정으로 포인트가 입금됩니다.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('shop')}
                className="px-7 py-4 bg-[#EAF854] hover:bg-[#D8E645] text-[#121214] font-mono-code font-extrabold text-xs rounded-full shadow-md shrink-0 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#121214]" />
                <span>SHOP WITH POINTS</span>
                <ArrowRight className="w-4 h-4 text-[#121214]" />
              </button>
            </div>

          </div>
        )}

        {/* VIEW 2: ECO POINT SHOP */}
        {activeTab === 'shop' && (
          <ShopView
            products={SHOP_PRODUCTS}
            userPoints={userStats.points}
            onBuyWithPoints={handleBuyWithPoints}
          />
        )}

        {/* VIEW 3: USER ACTIVITY & TIMELINE */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#121214] font-display">내 신청 & 배송 내역</h2>
                <p className="text-xs font-mono-code text-[#737378] mt-0.5">
                  REAL-TIME PICKUP & REFILL STATUS
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="px-5 py-2.5 text-xs font-mono-code font-bold bg-[#121214] text-white rounded-full shadow-2xs hover:bg-[#2A2A2E] cursor-pointer"
              >
                + NEW PICKUP
              </button>
            </div>

            {/* Render Activity directly inline */}
            <div className="bg-white rounded-3xl border border-[#E5E5E0] p-6 shadow-2xs">
              <MyActivityModal
                initialTab={activityInitialTab}
                onClose={() => setActiveTab('search')}
                pickups={pickups}
                refills={refills}
                pointHistory={pointHistory}
                userStats={userStats}
                onConfirmPickupAndCreditPoints={handleConfirmPickupAndCreditPoints}
                onAdvancePickupStep={handleAdvancePickupStep}
                onOpenTierModal={() => setShowTierModal(true)}
              />
            </div>
          </div>
        )}

        {/* VIEW 4: ECO GUIDE */}
        {activeTab === 'guide' && (
          <EcoGuideView onStartSearch={() => setActiveTab('search')} />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#121214] text-[#F8F8F6] border-t border-black/10 py-12 text-xs font-mono-code">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-white text-sm">
              <Leaf className="w-4 h-4 text-[#EAF854]" />
              <span>ECOBOTTLE ARCHIVE</span>
            </div>
            <p className="text-[11px] text-[#737378]">
              화장품 공병 비대면 회수 & 포인트 환급 • 친환경 리필팩 맞춤 배송 • 제로웨이스트 마켓
            </p>
          </div>

          <div className="text-[11px] text-[#737378] flex items-center justify-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">PRIVACY POLICY</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">TERMS OF USE</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">PARTNER INQUIRY</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 0. Benefit Choice Modal */}
      {benefitChoiceBottle && (
        <BenefitChoiceModal
          bottle={benefitChoiceBottle}
          userStats={userStats}
          onClose={() => setBenefitChoiceBottle(null)}
          onSelectPoint={(bottle) => {
            setBenefitChoiceBottle(null);
            setPickupBenefitType('points');
            setPickupModalBottle(bottle);
          }}
          onSelectRefill={(bottle) => {
            setBenefitChoiceBottle(null);
            setPickupBenefitType('free_refill');
            setPickupModalBottle(bottle);
          }}
        />
      )}

      {/* 1. Pickup Request Modal */}
      {pickupModalBottle && (
        <PickupModal
          bottle={pickupModalBottle}
          benefitType={pickupBenefitType}
          onClose={() => setPickupModalBottle(null)}
          onSubmit={handleSubmitPickup}
        />
      )}

      {/* 2. Refill Pack Request Modal */}
      {refillModalBottle && (
        <RefillModal
          bottle={refillModalBottle}
          userPoints={userStats?.points ?? 0}
          onClose={() => setRefillModalBottle(null)}
          onSubmit={handleSubmitRefill}
        />
      )}

      {/* 3. My Activity Modal (when opened as modal overlay) */}
      {showActivityModal && activeTab !== 'activity' && (
        <MyActivityModal
          initialTab={activityInitialTab}
          onClose={() => setShowActivityModal(false)}
          pickups={pickups}
          refills={refills}
          pointHistory={pointHistory}
          userStats={userStats}
          onConfirmPickupAndCreditPoints={handleConfirmPickupAndCreditPoints}
          onAdvancePickupStep={handleAdvancePickupStep}
          onOpenTierModal={() => setShowTierModal(true)}
        />
      )}

      {/* 4. Eco Tier Level Modal */}
      {showTierModal && (
        <EcoTierModal
          userStats={userStats}
          onClose={() => setShowTierModal(false)}
          onNavigateToSearch={() => {
            setShowTierModal(false);
            setActiveTab('search');
          }}
        />
      )}

      {/* 5. Custom Bottle Modal */}
      {showCustomBottleModal && (
        <CustomBottleModal
          onClose={() => setShowCustomBottleModal(false)}
          onAddAndRequest={handleAddCustomBottle}
        />
      )}

      {/* 6. Notification Toast */}
      {toastInfo && (
        <Toast
          message={toastInfo.message}
          points={toastInfo.points}
          onClose={() => setToastInfo(null)}
        />
      )}

    </div>
  );
}
