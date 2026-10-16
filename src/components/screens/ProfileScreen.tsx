import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Bell,
  Lock,
  HelpCircle,
  ShieldCheck,
  Globe,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { UserProfile, PassportData } from '../../types';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onScanPassport: () => void;
  onResetAllData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onScanPassport,
  onResetAllData,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleSaveProfile = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleToggleNotification = (key: keyof UserProfile['notificationPreferences']) => {
    const updated = {
      ...formData,
      notificationPreferences: {
        ...formData.notificationPreferences,
        [key]: !formData.notificationPreferences[key],
      },
    };
    setFormData(updated);
    onUpdateProfile(updated);
  };

  const handleTogglePrivacy = (key: keyof UserProfile['privacySettings']) => {
    const updated = {
      ...formData,
      privacySettings: {
        ...formData.privacySettings,
        [key]: !formData.privacySettings[key],
      },
    };
    setFormData(updated);
    onUpdateProfile(updated);
  };

  return (
    <div className="flex-1 p-4 pb-20 space-y-4 animate-fade-in">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#126B68] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            {profile.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-extrabold text-[#172B3A] truncate">
              {profile.fullName}
            </h2>
            <p className="text-xs text-[#697A86] truncate">{profile.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full">
                🇳🇬 {profile.passportNationality} Citizen
              </span>
              <span className="text-[10px] text-[#697A86]">
                Resident in {profile.countryOfResidence}
              </span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#697A86] mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#697A86] mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#697A86] mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-[#697A86]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 bg-[#126B68] text-white rounded-xl text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-2 bg-[#F8FAF8] border border-[#126B68]/15 rounded-xl text-xs font-bold text-[#126B68] hover:bg-[#DFF4ED]/40 transition-colors"
          >
            Edit Profile Details
          </button>
        )}
      </div>

      {/* Verified Biometric Passport Info */}
      <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#126B68]" />
            <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
              Biometric Passport Record
            </h3>
          </div>
          <button
            onClick={onScanPassport}
            className="text-xs font-bold text-[#126B68] hover:underline"
          >
            Scan / Update
          </button>
        </div>

        <div className="bg-[#F8FAF8] rounded-2xl p-3.5 border border-[#126B68]/10 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#697A86]">Passport Number:</span>
            <span className="font-mono font-bold text-[#172B3A]">
              {profile.passportData?.passportNumber || 'Not Scanned'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#697A86]">Holder Name:</span>
            <span className="font-mono font-bold text-[#172B3A]">
              {profile.passportData?.surname} {profile.passportData?.givenNames}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#697A86]">Expiry Date:</span>
            <span className="font-mono font-bold text-[#172B3A]">
              {profile.passportData?.expiryDate || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-[#126B68]/10">
            <span className="text-[#697A86]">Status:</span>
            <span className="text-[10px] font-bold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Biometric
            </span>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#126B68]" />
          <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
            Travel & Visa Alerts
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#172B3A]">Appointment Reminders</p>
              <p className="text-[11px] text-[#697A86]">TLScontact & VFS Global biometric dates</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationPreferences.appointmentReminders}
              onChange={() => handleToggleNotification('appointmentReminders')}
              className="w-4 h-4 accent-[#126B68] rounded-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#172B3A]">Checklist Milestones</p>
              <p className="text-[11px] text-[#697A86]">Alerts for remaining uncollected documents</p>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationPreferences.checklistProgress}
              onChange={() => handleToggleNotification('checklistProgress')}
              className="w-4 h-4 accent-[#126B68] rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#126B68]" />
          <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
            Data Privacy & Architecture
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#172B3A]">Local Prototype Storage</p>
              <p className="text-[11px] text-[#697A86]">Store dossiers locally on this device only</p>
            </div>
            <span className="text-[10px] font-bold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#172B3A]">Biometric App Lock</p>
              <p className="text-[11px] text-[#697A86]">Require fingerprint/face recognition</p>
            </div>
            <input
              type="checkbox"
              checked={formData.privacySettings.biometricLock}
              onChange={() => handleTogglePrivacy('biometricLock')}
              className="w-4 h-4 accent-[#126B68] rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Nigerian Consular & VAC Directory */}
      <div className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#126B68]" />
          <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
            Official Consular Directory (Nigeria)
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-[#126B68]/10 space-y-1">
            <h4 className="font-bold text-[#172B3A]">🇬🇧 UK Visas & Immigration (TLScontact)</h4>
            <p className="text-[11px] text-[#697A86]">
              Lagos: TLScontact Centre, 5th Floor, Churchgate Tower 2, Victoria Island.<br />
              Abuja: TLScontact Centre, Dangote House, Central Business District.
            </p>
          </div>

          <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-[#126B68]/10 space-y-1">
            <h4 className="font-bold text-[#172B3A]">🇨🇦 Canadian High Commission (VFS Global)</h4>
            <p className="text-[11px] text-[#697A86]">
              Lagos: VFS Centre, Manor House, Plot 110, Admiral Ayinla Way, Lekki.<br />
              Abuja: VFS Centre, Sterling Bank Plaza, 3rd Floor, CBD.
            </p>
          </div>

          <div className="p-3 bg-[#F8FAF8] rounded-2xl border border-[#126B68]/10 space-y-1">
            <h4 className="font-bold text-[#172B3A]">🇪🇺 Schengen Consulates (France, Germany)</h4>
            <p className="text-[11px] text-[#697A86]">
              Lagos: VFS Global France / TLScontact Germany Victoria Island.
            </p>
          </div>
        </div>
      </div>

      {/* Reset & Wipe Action */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (confirm('Reset VisaTrack AI to initial sample data? All local edits will be refreshed.')) {
              onResetAllData();
            }
          }}
          className="w-full py-2.5 rounded-2xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Prototype Data</span>
        </button>
      </div>
    </div>
  );
};
