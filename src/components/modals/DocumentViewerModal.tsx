import React from 'react';
import { X, FileText, Download, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onReplace?: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  onReplace,
}) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#F8FAF8] border-b border-[#126B68]/10 flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-[#126B68] uppercase tracking-wider">
              {document.category} Document
            </span>
            <h3 className="text-sm font-bold text-[#172B3A] truncate">
              {document.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#697A86] hover:text-[#172B3A] hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5">
          {document.dataUrl || document.name.toLowerCase().includes('passport') ? (
            <div className="rounded-2xl overflow-hidden border border-[#126B68]/15 bg-black flex items-center justify-center">
              <img
                src={document.dataUrl || '/src/assets/images/passport_scan_guide_1792101482569.jpg'}
                alt={document.name}
                className="max-h-72 w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="h-44 rounded-2xl bg-[#DFF4ED]/30 border border-[#126B68]/15 flex flex-col items-center justify-center text-center p-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#126B68] flex items-center justify-center shadow-xs">
                <FileText className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="text-xs font-bold text-[#172B3A]">{document.name}</p>
              <span className="text-[10px] text-[#697A86]">
                {document.fileType} · Uploaded on {document.uploadDate}
              </span>
            </div>
          )}

          {/* Document metadata info */}
          <div className="bg-[#F8FAF8] p-3 rounded-2xl border border-[#126B68]/10 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#697A86]">Category:</span>
              <span className="font-semibold text-[#172B3A]">{document.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#697A86]">File Size:</span>
              <span className="font-semibold text-[#172B3A]">
                {Math.round(document.sizeBytes / 1024)} KB
              </span>
            </div>
            {document.applicationTitle && (
              <div className="flex justify-between">
                <span className="text-[#697A86]">Linked Dossier:</span>
                <span className="font-semibold text-[#126B68] truncate max-w-[160px]">
                  {document.applicationTitle}
                </span>
              </div>
            )}
            {document.notes && (
              <div className="pt-1.5 border-t border-[#126B68]/10">
                <span className="text-[#697A86] block text-[10px] mb-0.5">Notes:</span>
                <p className="font-medium text-[#172B3A] text-[11px] leading-snug">
                  {document.notes}
                </p>
              </div>
            )}
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-2 text-[11px] text-[#126B68] bg-[#DFF4ED] p-2.5 rounded-xl font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Document verified and prepared for consular submission.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F8FAF8] border-t border-[#126B68]/10 flex items-center gap-2">
          {onReplace && (
            <button
              onClick={() => {
                onClose();
                onReplace();
              }}
              className="flex-1 h-10 rounded-xl border border-[#126B68]/30 bg-white text-xs font-bold text-[#126B68] hover:bg-[#DFF4ED]/30"
            >
              Replace Document
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl bg-[#126B68] text-white text-xs font-bold hover:bg-[#0D4E4C]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
