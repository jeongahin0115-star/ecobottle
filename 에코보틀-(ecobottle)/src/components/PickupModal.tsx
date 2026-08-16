import React, { useState } from 'react';
import { X, RefreshCw, MapPin, Calendar, Clock, Sparkles, User, KeyRound, ShieldCheck, Plus, Minus, PackagePlus, Droplet, Tag } from 'lucide-react';
import { CosmeticBottle, PickupRequest } from '../types';

interface PickupModalProps {
  bottle: CosmeticBottle;
  benefitType?: 'free_refill' | 'points';
  onClose: () => void;
  onSubmit: (request: Omit<PickupRequest, 'id' | 'createdAt' | 'status' | 'pointsCredited' | 'trackingNumber'>) => void;
}

const PRESET_ADDRESSES = [
  { road: '서울특별시 강남구 테헤란로 152 (강남파이낸스센터)', detail: '14층 에코랩', zip: '06236' },
  { road: '경기도 성남시 분당구 판교역로 166 (판교카카오)', detail: 'A동 802호', zip: '13529' },
  { road: '서울특별시 마포구 월드컵북로 396 (누리꿈스퀘어)', detail: '연구동 501호', zip: '03925' },
];

export const PickupModal: React.FC<PickupModalProps> = ({
  bottle,
  benefitType = 'points',
  onClose,
  onSubmit,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [extraBottlesCount, setExtraBottlesCount] = useState(0);
  
  // Address form
  const [roadAddress, setRoadAddress] = useState('서울특별시 강남구 테헤란로 152');
  const [detailAddress, setDetailAddress] = useState('101동 1204호');
  const [zipCode, setZipCode] = useState('06236');

  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [pickupTimeSlot, setPickupTimeSlot] = useState('비대면 문 앞 보관 (오전 07:00 이전 수거)');

  // Contact info
  const [contactName, setContactName] = useState('김에코');
  const [contactPhone, setContactPhone] = useState('010-9876-5432');
  const [doorPassword, setDoorPassword] = useState('공동현관 #1234*');
  const [memo, setMemo] = useState('문 앞에 쇼핑백에 담아 두겠습니다.');

  // Calculation:
  // Refill mode: 30% discount of original price + 10% points earned
  const singleRefillPrice = Math.round(bottle.originalPrice * 0.70);
  const totalRefillPayment = quantity * singleRefillPrice;
  const singleBottleRefillPoints = Math.round(bottle.pickupPoints * 0.10); // 10% points for refill
  const totalRefillEarnedPoints = quantity * singleBottleRefillPoints;

  // Points mode: 100% full bottle points as requested ("포인트만 받는 거는 그에 맞는 포인트를 지급")
  const singleBottleFullPoints = bottle.pickupPoints; // 100% full points
  const extraBottleFullPoints = 500; // 500P full

  const mainBottlesPoints = benefitType === 'free_refill' ? totalRefillEarnedPoints : quantity * singleBottleFullPoints;
  const extraBottlesPoints = benefitType === 'points' ? extraBottlesCount * extraBottleFullPoints : 0;
  const totalEstimatedPoints = mainBottlesPoints + extraBottlesPoints;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadAddress.trim()) {
      alert('회수 장소 주소를 입력해주세요.');
      return;
    }
    if (!contactPhone.trim()) {
      alert('연락처를 입력해주세요.');
      return;
    }

    onSubmit({
      bottle,
      quantity,
      extraBottlesCount: benefitType === 'points' ? extraBottlesCount : 0,
      totalPoints: totalEstimatedPoints,
      benefitType,
      pickupAddress: {
        roadAddress,
        detailAddress,
        zipCode,
      },
      pickupDate,
      pickupTimeSlot,
      contactName,
      contactPhone,
      doorPassword,
      memo,
    });
  };

  const handleApplyPresetAddress = (addr: typeof PRESET_ADDRESSES[0]) => {
    setRoadAddress(addr.road);
    setDetailAddress(addr.detail);
    setZipCode(addr.zip);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        id="pickup-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden my-8 animate-fadeIn"
      >
        
        {/* Header */}
        <div className={`relative text-white p-6 sm:p-7 ${
          benefitType === 'free_refill' 
            ? 'bg-gradient-to-br from-[#042419] via-[#093c2b] to-[#041d13]' 
            : 'bg-gradient-to-br from-[#062c1e] via-[#0b3d2b] to-[#041d13]'
        }`}>
          <button
            id="close-pickup-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
            {benefitType === 'free_refill' ? (
              <>
                <Tag className="w-4 h-4 text-cyan-300" />
                <span className="text-cyan-200">정가 30% 할인 리필 충전 (+10%P 적립)</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>화장품 공병 비대면 무료 회수 & 100% 포인트 적립</span>
              </>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {benefitType === 'free_refill' ? '30% 할인가 리필 충전 & 10%P 적립 신청' : '공병 수거 및 100% 전액 포인트 적립 신청'}
          </h2>
          <p className="text-slate-200/90 text-xs sm:text-sm mt-1.5 leading-relaxed font-normal">
            {benefitType === 'free_refill' ? (
              <span>공병 수거 후 살균 세척 및 <strong className="text-cyan-300 font-bold">{bottle.name}</strong> 원액을 <strong>30% 할인된 가격({singleRefillPrice.toLocaleString()}원)</strong>으로 완충 재배송하며, <strong>10% 포인트(+{singleBottleRefillPoints.toLocaleString()}P)</strong>도 함께 적립됩니다.</span>
            ) : (
              <span>신청하신 공병이 수거 및 검수 확인되면 공병에 책정된 맞춤 포인트 <strong className="text-amber-300 font-black">100% 전액(+{singleBottleFullPoints.toLocaleString()}P)</strong>이 자동 적립됩니다.</span>
            )}
          </p>
        </div>

        {/* Selected Product Banner */}
        <div className={`p-4 sm:p-5 border-b flex items-center gap-4 ${
          benefitType === 'free_refill' 
            ? 'bg-teal-50/70 border-teal-200/80' 
            : 'bg-emerald-50/60 border-emerald-200/80'
        }`}>
          <img
            src={bottle.imageUrl}
            alt={bottle.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200/90 shadow-xs shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-900 text-white">{bottle.brand}</span>
              <span className="text-xs text-slate-600 font-medium">{bottle.capacity} • {bottle.materialKorean}</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5">{bottle.name}</div>
            
            {benefitType === 'free_refill' ? (
              <div className="text-xs text-teal-900 font-bold mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span className="bg-teal-200/80 text-teal-950 px-2 py-0.5 rounded font-black text-[11px]">30% 할인 + 10%P</span>
                <span>정가 {bottle.originalPrice.toLocaleString()}원 ➔ <strong className="text-teal-800">{singleRefillPrice.toLocaleString()}원</strong> (개당)</span>
                <span className="text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] font-black">+{singleBottleRefillPoints.toLocaleString()}P 적립</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-900 font-bold mt-0.5 flex items-center gap-1.5">
                <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-black text-[11px]">100% 전액 적립</span>
                <span>개당 <strong className="text-emerald-800 font-black">+{singleBottleFullPoints.toLocaleString()}P</strong> 전액 지급</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Quantity Selection */}
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                {benefitType === 'free_refill' ? (
                  <Droplet className="w-4 h-4 text-teal-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                )}
                <span>1. {benefitType === 'free_refill' ? '리필 충전할 공병 수량' : '회수할 공병 수량'}</span>
              </span>
              <span className="text-xs font-medium text-slate-500">최대 20개까지 한 번에 신청 가능</span>
            </label>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-lg font-black text-slate-900">{quantity}개</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-right">
                {benefitType === 'free_refill' ? (
                  <div>
                    <div className="text-xs text-slate-500 font-medium">30% 할인가 결제액 & 10%P 적립</div>
                    <div className="text-lg font-black text-teal-800">
                      {totalRefillPayment.toLocaleString()}원 <span className="text-xs font-black text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded-full ml-1">30% 특가</span>
                    </div>
                    <div className="text-xs font-black text-amber-800">
                      +{totalRefillEarnedPoints.toLocaleString()}P 적립
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-slate-500 font-medium">공병 100% 전액 예상 적립 포인트</div>
                    <div className="text-lg font-black text-emerald-800">
                      +{totalEstimatedPoints.toLocaleString()} <span className="text-xs font-bold">P</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Extra other cosmetic bottles option (Only for points mode) */}
            {benefitType === 'points' && (
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PackagePlus className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-teal-950">함께 보낼 다른 일반 화장품 공병이 있나요?</div>
                    <div className="text-[11px] text-teal-800 font-medium">기타 공병 1개당 +500P(100%) 추가 적립</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setExtraBottlesCount(Math.max(0, extraBottlesCount - 1))}
                    className="p-1 hover:text-teal-700 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black text-slate-800 w-6 text-center">{extraBottlesCount}개</span>
                  <button
                    type="button"
                    onClick={() => setExtraBottlesCount(Math.min(10, extraBottlesCount + 1))}
                    className="p-1 hover:text-teal-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>2. {benefitType === 'free_refill' ? '수거 및 리필 완충품 재배송지 주소' : '공병을 회수할 장소 (주소)'}</span>
              </label>
              <div className="text-[11px] text-emerald-700 font-bold">전국 무료 방문 수거/배송</div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 py-1 font-medium">빠른 주소 예시:</span>
              {PRESET_ADDRESSES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPresetAddress(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  예시 {idx + 1} ({preset.road.split(' ')[1]})
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  id="pickup-zipcode"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="우편번호"
                  className="w-28 py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                />
                <input
                  id="pickup-road-address"
                  type="text"
                  value={roadAddress}
                  onChange={(e) => setRoadAddress(e.target.value)}
                  placeholder="기본 주소 (도로명 또는 지번)"
                  className="flex-1 py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                  required
                />
              </div>

              <input
                id="pickup-detail-address"
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 (동/호수, 층수 등)"
                className="w-full py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
              />
            </div>
          </div>

          {/* Section 3: Pickup Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>3. 회수 희망 날짜</span>
              </label>
              <input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>회수 희망 시간대</span>
              </label>
              <select
                id="pickup-time-slot"
                value={pickupTimeSlot}
                onChange={(e) => setPickupTimeSlot(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-800"
              >
                <option value="비대면 문 앞 보관 (오전 07:00 이전 수거)">비대면 문 앞 보관 (오전 07:00 이전 수거)</option>
                <option value="오전 (09:00 ~ 12:00)">오전 (09:00 ~ 12:00)</option>
                <option value="오후 (13:00 ~ 18:00)">오후 (13:00 ~ 18:00)</option>
                <option value="경비실 위탁 수거">경비실 위탁 수거</option>
                <option value="무인택배함 수거">무인택배함 수거</option>
              </select>
            </div>
          </div>

          {/* Section 4: Door Password & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>공동현관 출입 방법</span>
              </label>
              <input
                id="pickup-door-password"
                type="text"
                value={doorPassword}
                onChange={(e) => setDoorPassword(e.target.value)}
                placeholder="예: #1234*, 자유 출입 등"
                className="w-full py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>신청자 연락처</span>
              </label>
              <input
                id="pickup-contact-phone"
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                required
              />
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">
              수거 기사님 전달 메모 (선택)
            </label>
            <input
              id="pickup-memo"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 문 앞 종이 쇼핑백에 담아두었습니다."
              className="w-full py-2.5 px-3 text-xs bg-slate-50/90 border border-slate-300/90 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
            />
          </div>

          {/* Summary Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border ${
            benefitType === 'free_refill'
              ? 'bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 border-teal-200/90'
              : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border-emerald-200/90'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>수거 예정 공병: <strong className="text-slate-900 font-black">총 {quantity + (benefitType === 'points' ? extraBottlesCount : 0)}개</strong></span>
              <span>왕복 수거/배송비용: <strong className="text-emerald-800 font-black">무료 (0원)</strong></span>
            </div>
            
            {benefitType === 'free_refill' ? (
              <div className="space-y-2 pt-2 border-t border-teal-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-teal-600 fill-current" />
                    <span>30% 할인가 리필 결제 금액:</span>
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-black text-teal-800 flex items-baseline justify-end gap-1">
                      <span>{totalRefillPayment.toLocaleString()}원</span>
                      <span className="text-xs font-black text-teal-900 bg-teal-200/80 px-2 py-0.5 rounded-full">30% 할인</span>
                    </div>
                    <div className="text-xs text-slate-400 line-through">
                      정가 {(quantity * bottle.originalPrice).toLocaleString()}원
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-teal-200/60">
                  <span className="text-teal-950 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>추가 적립 혜택 (10%P):</span>
                  </span>
                  <span className="font-black text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-300">
                    +{totalRefillEarnedPoints.toLocaleString()}P 적립
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-emerald-200/80">
                <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>수거 검수 후 100% 전액 지급 포인트:</span>
                </span>
                <div className="text-xl font-black text-emerald-800 flex items-baseline gap-1">
                  <span>+{totalEstimatedPoints.toLocaleString()}</span>
                  <span className="text-xs font-black text-amber-600">P</span>
                </div>
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-normal">
              {benefitType === 'free_refill' ? (
                <span>수거된 공병은 에코 멸균 세척 및 원액 완충을 거쳐 3~4일 이내로 정가 대비 30% 할인된 가격으로 동일한 배송지로 안전하게 무료 배송되며, 공병 10% 포인트(+{totalRefillEarnedPoints.toLocaleString()}P)도 함께 적립됩니다.</span>
              ) : (
                <span>수거 기사님이 방문하여 공병을 회수한 뒤 검수가 완료되는 즉시 공병 맞춤 포인트 100% 전액(+{totalEstimatedPoints.toLocaleString()}P)이 사용자 계정으로 입금됩니다.</span>
              )}
            </p>
          </div>

          {/* Submit Button */}
          <button
            id="submit-pickup-request-btn"
            type="submit"
            className={`w-full py-4 px-6 rounded-2xl text-white font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] ${
              benefitType === 'free_refill'
                ? 'bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 shadow-teal-700/30'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 shadow-emerald-700/30'
            }`}
          >
            {benefitType === 'free_refill' ? (
              <>
                <Droplet className="w-5 h-5 fill-current" />
                <span>30% 할인가({totalRefillPayment.toLocaleString()}원) + {totalRefillEarnedPoints.toLocaleString()}P(10%) 리필 신청 완료</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>회수 신청 완료하고 +{totalEstimatedPoints.toLocaleString()}P(100%) 적립 대기하기</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
