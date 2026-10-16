import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Upload,
  Eye,
  RefreshCw,
  Edit3,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';
import { VisaApplication, ChecklistItem, PREPARATION_STAGES, PreparationStage } from '../../types';

interface ApplicationDetailProps {
  application: VisaApplication;
  onUpdateApplication: (updatedApp: VisaApplication) => void;
  onUploadDocumentForItem: (item: ChecklistItem) => void;
  onViewDocument: (item: ChecklistItem) => void;
  onBack: () => void;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onUpdateApplication,
  onUploadDocumentForItem,
  onViewDocument,
  onBack,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checklist' | 'timeline' | 'details'>('checklist');
  const [editingNotesItemId, setEditingNotesItemId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Checklist counts
  const totalItems = application.checklist.length;
  const completedItems = application.checklist.filter((i) => i.isCompleted).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Toggle checklist item completion
  const handleToggleItemComplete = (itemId: string) => {
    const updatedChecklist = application.checklist.map((item) => {
      if (item.id === itemId) {
        const nextCompleted = !item.isCompleted;
        return {
          ...item,
          isCompleted: nextCompleted,
          status: nextCompleted ? ('verified' as const) : ('pending' as const),
        };
      }
      return item;
    });

    onUpdateApplication({
      ...application,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    });
  };

  // Save notes on checklist item
  const handleSaveNotes = (itemId: string) => {
    const updatedChecklist = application.checklist.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          notes: tempNotes,
        };
      }
      return item;
    });

    onUpdateApplication({
      ...application,
      checklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    });

    setEditingNotesItemId(null);
  };

  // Change stage in timeline
  const handleSetStage = (newStage: PreparationStage) => {
    const nowIso = new Date().toISOString();
    const currentTimestamps = { ...(application.stageTimestamps || {}) };
    currentTimestamps[newStage] = nowIso;

    onUpdateApplication({
      ...application,
      currentStage: newStage,
      stageTimestamps: currentTimestamps,
      updatedAt: nowIso,
    });
  };

  const categories = ['All', 'Identity', 'Financial', 'Employment', 'Travel', 'Supporting'];

  const filteredChecklist = application.checklist.filter((item) => {
    if (categoryFilter === 'All') return true;
    return item.category === categoryFilter;
  });

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-fade-in">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow-sm">{application.destinationFlag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#172B3A]">
                  {application.destination}
                </h2>
                <span className="text-[11px] font-bold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full">
                  {application.visaCategory}
                </span>
              </div>
              <p className="text-xs text-[#697A86] mt-0.5">
                Arrival: {application.destinationCity || 'Central'} · Length: {application.lengthOfStay}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#172B3A]">
              Dossier Readiness: <strong className="text-[#126B68]">{progressPercent}%</strong>
            </span>
            <span className="text-[#697A86] tabular-nums font-mono text-[11px]">
              {completedItems}/{totalItems} Completed
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#E5F1FA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#126B68] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Stage tag */}
        <div className="flex items-center justify-between pt-2 border-t border-[#126B68]/10 text-xs text-[#697A86]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#126B68]"></span>
            Current Stage: <strong className="text-[#172B3A]">
              {PREPARATION_STAGES.find((s) => s.id === application.currentStage)?.label || 'Preparation'}
            </strong>
          </span>
          <span className="text-[11px] font-mono">
            Dep: {application.intendedDepartureDate}
          </span>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex items-center p-1 bg-white rounded-2xl border border-[#126B68]/10 shadow-xs">
        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'checklist'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          Checklist ({completedItems}/{totalItems})
        </button>
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'timeline'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          Tracking Timeline
        </button>
        <button
          onClick={() => setActiveSubTab('details')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSubTab === 'details'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          Application Info
        </button>
      </div>

      {/* SUBTAB 1: CHECKLIST */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-3.5">
          {/* Unverified / Sample Label Notice */}
          <div className="bg-[#E5F1FA] border border-[#126B68]/15 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-[#172B3A]">
            <Info className="w-4 h-4 text-[#126B68] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#126B68]">
                Sample Destination-Specific Checklist
              </p>
              <p className="text-[11px] text-[#697A86] mt-0.5 leading-relaxed">
                Initial requirements are curated for Nigerian applicants. Cross-verify with the official consulate or VAC before final fee submission.
              </p>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#126B68] text-white shadow-xs'
                    : 'bg-white text-[#697A86] border border-[#126B68]/15 hover:border-[#126B68]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {filteredChecklist.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 border transition-all ${
                  item.isCompleted
                    ? 'border-[#126B68]/30 shadow-xs'
                    : 'border-[#126B68]/10 hover:border-[#126B68]/20'
                }`}
              >
                {/* Header row with checkbox */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleItemComplete(item.id)}
                    className="mt-0.5 text-[#126B68] focus:outline-none min-w-[28px] min-h-[28px] flex items-center justify-center"
                    aria-label={item.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {item.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 fill-[#126B68] text-white" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#697A86]/40 hover:text-[#126B68]" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold ${
                          item.isCompleted ? 'text-[#172B3A] line-through opacity-80' : 'text-[#172B3A]'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#697A86] bg-[#F8FAF8] border border-[#126B68]/10 px-2 py-0.5 rounded-md shrink-0">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#697A86] mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {item.officialSpec && (
                      <p className="text-[10px] font-mono text-[#126B68] bg-[#DFF4ED]/40 p-1.5 rounded-lg mt-2">
                        {item.officialSpec}
                      </p>
                    )}

                    {/* Attached Document Status */}
                    {item.documentName && (
                      <div className="mt-2.5 flex items-center justify-between bg-[#F8FAF8] p-2 rounded-xl border border-[#126B68]/10 text-xs">
                        <span className="flex items-center gap-1.5 text-[#172B3A] font-medium truncate">
                          <FileText className="w-3.5 h-3.5 text-[#126B68] shrink-0" />
                          <span className="truncate">{item.documentName}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onViewDocument(item)}
                            className="text-[#126B68] font-bold text-[11px] hover:underline flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          <button
                            onClick={() => onUploadDocumentForItem(item)}
                            className="text-[#697A86] font-bold text-[11px] hover:text-[#172B3A] flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Replace
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notes on checklist item */}
                    {editingNotesItemId === item.id ? (
                      <div className="mt-2.5 space-y-2">
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Add custom notes (e.g. Stamped at bank branch on Tuesday)..."
                          className="w-full text-xs p-2.5 rounded-xl border border-[#126B68]/30 bg-[#F8FAF8] focus:outline-none focus:border-[#126B68]"
                          rows={2}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setEditingNotesItemId(null)}
                            className="text-[11px] text-[#697A86] px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            className="text-[11px] font-bold text-white bg-[#126B68] px-3 py-1 rounded-lg"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      item.notes && (
                        <div className="mt-2 text-[11px] text-[#172B3A] bg-amber-50/60 border border-amber-200/60 p-2 rounded-xl flex items-start justify-between gap-2">
                          <span className="leading-snug">
                            <strong>Note:</strong> {item.notes}
                          </span>
                          <button
                            onClick={() => {
                              setEditingNotesItemId(item.id);
                              setTempNotes(item.notes || '');
                            }}
                            className="text-[#697A86] hover:text-[#172B3A] shrink-0"
                            title="Edit note"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    )}

                    {/* Actions button strip */}
                    <div className="mt-3 pt-2.5 border-t border-[#126B68]/10 flex items-center justify-between text-xs">
                      {!item.documentName ? (
                        <button
                          onClick={() => onUploadDocumentForItem(item)}
                          className="px-3 py-1.5 bg-[#DFF4ED] text-[#126B68] rounded-xl font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#126B68] hover:text-white transition-all"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Document</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#126B68] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Uploaded & Linked
                        </span>
                      )}

                      {!editingNotesItemId && !item.notes && (
                        <button
                          onClick={() => {
                            setEditingNotesItemId(item.id);
                            setTempNotes('');
                          }}
                          className="text-[11px] font-medium text-[#697A86] hover:text-[#126B68] flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Add Note</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: TRACKING TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-4">
          {/* Transparency Disclaimer */}
          <div className="bg-[#F8FAF8] rounded-2xl p-3.5 border border-[#126B68]/15 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#172B3A]">
              <AlertCircle className="w-4 h-4 text-[#126B68]" />
              <span>Manual Preparation Timeline</span>
            </div>
            <p className="text-[11px] text-[#697A86] leading-relaxed">
              VisaTrack AI tracks your self-reported preparation and submission milestones. This app does not access confidential embassy internal servers or guarantee decisions.
            </p>
          </div>

          {/* Stepper Stages */}
          <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-[#697A86] uppercase tracking-wider">
              Application Milestones
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5F1FA]">
              {PREPARATION_STAGES.map((stage, idx) => {
                const isCurrent = application.currentStage === stage.id;
                const stageIndex = PREPARATION_STAGES.findIndex((s) => s.id === application.currentStage);
                const isCompleted = idx < stageIndex || (idx === stageIndex && application.currentStage === 'decision_received');
                const timestamp = application.stageTimestamps?.[stage.id];

                return (
                  <div key={stage.id} className="relative group">
                    {/* Circle Indicator */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#126B68] text-white ring-4 ring-[#DFF4ED]'
                          : isCompleted
                          ? 'bg-[#126B68] text-white'
                          : 'bg-white border-2 border-[#697A86]/40 text-[#697A86]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <span className="text-[9px] font-bold">{stage.stepNumber}</span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-[#126B68]' : 'text-[#172B3A]'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        <p className="text-[11px] text-[#697A86] mt-0.5">
                          {stage.description}
                        </p>
                        {timestamp && (
                          <span className="inline-block text-[10px] text-[#126B68] font-mono mt-1">
                            Updated: {new Date(timestamp).toLocaleDateString('en-GB')}
                          </span>
                        )}
                      </div>

                      {/* Manual update button */}
                      {!isCurrent && (
                        <button
                          onClick={() => handleSetStage(stage.id)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-[#126B68]/20 text-[#126B68] hover:bg-[#DFF4ED]/60 shrink-0"
                        >
                          Set Active
                        </button>
                      )}
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full shrink-0">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Biometrics / VAC Appointment Details */}
          <div className="bg-white rounded-2xl p-4 border border-[#126B68]/15 space-y-3">
            <h4 className="text-xs font-bold text-[#172B3A]">
              Visa Application Centre (VAC) Booking
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-[#697A86]">Appointment Date:</span>
                <p className="font-semibold text-[#172B3A]">
                  {application.appointmentDate || 'Not yet scheduled'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-[#697A86]">Location:</span>
                <p className="font-semibold text-[#172B3A] truncate">
                  {application.appointmentLocation || 'TLScontact / VFS Global Lagos'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: APPLICATION DETAILS */}
      {activeSubTab === 'details' && (
        <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#697A86] uppercase tracking-wider">
            Applicant & Itinerary Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Destination Country:</span>
              <span className="font-bold text-[#172B3A]">{application.destination}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Visa Class:</span>
              <span className="font-bold text-[#172B3A]">{application.visaCategory}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Nationality:</span>
              <span className="font-bold text-[#172B3A]">{application.passportNationality} 🇳🇬</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Country of Residence:</span>
              <span className="font-bold text-[#172B3A]">{application.countryOfResidence}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Proposed Departure:</span>
              <span className="font-bold text-[#172B3A]">{application.intendedDepartureDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Proposed Return:</span>
              <span className="font-bold text-[#172B3A]">{application.intendedReturnDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[#697A86]">Length of Stay:</span>
              <span className="font-bold text-[#172B3A]">{application.lengthOfStay}</span>
            </div>
            <div className="py-2 border-b border-slate-100">
              <span className="text-[#697A86] block mb-1">Declared Purpose:</span>
              <p className="font-medium text-[#172B3A] bg-[#F8FAF8] p-2.5 rounded-xl border border-[#126B68]/10">
                {application.purposeOfTravel}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
