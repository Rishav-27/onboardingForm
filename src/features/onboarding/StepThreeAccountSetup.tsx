// features/onboarding/StepThreeAccountSetup.jsx
'use client';

// Define the type for the props expected by this component
type StepProps = {
  setIsStepValid: (isValid: boolean) => void;
};

export default function StepThreeAccountSetup({ setIsStepValid }: StepProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-center">Step 3: Account Setup</h3>
      <p className="text-gray-600 text-center">Form fields for Employee ID, Password, Confirm Password will go here.</p>
    </div>
  );
}