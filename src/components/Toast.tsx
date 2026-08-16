import React from 'react';
import { Sparkles, X, Coins } from 'lucide-react';

interface ToastProps {
  message: string;
  points?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, points, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 bg-[#121214] text-white px-5 py-4 rounded-2xl shadow-2xl border border-white/10 font-mono-code">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#EAF854]">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
        </div>

        <div>
          <div className="text-xs font-bold text-white font-sans">{message}</div>
          {points !== undefined && (
            <div className="text-xs font-extrabold text-[#EAF854] flex items-center gap-1 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-[#EAF854]" />
              <span>+{(points ?? 0).toLocaleString()} P CREDITED</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="ml-2 p-1 text-[#A0A0A5] hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
