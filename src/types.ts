export type BottleMaterial = 'Glass' | 'PET' | 'PP' | 'PE Tube' | 'Aluminum' | 'Complex / Other';

export interface CosmeticBottle {
  id: string;
  brand: string;
  name: string;
  category: '스킨/토너' | '세럼/앰플' | '크림/로션' | '클렌징' | '바디/헤어' | '향수/미스트';
  capacity: string; // e.g. "150ml", "50ml"
  imageUrl: string;
  material: BottleMaterial;
  materialKorean: string; // e.g. "유리 (재활용 최우수)", "투명 PET"
  pickupPoints: number; // e.g. 1500 (Points earned when returned)
  refillAvailable: boolean;
  refillName?: string;
  refillPoints: number; // Points earned or reward given when requesting refill
  refillPrice: number; // KRW price for refill pack
  originalPrice: number; // KRW original cosmetic price
  recyclingDifficulty: '쉬움' | '보통' | '부품분리 필요';
  ecoTip: string;
  tags: string[];
  description: string;
}

export type PickupStatus = 
  | '신청완료' 
  | '기사배정' 
  | '수거진행' 
  | '검수중' 
  | '수거완료 (포인트지급)';

export interface PickupRequest {
  id: string;
  createdAt: string;
  bottle: CosmeticBottle;
  quantity: number;
  totalPoints: number;
  extraBottlesCount?: number;
  benefitType?: 'free_refill' | 'points'; // 'free_refill' = 무료 내용물 충전 배송, 'points' = 15% 포인트 적립
  pickupAddress: {
    roadAddress: string;
    detailAddress: string;
    zipCode: string;
  };
  pickupDate: string;
  pickupTimeSlot: string; // e.g. "오전 09:00 ~ 12:00", "비대면 문 앞 보관"
  contactName: string;
  contactPhone: string;
  doorPassword?: string;
  memo?: string;
  status: PickupStatus;
  pointsCredited: boolean;
  trackingNumber: string;
}

export type RefillStatus = '주문완료' | '상품준비중' | '배송중' | '배송완료';

export interface RefillOrder {
  id: string;
  createdAt: string;
  bottle: CosmeticBottle;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  pointsUsed: number;
  finalPaidAmount: number;
  earnedPoints: number;
  deliveryAddress: {
    roadAddress: string;
    detailAddress: string;
    zipCode: string;
  };
  preferredDate: string;
  deliveryMemo: string;
  status: RefillStatus;
  trackingNumber: string;
}

export interface PointHistoryItem {
  id: string;
  date: string;
  title: string;
  type: 'earn' | 'use';
  amount: number;
  balanceAfter: number;
  detail: string;
}

export interface ShopProduct {
  id: string;
  brand: string;
  name: string;
  category: string;
  productType?: 'full_product' | 'refill' | 'eco_tool'; // 본품 화장품, 리필팩, 친환경 소품
  imageUrl: string;
  originalPrice: number;
  memberPrice: number; // Discounted price for members
  maxPointDeduction: number; // e.g. up to 5000P can be used
  pointsRewarded: number;
  ecoBadge: string;
  rating: number;
  reviewCount: number;
  description: string;
  isRefill: boolean;
  isFullProduct?: boolean;
}

export interface UserEcoStats {
  points: number;
  totalBottlesRecycled: number;
  co2SavedKg: number;
  plasticGlassSavedKg: number;
  treesSaved: number;
  ecoLevel: string;
  ecoTierId?: string;
  bonusRatePercent?: number;
}
