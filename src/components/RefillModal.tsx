import React, { useState } from 'react';
import { X, Droplet, MapPin, Calendar, Clock, Coins, Truck, Plus, Minus, ArrowRight } from 'lucide-react';
import { CosmeticBottle, RefillOrder } from '../types';

interface RefillModalProps {
  bottle: CosmeticBottle;
  userPoints: number;
  onClose: () => void;
  onSubmit: (order: Omit<RefillOrder, 'id' | 'createdAt' | 'status' | 'trackingNumber'>) => void;
}

const PRESET_ADDRESSES = [
  { road: '서울특별시 강남구 테헤란로 152 (강남파이낸스센터)', detail: '14층 에코랩', zip: '06236' },
  { road: '경기도 성남시 분당구 판교역로 166 (판교카카오)', detail: 'A동 802호', zip: '13529' },
  { road: '서울특별시 마포구 월드컵북로 396 (누리꿈스퀘어)', detail: '연구동 501호', zip: '03925' },
];

export const RefillModal: React.FC<RefillModalProps> = ({
  bottle,
  userPoints = 0,
  onClose,
  onSubmit,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [usePoints, setUsePoints] = useState(0);

  // Address
  const [roadAddress, setRoadAddress] = useState('서울특별시 강남구 테헤란로 152');
  const [detailAddress, setDetailAddress] = useState('101동 1204호');
  const [zipCode, setZipCode] = useState('06236');

  // Delivery preferred date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [preferredDate, setPreferredDate] = useState(defaultDateStr);
  const [deliveryMemo, setDeliveryMemo] = useState('문 앞에 안전하게 놓아주세요. (친환경 종이 포장재)');

  const originalPrice = bottle?.originalPrice ?? 0;
  const unitPrice = bottle?.refillPrice || Math.round(originalPrice * 0.70);
  const refillRewardPoints = bottle?.refillPoints ?? Math.round((bottle?.pickupPoints ?? 0) * 0.10);

  const totalPrice = quantity * unitPrice;
  const maxUsablePoints = Math.min(userPoints, totalPrice);
  const finalPaidAmount = Math.max(0, totalPrice - usePoints);
  const totalEarnedPoints = quantity * refillRewardPoints;

  const handleUseAllPoints = () => {
    setUsePoints(maxUsablePoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadAddress.trim()) {
      alert('리필팩을 받으실 배송지 주소를 입력해주세요.');
      return;
    }

    onSubmit({
      bottle,
      quantity,
      unitPrice,
      totalPrice,
      pointsUsed: usePoints,
      finalPaidAmount,
      earnedPoints: totalEarnedPoints,
      deliveryAddress: {
        roadAddress,
        detailAddress,
        zipCode,
      },
      preferredDate,
      deliveryMemo,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="refill-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E5E0] overflow-hidden my-8 animate-fadeIn"
      >
        
        {/* Header */}
        <div className="relative bg-[#121214] text-[#F8F8F6] p-6 sm:p-8 border-b border-black/10">
          <button
            id="close-refill-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-[#EAF854] text-[11px] font-mono-code uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EAF854]" />
            <span>ECO REFILL POUCH ORDER</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-display">
            친환경 리필팩 주문 및 배송 신청
          </h2>
          <p className="text-[#A0A0A5] text-xs sm:text-sm mt-1 leading-relaxed">
            플라스틱 용기 쓰레기 80% 절감! 정가 대비 최대 50% 절약된 금액으로 리필 원액을 배송받으세요.
          </p>
        </div>

        {/* Selected Bottle Summary Strip */}
        <div className="p-5 bg-[#FBFBF9] border-b border-[#E5E5E0] flex items-center gap-4">
          <img
            src={bottle.imageUrl}
            alt={bottle.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border border-[#E5E5E0] shadow-2xs shrink-0 bg-white"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap font-mono-code">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#121214] text-white uppercase">
                {bottle.brand} REFILL
              </span>
              <span className="text-xs text-[#121214] bg-[#EAF854] px-2.5 py-0.5 rounded-full font-bold">
                SAVE {originalPrice > 0 ? Math.round(((originalPrice - unitPrice) / originalPrice) * 100) : 30}%
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-[#121214] truncate mt-1">
              {bottle.refillName || `${bottle.name} 친환경 리필팩`}
            </div>
            <div className="flex items-center gap-3 text-xs mt-0.5 font-mono-code">
              <span className="text-[#88888D] line-through">{originalPrice.toLocaleString()}원</span>
              <span className="text-sm font-bold text-[#121214]">{unitPrice.toLocaleString()}원</span>
              <span className="text-[#737378]">+{refillRewardPoints.toLocaleString()}P 적립</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Quantity Selection */}
          <div className="space-y-3">
            <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center justify-between">
              <span>01. REFILL QUANTITY</span>
              <span className="text-[10px] lowercase text-[#88888D]">최대 10개 신청 가능</span>
            </label>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0]">
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-[#E5E5E0] shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    const nextQ = Math.max(1, quantity - 1);
                    setQuantity(nextQ);
                    setUsePoints(Math.min(usePoints, nextQ * unitPrice));
                  }}
                  className="w-7 h-7 rounded-full bg-[#F0F0EB] hover:bg-[#E2ECE5] text-[#121214] flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-base font-extrabold text-[#121214] font-mono-code">{quantity}</span>
                <button
                  type="button"
                  onClick={() => {
                    const nextQ = Math.min(10, quantity + 1);
                    setQuantity(nextQ);
                  }}
                  className="w-7 h-7 rounded-full bg-[#F0F0EB] hover:bg-[#E2ECE5] text-[#121214] flex items-center justify-center font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 text-right font-mono-code">
                <div className="text-xs text-[#737378]">리필 상품 금액:</div>
                <div className="text-lg font-extrabold text-[#121214]">
                  {totalPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Point Redemption */}
          <div className="space-y-3 p-5 rounded-2xl bg-white border border-[#E5E5E0]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#121214]" />
                <span>02. POINT DISCOUNT</span>
              </label>
              <span className="text-xs font-mono-code text-[#737378]">
                BALANCE: <strong className="text-[#121214] font-bold">{userPoints.toLocaleString()}P</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  max={maxUsablePoints}
                  value={usePoints || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setUsePoints(Math.min(val, maxUsablePoints));
                  }}
                  placeholder="사용할 포인트 입력"
                  className="w-full py-2.5 px-3 text-xs font-bold bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] outline-none pr-8 font-mono-code"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-[#121214] font-mono-code">P</span>
              </div>

              <button
                type="button"
                onClick={handleUseAllPoints}
                className="px-4 py-2 text-xs font-bold font-mono-code bg-[#121214] hover:bg-[#2A2A2E] text-white rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                전액 사용
              </button>
            </div>

            <div className="text-[11px] text-[#88888D] font-mono-code">
              * 보유 중인 에코 포인트는 1P = 1원으로 현금처럼 사용하실 수 있습니다.
            </div>
          </div>

          {/* Section 3: Delivery Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#121214]" />
                <span>03. DELIVERY ADDRESS</span>
              </label>
              <div className="text-[10px] font-mono-code text-[#121214] font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> FREE SHIPPING
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-[11px] font-mono-code text-[#88888D] py-1">PRESETS:</span>
              {PRESET_ADDRESSES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRoadAddress(preset.road);
                    setDetailAddress(preset.detail);
                    setZipCode(preset.zip);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#F7F7F4] hover:bg-[#EBEBE8] text-[#121214] text-[11px] font-mono-code transition-colors cursor-pointer border border-[#E5E5E0]"
                >
                  {preset.road.split(' ')[1]}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  id="refill-zipcode"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="우편번호"
                  className="w-28 py-2 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-mono-code"
                />
                <input
                  id="refill-road-address"
                  type="text"
                  value={roadAddress}
                  onChange={(e) => setRoadAddress(e.target.value)}
                  placeholder="기본 주소 (도로명 또는 지번)"
                  className="flex-1 py-2 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
                  required
                />
              </div>

              <input
                id="refill-detail-address"
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 (동/호수, 층수 등)"
                className="w-full py-2 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Section 4: Preferred Date & Delivery Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#121214]" />
                <span>PREFERRED DATE</span>
              </label>
              <input
                id="refill-preferred-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-mono-code"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#737378] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#121214]" />
                <span>DELIVERY MEMO</span>
              </label>
              <input
                id="refill-delivery-memo"
                type="text"
                value={deliveryMemo}
                onChange={(e) => setDeliveryMemo(e.target.value)}
                placeholder="예: 문 앞 보관, 부재 시 연락"
                className="w-full py-2.5 px-3 text-xs bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="p-5 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0] space-y-2 text-xs font-mono-code">
            <div className="flex justify-between text-[#737378]">
              <span>SUBTOTAL ({quantity} PCS)</span>
              <span className="text-[#121214] font-bold">{totalPrice.toLocaleString()} KRW</span>
            </div>
            {usePoints > 0 && (
              <div className="flex justify-between text-[#121214] font-bold">
                <span>POINTS APPLIED</span>
                <span>-{usePoints.toLocaleString()} P</span>
              </div>
            )}
            <div className="flex justify-between text-[#737378]">
              <span>SHIPPING FEE</span>
              <span className="text-[#121214] font-bold">0 KRW (FREE)</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E0]">
              <span className="text-xs font-bold text-[#121214]">TOTAL PAYMENT</span>
              <span className="text-xl font-extrabold text-[#121214]">
                {finalPaidAmount.toLocaleString()} KRW
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 text-[#121214] font-bold">
              <span>ESTIMATED REWARD:</span>
              <span className="bg-[#EAF854] px-2 py-0.5 rounded-full">+{totalEarnedPoints.toLocaleString()} P</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            id="submit-refill-request-btn"
            type="submit"
            className="w-full py-4 px-6 rounded-full bg-[#121214] hover:bg-[#2A2A2E] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer font-mono-code"
          >
            <Truck className="w-4 h-4 text-[#EAF854]" />
            <span>SUBMIT REFILL ORDER (FREE SHIPPING)</span>
            <ArrowRight className="w-4 h-4 text-[#EAF854]" />
          </button>

        </form>

      </div>
    </div>
  );
};
