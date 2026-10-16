import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { ChecklistItem, DocumentItem } from '../../types';

interface UploadDocModalProps {
  checklistItem?: ChecklistItem | null;
  applicationId?: string;
  applicationTitle?: string;
  onSave: (doc: DocumentItem, targetChecklistId?: string) => void;
  onClose: () => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  checklistItem,
  applicationId,
  applicationTitle,
  onSave,
  onClose,
}) => {
  const [docName, setDocName] = useState<string>(
    checklistItem ? `${checklistItem.title.replace(/\s+/g, '_')}_Upload.pdf` : 'Travel_Document.pdf'
  );
  const [category, setCategory] = useState<any>(checklistItem?.category || 'Financial');
  const [notes, setNotes] = useState<string>(checklistItem?.notes || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocName(file.name);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      applicationId: applicationId || 'app-uk-2026-001',
      applicationTitle: applicationTitle || 'Active Visa Application',
      category,
      name: docName || 'Document_Upload.pdf',
      fileType: selectedFile?.type || 'PDF Document',
      sizeBytes: selectedFile?.size || 1250000,
      uploadDate: new Date().toISOString().split('T')[0],
      dataUrl: previewUrl || undefined,
      notes,
      isSample: false,
    };

    onSave(newDoc, checklistItem?.id);
    onClose();
  };

  const handleUseMockScan = () => {
    setDocName(`${checklistItem?.title || 'Stamped_Evidence'}_Verified.pdf`);
    setNotes('Verified and stamped by official issuer.');
    setPreviewUrl('/src/assets/images/passport_scan_guide_1792101482569.jpg');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-[#F8FAF8] border-b border-[#126B68]/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#126B68] uppercase tracking-wider">
              {checklistItem ? 'Checklist Attachment' : 'Vault Upload'}
            </span>
            <h3 className="text-sm font-bold text-[#172B3A]">
              {checklistItem ? `Upload ${checklistItem.title}` : 'Upload New Document'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#697A86] hover:text-[#172B3A] hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* File drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#126B68]/30 rounded-2xl p-4 text-center cursor-pointer hover:border-[#126B68] transition-colors bg-[#DFF4ED]/20 space-y-2"
          >
            <div className="w-10 h-10 rounded-full bg-[#126B68] text-white flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#172B3A]">
                {selectedFile ? selectedFile.name : 'Tap to select document or image'}
              </p>
              <p className="text-[10px] text-[#697A86] mt-0.5">
                PDF, JPEG, or PNG up to 10MB
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,image/*"
            className="hidden"
          />

          {/* Quick Mock Sample Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUseMockScan}
              className="text-[11px] font-semibold text-[#126B68] hover:underline"
            >
              + Use prototype sample attachment
            </button>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-[11px] font-bold text-[#697A86] mb-1">
              File Label / Display Name
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-[#697A86] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
            >
              <option value="Identity">Identity (Passport, Photo, NIN)</option>
              <option value="Financial">Financial (Bank Statement, Payslips, Tax)</option>
              <option value="Employment">Employment (Letter of Intro, CAC, Work ID)</option>
              <option value="Travel">Travel (Hotel, Flight Itinerary)</option>
              <option value="Supporting">Supporting (Ties, Sponsorship, Marriage)</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-bold text-[#697A86] mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Stamped by bank branch, includes signed leave approval..."
              rows={2}
              className="w-full p-2.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
            />
          </div>

          {/* Submit CTAs */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-[#126B68]/20 bg-white text-xs font-bold text-[#172B3A] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 h-11 rounded-xl bg-[#126B68] text-white text-xs font-bold shadow-md hover:bg-[#0D4E4C] active:scale-98 transition-all"
            >
              Save Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
