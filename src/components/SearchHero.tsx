import React, { useMemo } from 'react';
import { Search, Sparkles, Filter, X, ArrowRight, Check } from 'lucide-react';
import { CosmeticBottle } from '../types';

interface SearchHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedMaterial: string;
  setSelectedMaterial: (mat: string) => void;
  onOpenCustomBottle: () => void;
  totalResultsCount: number;
  availableBottles: CosmeticBottle[];
}

const CATEGORIES = [
  '전체',
  '스킨/토너',
  '세럼/앰플',
  '크림/로션',
  '클렌징',
  '바디/헤어',
  '향수/미스트',
];

const MATERIALS: { label: string; value: string }[] = [
  { label: 'ALL MATERIALS', value: 'all' },
  { label: '💎 GLASS (유리)', value: 'Glass' },
  { label: '🧴 PET (투명)', value: 'PET' },
  { label: '🥫 PP (플라스틱)', value: 'PP' },
  { label: '🧪 PE TUBE (튜브)', value: 'PE Tube' },
  { label: '🔩 ALUMINUM (알루미늄)', value: 'Aluminum' },
];

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedMaterial,
  setSelectedMaterial,
  onOpenCustomBottle,
  totalResultsCount,
  availableBottles,
}) => {
  const verifiedPopularKeywords = useMemo(() => {
    const candidates = [
      { keyword: '독도 토너', tag: '토너' },
      { keyword: '그린티', tag: '세럼' },
      { keyword: '윤조에센스', tag: '유리' },
      { keyword: '수딩크림', tag: '크림' },
      { keyword: '다이브인', tag: '세럼' },
      { keyword: '로즈마리 샴푸', tag: '대용량' },
      { keyword: '갈색병', tag: '안티에이징' },
      { keyword: '클렌징 오일', tag: '클렌징' },
      { keyword: '칼렌듈라', tag: '토너' },
      { keyword: '록시땅', tag: '알루미늄' },
      { keyword: '달바', tag: '미스트' },
      { keyword: '시카페어', tag: '튜브' },
      { keyword: '딥티크', tag: '향수' },
    ];

    return candidates.filter((item) => {
      const kw = item.keyword.toLowerCase();
      return availableBottles.some(
        (b) =>
          b.name.toLowerCase().includes(kw) ||
          b.brand.toLowerCase().includes(kw) ||
          b.category.toLowerCase().includes(kw) ||
          b.tags.some((t) => t.toLowerCase().includes(kw))
      );
    });
  }, [availableBottles]);

  return (
    <section className="relative overflow-hidden bg-[#121214] text-[#F8F8F6] pt-12 pb-14 px-6 sm:px-10 rounded-3xl border border-black/10 shadow-2xl mb-8">
      {/* Background Decorative ambient orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#EAF854]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-7">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-[#EAF854] font-mono-code font-bold uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REAL-TIME RECYCLE DIRECTORY</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white leading-tight font-display">
          다 쓴 화장품 공병, <br className="hidden sm:inline" />
          <span className="text-[#EAF854]">
            검색하고 비대면 무료 회수
          </span>
          하세요.
        </h1>

        <p className="text-[#A0A0A5] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          공병을 검색하면 100% 현금 가치 포인트와 30% 할인가 리필 완충 혜택을 즉시 확인하실 수 있습니다.
        </p>

        {/* Search Bar with Input */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl focus-within:ring-2 focus-within:ring-[#EAF854] transition-all duration-300">
            <div className="pl-4 pr-2 text-[#121214]">
              <Search className="w-5 h-5" />
            </div>
            
            <input
              id="cosmetic-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="수거할 화장품 공병을 검색하세요 (예: 독도 토너, 그린티, 윤조에센스...)"
              className="w-full py-3 px-2 text-[#121214] placeholder-[#737378] text-sm sm:text-base font-medium outline-none bg-transparent"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 text-[#737378] hover:text-[#121214] rounded-full hover:bg-[#F7F7F4] transition-colors mr-1 cursor-pointer"
                title="검색어 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="search-action-btn"
              className="bg-[#121214] hover:bg-[#2A2A2E] text-white font-mono-code font-bold px-6 py-3 rounded-full flex items-center gap-1.5 text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>SEARCH</span>
            </button>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-mono-code">
            <span className="text-[#A0A0A5] font-bold">
              SUGGESTIONS:
            </span>
            {verifiedPopularKeywords.map((item) => {
              const isSelected = searchQuery.toLowerCase() === item.keyword.toLowerCase();
              return (
                <button
                  key={item.keyword}
                  onClick={() => setSearchQuery(item.keyword)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#EAF854] text-[#121214] border-[#EAF854] shadow-xs'
                      : 'bg-white/5 hover:bg-white/15 text-[#E5E5E0] border-white/10'
                  }`}
                  title={`${item.keyword} 공병 검색하기`}
                >
                  <span>{item.keyword}</span>
                  <span className="text-[10px] opacity-70">({item.tag})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls: Category & Material */}
        <div className="pt-2 max-w-3xl mx-auto space-y-3.5 font-mono-code">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#EAF854] text-[#121214] border-[#EAF854] shadow-xs'
                    : 'bg-white/5 text-[#A0A0A5] hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Material Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center text-xs">
            <span className="text-[#A0A0A5] font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#EAF854]" /> MATERIAL:
            </span>
            {MATERIALS.map((mat) => (
              <button
                key={mat.value}
                onClick={() => setSelectedMaterial(mat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedMaterial === mat.value
                    ? 'bg-white text-[#121214] border-white shadow-xs'
                    : 'bg-black/40 border-white/10 text-[#A0A0A5] hover:text-white'
                }`}
              >
                {mat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Search Results Summary & Missing Bottle CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-[#A0A0A5] font-mono-code">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#EAF854]" />
            <span>
              TOTAL <strong className="text-white font-extrabold text-sm">{totalResultsCount}</strong> REGISTERED MODELS
            </span>
          </div>

          <button
            id="search-custom-bottle-link"
            onClick={onOpenCustomBottle}
            className="text-[#EAF854] hover:underline font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>[+ REGISTER UNLISTED BOTTLE]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
