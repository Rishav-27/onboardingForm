'use client';

import { useState, useEffect } from "react";
import { useOnboardingStore } from "@/features/onboarding/useOnboardingStore";
import { useRouter } from "next/navigation";
import StepOneBasicInfo from "./StepOneBasicInfo";
import StepTwoJobDetails from "./StepTwoJobDetails";
import StepThreeAccountSetup from "./StepThreeAccountSetup";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function OnboardingForm() {
    const { currentStep, nextStep, prevStep, onboardingData, isEditingMode, resetOnboarding } = useOnboardingStore();
    const [isStepValid, setIsStepValid] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsStepValid(false);
    }, [currentStep]);

    // Use a single handler for navigation that accounts for both editing and new onboarding
    const handleNext = () => {
        if (isStepValid) {
            if (currentStep < 3) {
                nextStep();
            } else {
                handleSubmitAll();
            }
        } else {
            toast.error(`Please complete Step ${currentStep} to proceed.`, {
                position: "bottom-right",
            });
        }
    };

    const handlePrev = () => {
        prevStep();
    };

    const handleSubmitAll = async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...onboardingDataToSend } = onboardingData;
        
        try {
            const method = isEditingMode ? "PUT" : "POST";
            const apiEndpoint = "/api/employees"; // The API endpoint will handle the PUT or POST logic

            const response = await fetch(apiEndpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(onboardingDataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error ||
                    `Failed to ${isEditingMode ? "update" : "add"} employee.`
                );
            }

            const result = await response.json();
            console.log(
                `Employee ${isEditingMode ? "updated" : "added"} successfully:`,
                result.employee
            );

            if (isEditingMode) {
                toast.success("Employee updated successfully! Redirecting...", {
                    position: "bottom-right",
                });
            } else {
                toast.success(
                    `✅ Employee created successfully!\n🔐 They can now login with:\n• Employee ID + Password\n• Google OAuth (${onboardingData.email})\n• GitHub OAuth (${onboardingData.email})`,
                    {
                        position: "bottom-right",
                        duration: 6000,
                    }
                );
            }

            // Reset the store and redirect to the correct page
            resetOnboarding();
            router.push(isEditingMode ? "/profile" : "/employees");

        } catch (error: unknown) {
            const err = error as Error;
            console.error(`Error submitting data:`, err);
            toast.error(`Error: ${err.message || "Could not complete the action."}`, {
                position: "bottom-right",
            });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepOneBasicInfo setIsStepValid={setIsStepValid} />;
            case 2:
                return <StepTwoJobDetails setIsStepValid={setIsStepValid} />;
            case 3:
                return <StepThreeAccountSetup setIsStepValid={setIsStepValid} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    const pageTitle = isEditingMode
        ? "Edit Employee Details"
        : "New Employee Onboarding";
    const submitButtonText = isEditingMode ? "Save Changes" : "Submit All";

    return (
        <div className="w-full max-w-5xl mx-auto p-10 border rounded-lg shadow-lg bg-white relative">
            {currentStep > 1 && (
                <button
                    onClick={handlePrev}
                    className="absolute top-4 left-4 flex items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" /> Back
                </button>
            )}

            <h2 className="text-2xl font-bold mb-6 text-center mt-8">
                {pageTitle} ({currentStep} of 3)
            </h2>
            <div className="flex justify-between mb-8">
                <div
                    className={`flex-1 text-center py-2 ${
                        currentStep >= 1
                            ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                            : "text-gray-400"
                    }`}
                >
                    Step 1: Basic Info
                </div>
                <div
                    className={`flex-1 text-center py-2 ${
                        currentStep >= 2
                            ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                            : "text-gray-400"
                    }`}
                >
                    Step 2: Job Details
                </div>
                <div
                    className={`flex-1 text-center py-2 ${
                        currentStep >= 3
                            ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                            : "text-gray-400"
                    }`}
                >
                    Step 3: Account Setup
                </div>
            </div>

            <div className="mb-8 min-h-[200px] w-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="absolute w-full flex justify-center"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-between mt-8">
                {currentStep < 3 ? (
                    <button
                        onClick={handleNext}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md ml-auto transition-colors ${
                            isStepValid
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                        disabled={!isStepValid}
                    >
                        Next <ArrowRight className="h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmitAll}
                        disabled={!isStepValid}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md ml-auto transition-colors ${
                            isStepValid
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                    >
                        {submitButtonText} <ArrowRight className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Toaster />
        </div>
    );
}