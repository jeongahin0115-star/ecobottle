import React, { useState } from 'react';
import { ShoppingBag, Coins, Sparkles, Star, Tag, Check, ArrowRight, ShieldCheck, Truck, X, Plus, Minus, Package, Droplets, Leaf, Filter } from 'lucide-react';
import { ShopProduct } from '../types';

interface ShopViewProps {
  products: ShopProduct[];
  userPoints: number;
  onBuyWithPoints: (product: ShopProduct, quantity: number, pointsUsed: number, paidCash: number) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  userPoints,
  onBuyWithPoints,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [selectedType, setSelectedType] = useState<'all' | 'full_product' | 'refill' | 'eco_tool'>('all');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '스킨/토너', '세럼/앰플', '크림/로션', '바디/헤어', '클렌징', '향수/미스트', '소품/용기'];

  const filteredProducts = products.filter((p) => {
    // Type filter
    if (selectedType === 'full_product' && !p.isFullProduct && p.productType !== 'full_product') return false;
    if (selectedType === 'refill' && !p.isRefill && p.productType !== 'refill') return false;
    if (selectedType === 'eco_tool' && p.category !== '소품/용기' && p.productType !== 'eco_tool') return false;

    // Category filter
    if (selectedCategory !== '전체' && p.category !== selectedCategory) return false;

    return true;
  });

  const handleOpenBuyModal = (product: ShopProduct) => {
    setSelectedProduct(product);
    setPurchaseQuantity(1);
    const initialPoints = Math.min(userPoints, product.memberPrice);
    setPointsToUse(initialPoints);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const calculateDiscountPercent = (original: number, member: number) => {
    return Math.round(((original - member) / original) * 100);
  };

  const fullProductsCount = products.filter(p => p.isFullProduct || p.productType === 'full_product').length;
  const refillProductsCount = products.filter(p => p.isRefill || p.productType === 'refill').length;
  const ecoToolsCount = products.filter(p => p.category === '소품/용기' || p.productType === 'eco_tool').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-emerald-700 to-teal-800 text-white p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-bold">
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>포인트 특가 에코 마켓</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            공병 포인트로 <span className="text-amber-300">정품 본품 화장품 & 리필팩</span>을 <br />
            초특가로 알뜰 구매하세요!
          </h2>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            인기 브랜드의 <strong>정품 본품 화장품</strong>부터 친환경 리필 파우치, 평생 재사용 앰버 글래스 용기까지! 
            공병 회수로 차곡차곡 모은 포인트를 100% 현금처럼 사용하여 가장 현명하게 쇼핑하세요.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-3 shadow-sm">
              <div className="flex flex-col">
                <span className="text-xs text-amber-200 font-semibold">내 보유 에코 포인트</span>
                <strong className="text-xl font-black text-amber-300">{userPoints.toLocaleString()} P</strong>
              </div>
              <span className="text-[11px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-md">
                1P = 1원 사용
              </span>
            </div>
          </div>
        </div>

        {/* Ambient shapes */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl" />
      </div>

      {/* Product Type Tabs (본품 화장품 / 리필팩 / 친환경 소품) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>상품 유형별 보기</span>
          </div>
          <span className="text-xs text-slate-500">총 {filteredProducts.length}개 상품</span>
        </div>

        {/* Main Type Segment Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            id="filter-type-all"
            onClick={() => setSelectedType('all')}
            className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedType === 'all'
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <span>전체 상품</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedType === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            id="filter-type-full"
            onClick={() => setSelectedType('full_product')}
            className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedType === 'full_product'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-700/25 border border-amber-500'
                : 'bg-white text-slate-700 hover:bg-amber-50/50 border border-slate-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${selectedType === 'full_product' ? 'text-amber-200' : 'text-amber-500'}`} />
            <span>✨ 본품 화장품 특가</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedType === 'full_product' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              {fullProductsCount}
            </span>
          </button>

          <button
            id="filter-type-refill"
            onClick={() => setSelectedType('refill')}
            className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedType === 'refill'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-lg shadow-teal-700/25 border border-teal-500'
                : 'bg-white text-slate-700 hover:bg-teal-50/50 border border-slate-200'
            }`}
          >
            <Droplets className={`w-3.5 h-3.5 ${selectedType === 'refill' ? 'text-teal-200' : 'text-teal-600'}`} />
            <span>🧴 친환경 리필팩</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedType === 'refill' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
            }`}>
              {refillProductsCount}
            </span>
          </button>

          <button
            id="filter-type-tool"
            onClick={() => setSelectedType('eco_tool')}
            className={`py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedType === 'eco_tool'
                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/25 border border-slate-700'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Leaf className={`w-3.5 h-3.5 ${selectedType === 'eco_tool' ? 'text-emerald-300' : 'text-emerald-600'}`} />
            <span>🌿 제로웨이스트 소품</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              selectedType === 'eco_tool' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {ecoToolsCount}
            </span>
          </button>
        </div>

        {/* Sub-category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold shrink-0 pr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>품목:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">해당 조건에 맞는 상품이 없습니다</h3>
          <p className="text-xs text-slate-500">다른 품목 또는 전체 상품 보기를 선택해 주세요.</p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedCategory('전체');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            전체 상품 보기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const discountRate = calculateDiscountPercent(product.originalPrice, product.memberPrice);
            const isFull = product.isFullProduct || product.productType === 'full_product';
            const isRef = product.isRefill || product.productType === 'refill';

            return (
              <div
                key={product.id}
                id={`shop-product-${product.id}`}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Top Image area */}
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Discount Tag */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="px-2.5 py-1 text-[11px] font-extrabold bg-amber-500 text-white rounded-lg shadow-sm">
                        {discountRate}% 특가
                      </span>
                    </div>

                    {/* Product Type Tag */}
                    <div className="absolute top-2.5 right-2.5">
                      {isFull ? (
                        <span className="px-2.5 py-1 text-[10px] font-black bg-amber-900/90 text-amber-200 rounded-lg backdrop-blur-xs border border-amber-400/40 shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>정품 본품</span>
                        </span>
                      ) : isRef ? (
                        <span className="px-2.5 py-1 text-[10px] font-black bg-teal-900/90 text-teal-200 rounded-lg backdrop-blur-xs border border-teal-400/40 shadow-xs flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-teal-300" />
                          <span>친환경 리필</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-black bg-slate-900/90 text-emerald-200 rounded-lg backdrop-blur-xs border border-emerald-400/40 shadow-xs flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-emerald-300" />
                          <span>에코 소품</span>
                        </span>
                      )}
                    </div>

                    {/* Eco Badge Bottom Overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-900/75 text-emerald-300 rounded-md backdrop-blur-xs truncate block">
                        🌱 {product.ecoBadge}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                          {product.brand}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price Display */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-400 line-through">
                          시중가 {product.originalPrice.toLocaleString()}원
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-amber-600">포인트 회원가</span>
                        <span className="text-lg font-black text-slate-900">
                          {product.memberPrice.toLocaleString()}
                          <span className="text-xs font-bold ml-0.5">원</span>
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center justify-between border border-emerald-100">
                        <span>포인트 최대 차감 결제</span>
                        <strong>-{product.maxPointDeduction.toLocaleString()}P</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="p-4 pt-0">
                  <button
                    id={`buy-btn-${product.id}`}
                    onClick={() => handleOpenBuyModal(product)}
                    className={`w-full py-2.5 px-4 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isFull
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/20'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/20'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isFull ? '본품 포인트로 구매하기' : '포인트로 구매하기'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Point Checkout Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>포인트 특가 주문/결제</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product summary */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-700">{selectedProduct.brand}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                    {selectedProduct.isFullProduct ? '본품' : selectedProduct.isRefill ? '리필' : '소품'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{selectedProduct.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  회원특가: <strong className="text-slate-800">{selectedProduct.memberPrice.toLocaleString()}원</strong> / 개당
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700">주문 수량</span>
              <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-xs">
                <button
                  onClick={() => {
                    const nextQ = Math.max(1, purchaseQuantity - 1);
                    setPurchaseQuantity(nextQ);
                    setPointsToUse(Math.min(pointsToUse, nextQ * selectedProduct.memberPrice));
                  }}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-slate-900 w-6 text-center">{purchaseQuantity}</span>
                <button
                  onClick={() => {
                    const nextQ = purchaseQuantity + 1;
                    setPurchaseQuantity(nextQ);
                  }}
                  className="p-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Points deduction form */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>보유 포인트 적용 (1P = 1원)</span>
                </span>
                <span className="text-slate-600">
                  보유: <strong className="text-amber-800">{userPoints.toLocaleString()}P</strong>
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max={Math.min(userPoints, purchaseQuantity * selectedProduct.memberPrice)}
                  value={pointsToUse || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    const maxP = Math.min(userPoints, purchaseQuantity * selectedProduct.memberPrice);
                    setPointsToUse(Math.min(val, maxP));
                  }}
                  className="flex-1 py-2 px-3 text-xs font-bold bg-white border border-amber-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="사용 포인트 입력"
                />
                <button
                  type="button"
                  onClick={() => {
                    const maxP = Math.min(userPoints, purchaseQuantity * selectedProduct.memberPrice);
                    setPointsToUse(maxP);
                  }}
                  className="px-3.5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  전액 사용
                </button>
              </div>
            </div>

            {/* Final calculation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>상품 합계</span>
                <span>{(purchaseQuantity * selectedProduct.memberPrice).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-amber-700 font-bold">
                <span>포인트 할인 적용</span>
                <span>-{pointsToUse.toLocaleString()}P</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>배송비</span>
                <span className="text-emerald-600 font-bold">무료 배송 (0원)</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-sm font-black">
                <span>최종 결제 금액</span>
                <span className="text-xl text-slate-900 font-black">
                  {Math.max(0, purchaseQuantity * selectedProduct.memberPrice - pointsToUse).toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={() => {
                const paidCash = Math.max(0, purchaseQuantity * selectedProduct.memberPrice - pointsToUse);
                onBuyWithPoints(selectedProduct, purchaseQuantity, pointsToUse, paidCash);
                handleCloseModal();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
            >
              주문 완료하기 ({pointsToUse > 0 ? `${pointsToUse.toLocaleString()}P 사용` : '0원 결제'})
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
