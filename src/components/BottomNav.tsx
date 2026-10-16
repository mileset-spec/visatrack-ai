import React from 'react';
import { Home, Layers, FileCheck, MessageSquare, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  applicationsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  applicationsCount = 1,
}) => {
  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'applications' as ActiveTab, label: 'My Applications', icon: Layers, badge: applicationsCount },
    { id: 'documents' as ActiveTab, label: 'Documents', icon: FileCheck },
    { id: 'assistant' as ActiveTab, label: 'AI Assistant', icon: MessageSquare },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-[#126B68]/10 shadow-[0_-4px_20px_rgba(23,43,58,0.04)]"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center relative rounded-xl transition-all duration-200 active:scale-95 ${
                isActive ? 'text-[#126B68]' : 'text-[#697A86] hover:text-[#172B3A]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors duration-200 ${
                  isActive ? 'bg-[#DFF4ED]' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap select-none ${
                  isActive ? 'font-bold text-[#126B68]' : 'font-medium text-[#697A86]'
                }`}
              >
                {item.label}
              </span>

              {item.badge && item.badge > 0 && item.id === 'applications' && (
                <span className="absolute top-1 right-2.5 w-4 h-4 bg-[#126B68] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
