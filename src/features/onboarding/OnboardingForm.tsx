// features/onboarding/OnboardingForm.jsx
'use client';

import { useState } from 'react';
import { useOnboardingStore } from './useOnboardingStore';
import StepOneBasicInfo from './StepOneBasicInfo';
import StepTwoJobDetails from './StepTwoJobDetails';
import StepThreeAccountSetup from './StepThreeAccountSetup';
import { Toaster, toast } from 'react-hot-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react'; // ArrowRight imported

export default function OnboardingForm() {
  const { currentStep, nextStep, prevStep, onboardingData, resetOnboarding } =
    useOnboardingStore();
  const [isStepValid, setIsStepValid] = useState(true);

  const handleNext = () => {
    if (isStepValid) {
      nextStep();
    } else {
      toast.error(
        `Please fix errors in Step ${currentStep} before proceeding.`
      );
      console.log(`Validation failed for Step ${currentStep}`);
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSubmitAll = () => {
    console.log("Final Onboarding Data:", onboardingData);
    toast.success("Employee Onboarding Complete! Data logged to console.");
    resetOnboarding();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOneBasicInfo setIsStepValid={setIsStepValid} />;
      case 2: // <--- CORRECTED THIS LINE
        return <StepTwoJobDetails setIsStepValid={setIsStepValid} />;
      case 3: // <--- CORRECTED THIS LINE
        return <StepThreeAccountSetup setIsStepValid={setIsStepValid} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">
        New Employee Onboarding ({currentStep} of 3)
      </h2>
      <div className="flex justify-between mb-8">
        <div
          className={`flex-1 text-center py-2 ${
            currentStep >= 1
              ? "border-b-2 border-blue-500 font-semibold text-blue-600"
              : "text-gray-400"
          }`}
        >
          Step 1: Basic Info
        </div>
        <div
          className={`flex-1 text-center py-2 ${
            currentStep >= 2
              ? "border-b-2 border-blue-500 font-semibold text-blue-600"
              : "text-gray-400"
          }`}
        >
          Step 2: Job Details
        </div>
        <div
          className={`flex-1 text-center py-2 ${
            currentStep >= 3
              ? "border-b-2 border-blue-500 font-semibold text-blue-600"
              : "text-gray-400"
          }`}
        >
          Step 3: Account Setup
        </div>
      </div>

      <div className="mb-8 min-h-[200px] flex items-center justify-center">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-6 py-2 rounded-md ml-auto transition-colors ${ // Added flex and gap for icon
              isStepValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!isStepValid}
          >
            Next <ArrowRight className="h-4 w-4" /> {/* Added ArrowRight icon */}
          </button>
        ) : (
          <button
            onClick={handleSubmitAll}
            className="flex items-center gap-2 px-6 py-2 rounded-md ml-auto bg-green-600 text-white hover:bg-green-700 transition-colors" // Added flex and gap for icon
          >
            Submit All <ArrowRight className="h-4 w-4" /> {/* Added ArrowRight icon */}
          </button>
        )}
      </div>
      <Toaster />
    </div>
  );
}