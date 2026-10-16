import React, { useState } from 'react';
import {
  User,
  Calendar,
  Globe2,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  PlusCircle,
  Users
} from 'lucide-react';
import { UserProfile, VisaApplication } from '../../types';
import { DESTINATION_OPTIONS, generateDefaultChecklist } from '../../data/defaultData';

interface AuthScreenProps {
  currentProfile: UserProfile;
  savedProfiles: UserProfile[];
  onSignIn: (profile: UserProfile, newApplication?: VisaApplication) => void;
  onSelectExistingProfile: (profileId: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentProfile,
  savedProfiles,
  onSignIn,
  onSelectExistingProfile,
}) => {
  const [mode, setMode] = useState<'signin' | 'new_traveler'>('new_traveler');

  // New Traveler Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [nationality, setNationality] = useState<string>('Nigerian');
  const [destination, setDestination] = useState<string>('United Kingdom');
  const [visaCategory, setVisaCategory] = useState<any>('Visitor or tourism');
  const [departureDate, setDepartureDate] = useState<string>('2026-11-25');
  const [returnDate, setReturnDate] = useState<string>('2026-12-10');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateAndSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!departureDate) newErrors.departureDate = 'Departure date is required.';
    if (!returnDate) newErrors.returnDate = 'Return date is required.';
    if (departureDate && returnDate && departureDate > returnDate) {
      newErrors.returnDate = 'Return date must be after departure date.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userId = `user_${Date.now()}`;
    const selectedDest = DESTINATION_OPTIONS.find((d) => d.id === destination) || DESTINATION_OPTIONS[0];

    // Calculate length of stay
    const d1 = new Date(departureDate);
    const d2 = new Date(returnDate);
    const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
    const lengthOfStay = `${diffDays} Days`;

    // Create tailored user profile
    const newProfile: UserProfile = {
      id: userId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: '+234 800 000 0000',
      passportNationality: nationality.trim(),
      countryOfResidence: 'Nigeria',
      intendedTravelDates: {
        departure: departureDate,
        return: returnDate,
        destination,
      },
      passportData: {
        surname: fullName.trim().split(' ').slice(-1)[0].toUpperCase(),
        givenNames: fullName.trim().split(' ').slice(0, -1).join(' ').toUpperCase() || fullName.trim().toUpperCase(),
        passportNumber: `A${Math.floor(10000000 + Math.random() * 90000000)}`,
        nationality: nationality.trim().toUpperCase(),
        dateOfBirth: '1995-05-15',
        expiryDate: '2032-05-14',
        issueDate: '2022-05-15',
        sex: 'M',
        isConfirmed: false,
      },
      notificationPreferences: {
        deadlineAlerts: true,
        appointmentReminders: true,
        checklistProgress: true,
      },
      privacySettings: {
        localDataOnly: true,
        biometricLock: false,
      },
      isSignedIn: true,
      lastLoginAt: new Date().toISOString(),
    };

    // Create initial customized application for their destination and dates
    const initialApp: VisaApplication = {
      id: `app-${destination.toLowerCase().slice(0, 2)}-${Date.now()}`,
      destination: destination as any,
      destinationFlag: selectedDest.flag,
      destinationCity: selectedDest.popularCities[0],
      visaCategory,
      passportNationality: nationality.trim(),
      countryOfResidence: 'Nigeria',
      purposeOfTravel: `Travel to ${destination} for ${visaCategory.toLowerCase()} from ${departureDate} to ${returnDate}.`,
      intendedDepartureDate: departureDate,
      intendedReturnDate: returnDate,
      lengthOfStay,
      currentStage: 'application_created',
      stageTimestamps: {
        application_created: new Date().toISOString(),
      },
      stageNotes: {
        application_created: `Dossier initialized with travel dates ${departureDate} to ${returnDate}.`,
      },
      notes: `Targeting travel on ${departureDate} for ${lengthOfStay}.`,
      checklist: generateDefaultChecklist(destination, visaCategory),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSignIn(newProfile, initialApp);
  };

  return (
    <div className="flex-1 p-4 pb-12 flex flex-col justify-center max-w-md mx-auto space-y-4 animate-fade-in">
      {/* Brand & Greeting Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-[#126B68] text-white flex items-center justify-center font-black text-xl mx-auto shadow-md">
          VT
        </div>
        <h2 className="text-xl font-extrabold text-[#172B3A]">
          VisaTrack AI Traveler Portal
        </h2>
        <p className="text-xs text-[#697A86] max-w-xs mx-auto">
          Sign in with your intended travel dates to prepare your visa checklist and track your application milestones.
        </p>
      </div>

      {/* Switch between New Traveler vs Existing Account */}
      <div className="flex items-center p-1 bg-white rounded-2xl border border-[#126B68]/15 shadow-xs">
        <button
          type="button"
          onClick={() => setMode('new_traveler')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'new_traveler'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          New Traveler Check-in
        </button>
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            mode === 'signin'
              ? 'bg-[#126B68] text-white shadow-xs'
              : 'text-[#697A86] hover:text-[#172B3A]'
          }`}
        >
          Switch Profile ({savedProfiles.length})
        </button>
      </div>

      {/* MODE 1: NEW TRAVELER / ENTER DATES */}
      {mode === 'new_traveler' ? (
        <form onSubmit={handleCreateAndSignIn} className="bg-white rounded-3xl p-5 border border-[#126B68]/15 shadow-sm space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#126B68]">
            <Compass className="w-4 h-4" />
            <span>Enter Your Travel & Identity Details</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#697A86] mb-1">
              Your Full Name (As on Passport)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Babajide O. Adeleke"
              className="w-full h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
            />
            {errors.fullName && (
              <p className="text-[10px] text-red-600 mt-0.5">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#697A86] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. babajide@example.ng"
              className="w-full h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
            />
            {errors.email && (
              <p className="text-[10px] text-red-600 mt-0.5">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g. Nigerian"
                className="w-full h-11 px-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#697A86] mb-1">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full h-11 px-2.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
              >
                <option value="United Kingdom">United Kingdom 🇬🇧</option>
                <option value="Canada">Canada 🇨🇦</option>
                <option value="Schengen Area">Schengen Area 🇪🇺</option>
              </select>
            </div>
          </div>

          {/* Travel Dates Picker */}
          <div className="bg-[#E5F1FA]/60 p-3 rounded-2xl border border-[#126B68]/15 space-y-2">
            <span className="text-[11px] font-bold text-[#126B68] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Intended Travel Window
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-medium text-[#697A86] mb-0.5">
                  Departure Date
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl border border-[#126B68]/20 bg-white text-xs font-mono font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#697A86] mb-0.5">
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full h-10 px-2 rounded-xl border border-[#126B68]/20 bg-white text-xs font-mono font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>
            </div>
            {errors.returnDate && (
              <p className="text-[10px] text-red-600">{errors.returnDate}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-[#126B68] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-[#0D4E4C] active:scale-98 transition-all"
          >
            <span>Sign In & Generate Visa Dossier</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* MODE 2: SWITCH EXISTING TRAVELER PROFILE */
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 border border-[#126B68]/15 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#126B68]">
              <Users className="w-4 h-4" />
              <span>Select Active Traveler Profile</span>
            </div>

            <div className="space-y-2">
              {savedProfiles.map((p) => {
                const isActive = p.id === currentProfile.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectExistingProfile(p.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-[#126B68] bg-[#DFF4ED]/20 shadow-xs'
                        : 'border-[#126B68]/10 bg-white hover:border-[#126B68]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#126B68] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {p.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#172B3A] truncate">
                          {p.fullName}
                        </h4>
                        <p className="text-[11px] text-[#697A86] truncate">
                          {p.intendedTravelDates?.destination || 'UK'} · Dep: {p.intendedTravelDates?.departure || 'Nov 2026'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isActive && (
                        <span className="text-[10px] font-bold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-[#697A86]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMode('new_traveler')}
            className="w-full py-3 bg-white border border-[#126B68]/20 rounded-2xl text-xs font-bold text-[#126B68] flex items-center justify-center gap-2 shadow-xs hover:bg-[#DFF4ED]/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Check-in a Different Traveler</span>
          </button>
        </div>
      )}

      {/* Security Privacy Footnote */}
      <div className="text-center text-[11px] text-[#697A86] flex items-center justify-center gap-1.5 pt-2">
        <ShieldCheck className="w-4 h-4 text-[#126B68]" />
        <span>Local client isolation · Switch or sign out anytime</span>
      </div>
    </div>
  );
};
