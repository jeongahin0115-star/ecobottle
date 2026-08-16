import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
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
  const [imageUrl] = useState('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E5E5E0] overflow-hidden animate-fadeIn p-6 sm:p-7 space-y-5">
        
        <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4">
          <div className="flex items-center gap-2 text-[#121214]">
            <PlusCircle className="w-5 h-5" />
            <h3 className="text-lg font-extrabold text-[#121214] font-display">미등록 공병 직접 등록 & 회수</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#737378] hover:text-[#121214] rounded-full hover:bg-[#F7F7F4] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-code">
          <div>
            <label className="font-bold text-[#121214] block mb-1 uppercase tracking-wider">BRAND NAME</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="예: 탬버린즈, 바이레도, 아이소이 등"
              className="w-full py-2.5 px-3 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-sans"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#121214] block mb-1 uppercase tracking-wider">PRODUCT NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 불가리안 로즈 블레미쉬 케어 세럼"
              className="w-full py-2.5 px-3 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] focus:bg-white outline-none font-sans"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#121214] block mb-1 uppercase tracking-wider">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CosmeticBottle['category'])}
                className="w-full py-2.5 px-3 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] outline-none font-sans"
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
              <label className="font-bold text-[#121214] block mb-1 uppercase tracking-wider">CAPACITY</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="예: 50ml, 150ml"
                className="w-full py-2.5 px-3 bg-[#FBFBF9] border border-[#E5E5E0] rounded-xl focus:ring-1 focus:ring-[#121214] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#121214] block mb-1 uppercase tracking-wider">BOTTLE MATERIAL</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Glass', 'PET', 'PP', 'Aluminum', 'PE Tube', 'Complex / Other'] as BottleMaterial[]).map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setMaterial(mat)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    material === mat
                      ? 'bg-[#121214] text-[#EAF854] border-black shadow-2xs'
                      : 'bg-[#F7F7F4] text-[#737378] border-[#E5E5E0] hover:bg-[#EBEBE8]'
                  }`}
                >
                  {mat === 'Glass' ? '유리 (1,800P)' : mat === 'PET' ? 'PET (1,000P)' : mat === 'PP' ? 'PP (1,100P)' : mat === 'Aluminum' ? '알루미늄 (1,400P)' : mat === 'PE Tube' ? '튜브 (900P)' : '기타 (800P)'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F7F4] border border-[#E5E5E0] flex items-center justify-between">
            <span className="font-bold text-[#737378]">ESTIMATED REWARD:</span>
            <span className="text-lg font-extrabold text-[#121214]">+{estimatedPoints.toLocaleString()} P</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#121214] hover:bg-[#2A2A2E] text-white font-bold text-xs rounded-full shadow-2xs transition-all cursor-pointer"
          >
            REGISTER & PROCEED TO RECYCLE
          </button>
        </form>

      </div>
    </div>
  );
};
