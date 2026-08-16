import React, { useState } from 'react';
import { X, Droplet, MapPin, Calendar, Clock, Coins, Sparkles, Truck, ShieldCheck, CheckCircle2, Plus, Minus, Tag } from 'lucide-react';
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
  userPoints,
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

  // Calculation
  const unitPrice = bottle.refillPrice || 15000;
  const totalPrice = quantity * unitPrice;
  const maxUsablePoints = Math.min(userPoints, totalPrice);
  const finalPaidAmount = Math.max(0, totalPrice - usePoints);
  const totalEarnedPoints = quantity * bottle.refillPoints;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div 
        id="refill-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden my-8 animate-fadeIn"
      >
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-800 to-cyan-900 text-white p-6">
          <button
            id="close-refill-modal-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Droplet className="w-4 h-4 text-cyan-300" />
            <span>친환경 리필팩 맞춤 주문 & 배송</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            리필팩 신청 및 배송 정보 입력
          </h2>
          <p className="text-teal-100 text-xs mt-1">
            플라스틱 용기 쓰레기 80% 절감! 본품보다 최대 50% 저렴하게 리필액을 배송받으세요.
          </p>
        </div>

        {/* Matching Refill Product Banner */}
        <div className="p-5 bg-teal-50/60 border-b border-teal-100 flex items-center gap-4">
          <img
            src={bottle.imageUrl}
            alt={bottle.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-xl object-cover border border-teal-200 shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                {bottle.brand} 리필팩
              </span>
              <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">
                정가 대비 {Math.round(((bottle.originalPrice - bottle.refillPrice) / bottle.originalPrice) * 100)}% 절약
              </span>
            </div>
            <div className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {bottle.refillName || `${bottle.name} 친환경 리필팩`}
            </div>
            <div className="flex items-center gap-3 text-xs mt-0.5">
              <span className="text-slate-500 line-through">정가 {bottle.originalPrice.toLocaleString()}원</span>
              <span className="text-sm font-extrabold text-teal-700">{unitPrice.toLocaleString()}원</span>
              <span className="text-emerald-700 font-bold">+{bottle.refillPoints.toLocaleString()}P 적립</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: Quantity Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-teal-600" />
                <span>1. 리필팩 신청 수량</span>
              </span>
              <span className="text-xs text-slate-500 font-normal">필요한 수량을 선택하세요</span>
            </label>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    const nextQ = Math.max(1, quantity - 1);
                    setQuantity(nextQ);
                    setUsePoints(Math.min(usePoints, nextQ * unitPrice));
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 flex items-center justify-center font-bold transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-lg font-black text-slate-900">{quantity}개</span>
                <button
                  type="button"
                  onClick={() => {
                    const nextQ = Math.min(10, quantity + 1);
                    setQuantity(nextQ);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 flex items-center justify-center font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-right">
                <div className="text-xs text-slate-500">리필팩 상품 금액</div>
                <div className="text-lg font-black text-slate-900">
                  {totalPrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Point Redemption */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>2. 포인트 사용하여 할인받기</span>
              </label>
              <span className="text-xs font-semibold text-slate-600">
                내 보유 포인트: <strong className="text-amber-700 font-extrabold">{userPoints.toLocaleString()}P</strong>
              </span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="refill-points-input"
                  type="number"
                  min="0"
                  max={maxUsablePoints}
                  value={usePoints || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setUsePoints(Math.min(val, maxUsablePoints));
                  }}
                  placeholder="사용할 포인트 입력"
                  className="w-full py-2.5 px-3 text-sm font-bold bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none pr-8"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-amber-700">P</span>
              </div>

              <button
                type="button"
                onClick={handleUseAllPoints}
                className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                전액 사용
              </button>
            </div>
            <div className="text-[11px] text-amber-800">
              * 공병 회수로 적립된 포인트를 1P = 1원으로 현금처럼 전액 사용하실 수 있습니다.
            </div>
          </div>

          {/* Section 3: Delivery Address */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>3. 리필팩을 받을 주소</span>
              </label>
              <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> 친환경 무료 배송
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 py-1 font-medium">빠른 주소 예시:</span>
              {PRESET_ADDRESSES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRoadAddress(preset.road);
                    setDetailAddress(preset.detail);
                    setZipCode(preset.zip);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 text-[11px] font-medium transition-colors"
                >
                  예시 {idx + 1} ({preset.road.split(' ')[1]})
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
                  className="w-28 py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none"
                />
                <input
                  id="refill-road-address"
                  type="text"
                  value={roadAddress}
                  onChange={(e) => setRoadAddress(e.target.value)}
                  placeholder="기본 주소 (도로명 또는 지번)"
                  className="flex-1 py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none"
                  required
                />
              </div>

              <input
                id="refill-detail-address"
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세 주소 (동/호수, 층수 등)"
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Section 4: Preferred Date & Delivery Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>배송 희망 날짜</span>
              </label>
              <input
                id="refill-preferred-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>배송 메모 / 요청사항</span>
              </label>
              <input
                id="refill-delivery-memo"
                type="text"
                value={deliveryMemo}
                onChange={(e) => setDeliveryMemo(e.target.value)}
                placeholder="예: 문 앞 보관, 부재 시 연락"
                className="w-full py-2.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none font-medium"
              />
            </div>
          </div>

          {/* Payment & Benefit Calculation Breakdown */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 border border-teal-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>상품 금액 ({quantity}개)</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
            {usePoints > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>포인트 할인</span>
                <span>-{usePoints.toLocaleString()}P</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>배송비</span>
              <span className="text-teal-700 font-bold">무료배송 (0원)</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-teal-200/80">
              <span className="text-sm font-black text-slate-900">최종 결제 금액</span>
              <span className="text-xl font-black text-teal-800">
                {finalPaidAmount.toLocaleString()}원
              </span>
            </div>

            {/* Extra reward note */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-emerald-800 font-bold bg-white/70 p-2 rounded-lg">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                리필팩 구매 시 추가 적립 예정 포인트:
              </span>
              <span>+{totalEarnedPoints.toLocaleString()}P</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="submit-refill-request-btn"
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 active:scale-99 text-white font-black text-base shadow-lg shadow-teal-700/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Truck className="w-5 h-5" />
            <span>리필팩 신청 완료 및 친환경 배송 요청하기</span>
          </button>

        </form>

      </div>
    </div>
  );
};
