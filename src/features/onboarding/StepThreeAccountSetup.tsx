'use client';

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { format } from 'date-fns';
import { useOnboardingStore, OnboardingData } from "./useOnboardingStore";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type StepProps = {
    setIsStepValid: (isValid: boolean) => void;
};

const departmentPrefixes: { [key: string]: string } = {
    'Human Resources': 'HR',
    'Engineering': 'ENG',
    'Marketing': 'MKT',
    'Sales': 'SAL',
    'Finance': 'FIN',
    'Operations': 'OPS',
    'Default': 'GEN',
};

export default function StepThreeAccountSetup({ setIsStepValid }: StepProps) {
    const { onboardingData, updateOnboardingData } = useOnboardingStore();
    // This is the key change: determine if we are editing or creating a new employee
    const isEditing = !!onboardingData.employeeId;

    type StepThreeFormData = Pick<OnboardingData, 'password' | 'confirmPassword'>;

    const form = useForm<StepThreeFormData>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
        getValues,
    } = form;

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    const currentDepartment = onboardingData.department;
    const dateOfJoining = onboardingData.dateOfJoining;

    const generateEmployeeIdStable = useCallback(() => {
        if (currentDepartment && dateOfJoining) {
            try {
                const parsedDate = new Date(dateOfJoining);
                if (isNaN(parsedDate.getTime())) {
                    console.warn("Invalid dateOfJoining for Employee ID generation:", dateOfJoining);
                    updateOnboardingData({ employeeId: '' });
                    return;
                }

                const yearTwoDigits = format(parsedDate, 'yy');
                const prefix = departmentPrefixes[currentDepartment] || departmentPrefixes['Default'];
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const newId = `${yearTwoDigits}${prefix}${randomNum}`;

                updateOnboardingData({ employeeId: newId });
            } catch (error) {
                console.error("Error generating employee ID:", error);
                updateOnboardingData({ employeeId: '' });
            }
        } else {
            updateOnboardingData({ employeeId: '' });
        }
    }, [currentDepartment, dateOfJoining, updateOnboardingData]);

    useEffect(() => {
        // The fix is here: only generate an ID if we are NOT in editing mode.
        // This ensures the ID remains unchanged when an existing employee's data is modified.
        if (!isEditing && currentDepartment && dateOfJoining && !onboardingData.employeeId) {
            generateEmployeeIdStable();
        } else if (!isEditing && (!currentDepartment || !dateOfJoining) && onboardingData.employeeId) {
            updateOnboardingData({ employeeId: '' });
        }
    }, [currentDepartment, dateOfJoining, onboardingData.employeeId, updateOnboardingData, generateEmployeeIdStable, isEditing]);

    useEffect(() => {
        updateOnboardingData({
            password,
            confirmPassword,
        });
    }, [password, confirmPassword, updateOnboardingData]);

    useEffect(() => {
        // The step is valid if the form is valid and an employeeId exists
        const isStepCompletelyValid = isValid && !!onboardingData.employeeId;
        setIsStepValid(isStepCompletelyValid);
    }, [isValid, onboardingData.employeeId, setIsStepValid]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit((data) => console.log('Step 3 data saved:', data))} className="space-y-6 w-1/2">
                <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                        <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground shadow-sm items-center">
                            {/* Display the employee ID differently based on whether we are editing */}
                            {isEditing 
                                ? onboardingData.employeeId 
                                : onboardingData.employeeId || (currentDepartment && dateOfJoining ? 'Generating ID...' : 'Please fill in Department and Date of Joining in previous step.')
                            }
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>

                <FormField
                    control={control}
                    name="password"
                    rules={{
                        // No password validation if editing, because the user might not be changing it
                        required: !isEditing ? 'Password is required' : false,
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters.',
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: 'Password must include uppercase, lowercase, number, and special character.',
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="confirmPassword"
                    rules={{
                        // No confirm password validation if editing and no new password is entered
                        required: !isEditing ? 'Confirm Password is required' : false,
                        validate: (value) =>
                            value === getValues('password') || 'Passwords do not match.',
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}