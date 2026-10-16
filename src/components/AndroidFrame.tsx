import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  viewMode: 'mobile_frame' | 'responsive';
  onToggleViewMode: (mode: 'mobile_frame' | 'responsive') => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  viewMode,
  onToggleViewMode,
}) => {
  const [currentTime, setCurrentTime] = React.useState('9:41');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#EBF1ED] flex flex-col items-center justify-start text-[#172B3A] selection:bg-[#DFF4ED]">
      {/* Top utility bar to switch device preview mode */}
      <header className="w-full bg-[#126B68] text-white px-4 py-2 flex items-center justify-between text-xs shadow-sm z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#DFF4ED] animate-pulse"></span>
            VisaTrack AI
          </span>
          <span className="text-white/70 hidden sm:inline">| Native Android UI Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
          <button
            onClick={() => onToggleViewMode('mobile_frame')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'mobile_frame'
                ? 'bg-white text-[#126B68] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
            title="Switch to Android Device Frame"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pixel 9 Frame</span>
          </button>
          <button
            onClick={() => onToggleViewMode('responsive')}
            className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 transition-all ${
              viewMode === 'responsive'
                ? 'bg-white text-[#126B68] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
            title="Switch to Full Viewport"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expanded</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex justify-center py-0 sm:py-6 sm:px-4">
        {viewMode === 'mobile_frame' ? (
          <div className="relative w-full max-w-[420px] bg-black rounded-none sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(18,107,104,0.3)] p-0 sm:p-[10px] border-0 sm:border-[4px] border-[#2A3F3E] transition-all flex flex-col h-[100dvh] sm:h-[870px] overflow-hidden">
            {/* Screen Inner Glass */}
            <div className="w-full h-full bg-[#F8FAF8] rounded-none sm:rounded-[36px] flex flex-col overflow-hidden relative">
              {/* Android Status Bar */}
              <div className="w-full h-8 bg-[#F8FAF8] text-[#172B3A] px-5 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-40 border-b border-[#126B68]/5">
                <span>{currentTime}</span>
                {/* Camera punch-hole */}
                <div className="w-4 h-4 rounded-full bg-black mx-auto"></div>
                <div className="flex items-center gap-1.5 text-[#172B3A]/80">
                  <Signal className="w-3 h-3 stroke-[2.5]" />
                  <Wifi className="w-3 h-3 stroke-[2.5]" />
                  <Battery className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              {/* Scrollable Viewport Content */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-[#F8FAF8]">
                {children}
              </div>

              {/* Android Gesture Bar */}
              <div className="w-full h-4 bg-white/95 flex items-center justify-center shrink-0 border-t border-[#126B68]/5 z-30 pb-1">
                <div className="w-32 h-1 bg-[#172B3A]/30 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Responsive Layout */
          <div className="w-full max-w-2xl bg-[#F8FAF8] sm:rounded-2xl shadow-sm border-0 sm:border border-[#126B68]/10 flex flex-col min-h-[100dvh] sm:min-h-[850px] overflow-hidden relative">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
