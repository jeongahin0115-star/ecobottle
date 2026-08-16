import React, { useMemo } from 'react';
import { Search, Sparkles, Filter, RefreshCw, X, ArrowRight, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
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
  { label: '전체 소재', value: 'all' },
  { label: '💎 유리 (최고 포인트)', value: 'Glass' },
  { label: '🧴 투명 PET', value: 'PET' },
  { label: '🥫 단일 PP 플라스틱', value: 'PP' },
  { label: '🧪 튜브 (PE)', value: 'PE Tube' },
  { label: '🔩 알루미늄', value: 'Aluminum' },
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
  // STRICT FILTER: Only recommend keywords that exist in the actual collectable bottles catalogue!
  const verifiedPopularKeywords = useMemo(() => {
    // Curated high-demand candidate keywords to check against real available bottles
    const candidates = [
      { keyword: '독도 토너', tag: '스킨/토너' },
      { keyword: '그린티', tag: '세럼' },
      { keyword: '윤조에센스', tag: '유리공병' },
      { keyword: '수딩크림', tag: '크림' },
      { keyword: '다이브인', tag: '세럼' },
      { keyword: '로즈마리 샴푸', tag: '대용량' },
      { keyword: '갈색병', tag: '안티에이징' },
      { keyword: '클렌징 오일', tag: '클렌징' },
      { keyword: '칼렌듈라', tag: '토너' },
      { keyword: '록시땅', tag: '알루미늄' },
      { keyword: '달바', tag: '미스트' },
      { keyword: '시카페어', tag: '튜브' },
      { keyword: '딥티크', tag: '향수(3000P)' },
    ];

    // Filter to ONLY those keywords where at least one bottle in availableBottles matches
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#062c1e] via-[#0b3d2b] to-[#041d13] text-white pt-11 pb-13 px-5 sm:px-8 lg:px-10 rounded-3xl shadow-[0_12px_40px_-15px_rgba(6,78,59,0.3)] mb-10 border border-emerald-700/30">
      {/* Background Decorative ambient orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-7">
        
        {/* Badge & Slogan */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
          <span>실제 회수 가능한 공병 검색 • 공병당 최대 3,000P 즉시 적립</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          다 쓴 화장품 공병, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
            검색하고 문 앞에서 간편하게 회수
          </span>
          하세요!
        </h1>

        <p className="text-slate-200/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          공병을 검색하면 회수 포인트와 맞춤 리필팩을 바로 확인하실 수 있습니다. <br className="hidden sm:inline" />
          수거 완료 즉시 포인트가 지급되며, 에코 마켓에서 초특가 쇼핑을 즐기실 수 있습니다.
        </p>

        {/* Search Bar with Large Input */}
        <div className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl shadow-black/20 focus-within:ring-4 focus-within:ring-emerald-400/40 transition-all duration-300">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search className="w-6 h-6 text-emerald-600" />
            </div>
            
            <input
              id="cosmetic-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="수거하고 싶은 화장품 공병을 검색해보세요 (예: 독도 토너, 그린티, 윤조에센스...)"
              className="w-full py-2.5 px-2 text-slate-900 placeholder-slate-400 text-sm sm:text-base font-semibold outline-none bg-transparent"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
                title="검색어 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              id="search-action-btn"
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.98] text-white font-extrabold px-5 sm:px-7 py-3 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm shadow-md shadow-emerald-700/30 transition-all shrink-0 cursor-pointer"
            >
              <span>조회하기</span>
            </button>
          </div>

          {/* Verified Collectable Search Keywords Only */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-300">
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> 회수 가능 추천 공병:
            </span>
            {verifiedPopularKeywords.map((item) => {
              const isSelected = searchQuery.toLowerCase() === item.keyword.toLowerCase();
              return (
                <button
                  key={item.keyword}
                  onClick={() => setSearchQuery(item.keyword)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 font-black shadow-sm scale-105'
                      : 'bg-white/10 hover:bg-emerald-500/25 text-slate-200 hover:text-white border border-white/15'
                  }`}
                  title={`${item.keyword} 공병 검색하기`}
                >
                  <span>{item.keyword}</span>
                  <span className="text-[10px] opacity-75 font-normal">({item.tag})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls: Category & Material */}
        <div className="pt-2 max-w-3xl mx-auto space-y-3.5">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black shadow-lg shadow-emerald-500/25 scale-105'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Material Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center text-xs">
            <span className="text-emerald-300/80 font-bold shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" /> 소재별:
            </span>
            {MATERIALS.map((mat) => (
              <button
                key={mat.value}
                onClick={() => setSelectedMaterial(mat.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedMaterial === mat.value
                    ? 'bg-teal-500/30 border-teal-300 text-teal-200 font-bold shadow-xs'
                    : 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {mat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Search Results Summary & Missing Bottle CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              현재 총 <strong className="text-white font-extrabold text-sm">{totalResultsCount}개</strong>의 공병 회수 모델이 등록되어 있습니다.
            </span>
          </div>

          <button
            id="search-custom-bottle-link"
            onClick={onOpenCustomBottle}
            className="text-emerald-300 hover:text-emerald-200 font-bold underline underline-offset-4 flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
          >
            <span>찾는 공병이 없나요? 직접 공병 등록 신청</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

