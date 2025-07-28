import { create } from 'zustand';

const initialOnboardingData ={
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

export const useOnboardingStore = create ((set)=>({
    currentStep: 1,

    onboardingData: initialOnboardingData,

    nextStep: () => set((state)=>({ currentStep: state.currentStep +1})),
    prevStep: () => set((state) => ({currentStep: state.currentStep-1})),

    updateOnboardingData: (newData) =>
        set((state) => ({
            onboardingData: {...state.onboardingData, ...newData},
        })),

    resetOnboarding: () => set({ currentStep:1, onboardingData: initialOnboardingData}),

}));