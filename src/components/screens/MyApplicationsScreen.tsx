import React, { useState } from 'react';
import {
  PlusCircle,
  ArrowRight,
  Calendar,
  Layers,
  Trash2,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { VisaApplication } from '../../types';
import { PREPARATION_STAGES } from '../../types';

interface MyApplicationsScreenProps {
  applications: VisaApplication[];
  onOpenApplication: (appId: string) => void;
  onStartNewApplication: () => void;
  onDeleteApplication: (appId: string) => void;
  onLoadSampleApplication: () => void;
}

export const MyApplicationsScreen: React.FC<MyApplicationsScreenProps> = ({
  applications,
  onOpenApplication,
  onStartNewApplication,
  onDeleteApplication,
  onLoadSampleApplication,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return app.currentStage === 'decision_received';
    if (filter === 'in_progress') return app.currentStage !== 'decision_received';
    return true;
  });

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-fade-in">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-extrabold text-[#172B3A]">
            My Visa Applications
          </h2>
          <p className="text-xs text-[#697A86]">
            {applications.length} {applications.length === 1 ? 'dossier' : 'dossiers'} tracked
          </p>
        </div>

        <button
          onClick={onStartNewApplication}
          className="px-3.5 py-2 bg-[#126B68] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#0D4E4C] active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Segmented Filter */}
      <div className="flex items-center p-1 bg-white rounded-xl border border-[#126B68]/10 shadow-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filter === 'in_progress'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            filter === 'completed'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            const completedCount = app.checklist.filter((i) => i.isCompleted).length;
            const totalCount = app.checklist.length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const stageLabel = PREPARATION_STAGES.find((s) => s.id === app.currentStage)?.label || 'Preparation';

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-4 hover:border-[#126B68]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow-sm">{app.destinationFlag}</span>
                    <div>
                      <h3 className="text-sm font-bold text-[#172B3A] leading-snug">
                        {app.destination}
                        {app.destinationCity ? ` (${app.destinationCity})` : ''}
                      </h3>
                      <p className="text-xs text-[#697A86]">
                        {app.visaCategory} · {app.lengthOfStay}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#126B68] bg-[#DFF4ED] px-2.5 py-1 rounded-full whitespace-nowrap">
                    {progress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#697A86]">
                    <span>Stage: <strong className="text-[#172B3A]">{stageLabel}</strong></span>
                    <span className="font-mono">{completedCount}/{totalCount} items</span>
                  </div>
                  <div className="w-full h-2 bg-[#E5F1FA] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#126B68] rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Details row */}
                <div className="flex items-center justify-between text-xs text-[#697A86] pt-1 border-t border-[#126B68]/10">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#126B68]" />
                    <span>Travel: {app.intendedDepartureDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteApplication(app.id)}
                      className="p-1.5 text-[#697A86] hover:text-red-600 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenApplication(app.id)}
                      className="px-3 py-1.5 bg-[#126B68] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-[#0D4E4C] active:scale-95 transition-all"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-[#126B68]/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#DFF4ED] text-[#126B68] flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172B3A]">No applications found</h4>
              <p className="text-xs text-[#697A86] mt-1">
                You have no applications under this filter.
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={onStartNewApplication}
                className="px-4 py-2 bg-[#126B68] text-white rounded-xl text-xs font-bold"
              >
                Start Application
              </button>
              <button
                onClick={onLoadSampleApplication}
                className="px-4 py-2 bg-[#DFF4ED] text-[#126B68] rounded-xl text-xs font-bold"
              >
                Load Sample
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
