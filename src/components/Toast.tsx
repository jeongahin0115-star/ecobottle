import React from 'react';
import { CheckCircle2, Sparkles, X, Coins } from 'lucide-react';

interface ToastProps {
  message: string;
  points?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, points, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-500/40">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
          <Sparkles className="w-5 h-5 animate-spin" />
        </div>

        <div>
          <div className="text-xs font-bold text-slate-200">{message}</div>
          {points !== undefined && (
            <div className="text-sm font-extrabold text-amber-400 flex items-center gap-1 mt-0.5">
              <Coins className="w-4 h-4 text-amber-300" />
              <span>+{points.toLocaleString()}P 적립 완료!</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="ml-2 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
