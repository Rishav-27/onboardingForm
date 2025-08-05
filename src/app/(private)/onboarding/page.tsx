// app/(private)/onboarding/page.jsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/useAuthStore';
import OnboardingForm from '@/features/onboarding/OnboardingForm';

export default function OnboardingPage() {
  
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();

  useEffect(()=>{
    if(!isAuthenticated || !isAdmin){
      router.push('/');
    }
  },[isAuthenticated,isAdmin,router]);

  if (!isAuthenticated || !isAdmin){
    return <div>Access Denied. Redirecting....</div>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <OnboardingForm />
    </main>
  );
}