import { UserEcoStats } from '../types';

export interface EcoTierInfo {
  level: number;
  id: string;
  name: string;
  minBottles: number;
  maxBottles: number | null; // null for highest tier
  icon: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  bgLight: string;
  bonusRatePercent: number; // e.g. 5 means +5% extra points on bottle return
  description: string;
  perks: string[];
}

export const ECO_TIERS: EcoTierInfo[] = [
  {
    level: 1,
    id: 'sprout',
    name: '에코 새싹 (Sprout)',
    minBottles: 0,
    maxBottles: 2,
    icon: '🌱',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgLight: 'bg-emerald-50/50',
    bonusRatePercent: 0,
    description: '에코보틀에 첫 발을 내딛은 환경 지킴이',
    perks: [
      '모든 화장품 공병 100% 무료 비대면 수거',
      '공병 수거 시 기본 포인트 전액 즉시 적립',
      '신규 가입 웰컴 2,500P 지급',
    ],
  },
  {
    level: 2,
    id: 'green',
    name: '에코 그린 (Green)',
    minBottles: 3,
    maxBottles: 5,
    icon: '🌿',
    badgeColor: 'bg-teal-100 text-teal-800',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-300',
    bgLight: 'bg-teal-50/50',
    bonusRatePercent: 5,
    description: '꾸준한 공병 분리배출을 실천하는 그린 리더',
    perks: [
      '공병 수거 검수 시 +5% 추가 보너스 포인트 지급',
      '친환경 리필팩 구매 시 3% 추가 포인트 적립',
      '에코 마켓 전용 5% 할인 쿠폰 매월 1회 지급',
    ],
  },
  {
    level: 3,
    id: 'silver',
    name: '에코 실버 (Silver)',
    minBottles: 6,
    maxBottles: 10,
    icon: '🥈',
    badgeColor: 'bg-slate-200 text-slate-800',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    bgLight: 'bg-slate-50',
    bonusRatePercent: 10,
    description: '본격적인 제로웨이스트 라이프를 실천하는 실버 마스터',
    perks: [
      '공병 수거 검수 시 +10% 추가 보너스 포인트 지급',
      '친환경 리필팩 주문 시 전 품목 무제한 무료 배송',
      '신규 리필 화장품 출시 시 우선 체험단 기회',
    ],
  },
  {
    level: 4,
    id: 'gold',
    name: '에코 골드 (Gold)',
    minBottles: 11,
    maxBottles: 20,
    icon: '🥇',
    badgeColor: 'bg-amber-100 text-amber-900',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    bgLight: 'bg-amber-50/50',
    bonusRatePercent: 15,
    description: '지구 환경을 바꾸는 상위 1% 친환경 뷰티 앰버서더',
    perks: [
      '공병 수거 검수 시 +15% 강력한 추가 보너스 포인트 지급',
      '에코 마켓 전 품목 상시 10% 추가 할인',
      '수거 기사 당일 우선 배차 서비스',
    ],
  },
  {
    level: 5,
    id: 'master',
    name: '에코 마스터 (Master VIP)',
    minBottles: 21,
    maxBottles: null,
    icon: '👑',
    badgeColor: 'bg-purple-100 text-purple-900',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    bgLight: 'bg-purple-50/50',
    bonusRatePercent: 20,
    description: '완벽한 자원 순환을 이끄는 에코보틀 명예의 전당 VIP',
    perks: [
      '공병 수거 검수 시 최고 +20% 추가 보너스 포인트 적립',
      '분기별 제로웨이스트 VIP 특별 뷰티 키트 무료 증정',
      '전용 1:1 에코 컨시어지 및 영구 VIP 프리미엄 혜택',
    ],
  },
];

export interface UserTierDetails {
  currentTier: EcoTierInfo;
  nextTier: EcoTierInfo | null;
  bottlesCount: number;
  bottlesToNext: number;
  progressPercent: number;
}

export function getUserTierDetails(bottlesCount: number): UserTierDetails {
  let currentTier = ECO_TIERS[0];

  for (const tier of ECO_TIERS) {
    if (bottlesCount >= tier.minBottles) {
      if (tier.maxBottles === null || bottlesCount <= tier.maxBottles) {
        currentTier = tier;
        break;
      }
    }
  }

  // If beyond highest tier minBottles
  if (bottlesCount >= 21) {
    currentTier = ECO_TIERS[ECO_TIERS.length - 1];
  }

  const currentIndex = ECO_TIERS.findIndex((t) => t.id === currentTier.id);
  const nextTier = currentIndex < ECO_TIERS.length - 1 ? ECO_TIERS[currentIndex + 1] : null;

  let bottlesToNext = 0;
  let progressPercent = 100;

  if (nextTier) {
    bottlesToNext = Math.max(0, nextTier.minBottles - bottlesCount);
    const range = nextTier.minBottles - currentTier.minBottles;
    const currentProgress = bottlesCount - currentTier.minBottles;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
  }

  return {
    currentTier,
    nextTier,
    bottlesCount,
    bottlesToNext,
    progressPercent,
  };
}
