import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  RefreshCw,
  FolderOpen,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentsScreenProps {
  documents: DocumentItem[];
  onOpenUploadModal: () => void;
  onPreviewDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (docId: string) => void;
}

export const DocumentsScreen: React.FC<DocumentsScreenProps> = ({
  documents,
  onOpenUploadModal,
  onPreviewDocument,
  onDeleteDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Identity', 'Financial', 'Employment', 'Travel', 'Supporting'];

  const filteredDocs = documents.filter((doc) => {
    if (selectedCategory === 'All') return true;
    return doc.category === selectedCategory;
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-fade-in">
      {/* Header and Upload button */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-base font-extrabold text-[#172B3A]">
            Document Library
          </h2>
          <p className="text-xs text-[#697A86]">
            {documents.length} verified & prototype documents stored
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-3.5 py-2 bg-[#126B68] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#0D4E4C] active:scale-95 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Security Banner */}
      <div className="bg-[#DFF4ED]/60 border border-[#126B68]/20 rounded-2xl p-3.5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#126B68] shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold text-[#126B68]">
            Local Privacy & Sandbox Isolation
          </p>
          <p className="text-[11px] text-[#172B3A]/80 mt-0.5 leading-relaxed">
            All documents uploaded here are isolated locally in browser prototype storage. Sample prototype files are explicitly marked to protect user data.
          </p>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#126B68] text-white shadow-xs'
                : 'bg-white text-[#697A86] border border-[#126B68]/15 hover:border-[#126B68]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Grid / List */}
      <div className="space-y-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-4 border border-[#126B68]/15 shadow-xs hover:border-[#126B68]/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#E5F1FA] text-[#126B68] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[#172B3A] truncate">
                        {doc.name}
                      </h3>
                      {doc.isSample ? (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-sm shrink-0">
                          Sample Data
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-[#126B68] bg-[#DFF4ED] px-1.5 py-0.5 rounded-sm shrink-0">
                          User Upload
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#697A86] mt-0.5">
                      {doc.category} · {formatSize(doc.sizeBytes)} · {doc.uploadDate}
                    </p>
                    {doc.applicationTitle && (
                      <p className="text-[10px] text-[#126B68] font-medium mt-0.5 truncate">
                        Linked: {doc.applicationTitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {doc.notes && (
                <p className="text-[11px] text-[#172B3A] bg-[#F8FAF8] p-2 rounded-xl border border-[#126B68]/10 leading-snug">
                  <strong>Notes:</strong> {doc.notes}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[#126B68]/10 text-xs">
                <button
                  onClick={() => onPreviewDocument(doc)}
                  className="text-[#126B68] font-bold text-[11px] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 text-[#697A86] hover:text-red-600 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-dashed border-[#126B68]/20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#DFF4ED] text-[#126B68] flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172B3A]">No documents in this category</h4>
              <p className="text-xs text-[#697A86] mt-1">
                Upload your stamped bank statements, employer letters, or passport scans.
              </p>
            </div>
            <button
              onClick={onOpenUploadModal}
              className="px-4 py-2 bg-[#126B68] text-white rounded-xl text-xs font-bold"
            >
              Upload Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
