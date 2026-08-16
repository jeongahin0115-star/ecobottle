import React, { useState } from 'react';
import { X, Sparkles, PlusCircle, CheckCircle, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { CosmeticBottle, BottleMaterial } from '../types';

interface CustomBottleModalProps {
  onClose: () => void;
  onAddAndRequest: (bottle: CosmeticBottle) => void;
}

export const CustomBottleModal: React.FC<CustomBottleModalProps> = ({
  onClose,
  onAddAndRequest,
}) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CosmeticBottle['category']>('세럼/앰플');
  const [capacity, setCapacity] = useState('50ml');
  const [material, setMaterial] = useState<BottleMaterial>('Glass');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');

  const calculateCustomPoints = (mat: BottleMaterial): number => {
    switch (mat) {
      case 'Glass': return 1800;
      case 'PET': return 1000;
      case 'PP': return 1100;
      case 'Aluminum': return 1400;
      case 'PE Tube': return 900;
      default: return 800;
    }
  };

  const estimatedPoints = calculateCustomPoints(material);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !name.trim()) {
      alert('브랜드와 화장품명을 입력해주세요.');
      return;
    }

    const newBottle: CosmeticBottle = {
      id: `custom-${Date.now()}`,
      brand,
      name,
      category,
      capacity,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      material,
      materialKorean: material === 'Glass' ? '재활용 유리' : material === 'PET' ? '투명 PET' : `${material} 플라스틱`,
      pickupPoints: estimatedPoints,
      refillAvailable: true,
      refillName: `${name} 전용 에코 리필팩`,
      refillPoints: estimatedPoints + 500,
      refillPrice: 15000,
      originalPrice: 28000,
      recyclingDifficulty: '쉬움',
      ecoTip: '라벨을 떼어내고 물로 가볍게 헹구어 배출해주세요.',
      tags: [brand, '사용자등록', '신규공병'],
      description: `${brand}의 ${name} (${capacity}) 등록 공병입니다.`,
    };

    onAddAndRequest(newBottle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-fadeIn p-6 space-y-5">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-lg font-black text-slate-900">미등록 공병 직접 등록 & 회수</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">화장품 브랜드</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="예: 탬버린즈, 바이레도, 아이소이 등"
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">화장품 제품명</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 불가리안 로즈 블레미쉬 케어 세럼"
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CosmeticBottle['category'])}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="스킨/토너">스킨/토너</option>
                <option value="세럼/앰플">세럼/앰플</option>
                <option value="크림/로션">크림/로션</option>
                <option value="클렌징">클렌징</option>
                <option value="바디/헤어">바디/헤어</option>
                <option value="향수/미스트">향수/미스트</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">용기 용량</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="예: 50ml, 150ml"
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">용기 재질 (소재)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Glass', 'PET', 'PP', 'Aluminum', 'PE Tube', 'Complex / Other'] as BottleMaterial[]).map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setMaterial(mat)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    material === mat
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mat === 'Glass' ? '유리 (1,800P)' : mat === 'PET' ? '투명 PET (1,000P)' : mat === 'PP' ? 'PP 플라스틱 (1,100P)' : mat === 'Aluminum' ? '알루미늄 (1,400P)' : mat === 'PE Tube' ? '튜브 (900P)' : '기타 (800P)'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <span className="font-bold text-slate-800">예상 공병 수거 포인트:</span>
            <span className="text-lg font-black text-emerald-700">+{estimatedPoints.toLocaleString()}P</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
          >
            공병 등록하고 회수 신청하기
          </button>
        </form>

      </div>
    </div>
  );
};
