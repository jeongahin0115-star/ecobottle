import React, { useState } from 'react';
import { X, RefreshCw, Droplet, Coins, Package, CheckCircle2, Clock, MapPin, Truck, Sparkles, ArrowRight, ShieldCheck, TreePine, AlertCircle, Award, ChevronRight } from 'lucide-react';
import { PickupRequest, RefillOrder, PointHistoryItem, UserEcoStats } from '../types';
import { getUserTierDetails } from '../data/ecoTiers';

interface MyActivityModalProps {
  initialTab?: 'pickups' | 'refills' | 'points';
  onClose: () => void;
  pickups: PickupRequest[];
  refills: RefillOrder[];
  pointHistory: PointHistoryItem[];
  userStats: UserEcoStats;
  onConfirmPickupAndCreditPoints: (pickupId: string) => void;
  onAdvancePickupStep: (pickupId: string) => void;
  onOpenTierModal?: () => void;
}

export const MyActivityModal: React.FC<MyActivityModalProps> = ({
  initialTab = 'pickups',
  onClose,
  pickups,
  refills,
  pointHistory,
  userStats,
  onConfirmPickupAndCreditPoints,
  onAdvancePickupStep,
  onOpenTierModal,
}) => {
  const [activeTab, setActiveTab] = useState<'pickups' | 'refills' | 'points'>(initialTab);
  const tierDetails = getUserTierDetails(userStats.totalBottlesRecycled);
  const { currentTier, nextTier, bottlesToNext } = tierDetails;

  const getStatusBadge = (status: PickupRequest['status']) => {
    switch (status) {
      case '수거완료 (포인트지급)':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case '검수중':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case '수거진행':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case '기사배정':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getStepProgress = (status: PickupRequest['status']) => {
    switch (status) {
      case '신청완료': return 1;
      case '기사배정': return 2;
      case '수거진행': return 3;
      case '검수중': return 4;
      case '수거완료 (포인트지급)': return 5;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div 
        id="activity-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn flex flex-col max-h-[85vh]"
      >
        
        {/* Header & Eco Impact Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">
                    내 에코 활동 & 신청 현황
                  </h2>
                  <button
                    onClick={onOpenTierModal}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 font-extrabold flex items-center gap-1 hover:bg-emerald-400/30 transition-colors cursor-pointer"
                    title="에코 등급 혜택 자세히 보기"
                  >
                    <span>{currentTier.icon}</span>
                    <span>Lv.{currentTier.level} {currentTier.name}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  실시간 공병 회수 진행 상태 확인 및 리필팩 배송 조회
                </p>
              </div>
            </div>

            <button
              id="close-activity-modal-btn"
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Eco Stats Summary in Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
            <div className="text-center p-1.5">
              <div className="text-slate-300 text-[11px]">보유 포인트</div>
              <div className="text-base font-extrabold text-amber-400 mt-0.5">
                {userStats.points.toLocaleString()} <span className="text-xs">P</span>
              </div>
            </div>
            <div className="text-center p-1.5 border-l border-white/10">
              <div className="text-slate-300 text-[11px]">재활용 공병</div>
              <div className="text-base font-extrabold text-emerald-400 mt-0.5">
                {userStats.totalBottlesRecycled}개
              </div>
            </div>
            <div className="text-center p-1.5 border-l border-white/10">
              <div className="text-slate-300 text-[11px]">탄소(CO2) 절감</div>
              <div className="text-base font-extrabold text-teal-300 mt-0.5">
                {userStats.co2SavedKg.toFixed(1)}kg
              </div>
            </div>
            <div className="text-center p-1.5 border-l border-white/10">
              <div className="text-slate-300 text-[11px]">살린 나무</div>
              <div className="text-base font-extrabold text-emerald-300 mt-0.5 flex items-center justify-center gap-1">
                <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                <span>{userStats.treesSaved.toFixed(1)}그루</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            id="activity-tab-pickups"
            onClick={() => setActiveTab('pickups')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'pickups'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>공병 회수 내역</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {pickups.length}
            </span>
          </button>

          <button
            id="activity-tab-refills"
            onClick={() => setActiveTab('refills')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'refills'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>리필팩 배송 내역</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
              {refills.length}
            </span>
          </button>

          <button
            id="activity-tab-points"
            onClick={() => setActiveTab('points')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'points'
                ? 'border-amber-500 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>포인트 적립/사용 장부</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
              {pointHistory.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PICKUPS */}
          {activeTab === 'pickups' && (
            <div className="space-y-5">
              {pickups.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <RefreshCw className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">신청된 공병 회수 내역이 없습니다.</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    메인 화면에서 다 쓴 화장품 공병을 검색하고 문 앞 무료 회수를 신청해보세요!
                  </p>
                </div>
              ) : (
                pickups.map((req) => {
                  const currentStep = getStepProgress(req.status);
                  const isCompleted = req.pointsCredited;

                  return (
                    <div
                      key={req.id}
                      id={`pickup-item-${req.id}`}
                      className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-emerald-300 transition-all space-y-4"
                    >
                      {/* Top Row: Product Info & Status */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.bottle.imageUrl}
                            alt={req.bottle.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">{req.bottle.brand}</span>
                              <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {req.bottle.materialKorean}
                              </span>
                              {req.benefitType === 'free_refill' ? (
                                <span className="text-[11px] px-2 py-0.5 bg-teal-100 text-teal-800 font-bold rounded-full border border-teal-200">
                                  🧴 30% 할인 리필 (+10%P)
                                </span>
                              ) : (
                                <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full border border-emerald-200">
                                  💰 100% 전액 포인트 적립
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mt-0.5">{req.bottle.name}</h4>
                            <div className="text-xs text-slate-500 mt-0.5">
                              신청수량: <strong className="text-slate-800">{req.quantity}개</strong>
                              {req.extraBottlesCount ? ` + 기타공병 ${req.extraBottlesCount}개` : ''} 
                              {' • '} 신청일: {req.createdAt}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge & Tracking */}
                        <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                          <span className={`px-3 py-1 text-xs font-extrabold rounded-full border ${getStatusBadge(req.status)}`}>
                            {req.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono mt-1">
                            송장: {req.trackingNumber}
                          </span>
                        </div>
                      </div>

                      {/* 5-Step Visual Progress Bar */}
                      <div className="py-2">
                        <div className="relative flex items-center justify-between text-xs">
                          {/* Progress Line */}
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                            />
                          </div>

                          {[
                            { label: '신청완료', step: 1 },
                            { label: '기사배정', step: 2 },
                            { label: '수거진행', step: 3 },
                            { label: req.benefitType === 'free_refill' ? '세척/충전' : '검수중', step: 4 },
                            { label: req.benefitType === 'free_refill' ? '리필완료' : '포인트지급', step: 5 },
                          ].map((s) => (
                            <div key={s.step} className="relative z-10 flex flex-col items-center gap-1">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  currentStep >= s.step
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-white border-2 border-slate-200 text-slate-400'
                                }`}
                              >
                                {currentStep > s.step ? '✓' : s.step}
                              </div>
                              <span
                                className={`text-[11px] font-medium hidden sm:block ${
                                  currentStep >= s.step ? 'text-emerald-800 font-bold' : 'text-slate-400'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Box: Address & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl text-slate-600">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">수거 장소: </span>
                            {req.pickupAddress.roadAddress} {req.pickupAddress.detailAddress}
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">희망 일시: </span>
                            {req.pickupDate} ({req.pickupTimeSlot})
                          </div>
                        </div>
                      </div>

                      {/* Action Area: Points Claim / Simulation */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {req.benefitType === 'free_refill' ? (
                            <>
                              <Droplet className="w-4 h-4 text-teal-600 fill-current" />
                              <span className="text-xs text-slate-600">혜택:</span>
                              <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                                30% 할인가 리필 ({Math.round(req.bottle.originalPrice * 0.70).toLocaleString()}원) + 10% 적립 (+{req.totalPoints.toLocaleString()}P)
                              </span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span className="text-xs text-slate-600">
                                {isCompleted ? '지급 완료된 포인트(100%): ' : '수거 완료 시 적립 포인트(100%): '}
                              </span>
                              <span className="text-base font-black text-emerald-700">
                                +{req.totalPoints.toLocaleString()}P
                              </span>
                            </>
                          )}
                        </div>

                        {/* Interactive Verification Button */}
                        {!isCompleted ? (
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              id={`advance-step-btn-${req.id}`}
                              onClick={() => onAdvancePickupStep(req.id)}
                              className="flex-1 sm:flex-initial px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                              title="수거 단계 1단계 진행"
                            >
                              단계 진행 ➔
                            </button>

                            <button
                              id={`confirm-pickup-btn-${req.id}`}
                              onClick={() => onConfirmPickupAndCreditPoints(req.id)}
                              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>
                                {req.benefitType === 'free_refill' 
                                  ? `수거/30%할인 리필 완료 (+${req.totalPoints.toLocaleString()}P 받기)` 
                                  : `수거/검수 확인 및 +${req.totalPoints.toLocaleString()}P 받기`}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>
                              {req.benefitType === 'free_refill'
                                ? '공병 세척 및 정품 원액 30% 할인가 충전 배송과 10% 포인트 지급이 완료되었습니다'
                                : '공병 100% 맞춤 포인트가 사용자 계정에 정상 적립되었습니다'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: REFILL ORDERS */}
          {activeTab === 'refills' && (
            <div className="space-y-4">
              {refills.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">신청된 리필팩 주문 내역이 없습니다.</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    공병 검색에서 원하는 화장품의 리필팩을 신청하고 친환경 무료 배송을 받아보세요!
                  </p>
                </div>
              ) : (
                refills.map((order) => (
                  <div
                    key={order.id}
                    id={`refill-item-${order.id}`}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.bottle.imageUrl}
                          alt={order.bottle.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-bold text-teal-700">{order.bottle.brand} 리필팩</span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {order.bottle.refillName || `${order.bottle.name} 리필 팩`}
                          </h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            수량: {order.quantity}개 • 결제액: {order.finalPaidAmount.toLocaleString()}원 
                            {order.pointsUsed > 0 && ` (포인트 ${order.pointsUsed.toLocaleString()}P 사용)`}
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                          {order.status}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono mt-1">
                          택배 송장: {order.trackingNumber}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-teal-50/50 p-3 rounded-xl text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">배송 주소: </span>
                          {order.deliveryAddress.roadAddress} {order.deliveryAddress.detailAddress}
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">희망 배송일: </span>
                          {order.preferredDate} ({order.deliveryMemo})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        리필팩 구매 보너스: +{order.earnedPoints.toLocaleString()}P 적립 완료
                      </span>
                      <span className="text-slate-400 text-[11px]">{order.createdAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: POINTS HISTORY */}
          {activeTab === 'points' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-900 font-bold">현재 사용 가능한 총 포인트</div>
                  <div className="text-2xl font-black text-amber-700 mt-0.5">
                    {userStats.points.toLocaleString()} <span className="text-sm font-bold">P</span>
                  </div>
                </div>
                <div className="text-xs text-amber-800 text-right">
                  1P = 1원 현금 가치 <br />
                  포인트 마켓 및 리필팩 구매 시 전액 사용 가능
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden">
                {pointHistory.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.detail} • {item.date}</div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-black ${item.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.type === 'earn' ? `+${item.amount.toLocaleString()}P` : `-${item.amount.toLocaleString()}P`}
                      </div>
                      <div className="text-[10px] text-slate-400">잔액 {item.balanceAfter.toLocaleString()}P</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
