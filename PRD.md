# 📋 에코보틀 (EcoBottle) 제품 요구사항 정의서 (PRD)

---

## 1. 프로젝트 개요 (Overview)

- **제품명**: 에코보틀 (EcoBottle)
- **분류**: 지속 가능한 뷰티 & 화장품 공병 순환 자원 리사이클링 / 리필 플랫폼
- **플랫폼 형태**: 반응형 웹 애플리케이션 (Mobile-First, Desktop-Optimized SPA)
- **핵심 가치 제안 (Value Proposition)**: 
  - 복합 재질로 인해 90% 이상 일반 쓰레기로 소각/매립되던 화장품 공병을 **비대면 무료 수거**
  - **정가 대비 30% 할인된 가격의 정품 멸균 리필 완충 배송 + 10% 추가 포인트 적립**
  - 수거 전용 신청 시 공병 가치에 부합하는 **100% 전액 에코 포인트 즉시 적립**
  - 적립된 포인트를 활용한 **본품 화장품, 친환경 리필팩, 제로웨이스트 뷰티 소품 특가 마켓** 연계
  - 분리배출 횟수에 따른 **5단계 에코 멤버십 티어 시스템**을 통한 사용자 자발적 참여 유도

---

## 2. 사용자 페르소나 및 타깃 고객 (Target Audience)

1. **가치 소비 & 제로웨이스트 실천자 (2030 세대)**
   - 화장품 용기 분리배출의 어려움을 느끼고 실제 재활용률에 관심이 많은 사용자
   - 일상 속 자원 순환과 환경 보호(CO2 절감, 나무 심기 환산)에 능동적으로 기여하고자 하는 소비자
2. **합리적인 뷰티 쇼퍼**
   - 동일한 화장품을 지속적으로 사용하며 용기 비용을 절감하여 저렴하게 리필을 원하는 고객
   - 공병 반납으로 얻은 포인트를 새로운 화장품 본품 및 리필 구매에 재투자하는 고객

---

## 3. 핵심 기능 요구사항 (Core Features & Functional Scope)

### 3.1. 화장품 공병 검색 및 탐색 (Search & Catalog)
- **실시간 통합 검색**: 제품명, 브랜드명(이니스프리, 아로마티카, 톤28, 닥터지, 라운드랩, 시드물 등), 카테고리 실시간 필터링
- **다차원 필터링**:
  - 카테고리: 스킨/토너, 세럼/앰플, 크림/로션, 클렌징, 바디/헤어, 향수/미스트
  - 용기 재질: 유리(최우수), 투명 PET, PP, PE 튜브, 알루미늄, 복합재질
  - 정렬 기준: 포인트 높은순, 분리배출 난이도순, 제품 가격순
- **목록 외 공병 직접 등록 (`CustomBottleModal`)**:
  - 검색되지 않는 브랜드/공병의 경우, 사용자가 사진 업로드 시뮬레이션 및 용기 정보(브랜드, 품명, 용량, 재질)를 입력하여 즉시 견적 포인트 산출 후 수거 신청 가능.

### 3.2. 2-트랙 공병 회수 혜택 선택 시스템 (`BenefitChoiceModal`)
사용자가 공병 카드에서 [회수 신청하기]를 누르면 명확한 2가지 옵션을 제공:
1. **옵션 1: 🧴 정가 30% 할인가 리필 완충 배송 + 10% 포인트 적립**
   - **가격 혜택**: 해당 화장품 정가에서 **30% 할인된 금액**으로 멸균 세척 및 정품 원액 100% 충전 재배송 (예: 28,000원 제품 ➔ 19,600원 결제)
   - **포인트 혜택**: 공병 기준 포인트의 **10% 추가 보너스 적립** (예: 1,200P 공병 기준 +120P 지급)
   - **배송 혜택**: 왕복 수거 및 배송비 무료
2. **옵션 2: 💰 100% 맞춤 공병 포인트 전액 적립 (회수 전용)**
   - **포인트 혜택**: 공병의 규격/재질에 책정된 **100% 전액 포인트 지급** (예: 1,200P 공병 ➔ 1,200P 전액 지급)
   - **등급 보너스 연동**: 사용자 에코 등급에 따른 추가 보너스율(0%~20%) 합산 적용

### 3.3. 비대면 도어투도어 수거 신청 프로세스 (`PickupModal`)
- **수량 조절**: 동일 공병 1~10개 선택 (결제 금액 또는 예상 포인트 실시간 연동)
- **기타 공병 추가 동봉**:
  - 추가 일반 공병 개당 +500P(100% 포인트 모드) 또는 +50P(리필 모드) 계산
- **수거 정보 입력**:
  - 카카오 주소 검색 API 연동 도로명 주소 검색 및 상세 주소, 우편번호 자동 입력
  - 비대면 수거 일자 (내일부터 7일간 선택) 및 수거 시간대(오전, 오후, 야간, 비대면 문 앞 보관)
  - 신청자 성명, 연락처, 공동현관 비밀번호, 수거 요청 메모
- **실시간 요약 및 신청 완료 처리**:
  - 수거 트래킹 번호(EP-XXXX) 발급 및 실시간 수거 진행 상태 큐에 등록

### 3.4. 5단계 에코 멤버십 티어 시스템 (`EcoTierModal` & `ecoTiers.ts`)
| 등급 | 누적 수거 수량 | 아이콘 | 공병 수거 추가 보너스 | 전용 혜택 |
| :--- | :--- | :---: | :---: | :--- |
| **에코 새싹 (Sprout)** | 0 ~ 2개 | 🌱 | +0% | 비대면 100% 무료 수거, 웰컴 2,500P |
| **에코 그린 (Green)** | 3 ~ 5개 | 🌿 | +5% | 리필팩 3% 추가 적립, 매월 5% 할인쿠폰 |
| **에코 실버 (Silver)** | 6 ~ 10개 | 🥈 | +10% | 리필팩 전 품목 무료 배송, 신제품 우선 체험 |
| **에코 골드 (Gold)** | 11 ~ 20개 | 🥇 | +15% | 에코 마켓 상시 10% 추가할인, 당일 우선 배차 |
| **에코 마스터 (Master)**| 21개 이상 | 👑 | +20% | 분기별 VIP 제로웨이스트 키트, 1:1 컨시어지 |

### 3.5. 에코 포인트 마켓 (`ShopView` & `RefillModal`)
- **카테고리 구성**:
  - **정품 본품 화장품 (Full Product)**: 에코 포인트로 정가 대비 최대 35% 할인 + 부분 포인트 결제
  - **친환경 리필팩 (Refill Pouch)**: 탄소 배출을 80% 줄인 파우치 형태 정품 리필
  - **제로웨이스트 뷰티 소품 (Eco Tools)**: 규조토 트레이, 대나무 화장솜, 샴푸바 홀더 등
- **포인트 결제 시스템**:
  - 보유 에코 포인트를 100P 단위로 자유롭게 차감하여 실 결제액 즉시 할인
  - 결제 완료 시 실시간 주문 내역(`RefillOrder`) 생성 및 잔여 포인트 업데이트

### 3.6. 나의 에코 활동 & 실시간 내역 관리 (`MyActivityModal`)
- **수거 신청 내역 관리**:
  - 상태 단계: `신청완료` ➔ `기사배정` ➔ `수거진행` ➔ `검수중` ➔ `수거완료 (포인트지급)`
  - 수거 검수 시뮬레이션 버튼 제공: 클릭 시 즉시 100% 포인트(또는 10% 리필 보너스) 계정 입금 및 환경 지표 갱신
- **리필/마켓 주문 내역**: 송장 번호 및 배송 상태 추적
- **포인트 입출금 원장 (Ledger)**: 적립/사용 내역, 일시, 적립 사유, 거래 후 잔액 명시

### 3.7. 환경 기여도 실시간 산출 알고리즘
- **탄소 절감량 (CO2 Saved)**: $수거\ 공병\ 개수 \times 0.28\text{ kg}$
- **플라스틱/유리 자원 보존량**: $수거\ 공병\ 개수 \times 0.15\text{ kg}$
- **식수 효과 환산 (Trees Saved)**: $수거\ 공병\ 개수 \times 0.12\text{ 그루}$

---

## 4. 데이터 구조 및 인터페이스 명세 (Data Schema)

```typescript
// 1. 화장품 공병 모델
export interface CosmeticBottle {
  id: string;
  brand: string;
  name: string;
  category: '스킨/토너' | '세럼/앰플' | '크림/로션' | '클렌징' | '바디/헤어' | '향수/미스트';
  capacity: string;
  imageUrl: string;
  material: 'Glass' | 'PET' | 'PP' | 'PE Tube' | 'Aluminum' | 'Complex / Other';
  materialKorean: string;
  pickupPoints: number; // 공병 맞춤 100% 기준 포인트
  refillAvailable: boolean;
  refillPrice: number;
  originalPrice: number; // 화장품 정가 (30% 리필 할인가 산정 기준)
  recyclingDifficulty: '쉬움' | '보통' | '부품분리 필요';
  ecoTip: string;
  tags: string[];
  description: string;
}

// 2. 수거 신청 모델
export interface PickupRequest {
  id: string;
  createdAt: string;
  bottle: CosmeticBottle;
  quantity: number;
  totalPoints: number;
  extraBottlesCount?: number;
  benefitType?: 'free_refill' | 'points'; // 'free_refill' (30%할인가+10%P) vs 'points' (100%전액)
  pickupAddress: {
    roadAddress: string;
    detailAddress: string;
    zipCode: string;
  };
  pickupDate: string;
  pickupTimeSlot: string;
  contactName: string;
  contactPhone: string;
  doorPassword?: string;
  memo?: string;
  status: '신청완료' | '기사배정' | '수거진행' | '검수중' | '수거완료 (포인트지급)';
  pointsCredited: boolean;
  trackingNumber: string;
}

// 3. 사용자 환경 스탯
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
```

---

## 5. 비기능적 요구사항 (Non-Functional Requirements)

1. **사용성 및 접근성**:
   - WCAG AA 명도 대비(4.5:1 이상) 준수
   - 모든 폼 컨트롤(인풋, 셀렉트, 버튼) 최소 터치 타깃 44px 이상 확보
2. **반응형 뷰포트**:
   - 모바일(360px~), 태블릿(768px~), 데스크톱(1024px~1280px+) 완벽 최적화
3. **성능 & 피드백**:
   - 모달 인터랙션 및 탭 전환 간 60fps 부드러운 애니메이션
   - 수거 완료 및 포인트 적립 시 축하 컨페티(Confetti) 효과와 토스트 알림 즉각 피드백
