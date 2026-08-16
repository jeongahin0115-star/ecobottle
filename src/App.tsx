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
import { Leaf, RefreshCw, Sparkles, CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

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
    const saved = localStorage.getItem('ecobottle_catalogue');
    return saved ? JSON.parse(saved) : COSMETIC_BOTTLES;
  });

  // User Stats & Histories
  const [userStats, setUserStats] = useState<UserEcoStats>(() => {
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
    return INITIAL_USER_STATS;
  });

  const [pickups, setPickups] = useState<PickupRequest[]>(() => {
    const saved = localStorage.getItem('ecobottle_pickups');
    return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
  });

  const [refills, setRefills] = useState<RefillOrder[]>(() => {
    const saved = localStorage.getItem('ecobottle_refills');
    return saved ? JSON.parse(saved) : INITIAL_REFILLS;
  });

  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>(() => {
    const saved = localStorage.getItem('ecobottle_points_history');
    return saved ? JSON.parse(saved) : INITIAL_POINT_HISTORY;
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
      colors: ['#10b981', '#14b8a6', '#f59e0b', '#3b82f6'],
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

  const handleOpenDirectPickupModal = (bottle: CosmeticBottle) => {
    setPickupModalBottle(bottle);
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

    if (requestData.benefitType === 'free_refill') {
      setToastInfo({
        message: `${requestData.bottle.name} 공병 내용물 무료 충전 리필 신청이 접수되었습니다! (비용 0원)`,
      });
    } else {
      setToastInfo({
        message: `${requestData.bottle.name} 공병 회수 신청이 접수되었습니다! (+${requestData.totalPoints.toLocaleString()}P 적립 대기)`,
      });
    }

    // Switch to activity tab to show progress
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

    // Update user points if points used
    let currentPts = userStats.points;
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
        detail: `${orderData.bottle.name} 리필팩 주문 결제`,
      });
    }

    // Add earned reward points for refill purchase
    currentPts += orderData.earnedPoints;
    newHistories.unshift({
      id: `pt-earn-${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      title: '리필팩 구매 에코 보너스 적립',
      type: 'earn',
      amount: orderData.earnedPoints,
      balanceAfter: currentPts,
      detail: `${orderData.bottle.brand} 리필팩 신청 보너스`,
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

  // 4. CRITICAL: Confirm Pickup and Deposit Points into User Account with Tier Bonus Rate!
  const handleConfirmPickupAndCreditPoints = (pickupId: string) => {
    const target = pickups.find((p) => p.id === pickupId);
    if (!target || target.pointsCredited) return;

    const addedBottles = target.quantity + (target.extraBottlesCount || 0);
    const newRecycledCount = userStats.totalBottlesRecycled + addedBottles;
    
    // Determine updated tier
    const tierDetails = getUserTierDetails(newRecycledCount);
    const { currentTier } = tierDetails;

    const newCo2 = userStats.co2SavedKg + addedBottles * 0.45;
    const newPlastic = userStats.plasticGlassSavedKg + addedBottles * 0.25;
    const newTrees = userStats.treesSaved + addedBottles * 0.12;

    if (target.benefitType === 'free_refill') {
      // 30% Discount Refill: Delivery completed + 10% Points reward ("리필해서 받는거가 10% 포인트+정가에서 30%할인된 가격")
      const base10PercentPoints = target.totalPoints > 0 
        ? target.totalPoints 
        : Math.round(target.bottle.pickupPoints * 0.10) * target.quantity;
      
      const tierBonusRate = currentTier.bonusRatePercent;
      const tierBonusPoints = Math.round(base10PercentPoints * (tierBonusRate / 100));
      const totalEarnedPoints = base10PercentPoints + tierBonusPoints;
      const newTotalPoints = userStats.points + totalEarnedPoints;

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

      // Add to points history
      setPointHistory([
        {
          id: `pt-${Date.now()}`,
          date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          title: `30% 할인 리필 보너스 포인트 (10% 적립 + ${currentTier.name} ${tierBonusRate}% 등급 보너스)`,
          type: 'earn',
          amount: totalEarnedPoints,
          balanceAfter: newTotalPoints,
          detail: `${target.bottle.name} (${target.quantity}개) 30% 할인가 리필 완충 및 10% 적립 (기본 ${base10PercentPoints.toLocaleString()}P + 등급보너스 ${tierBonusPoints.toLocaleString()}P)`,
        },
        ...pointHistory,
      ]);

      triggerConfetti();
      setToastInfo({
        message: `${target.bottle.name} 정품 30% 할인가 리필 완충품 발송 및 10% 보너스 포인트(+${totalEarnedPoints.toLocaleString()}P)가 적립되었습니다!`,
        points: totalEarnedPoints,
      });
    } else {
      // 100% Full Points Calculation + Tier Bonus ("포인트만 받는 거는 그에 맞는 포인트를 지급")
      const baseFullPoints = target.totalPoints > 0 
        ? target.totalPoints 
        : target.bottle.pickupPoints * target.quantity + (target.extraBottlesCount ? target.extraBottlesCount * 500 : 0);
      
      const tierBonusRate = currentTier.bonusRatePercent;
      const tierBonusPoints = Math.round(baseFullPoints * (tierBonusRate / 100));
      const totalEarnedPoints = baseFullPoints + tierBonusPoints;

      const newTotalPoints = userStats.points + totalEarnedPoints;

      // Update pickups list
      setPickups(
        pickups.map((p) =>
          p.id === pickupId
            ? { ...p, status: '수거완료 (포인트지급)', pointsCredited: true }
            : p
        )
      );

      // Update user stats
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

      // Add to points history
      setPointHistory([
        {
          id: `pt-${Date.now()}`,
          date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          title: `공병 회수 맞춤 포인트 (100% 전액 적립 + ${currentTier.name} ${tierBonusRate}% 등급 보너스)`,
          type: 'earn',
          amount: totalEarnedPoints,
          balanceAfter: newTotalPoints,
          detail: `${target.bottle.name} (${target.quantity}개) 회수 검수 완료 (100% 전액 기본 ${baseFullPoints.toLocaleString()}P + 등급보너스 ${tierBonusPoints.toLocaleString()}P)`,
        },
        ...pointHistory,
      ]);

      triggerConfetti();
      setToastInfo({
        message: `공병 회수 검수 완료! 공병 맞춤 100% 포인트 및 ${currentTier.name} 등급 보너스 포함 +${totalEarnedPoints.toLocaleString()}P가 적립되었습니다!`,
        points: totalEarnedPoints,
      });
    }
  };

  // 5. Step Progression for testing
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
    let currentPts = userStats.points - pointsUsed;
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

    currentPts += product.pointsRewarded * quantity;
    newHistories.unshift({
      id: `pt-shop-reward-${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      title: '에코 마켓 구매 적립금',
      type: 'earn',
      amount: product.pointsRewarded * quantity,
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
      points: product.pointsRewarded * quantity,
    });
  };

  // 7. Custom Bottle Registration
  const handleAddCustomBottle = (newBottle: CosmeticBottle) => {
    setBottles([newBottle, ...bottles]);
    setShowCustomBottleModal(false);
    setPickupModalBottle(newBottle);
  };

  // Count active pending pickups
  const pendingPickupsCount = pickups.filter((p) => !p.pointsCredited).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
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
          const newPts = userStats.points + 1000;
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="font-bold text-slate-900">검색 결과:</span>
                <span className="font-extrabold text-emerald-700">{filteredBottles.length}개</span>
                <span className="text-slate-400 text-xs">
                  (공병마다 회수 포인트와 리필팩 가격이 차등 적용됩니다)
                </span>
              </div>

              {pendingPickupsCount > 0 && (
                <button
                  onClick={() => {
                    setActivityInitialTab('pickups');
                    setShowActivityModal(true);
                  }}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>현재 진행 중인 공병 회수 {pendingPickupsCount}건 확인하기</span>
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
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <Leaf className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">
                  '{searchQuery}'에 해당하는 공병을 찾지 못했습니다.
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  에코보틀에 아직 등록되지 않은 화장품이라도 직접 등록하여 무료 수거 및 포인트를 받으실 수 있습니다.
                </p>
                <button
                  onClick={() => setShowCustomBottleModal(true)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>미등록 공병 직접 등록 및 수거 신청</span>
                </button>
              </div>
            )}

            {/* Bottom Info Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-xs text-emerald-300 font-bold flex items-center justify-center md:justify-start gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>안심 에코 프로세스</span>
                </div>
                <h4 className="text-lg font-black">
                  회수된 공병은 100% 전문 업사이클링 센터에서 새 용기로 재탄생합니다.
                </h4>
                <p className="text-xs text-slate-300">
                  문 앞에 놓아두시면 비대면 수거 기사님이 방문 수거 후 검수 즉시 계정으로 포인트가 입금됩니다.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('shop')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-sm rounded-xl shadow-md shrink-0 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>적립된 포인트로 특가 쇼핑하기</span>
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
                <h2 className="text-2xl font-black text-slate-900">내 신청 & 배송 내역</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  공병 수거 진행 상태 확인 및 리필팩 배송 현황
                </p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl shadow-xs cursor-pointer"
              >
                + 새 공병 수거 신청하기
              </button>
            </div>

            {/* Render Activity directly inline */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
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
      <footer className="mt-16 bg-white border-t border-slate-200 py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-black text-slate-800 text-sm">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>에코보틀 (EcoBottle)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              화장품 공병 비대면 회수 & 포인트 지급 • 친환경 리필팩 맞춤 배송 • 제로웨이스트 에코 마켓
            </p>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-4">
            <span>개인정보처리방침</span>
            <span>•</span>
            <span>이용약관</span>
            <span>•</span>
            <span>수거파트너 문의</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 0. Benefit Choice Modal (Choose between 15% Points or Free Product Refill) */}
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
          userPoints={userStats.points}
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

