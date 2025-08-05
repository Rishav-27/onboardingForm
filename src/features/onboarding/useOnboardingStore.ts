import { create } from 'zustand';

export interface OnboardingData {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  dateOfJoining: string;
  employeeId: string;
  password?: string;
  confirmPassword?: string;
}

export interface OnboardingStoreState {
  currentStep: number;
  onboardingData: OnboardingData;
  nextStep: () => void;
  prevStep: () => void;
  updateOnboardingData: (newData: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  setOnboardingData: (data: OnboardingData) => void;
}

const initialOnboardingData: OnboardingData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  department: '',
  role: '',
  dateOfJoining: '',
  employeeId: '',
  password: '',
  confirmPassword: '',
};

export const useOnboardingStore = create<OnboardingStoreState>((set) => ({
  currentStep: 1,
  onboardingData: initialOnboardingData,
  setOnboardingData: (data) => set({ onboardingData: data }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  updateOnboardingData: (newData) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...newData },
    })),
  resetOnboarding: () => set({ currentStep: 1, onboardingData: initialOnboardingData }),
}));