# 🎨 에코보틀 (EcoBottle) 디자인 시스템 가이드 (DESIGN.md)

---

## 1. 디자인 비전 및 컨셉 (Design Vision & Archetype)

- **컨셉 키워드**: `Eco-Modern Pristine`, `Circular Beauty`, `Trustworthy Clean`
- **디자인 철학**:
  - 친환경의 편견인 칙칙한 갈색 톤을 지양하고, **에메랄드/틸 그린의 청량한 생동감**과 **세련된 오프화이트 캔버스**를 결합하여 프리미엄 뷰티 플랫폼다운 신뢰감과 청결함을 전달합니다.
  - 인위적인 과장이나 불필요한 AI 클리셰(보라-파랑 그라디언트, 임의의 네온 글로우 등)를 완전히 배제하고, **명확한 정보 위계, 여유로운 음의 공간(Negative Space), 정교한 모서리 곡률 연산**을 통해 프로덕트의 완성도를 극대화합니다.

---

## 2. 컬러 팔레트 시스템 (Color Tokens)

### 2.1. Primary & Brand Colors
| 토큰명 | 색상 코드 (HEX) | Tailwind 클래스 | 용도 |
| :--- | :--- | :--- | :--- |
| **Brand Emerald** | `#059669` / `#10b981` | `emerald-600` / `emerald-500` | 메인 브랜드 액션, 포인트 배지, 회수 신청 버튼 |
| **Brand Deep Teal** | `#0f766e` / `#115e59` | `teal-700` / `teal-800` | 리필 혜택 강조, 30% 할인가 강조, 깊이감 있는 그라디언트 |
| **Brand Cyan Accent**| `#0891b2` / `#06b6d4` | `cyan-600` / `cyan-500` | 세척/멸균 완충 인디케이터, 청결감 부여 |
| **Gold Reward** | `#d97706` / `#f59e0b` | `amber-600` / `amber-500` | 에코 포인트 코인 아이콘, 보너스 리워드 강조 |

### 2.2. Backgrounds & Neutrals
| 토큰명 | 색상 코드 (HEX) | Tailwind 클래스 | 용도 |
| :--- | :--- | :--- | :--- |
| **Canvas Background**| `#f8fafc` | `bg-slate-50` | 최상위 페이지 배경 (미세한 쿨톤 첨가로 눈 피로 최소화) |
| **Card Surface** | `#ffffff` | `bg-white` | 컴포넌트 및 카드 기본 배경 |
| **Subtle Neutral** | `#f1f5f9` / `#e2e8f0` | `slate-100` / `slate-200` | 비활성 영역, 카드 보더, 구분선 |
| **Text Primary** | `#0f172a` | `text-slate-900` | 고대비 본문 및 헤드라인 (명도비 12:1 이상) |
| **Text Secondary** | `#475569` / `#64748b` | `text-slate-600` / `slate-500`| 보조 설명, 라벨, 힌트 텍스트 |

### 2.3. Material & Badge Color Coding
용기 재질별 시각적 구분을 위한 전용 태그 팔레트:
- **유리 (Glass)**: `bg-blue-50 text-blue-700 border-blue-200` (재활용 최우수)
- **투명 PET**: `bg-emerald-50 text-emerald-700 border-emerald-200`
- **PP (폴리프로필렌)**: `bg-indigo-50 text-indigo-700 border-indigo-200`
- **알루미늄 (Aluminum)**: `bg-amber-50 text-amber-700 border-amber-200`
- **PE 튜브 (Tube)**: `bg-teal-50 text-teal-700 border-teal-200`

---

## 3. 타이포그래피 시스템 (Typography System)

- **주 폰트 (Font Family)**: `Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **폰트 스케일 비율**: Major Second (1.125) 기반 밀도 있는 UI 최적화

| 레벨 | 폰트 크기 | 행간 (Line Height) | 자간 (Letter Spacing) | 굵기 (Font Weight) | 용도 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | `2.25rem (36px)` | `1.25` | `-0.025em` | `900 (Black)` | 메인 히어로 헤드라인 |
| **Section H2** | `1.75rem (28px)` | `1.3` | `-0.02em` | `800 (ExtraBold)` | 탭 타이틀, 모달 헤더 |
| **Card Title H3**| `1.125rem (18px)`| `1.4` | `-0.01em` | `700 (Bold)` | 화장품/상품명 |
| **Body Large** | `1.0rem (16px)` | `1.6` | `0em` | `500 (Medium)` | 주요 안내문, 버튼 텍스트 |
| **Body Regular**| `0.875rem (14px)`| `1.5` | `0em` | `400 (Regular)` | 서술형 설명, 폼 인풋 |
| **Caption/Label**| `0.75rem (12px)` | `1.4` | `+0.01em` | `600 (SemiBold)` | 배지, 카테고리 태그 |

---

## 4. 레이아웃 및 공간 규칙 (Spacing & Grid Rules)

### 4.1. 컨테이너 및 그리드 규칙
- **최대 폭 (Max-Width)**: `max-w-7xl (1280px)`로 중앙 정렬하여 대형 스크린에서도 시선 분산 방지
- **패딩 규칙**:
  - 모바일: `px-4 (16px)`
  - 태블릿/데스크톱: `px-6 md:px-8 (24px ~ 32px)`
- **버튼 패딩 황금비**: 수평 패딩은 항상 수직 패딩의 **정확히 2배**를 유지 (`py-3.5 px-7` 또는 `py-3 px-6`)

### 4.2. 중첩 라운드 코너 연산 (Nested Border Radius Rule)
- 외부 컨테이너 반경: $R_{outer} = 24\text{px} \ (rounded-3xl)$
- 내부 패딩: $P = 16\text{px} \ (p-4)$
- 내부 요소 반경: $R_{inner} = R_{outer} - P = 8\text{px} \ (rounded-lg)$

---

## 5. 핵심 컴포넌트 디자인 상세 (Component Anatomy)

### 5.1. 헤더 & 고정 에코 스탯 바 (`Header.tsx`)
- 상단 4단 네비게이션: `공병 찾기 (수거신청)`, `에코 분리수거 가이드`, `포인트 특가 마켓`, `내 활동 내역`
- 우측 상단 실시간 스탯 위젯:
  - 사용자 보유 포인트 배지 (`bg-amber-50 text-amber-900 border-amber-200`)
  - 현재 에코 티어 칩 (새싹/그린/실버/골드/마스터 단계별 컬러 연동)

### 5.2. 화장품 공병 카드 (`CosmeticCard.tsx`)
- **상단 비주얼 영역**:
  - `h-56` 고화질 정품 화장품 컷 (호버 시 105% 부드러운 확대)
  - 좌측 상단 브랜드 블러 뱃지 + 재질 컬러 칩
  - 우측 상단 용량(ml) 알약 태그
- **하단 혜택 2분할 섹션**:
  - **좌측 (리필 혜택)**: 30% 할인가 표시 + 취소선 정가 + 10% 추가 적립 안내
  - **우측 (포인트 혜택)**: 공병 100% 맞춤 포인트 뱃지
- **원클릭 통합 액션 버튼**: 그라디언트 에메랄드/틸 풀-와이드 버튼

### 5.3. 혜택 선택 팝업 (`BenefitChoiceModal.tsx`)
- **옵션 1 카드 (30% 리필 + 10% 포인트)**:
  - 틸/시안 300 보더 & 부드러운 틸 틴트 배경
  - 30% 할인된 명확한 실 결제액과 10% 추가 보너스 포인트 칩 병기
- **옵션 2 카드 (100% 전액 포인트)**:
  - 에메랄드 200 보더 & 깔끔한 화이트 카드
  - 수거 검수 시 즉시 지급되는 100% 풀 포인트와 등급 보너스율 명시

### 5.4. 수거 신청 폼 (`PickupModal.tsx`)
- **스텝 폼 구성**:
  1. 수거 수량 및 기타 공병 동봉 수량 카운터
  2. 다음/카카오 주소 연동 우편번호 및 도로명 주소 검색
  3. 캘린더 일자 및 비대면 시간대 선택 칩
  4. 신청자 연락처 & 공동현관 출입 메모
- **하단 결제/적립 실시간 요약 바**: 선택된 옵션(30% 할인가 vs 100% 포인트)에 따른 총액 실시간 인터랙션

---

## 6. 인터랙션 및 마이크로 피드백 (Micro-Interactions)

- **Hover States**: 카드 테두리 색상 전환(`border-slate-200` ➔ `border-emerald-300`)과 가벼운 그림자 승격(`shadow-sm` ➔ `shadow-lg`)
- **Active States**: 버튼 클릭 시 `scale-[0.98]` 햅틱 스타일 스케일 피드백
- **Success Events**:
  - 수거 신청 완료 및 포인트 적립 완료 시 화면 상단 `Canvas-Confetti` 꽃가루 파티클 애니메이션 발동
  - 하단 플로팅 `Toast` 알림을 통한 긍정적 보상 경험 부여
