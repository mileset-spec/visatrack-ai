import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Calendar,
  Globe2,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { VisaApplication } from '../../types';
import { DESTINATION_OPTIONS, VISA_CATEGORIES, generateDefaultChecklist } from '../../data/defaultData';

interface ApplicationWizardProps {
  onComplete: (newApp: VisaApplication) => void;
  onCancel: () => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [destination, setDestination] = useState<string>('United Kingdom');
  const [destinationCity, setDestinationCity] = useState<string>('London');
  const [visaCategory, setVisaCategory] = useState<any>('Visitor or tourism');
  const [passportNationality, setPassportNationality] = useState<string>('Nigerian');
  const [countryOfResidence, setCountryOfResidence] = useState<string>('Nigeria');
  const [purposeOfTravel, setPurposeOfTravel] = useState<string>('Holiday, tourism, and visiting friends/family');
  const [intendedDepartureDate, setIntendedDepartureDate] = useState<string>('2026-11-20');
  const [intendedReturnDate, setIntendedReturnDate] = useState<string>('2026-12-05');
  const [lengthOfStay, setLengthOfStay] = useState<string>('15 Days');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!destination) newErrors.destination = 'Please select a destination.';
    }

    if (step === 2) {
      if (!visaCategory) newErrors.visaCategory = 'Please select a visa category.';
    }

    if (step === 3) {
      if (!passportNationality.trim()) newErrors.passportNationality = 'Passport nationality is required.';
      if (!countryOfResidence.trim()) newErrors.countryOfResidence = 'Country of residence is required.';
      if (!purposeOfTravel.trim() || purposeOfTravel.length < 5) {
        newErrors.purposeOfTravel = 'Please provide a clear purpose of travel (at least 5 characters).';
      }
      if (!intendedDepartureDate) newErrors.intendedDepartureDate = 'Departure date is required.';
      if (!intendedReturnDate) newErrors.intendedReturnDate = 'Return date is required.';
      if (intendedDepartureDate && intendedReturnDate && intendedDepartureDate > intendedReturnDate) {
        newErrors.intendedReturnDate = 'Return date must be after departure date.';
      }
      if (!lengthOfStay.trim()) newErrors.lengthOfStay = 'Please specify duration of stay.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    const selectedDest = DESTINATION_OPTIONS.find((d) => d.id === destination) || DESTINATION_OPTIONS[0];

    const checklist = generateDefaultChecklist(destination, visaCategory);

    const newApplication: VisaApplication = {
      id: `app-${destination.toLowerCase().slice(0, 2)}-${Date.now()}`,
      destination: destination as any,
      destinationFlag: selectedDest.flag,
      destinationCity: destinationCity || 'Capital/Central',
      visaCategory,
      passportNationality,
      countryOfResidence,
      purposeOfTravel,
      intendedDepartureDate,
      intendedReturnDate,
      lengthOfStay,
      currentStage: 'application_created',
      stageTimestamps: {
        application_created: new Date().toISOString(),
      },
      stageNotes: {
        application_created: 'Application wizard completed. Interactive checklist generated.',
      },
      notes: `Targeting travel on ${intendedDepartureDate} for ${lengthOfStay}.`,
      checklist,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onComplete(newApplication);
  };

  const selectedDestDetails = DESTINATION_OPTIONS.find((d) => d.id === destination);

  return (
    <div className="flex-1 p-4 pb-20 space-y-5 animate-fade-in">
      {/* Wizard Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#126B68]/10">
        <div>
          <span className="text-[11px] font-bold text-[#126B68] uppercase tracking-wider">
            Step {currentStep} of 4
          </span>
          <h2 className="text-lg font-extrabold text-[#172B3A]">
            {currentStep === 1 && 'Select Destination'}
            {currentStep === 2 && 'Visa Category'}
            {currentStep === 3 && 'Travel & Applicant Details'}
            {currentStep === 4 && 'Review & Generate Checklist'}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-[#697A86] hover:text-[#172B3A] p-1.5"
        >
          Cancel
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step <= currentStep ? 'bg-[#126B68]' : 'bg-[#E5F1FA]'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: DESTINATION */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <p className="text-xs text-[#697A86]">
            Select the country or territory you are preparing to visit. Requirements and checklists will adapt automatically.
          </p>

          <div className="space-y-2.5">
            {DESTINATION_OPTIONS.map((dest) => {
              const isSelected = destination === dest.id;
              return (
                <div
                  key={dest.id}
                  onClick={() => {
                    setDestination(dest.id);
                    setDestinationCity(dest.popularCities[0]);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#126B68] bg-[#DFF4ED]/20 shadow-xs'
                      : 'border-[#126B68]/10 bg-white hover:border-[#126B68]/30'
                  }`}
                >
                  <span className="text-3xl shrink-0 mt-0.5">{dest.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#172B3A]">{dest.name}</h3>
                      <span className="text-[10px] font-bold text-[#126B68] bg-[#DFF4ED] px-2 py-0.5 rounded-full">
                        {dest.avgProcessingWeeks}
                      </span>
                    </div>
                    <p className="text-xs text-[#697A86] mt-0.5">{dest.badge}</p>
                    <div className="text-[11px] text-[#126B68] font-medium mt-1">
                      Embassy: {dest.embassyLiaison}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                      isSelected ? 'border-[#126B68] bg-[#126B68] text-white' : 'border-[#697A86]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {errors.destination && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.destination}
            </p>
          )}

          {/* Destination city selection */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#126B68]/10 space-y-2">
            <label className="block text-xs font-bold text-[#172B3A]">
              Primary City / Region of Arrival:
            </label>
            <input
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              placeholder="e.g. London, Toronto, Paris"
              className="w-full h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
            />
          </div>
        </div>
      )}

      {/* STEP 2: VISA CATEGORY */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-[#697A86]">
            Select your travel purpose. This determines specific financial sufficiency thresholds and employment proof requirements.
          </p>

          <div className="space-y-2.5">
            {VISA_CATEGORIES.map((cat) => {
              const isSelected = visaCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setVisaCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#126B68] bg-[#DFF4ED]/20 shadow-xs'
                      : 'border-[#126B68]/10 bg-white hover:border-[#126B68]/30'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-[#172B3A]">{cat.title}</h3>
                    <p className="text-[11px] text-[#697A86] mt-0.5">{cat.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#126B68] bg-[#126B68] text-white' : 'border-[#697A86]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#E5F1FA] p-3 rounded-xl border border-[#126B68]/10 text-xs text-[#172B3A] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#126B68] shrink-0 mt-0.5" />
            <span>
              <strong>Note for Nigerian applicants:</strong> Visitor visas require clear proof that you have legitimate reasons to return to Nigeria (family ties, job, business registration).
            </span>
          </div>
        </div>
      )}

      {/* STEP 3: TRAVELER & TRIP DETAILS */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-[#697A86]">
            Enter your passport nationality, country of residence, and proposed schedule.
          </p>

          <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#126B68]/15 shadow-xs">
            {/* Nationality */}
            <div>
              <label className="block text-xs font-bold text-[#172B3A] mb-1">
                Passport Nationality
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={passportNationality}
                  onChange={(e) => setPassportNationality(e.target.value)}
                  placeholder="e.g. Nigerian"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
                <span className="absolute right-3.5 top-3 text-sm">🇳🇬</span>
              </div>
              {errors.passportNationality && (
                <p className="text-[11px] text-red-600 mt-1">{errors.passportNationality}</p>
              )}
            </div>

            {/* Country of Residence */}
            <div>
              <label className="block text-xs font-bold text-[#172B3A] mb-1">
                Country of Residence
              </label>
              <input
                type="text"
                value={countryOfResidence}
                onChange={(e) => setCountryOfResidence(e.target.value)}
                placeholder="e.g. Nigeria"
                className="w-full h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
              />
              {errors.countryOfResidence && (
                <p className="text-[11px] text-red-600 mt-1">{errors.countryOfResidence}</p>
              )}
            </div>

            {/* Purpose of Travel */}
            <div>
              <label className="block text-xs font-bold text-[#172B3A] mb-1">
                Specific Purpose of Travel
              </label>
              <textarea
                value={purposeOfTravel}
                onChange={(e) => setPurposeOfTravel(e.target.value)}
                rows={2}
                placeholder="e.g. Attending professional tech conference and sightseeing in London for two weeks"
                className="w-full p-3 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
              />
              {errors.purposeOfTravel && (
                <p className="text-[11px] text-red-600 mt-1">{errors.purposeOfTravel}</p>
              )}
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-[#172B3A] mb-1">
                  Intended Departure
                </label>
                <input
                  type="date"
                  value={intendedDepartureDate}
                  onChange={(e) => setIntendedDepartureDate(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172B3A] mb-1">
                  Intended Return
                </label>
                <input
                  type="date"
                  value={intendedReturnDate}
                  onChange={(e) => setIntendedReturnDate(e.target.value)}
                  className="w-full h-11 px-2.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
                />
              </div>
            </div>

            {/* Length of Stay */}
            <div>
              <label className="block text-xs font-bold text-[#172B3A] mb-1">
                Length of Stay
              </label>
              <input
                type="text"
                value={lengthOfStay}
                onChange={(e) => setLengthOfStay(e.target.value)}
                placeholder="e.g. 15 Days, 1 Month"
                className="w-full h-11 px-3.5 rounded-xl border border-[#126B68]/20 bg-[#F8FAF8] text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#126B68]"
              />
              {errors.lengthOfStay && (
                <p className="text-[11px] text-red-600 mt-1">{errors.lengthOfStay}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONFIRM */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="bg-[#DFF4ED]/40 p-3.5 rounded-2xl border border-[#126B68]/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#126B68] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-[#126B68]">
                Customized Checklist Ready for Creation
              </h3>
              <p className="text-[11px] text-[#172B3A] mt-0.5">
                We have generated an initial verified checklist tailored to your destination and applicant profile.
              </p>
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-white rounded-2xl p-4 border border-[#126B68]/15 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <span className="text-3xl">{selectedDestDetails?.flag}</span>
              <div>
                <h4 className="text-sm font-bold text-[#172B3A]">{destination}</h4>
                <p className="text-xs text-[#697A86]">{visaCategory} · {lengthOfStay}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-[#697A86]">Applicant Nationality:</span>
                <p className="font-semibold text-[#172B3A]">{passportNationality}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#697A86]">Country of Residence:</span>
                <p className="font-semibold text-[#172B3A]">{countryOfResidence}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#697A86]">Departure:</span>
                <p className="font-semibold text-[#172B3A]">{intendedDepartureDate}</p>
              </div>
              <div>
                <span className="text-[11px] text-[#697A86]">Return:</span>
                <p className="font-semibold text-[#172B3A]">{intendedReturnDate}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-[#697A86]">Purpose:</span>
              <p className="font-medium text-[#172B3A] mt-0.5">{purposeOfTravel}</p>
            </div>
          </div>

          <div className="bg-[#F8FAF8] p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Sample Checklist Notice:</strong> The generated checklist reflects general consular requirements for Nigerian travelers and must be cross-checked against the official embassy portal prior to fee payment.
            </span>
          </div>
        </div>
      )}

      {/* Navigation CTA Buttons */}
      <div className="pt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 h-12 rounded-2xl border border-[#126B68]/20 bg-white text-xs font-bold text-[#172B3A] flex items-center justify-center gap-1.5 hover:bg-[#DFF4ED]/30 active:scale-98 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="flex-2 h-12 rounded-2xl bg-[#126B68] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-[#0D4E4C] active:scale-98 transition-all"
        >
          <span>{currentStep === 4 ? 'Create Application & Checklist' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
