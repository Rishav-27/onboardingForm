// features/onboarding/StepTwoJobDetails.jsx
'use client';

// Define the type for the props expected by this component
type StepProps = {
  setIsStepValid: (isValid: boolean) => void;
};

export default function StepTwoJobDetails({ setIsStepValid }: StepProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-center">Step 2: Job Details</h3>
      <p className="text-gray-600 text-center">Form fields for Department, Role, Date of Joining will go here.</p>
    </div>
  );
}