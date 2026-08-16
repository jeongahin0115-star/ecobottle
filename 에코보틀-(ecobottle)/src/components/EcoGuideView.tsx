import React from 'react';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Droplet, TreePine, ShieldCheck, ArrowRight } from 'lucide-react';

interface EcoGuideViewProps {
  onStartSearch: () => void;
}

export const EcoGuideView: React.FC<EcoGuideViewProps> = ({ onStartSearch }) => {
  return (
    <div className="space-y-10 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>에코보틀 공식 가이드라인</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          화장품 공병 수거 & 포인트 환급 기준
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          재질과 용량에 따라 정직하게 책정된 에코 포인트를 확인하고, 올바른 공병 배출법을 알아보세요.
        </p>
      </div>

      {/* Point Rates Table by Material */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>소재별 공병 1개당 지급 포인트 기준표</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">단위: 1개당 P</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">유리 용기 (Glass)</span>
              <span className="text-base font-black text-blue-700">1,200 ~ 2,500P</span>
            </div>
            <p className="text-xs text-slate-600">
              세럼, 에센스, 크림 유리병. 100% 무한 재생 가능한 최고 가치 소재입니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">향수 & 럭셔리 보틀</span>
              <span className="text-base font-black text-purple-700">최대 3,000P</span>
            </div>
            <p className="text-xs text-slate-600">
              고밀도 크리스탈 유리 및 프리미엄 향수 공병 대상 특별 보너스 지급.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">투명 PET / PCR</span>
              <span className="text-base font-black text-emerald-700">800 ~ 1,600P</span>
            </div>
            <p className="text-xs text-slate-600">
              스킨, 토너, 클렌징 워터 투명 보틀. 이지필 라벨 적용 시 즉시 세척 수거.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">알루미늄 용기</span>
              <span className="text-base font-black text-amber-700">1,400P</span>
            </div>
            <p className="text-xs text-slate-600">
              록시땅 핸드크림, 바디 튜브 등 알루미늄 95% 이상 용기.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">단일 PP / PE 튜브</span>
              <span className="text-base font-black text-indigo-700">900 ~ 1,200P</span>
            </div>
            <p className="text-xs text-slate-600">
              수딩 크림 통, 폼클렌저 튜브 등 단일 플라스틱 제품.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-200 text-teal-900">기타 일반 공병</span>
              <span className="text-base font-black text-teal-700">500P / 개당</span>
            </div>
            <p className="text-xs text-slate-600">
              목록에 없는 모든 화장품 공병 묶음 수거 신청 시 보너스 포인트 지급.
            </p>
          </div>
        </div>
      </div>

      {/* 4-Step Bottle Preparation */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 text-center">
          간단한 4단계 공병 배출 가이드
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">내용물 비우기</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              화장품 내용물을 끝까지 사용하시고 미온수로 가볍게 1회 헹구어주세요.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">라벨 및 펌프 분리</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              스티커 라벨과 스프링 펌프를 분리해주세요. (메탈리스 펌프는 그대로 가능)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">문 앞 보관</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              종이 쇼핑백이나 상자에 담아 문 앞에 두시고 회수 신청서를 접수하세요.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-sm">포인트 자동 적립</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              기사님이 수거 후 검수 확인 즉시 계정으로 포인트가 입금됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onStartSearch}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/30 inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>지금 내 화장품 공병 검색하고 수거 신청하기</span>
        </button>
      </div>

    </div>
  );
};
