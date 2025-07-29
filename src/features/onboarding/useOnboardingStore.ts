// features/onboarding/useOnboardingStore.ts
import { create } from 'zustand';

/**
 * Defines the interface for the raw onboarding data collected across all steps.
 */
export interface OnboardingData {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  dateOfJoining: string; // Storing as string initially, will handle date picker later
  employeeId: string;
  password: string;
  confirmPassword: string;
}

/**
 * Defines the interface for the entire Zustand store's state,
 * including both data and actions.
 */
export interface OnboardingStoreState {
  currentStep: number;
  onboardingData: OnboardingData;
  nextStep: () => void;
  prevStep: () => void;
  updateOnboardingData: (newData: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

// Initial state for the onboarding data
const initialOnboardingData: OnboardingData = {
  // Step 1: Basic Information
  fullName: '',
  email: '',
  phoneNumber: '',

  // Step 2: Job Details
  department: '',
  role: '',
  dateOfJoining: '',

  // Step 3: Account Setup
  employeeId: '',
  password: '',
  confirmPassword: '',
};

/**
 * Zustand store for managing the multi-step onboarding form state.
 * It holds the current step, collected form data, and actions to manipulate them.
 */
export const useOnboardingStore = create<OnboardingStoreState>((set) => ({
  // Initial state values
  currentStep: 1,
  onboardingData: initialOnboardingData,

  // Action to move to the next step
  nextStep: () => set((state: OnboardingStoreState) => ({ currentStep: state.currentStep + 1 })),

  // Action to move to the previous step
  prevStep: () => set((state: OnboardingStoreState) => ({ currentStep: state.currentStep - 1 })),

  // Action to update specific fields in the onboarding data
  updateOnboardingData: (newData) =>
    set((state: OnboardingStoreState) => ({
      onboardingData: { ...state.onboardingData, ...newData },
    })),

  // Action to reset the entire onboarding process
  resetOnboarding: () => set({ currentStep: 1, onboardingData: initialOnboardingData }),
}));