import { create } from "zustand";

export interface OnboardingData {
  full_name: string;
  email: string;
  phone_number: string;
  department: string;
  role: string;
  date_of_joining: string;
  employee_id: string;
  password?: string;
  confirmPassword?: string;
  profile_image_url?: string | null;
}

export interface OnboardingStoreState {
  currentStep: number;
  onboardingData: OnboardingData;
  isEditingMode: boolean; 
  nextStep: () => void;
  prevStep: () => void;
  updateOnboardingData: (newData: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  setOnboardingData: (data: OnboardingData) => void;
  setEditingMode: (isEditing: boolean) => void; 
}

const initialOnboardingData: OnboardingData = {
  full_name: "",
  email: "",
  phone_number: "",
  department: "",
  role: "",
  date_of_joining: "",
  employee_id: "",
  password: "",
  confirmPassword: "",
};

export const useOnboardingStore = create<OnboardingStoreState>((set) => ({
  currentStep: 1,
  onboardingData: initialOnboardingData,
  isEditingMode: false,
  setOnboardingData: (data) => set({ onboardingData: data }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
  updateOnboardingData: (newData) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, ...newData },
    })),
  resetOnboarding: () =>
    set({ currentStep: 1, onboardingData: initialOnboardingData }),
  setEditingMode: (isEditing) => set({ isEditingMode: isEditing }), 
}));
