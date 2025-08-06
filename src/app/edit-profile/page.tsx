'use client';

import OnboardingForm from '@/features/onboarding/OnboardingForm';
import { useAuthStore } from '@/lib/useAuthStore';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditProfilePage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return (
        <div className="container mx-auto p-8">
            <OnboardingForm />
        </div>
    );
}