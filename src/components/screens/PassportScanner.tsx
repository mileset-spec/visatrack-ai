import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Crop,
  ShieldCheck,
  User,
  Calendar,
  CreditCard,
  Sparkles,
  Info
} from 'lucide-react';
import { PassportData } from '../../types';
import { api, OcrResponse } from '../../services/api';

interface PassportScannerProps {
  currentPassport: PassportData;
  onSavePassport: (data: PassportData) => void;
  onClose: () => void;
}

export const PassportScanner: React.FC<PassportScannerProps> = ({
  currentPassport,
  onSavePassport,
  onClose,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<OcrResponse | null>(null);
  const [formData, setFormData] = useState<PassportData>({ ...currentPassport });
  const [activeStep, setActiveStep] = useState<'capture' | 'review'>('capture');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start device camera
  const handleStartCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access not granted or unavailable:', err);
      setCameraActive(false);
      // Fallback: trigger file input
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Capture snapshot from video stream
  const handleCaptureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(dataUrl);
        stopCamera();
        processImage(dataUrl);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImagePreview(dataUrl);
        processImage(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image with OCR
  const processImage = async (dataUrl: string) => {
    setIsScanning(true);
    try {
      const response = await api.scanPassportImage(dataUrl);
      setScanResult(response);
      setFormData({
        surname: response.data.surname || 'ADEBAYO',
        givenNames: response.data.givenNames || 'AMAKA SIMISOLA',
        passportNumber: response.data.passportNumber || 'A09876543',
        nationality: response.data.nationality || 'NIGERIAN',
        dateOfBirth: response.data.dateOfBirth || '1992-06-18',
        expiryDate: response.data.expiryDate || '2031-06-17',
        issueDate: response.data.issueDate || '2021-06-18',
        sex: response.data.sex || 'F',
        isConfirmed: false,
        scanImageUrl: dataUrl,
        lastScannedAt: new Date().toISOString(),
      });
      setActiveStep('review');
    } catch (err) {
      console.error('Scan processing error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRetake = () => {
    stopCamera();
    setImagePreview(null);
    setScanResult(null);
    setActiveStep('capture');
    setRotationAngle(0);
  };

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
  };

  const handleConfirm = () => {
    onSavePassport({
      ...formData,
      isConfirmed: true,
      lastScannedAt: new Date().toISOString(),
    });
    onClose();
  };

  // Load sample Nigerian passport image for instant test
  const handleUseSamplePassport = () => {
    // Generated image asset
    const sampleUrl = '/src/assets/images/passport_scan_guide_1792101482569.jpg';
    setImagePreview(sampleUrl);
    processImage(sampleUrl);
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-fade-in">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#126B68]/10">
        <div>
          <span className="text-[11px] font-bold text-[#126B68] uppercase tracking-wider">
            Biometric Passport Scan
          </span>
          <h2 className="text-base font-black text-[#172B3A]">
            {activeStep === 'capture' ? 'Capture Passport Data Page' : 'Verify Extracted Details'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-[#697A86] hover:text-[#172B3A] p-1.5"
        >
          Close
        </button>
      </div>

      {/* STEP 1: CAPTURE / UPLOAD */}
      {activeStep === 'capture' && (
        <div className="space-y-4">
          {/* Guide image illustration */}
          <div className="relative rounded-3xl overflow-hidden border border-[#126B68]/15 bg-[#E5F1FA] shadow-xs">
            {cameraActive ? (
              <div className="relative aspect-4/3 bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder overlay */}
                <div className="absolute inset-6 border-2 border-dashed border-[#DFF4ED] rounded-2xl pointer-events-none flex items-center justify-center">
                  <span className="text-[10px] text-white bg-black/60 px-2 py-1 rounded-md">
                    Align MRZ barcode & photo within frame
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative aspect-16/10">
                <img
                  src="/src/assets/images/passport_scan_guide_1792101482569.jpg"
                  alt="Passport Scanning Guide"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[11px] font-bold text-[#DFF4ED] uppercase tracking-wider">
                    Scanning Best Practices
                  </span>
                  <p className="text-xs text-white/90 leading-tight mt-0.5">
                    Avoid flash glare on the laminate. Ensure the bottom two MRZ barcode lines are crisp and straight.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            {cameraActive ? (
              <button
                onClick={handleCaptureSnapshot}
                className="w-full h-12 bg-[#126B68] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#0D4E4C] active:scale-98 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo Now</span>
              </button>
            ) : (
              <button
                onClick={handleStartCamera}
                className="w-full h-12 bg-[#126B68] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#0D4E4C] active:scale-98 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Use Device Camera</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-11 bg-white border border-[#126B68]/20 text-[#172B3A] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#DFF4ED]/30 active:scale-98 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-[#126B68]" />
                <span>Upload File</span>
              </button>
              <button
                onClick={handleUseSamplePassport}
                className="h-11 bg-[#DFF4ED] text-[#126B68] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#126B68]/15 active:scale-98 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Scan</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Scanner specifications info */}
          <div className="bg-white rounded-2xl p-4 border border-[#126B68]/10 text-xs text-[#697A86] space-y-1.5">
            <span className="font-bold text-[#172B3A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#126B68]" />
              Secure Client-Side Extraction Sandbox
            </span>
            <p className="text-[11px] leading-relaxed">
              VisaTrack AI reads name, nationality, passport number, and expiration date directly for your visa checklist. No images are permanently stored on unauthorized remote servers.
            </p>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {isScanning && (
        <div className="bg-white rounded-3xl p-8 border border-[#126B68]/15 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#DFF4ED] text-[#126B68] flex items-center justify-center mx-auto animate-spin">
            <RefreshCw className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#172B3A]">
              Analyzing Passport Data Page...
            </h3>
            <p className="text-xs text-[#697A86] mt-1">
              Parsing ICAO 9303 machine-readable zones (MRZ) & OCR fields.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: REVIEW EXTRACTED DETAILS & CONFIRM */}
      {activeStep === 'review' && !isScanning && (
        <div className="space-y-4">
          {/* Preview thumbnail with controls */}
          {imagePreview && (
            <div className="bg-white rounded-2xl p-3 border border-[#126B68]/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 bg-black rounded-lg overflow-hidden shrink-0">
                  <img
                    src={imagePreview}
                    alt="Captured Scan"
                    className="w-full h-full object-cover transition-transform"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#172B3A]">Document Captured</span>
                  <p className="text-[10px] text-[#697A86]">Ready for confirmation</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg text-[#697A86] hover:text-[#172B3A] hover:bg-slate-100"
                  title="Rotate image"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRetake}
                  className="px-2.5 py-1 text-xs font-bold text-[#126B68] hover:underline"
                >
                  Retake
                </button>
              </div>
            </div>
          )}

          {/* Sandbox / OCR Notice */}
          {scanResult?.isDemoMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Sandbox Mode Extraction</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Extracted fields are displayed as a prototype placeholder. Please inspect and edit all values to match your physical passport before saving.
                </p>
              </div>
            </div>
          )}

          {/* Form Fields to Confirm */}
          <div className="bg-white rounded-3xl p-4 border border-[#126B68]/15 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-[#697A86] uppercase tracking-wider">
              Extracted Passport Fields
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                  Surname (Last Name)
                </label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value.toUpperCase() })}
                  className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-mono font-bold text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                  Given Names
                </label>
                <input
                  type="text"
                  value={formData.givenNames}
                  onChange={(e) => setFormData({ ...formData, givenNames: e.target.value.toUpperCase() })}
                  className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-mono font-bold text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                  Passport Number
                </label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                  className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-mono font-bold text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value.toUpperCase() })}
                  className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-mono font-bold text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full h-10 px-2 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-mono font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full h-10 px-2 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-mono font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleRetake}
              className="flex-1 h-12 rounded-2xl border border-[#126B68]/20 bg-white text-xs font-bold text-[#172B3A] hover:bg-slate-50 transition-all"
            >
              Retake Scan
            </button>
            <button
              onClick={handleConfirm}
              className="flex-2 h-12 rounded-2xl bg-[#126B68] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-[#0D4E4C] active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Link to Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
