import React from 'react';
import {
  PlusCircle,
  ScanLine,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileText
} from 'lucide-react';
import { VisaApplication, UserProfile, ActiveTab } from '../../types';

interface HomeScreenProps {
  userProfile: UserProfile;
  applications: VisaApplication[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenApplication: (appId: string) => void;
  onStartNewApplication: () => void;
  onStartPassportScan: () => void;
  onLoadSampleApplication: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  applications,
  onNavigateTab,
  onOpenApplication,
  onStartNewApplication,
  onStartPassportScan,
  onLoadSampleApplication,
}) => {
  const activeApp = applications[0];

  // Calculate checklist progress
  const completedDocsCount = activeApp
    ? activeApp.checklist.filter((item) => item.isCompleted).length
    : 0;
  const totalDocsCount = activeApp ? activeApp.checklist.length : 0;
  const progressPercent = totalDocsCount > 0 ? Math.round((completedDocsCount / totalDocsCount) * 100) : 0;

  // Next incomplete item
  const nextIncompleteItem = activeApp?.checklist.find((item) => !item.isCompleted);

  return (
    <div className="flex-1 p-4 pb-20 space-y-5 animate-fade-in">
      {/* Top Welcome Card */}
      <section className="bg-gradient-to-br from-[#126B68] to-[#0D4E4C] rounded-3xl p-5 text-white shadow-[0_10px_25px_-5px_rgba(18,107,104,0.3)] relative overflow-hidden">
        {/* Subtle decorative travel vectors in background */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl"></div>
        <div className="absolute right-3 top-3 opacity-15 pointer-events-none">
          <Compass className="w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#DFF4ED] bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
              🇳🇬 Nigerian Traveler Portal
            </span>
            <span className="text-[11px] text-white/80 font-mono">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Good day, {userProfile.fullName.split(' ')[0]}
            </h2>
            <p className="text-xs text-[#DFF4ED]/90 mt-1 leading-relaxed max-w-xs">
              Prepare flawless visa dossiers for the UK, Canada, and Schengen with AI checklist intelligence.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onStartNewApplication}
              className="w-full h-12 bg-white text-[#126B68] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#DFF4ED] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.2]" />
              <span>Start a Visa Application</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section aria-label="Quick Actions">
        <h3 className="text-xs font-bold text-[#697A86] uppercase tracking-wider mb-2.5 px-1">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={onStartPassportScan}
            className="bg-white p-3.5 rounded-2xl border border-[#126B68]/10 flex flex-col items-center text-center shadow-xs hover:border-[#126B68]/30 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#E5F1FA] text-[#126B68] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ScanLine className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#172B3A] leading-tight">Scan Passport</span>
            <span className="text-[10px] text-[#697A86] mt-0.5">Biometric OCR</span>
          </button>

          <button
            onClick={() => onNavigateTab('documents')}
            className="bg-white p-3.5 rounded-2xl border border-[#126B68]/10 flex flex-col items-center text-center shadow-xs hover:border-[#126B68]/30 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#DFF4ED] text-[#126B68] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#172B3A] leading-tight">Check Documents</span>
            <span className="text-[10px] text-[#697A86] mt-0.5">Vault & Stamping</span>
          </button>

          <button
            onClick={() => onNavigateTab('assistant')}
            className="bg-white p-3.5 rounded-2xl border border-[#126B68]/10 flex flex-col items-center text-center shadow-xs hover:border-[#126B68]/30 active:scale-95 transition-all group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#126B68]/10 text-[#126B68] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-[#172B3A] leading-tight">Ask AI</span>
            <span className="text-[10px] text-[#697A86] mt-0.5">Visa Advisor</span>
          </button>
        </div>
      </section>

      {/* Active Application Section */}
      <section aria-label="Active Visa Application">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-bold text-[#697A86] uppercase tracking-wider">
            Active Application
          </h3>
          {applications.length > 1 && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-semibold text-[#126B68] hover:underline flex items-center gap-0.5"
            >
              View all ({applications.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {activeApp ? (
          <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-sm" role="img" aria-label={activeApp.destination}>
                  {activeApp.destinationFlag}
                </span>
                <div>
                  <h4 className="text-base font-extrabold text-[#172B3A] leading-snug">
                    {activeApp.destination}
                    {activeApp.destinationCity ? ` · ${activeApp.destinationCity}` : ''}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-[#697A86] mt-0.5">
                    <span>{activeApp.visaCategory}</span>
                    <span>·</span>
                    <span>{activeApp.lengthOfStay}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-[#126B68] bg-[#DFF4ED] px-2.5 py-1 rounded-full whitespace-nowrap">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#697A86]">
                <span className="font-medium">Checklist verification</span>
                <span className="font-bold text-[#172B3A] tabular-nums">
                  {completedDocsCount} of {totalDocsCount} documents
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#E5F1FA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#126B68] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Next step highlight card */}
            {nextIncompleteItem && (
              <div className="bg-[#F8FAF8] rounded-2xl p-3.5 border border-[#126B68]/15 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E5F1FA] text-[#126B68] flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-bold text-[#126B68] uppercase tracking-wide">
                    Next Required Step
                  </span>
                  <p className="text-xs font-bold text-[#172B3A] truncate mt-0.5">
                    {nextIncompleteItem.title}
                  </p>
                  <p className="text-[11px] text-[#697A86] line-clamp-1 mt-0.5">
                    {nextIncompleteItem.description}
                  </p>
                </div>
              </div>
            )}

            {/* Travel timeline banner */}
            <div className="flex items-center justify-between text-xs pt-1 text-[#697A86] border-t border-[#126B68]/10">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#126B68]" />
                <span>Travel Date: <strong className="text-[#172B3A]">{activeApp.intendedDepartureDate}</strong></span>
              </div>
              <button
                onClick={() => onOpenApplication(activeApp.id)}
                className="text-xs font-bold text-[#126B68] flex items-center gap-1 hover:underline"
              >
                Open Checklist
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-[#126B68]/20 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#DFF4ED] text-[#126B68] flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#172B3A]">No active application yet</h4>
              <p className="text-xs text-[#697A86] max-w-xs mx-auto mt-1">
                Create a customized visa checklist for the UK, Canada, or Schengen area to track your preparation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <button
                onClick={onStartNewApplication}
                className="px-4 py-2.5 bg-[#126B68] text-white rounded-xl text-xs font-bold hover:bg-[#0D4E4C] transition-all"
              >
                Create New Application
              </button>
              <button
                onClick={onLoadSampleApplication}
                className="px-4 py-2.5 bg-[#DFF4ED] text-[#126B68] rounded-xl text-xs font-bold hover:bg-[#126B68]/15 transition-all"
              >
                Load UK Visitor Sample
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Nigerian Traveler Advisory & Tips */}
      <section className="bg-[#E5F1FA]/60 rounded-2xl p-4 border border-[#126B68]/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#126B68]">
          <Clock className="w-4 h-4" />
          <span>Embassy Guidelines & Processing Insights</span>
        </div>
        <ul className="text-xs text-[#172B3A] space-y-1.5 list-disc list-inside">
          <li>
            <strong>UK Standard Visitor:</strong> TLScontact (Lagos/Abuja) appointments book fast. Ensure 6-month bank statements show salary narrations.
          </li>
          <li>
            <strong>Canada TRV:</strong> IRCC strongly assesses ties to Nigeria (employment letters, property deeds, family commitments).
          </li>
          <li>
            <strong>Schengen:</strong> Travel health insurance must cover a minimum of €30,000 for emergency medical expenses.
          </li>
        </ul>
      </section>
    </div>
  );
};
