// app/(private)/onboarding/page.jsx
import OnboardingForm from '@/features/onboarding/OnboardingForm';

export default function OnboardingPage() { // This must be a React component
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <OnboardingForm />
    </main>
  );
}