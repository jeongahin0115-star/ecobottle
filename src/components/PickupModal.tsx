import React, { useState } from 'react';
import { X, RefreshCw, MapPin, Calendar, Clock, Sparkles, User, KeyRound, ShieldCheck, Plus, Minus, PackagePlus, Droplet, ArrowRight } from 'lucide-react';
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

  const originalPrice = bottle?.originalPrice ?? 0;
  const pickupPoints = bottle?.pickupPoints ?? 0;

  // Calculation:
  const singleRefillPrice = Math.round(originalPrice * 0.70);
  const totalRefillPayment = quantity * singleRefillPrice;
  const singleBottleRefillPoints = Math.round(pickupPoints * 0.10);
  const totalRefillEarnedPoints = quantity * singleBottleRefillPoints;

  const singleBottleFullPoints = pickupPoints;
  const extraBottleFullPoints = 500;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="pickup-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E5E0] overflow-hidden my-8 animate-fadeIn"
      >
        
        {/* Header */}
        <div className="relative bg-[#121214] text-[#F8F8F6] p-6 sm:p-8 border-b border-black/10">
          <button
            id="close-pickup-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-[#EAF854] text-[11px] font-mono-code uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EAF854]" />
            <span>
              {benefitType === 'free_refill' ? '30% REFILL POUCH DISPATCH' : 'CONTACTLESS RECYCLE DISPATCH'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-display">
            {benefitType === 'free_refill' ? '30% 할인가 리필 완충 & 10%P 적립 신청' : '공병 수거 및 100% 전액 포인트 적립 신청'}
          </h2>
          <p className="text-[#A0A0A5] text-xs sm:text-sm mt-1 leading-relaxed">
            {benefitType === 'free_refill' ? (
              <span>수거 후 멸균 세척 및 <strong className="text-white">{bottle?.name}</strong> 원액을 <strong>30% 할인된 가격({singleRefillPrice.toLocaleString()}원)</strong>으로 완충 재배송하며, <strong>10% 포인트(+{singleBottleRefillPoints.toLocaleString()}P)</strong>도 적립됩니다.</span>
            ) : (
              <span>수거 및 검수 확인 완료 시 공병에 책정된 맞춤 포인트 <strong className="text-[#EAF854]">100% 전액(+{singleBottleFullPoints.toLocaleString()}P)</strong>이 즉시 계정으로 입금됩니다.</span>
            )}
          </p>
        </div>

        {/* Selected Product Banner */}
        <div className="p-5 bg-[#FBFBF9] border-b border-[#E5E5E0] flex items-center gap-4">
          <img
            src={bottle.imageUrl}
            alt={bottle.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-[#E5E5E0] shadow-2xs shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap font-mono-code">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#121214] text-white uppercase">{bottle.brand}</span>
              <span className="text-xs text-[#737378]">{bottle.capacity} • {bottle.materialKorean}</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-[#121214] truncate mt-1">{bottle.name}</div>
            
            {benefitType === 'free_refill' ? (
              <div className="text-xs text-[#121214] font-mono-code mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="bg-[#EAF854] text-[#121214] px-2 py-0.2 rounded-full font-bold text-[10px]">-30% REFILL</span>
                <span>정가 {originalPrice.toLocaleString()}원 ➔ <strong>{singleRefillPrice.toLocaleString()}원</strong></span>
                <span className="text-[#737378]">+{singleBottleRefillPoints.toLocaleString()}P 적립</span>
              </div>
            ) : (
              <div className="text-xs text-[#121214] font-mono-code mt-0.5 flex items-center gap-2">
                <span className="bg-[#121214] text-[#EAF854] px-2 py-0.2 rounded-full font-bold text-[10px]">100% REWARD</span>
                <span>개당 <strong>+{singleBottleFullPoints.toLocaleString()}P</strong> 전액 지급</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Quantity Selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center justify-between">
              <span>01. {benefitType === 'free_refill' ? 'REFILL QUANTITY' : 'RECYCLE QUANTITY'}</span>
              <span className="text-[10px] lowercase text-[#88888D]">최대 20개 신청 가능</span>
            </label>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0]">
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-[#E5E5E0] shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full bg-[#F0F0EB] hover:bg-[#E2ECE5] text-[#121214] flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-base font-extrabold text-[#121214] font-mono-code">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-7 h-7 rounded-full bg-[#F0F0EB] hover:bg-[#E2ECE5] text-[#121214] flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 text-right font-mono-code">
                {benefitType === 'free_refill' ? (
                  <div>
                    <div className="text-xs text-[#737378]">30% 할인가 결제 및 10%P 적립</div>
                    <div className="text-lg font-extrabold text-[#121214]">
                      {totalRefillPayment.toLocaleString()} KRW
                    </div>
                    <div className="text-xs font-bold text-[#121214]">
                      +{totalRefillEarnedPoints.toLocaleString()} P 적립
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-[#737378]">100% 예상 적립 포인트</div>
                    <div className="text-lg font-extrabold text-[#121214]">
                      +{totalEstimatedPoints.toLocaleString()} <span className="text-xs">P</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Extra other cosmetic bottles option (Only for points mode) */}
            {benefitType === 'points' && (
              <div className="p-4 rounded-2xl bg-white border border-[#E5E5E0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <PackagePlus className="w-4 h-4 text-[#121214] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#121214]">함께 보낼 다른 일반 화장품 공병이 있나요?</div>
                    <div className="text-[11px] text-[#737378] font-mono-code">기타 공병 1개당 +500P(100%) 추가 적립</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#F7F7F4] px-2.5 py-1 rounded-full border border-[#E5E5E0] shadow-2xs font-mono-code">
                  <button
                    type="button"
                    onClick={() => setExtraBottlesCount(Math.max(0, extraBottlesCount - 1))}
                    className="p-1 hover:text-[#121214] cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-[#121214] w-6 text-center">{extraBottlesCount}</span>
                  <button
                    type="button"
                    onClick={() => setExtraBottlesCount(Math.min(10, extraBottlesCount + 1))}
                    className="p-1 hover:text-[#121214] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#121214]" />
                <span>02. {benefitType === 'free_refill' ? 'PICKUP & RE-DELIVERY ADDRESS' : 'PICKUP ADDRESS'}</span>
              </label>
              <div className="text-[10px] font-mono-code text-[#121214] font-bold">FREE PICKUP & SHIPPING</div>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs font-mono-code">
              <span className="text-[11px] text-[#88888D] py-1">PRESETS:</span>
              {PRESET_ADDRESSES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPresetAddress(preset)}
                  className="px-2.5 py-1 rounded-full bg-[#F7F7F4] hover:bg-[#EBEBE8] text-[#121214] text-[11px] transition-colors cursor-pointer border border-[#E5E5E0]"
                >
                  {preset.road.split(' ')[1]}
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
                  className="w-28 py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-mono-code"
                />
                <input
                  id="pickup-road-address"
                  type="text"
                  value={roadAddress}
                  onChange={(e) => setRoadAddress(e.target.value)}
                  placeholder="기본 주소 (도로명 또는 지번)"
                  className="flex-1 py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
                  required
                />
              </div>

              <input
                id="pickup-detail-address"
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 (동/호수, 층수 등)"
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Section 3: Pickup Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#121214]" />
                <span>03. PICKUP DATE</span>
              </label>
              <input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-mono-code"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#121214]" />
                <span>TIME SLOT</span>
              </label>
              <select
                id="pickup-time-slot"
                value={pickupTimeSlot}
                onChange={(e) => setPickupTimeSlot(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-medium text-[#121214]"
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
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#121214]" />
                <span>DOOR CODE</span>
              </label>
              <input
                id="pickup-door-password"
                type="text"
                value={doorPassword}
                onChange={(e) => setDoorPassword(e.target.value)}
                placeholder="예: #1234*, 자유 출입 등"
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#121214]" />
                <span>PHONE NUMBER</span>
              </label>
              <input
                id="pickup-contact-phone"
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-mono-code"
                required
              />
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378]">
              DELIVERY MEMO
            </label>
            <input
              id="pickup-memo"
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 문 앞 종이 쇼핑백에 담아두었습니다."
              className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
            />
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0] font-mono-code">
            <div className="flex items-center justify-between text-xs text-[#737378] mb-2">
              <span>ITEMS: <strong className="text-[#121214]">{quantity + (benefitType === 'points' ? extraBottlesCount : 0)} PCS</strong></span>
              <span>SHIPPING: <strong className="text-[#121214]">FREE (0 KRW)</strong></span>
            </div>
            
            {benefitType === 'free_refill' ? (
              <div className="space-y-2 pt-2 border-t border-[#E5E5E0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#121214] flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-[#121214] fill-current" />
                    <span>30% REFILL AMOUNT:</span>
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-[#121214] flex items-baseline justify-end gap-1">
                      <span>{totalRefillPayment.toLocaleString()} KRW</span>
                    </div>
                    <div className="text-xs text-[#88888D] line-through">
                      ORIGINAL {(quantity * originalPrice).toLocaleString()} KRW
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5E5E0]">
                  <span className="text-[#737378] font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#121214]" />
                    <span>REWARD (10%P):</span>
                  </span>
                  <span className="font-bold text-[#121214] bg-[#EAF854] px-2 py-0.5 rounded-full">
                    +{totalRefillEarnedPoints.toLocaleString()} P
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E0]">
                <span className="text-xs font-bold text-[#121214] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#121214]" />
                  <span>TOTAL ESTIMATED REWARD (100%):</span>
                </span>
                <div className="text-xl font-extrabold text-[#121214] flex items-baseline gap-1">
                  <span>+{totalEstimatedPoints.toLocaleString()}</span>
                  <span className="text-xs text-[#737378]">P</span>
                </div>
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 text-xs text-[#737378] bg-white p-4 rounded-2xl border border-[#E5E5E0]">
            <ShieldCheck className="w-4 h-4 text-[#121214] shrink-0 mt-0.5" />
            <p className="leading-relaxed font-normal">
              {benefitType === 'free_refill' ? (
                <span>수거된 공병은 에코 멸균 세척 및 원액 완충을 거쳐 3~4일 이내로 정가 대비 30% 할인된 가격으로 무료 배송되며, 10% 포인트(+{totalRefillEarnedPoints.toLocaleString()}P)도 함께 적립됩니다.</span>
              ) : (
                <span>수거 기사님이 방문하여 공병을 회수한 뒤 검수가 완료되는 즉시 공병 맞춤 포인트 100% 전액(+{totalEstimatedPoints.toLocaleString()}P)이 사용자 계정으로 입금됩니다.</span>
              )}
            </p>
          </div>

          {/* Submit Button */}
          <button
            id="submit-pickup-request-btn"
            type="submit"
            className="w-full py-4 px-6 rounded-full text-white font-mono-code font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 bg-[#121214] hover:bg-[#2A2A2E]"
          >
            {benefitType === 'free_refill' ? (
              <>
                <Droplet className="w-4 h-4 text-[#EAF854] fill-current" />
                <span>30% REFILL ({totalRefillPayment.toLocaleString()} KRW) + {totalRefillEarnedPoints.toLocaleString()}P SUBMIT</span>
                <ArrowRight className="w-4 h-4 text-[#EAF854]" />
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-[#EAF854]" />
                <span>COMPLETE PICKUP REQUEST (+{totalEstimatedPoints.toLocaleString()}P)</span>
                <ArrowRight className="w-4 h-4 text-[#EAF854]" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
