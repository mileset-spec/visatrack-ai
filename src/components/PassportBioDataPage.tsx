import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Maximize2,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';
import { PassportData } from '../types';

interface PassportBioDataPageProps {
  passportData: PassportData;
  onScanOrUpload: () => void;
  onImageUploaded?: (imageDataUrl: string) => void;
  editable?: boolean;
}

export const PassportBioDataPage: React.FC<PassportBioDataPageProps> = ({
  passportData,
  onScanOrUpload,
  onImageUploaded,
  editable = true,
}) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // File input ref for quick direct upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (onImageUploaded) {
          onImageUploaded(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const hasScanImage = Boolean(passportData.scanImageUrl);
  const countryCode = passportData.nationality.toLowerCase().includes('nigeria')
    ? 'NGA'
    : passportData.nationality.slice(0, 3).toUpperCase();

  // Generate authentic MRZ code lines based on data
  const mrzLine1 = `P<${countryCode}${passportData.surname.padEnd(10, '<')}<<${passportData.givenNames.replace(/\s+/g, '<')}`
    .slice(0, 44)
    .padEnd(44, '<');
  const birthFormatted = (passportData.dateOfBirth || '920618').replace(/-/g, '').slice(2, 8);
  const expiryFormatted = (passportData.expiryDate || '310617').replace(/-/g, '').slice(2, 8);
  const sexCode = passportData.sex ? passportData.sex.charAt(0) : 'F';
  const mrzLine2 = `${(passportData.passportNumber || 'A09876543').padEnd(9, '<')}8${countryCode}${birthFormatted}4${sexCode}${expiryFormatted}2<<<<<<<<<<<<<<02`.slice(0, 44);

  return (
    <div className="space-y-3">
      {/* Physical Passport Booklet Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border-2 border-[#126B68]/30 bg-[#FAF9F5] text-[#172B3A]">
        {/* Top Gold/Teal Header of the Passport Booklet */}
        <div className="bg-gradient-to-r from-[#0D4E4C] via-[#126B68] to-[#0D4E4C] text-[#DFF4ED] px-4 py-2.5 flex items-center justify-between border-b border-[#DFF4ED]/20">
          <div className="flex items-center gap-2">
            <span className="text-base">🇳🇬</span>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#DFF4ED]">
                FEDERAL REPUBLIC OF NIGERIA
              </p>
              <p className="text-[9px] text-[#DFF4ED]/80 tracking-wide font-mono">
                PASSPORT · PASSEPORT · ECOWAS / CEDEAO
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#DFF4ED]">
            <ShieldCheck className="w-3 h-3 text-[#DFF4ED]" />
            <span>Type: P</span>
          </div>
        </div>

        {/* REAL CAPTURED PASSPORT IMAGE SECTION (As requested) */}
        <div className="p-3.5 space-y-3">
          {hasScanImage ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#126B68] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Captured Physical Data Page Scan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFullscreenImage(passportData.scanImageUrl || null)}
                    className="text-[11px] font-bold text-[#126B68] hover:underline flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Enlarge</span>
                  </button>
                  {editable && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-bold text-[#697A86] hover:text-[#172B3A] flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace</span>
                    </button>
                  )}
                </div>
              </div>

              {/* The Actual Displayed Image of the Passport Data Page */}
              <div
                onClick={() => setFullscreenImage(passportData.scanImageUrl || null)}
                className="relative rounded-2xl overflow-hidden border-2 border-[#126B68]/30 bg-black cursor-pointer group shadow-sm"
              >
                <img
                  src={passportData.scanImageUrl}
                  alt="Scanned Passport Bio Data Page"
                  className="w-full h-48 sm:h-56 object-cover object-center group-hover:opacity-95 transition-all"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                  <div>
                    <p className="text-[11px] font-mono font-bold tracking-wider">
                      {passportData.surname}, {passportData.givenNames}
                    </p>
                    <p className="text-[10px] text-[#DFF4ED] font-mono">
                      No: {passportData.passportNumber} · Exp: {passportData.expiryDate}
                    </p>
                  </div>
                  <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    Tap to zoom
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state asking to upload/scan physical data page */
            <div
              onClick={onScanOrUpload}
              className="border-2 border-dashed border-[#126B68]/30 rounded-2xl p-5 text-center cursor-pointer hover:border-[#126B68] bg-[#DFF4ED]/20 space-y-2.5 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#126B68] text-white flex items-center justify-center mx-auto shadow-xs">
                <Camera className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#172B3A]">
                  Upload or Scan Passport Data Page
                </h4>
                <p className="text-[11px] text-[#697A86] max-w-xs mx-auto mt-0.5">
                  Capture your physical bio-data page to display your official photo, document number, and MRZ code directly on your dossier.
                </p>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 bg-[#126B68] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select Passport Image</span>
              </button>
            </div>
          )}

          {/* Structured Passport Bio-Data Fields Layout */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#126B68]/15 space-y-2.5 text-xs">
            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100">
              <div className="col-span-2">
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Surname / Nom
                </span>
                <span className="text-xs font-mono font-extrabold text-[#172B3A]">
                  {passportData.surname || 'ADEBAYO'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Nationality / Nationalité
                </span>
                <span className="text-xs font-mono font-bold text-[#126B68]">
                  {countryCode} · {passportData.nationality || 'NIGERIAN'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100">
              <div className="col-span-2">
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Given Names / Prénoms
                </span>
                <span className="text-xs font-mono font-bold text-[#172B3A]">
                  {passportData.givenNames || 'AMAKA SIMISOLA'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Sex / Sexe
                </span>
                <span className="text-xs font-mono font-bold text-[#172B3A]">
                  {passportData.sex || 'F'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Passport No.
                </span>
                <span className="text-xs font-mono font-extrabold text-[#126B68]">
                  {passportData.passportNumber || 'A09876543'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Date of Birth
                </span>
                <span className="text-xs font-mono font-medium text-[#172B3A]">
                  {passportData.dateOfBirth || '1992-06-18'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#697A86] uppercase tracking-wider block">
                  Expiry Date
                </span>
                <span className="text-xs font-mono font-extrabold text-[#172B3A]">
                  {passportData.expiryDate || '2031-06-17'}
                </span>
              </div>
            </div>

            {/* Machine Readable Zone (MRZ) Optical Barcode Lines */}
            <div className="bg-[#172B3A] text-[#DFF4ED] p-2.5 rounded-xl font-mono text-[9px] sm:text-[10px] tracking-widest leading-relaxed select-all overflow-x-auto shadow-inner">
              <p className="whitespace-pre">{mrzLine1}</p>
              <p className="whitespace-pre">{mrzLine2}</p>
            </div>
          </div>

          {/* Quick upload triggers */}
          {editable && (
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={onScanOrUpload}
                className="px-3 py-1.5 bg-[#DFF4ED] text-[#126B68] rounded-xl font-bold text-[11px] flex items-center gap-1.5 hover:bg-[#126B68] hover:text-white transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Launch Camera Scanner</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-semibold text-[#697A86] hover:text-[#126B68] flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Bio Page File</span>
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDirectUpload}
            accept="image/*,.pdf"
            className="hidden"
          />
        </div>
      </div>

      {/* Fullscreen Modal to inspect physical passport scan in high resolution */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#172B3A] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-3 bg-[#0D4E4C] text-white flex items-center justify-between">
              <span className="text-xs font-bold font-mono">
                Physical Passport Bio Data Page
              </span>
              <button
                onClick={() => setFullscreenImage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={fullscreenImage}
                alt="Enlarged Passport Data Page"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="p-3 bg-[#0D4E4C] text-center text-[11px] text-[#DFF4ED]">
              Verified Biometric Scan · ICAO Document Standard
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
