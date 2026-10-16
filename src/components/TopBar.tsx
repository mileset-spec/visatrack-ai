import React from 'react';
import { ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenHelp?: () => void;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenHelp,
  subtitle,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#F8FAF8]/90 backdrop-blur-md px-4 py-3 border-b border-[#126B68]/10 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#172B3A] hover:bg-[#DFF4ED]/60 active:scale-95 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-[#126B68] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
            VT
          </div>
        )}

        <div className="min-w-0">
          <h1 className="text-base font-bold text-[#172B3A] truncate tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-[#697A86] truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center gap-1 text-[11px] font-medium text-[#126B68] bg-[#DFF4ED] px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Secure</span>
        </div>

        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#697A86] hover:text-[#172B3A] hover:bg-black/5 transition-colors"
            title="Visa guidelines & help"
            aria-label="Visa guidelines and help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
