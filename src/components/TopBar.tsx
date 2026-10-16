import React from 'react';
import { ArrowLeft, ShieldCheck, HelpCircle, LogOut, User } from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenHelp?: () => void;
  subtitle?: string;
  activeUser?: UserProfile;
  onSignOut?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenHelp,
  subtitle,
  activeUser,
  onSignOut,
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
          {subtitle ? (
            <p className="text-[11px] text-[#697A86] truncate">
              {subtitle}
            </p>
          ) : activeUser ? (
            <p className="text-[10px] text-[#697A86] truncate flex items-center gap-1">
              <span>Traveler: <strong className="text-[#172B3A]">{activeUser.fullName.split(' ')[0]}</strong></span>
              {activeUser.intendedTravelDates?.destination && (
                <span>· {activeUser.intendedTravelDates.destination}</span>
              )}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {activeUser && onSignOut && !showBack && (
          <button
            onClick={onSignOut}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#697A86] hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sign Out / Switch Traveler"
            aria-label="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}

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
