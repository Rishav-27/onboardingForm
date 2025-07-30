'use client';

import React, { JSX } from 'react';
import { useOnboardingStore } from '@/features/onboarding/useOnboardingStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProfilePage(): JSX.Element {
  const { onboardingData, resetOnboarding } = useOnboardingStore();
  const router = useRouter();

  const handleStartNewOnboarding = () => {
    resetOnboarding();
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl rounded-lg overflow-hidden">
        <CardHeader className="text-center pb-6 border-b border-gray-200">
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            Employee Profile Details
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Here are the details you provided during the onboarding process.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {onboardingData.fullName ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
                  <p><strong>Full Name:</strong> {onboardingData.fullName}</p>
                  <p><strong>Email:</strong> {onboardingData.email}</p>
                  <p><strong>Phone Number:</strong> {onboardingData.phoneNumber}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Job Details</h3>
                  <p><strong>Department:</strong> {onboardingData.department}</p>
                  <p><strong>Role:</strong> {onboardingData.role}</p>
                  <p><strong>Date of Joining:</strong> {onboardingData.dateOfJoining}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Account Information</h3>
                <p><strong>Employee ID:</strong> {onboardingData.employeeId || 'N/A'}</p>
                <p className="text-sm text-gray-500">
                  Password is set and secured.
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              No profile data available. Please complete the onboarding process.
            </p>
          )}
        </CardContent>

        <div className="px-6 py-4 flex justify-center bg-gray-50 border-t border-gray-200">
          <Button
            onClick={handleStartNewOnboarding}
            className="px-8 py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start New Onboarding
          </Button>
        </div>
      </Card>
    </div>
  );
}