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
    const { onboardingData, updateOnboardingData, isEditingMode } = useOnboardingStore();

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
    const date_of_joining = onboardingData.date_of_joining;

    const generateEmployeeIdStable = useCallback(() => {
        if (currentDepartment && date_of_joining) {
            try {
                const parsedDate = new Date(date_of_joining);
                if (isNaN(parsedDate.getTime())) {
                    console.warn("Invalid dateOfJoining for Employee ID generation:", date_of_joining);
                    updateOnboardingData({ employee_id: '' });
                    return;
                }

                const yearTwoDigits = format(parsedDate, 'yy');
                const prefix = departmentPrefixes[currentDepartment] || departmentPrefixes['Default'];
                const randomNum = Math.floor(1000 + Math.random() * 9000);
                const newId = `${yearTwoDigits}${prefix}${randomNum}`;

                updateOnboardingData({ employee_id: newId });
            } catch (error) {
                console.error("Error generating employee ID:", error);
                updateOnboardingData({ employee_id: '' });
            }
        } else {
            updateOnboardingData({ employee_id: '' });
        }
    }, [currentDepartment, date_of_joining, updateOnboardingData]);

    useEffect(() => {
        // Use the new isEditingMode flag to determine if an ID should be generated
        if (!isEditingMode && currentDepartment && date_of_joining && !onboardingData.employee_id) {
            generateEmployeeIdStable();
        } else if (!isEditingMode && (!currentDepartment || !date_of_joining) && onboardingData.employee_id) {
            updateOnboardingData({ employee_id: '' });
        }
    }, [currentDepartment, date_of_joining, onboardingData.employee_id, updateOnboardingData, generateEmployeeIdStable, isEditingMode]);

    useEffect(() => {
        updateOnboardingData({
            password,
            confirmPassword,
        });
    }, [password, confirmPassword, updateOnboardingData]);

    useEffect(() => {
        // The step is valid if the form is valid and an employeeId exists
        const isStepCompletelyValid = isValid && !!onboardingData.employee_id;
        setIsStepValid(isStepCompletelyValid);
    }, [isValid, onboardingData.employee_id, setIsStepValid]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit((data) => console.log('Step 3 data saved:', data))} className="space-y-6 w-1/2">
                <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                        <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground shadow-sm items-center">
                            {isEditingMode // Use the new flag here too
                                ? onboardingData.employee_id
                                : onboardingData.employee_id || (currentDepartment && date_of_joining ? 'Generating ID...' : 'Please fill in Department and Date of Joining in previous step.')
                            }
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>

                <FormField
                    control={control}
                    name="password"
                    rules={{
                        // Password is only required for new employees
                        required: !isEditingMode ? 'Password is required' : false,
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
                        // This validation handles both 'required' and 'match' logic
                        validate: (value) => {
                            const passwordValue = getValues('password');
                            // If a new password has been entered, the confirm field must match it.
                            if (passwordValue) {
                                return value === passwordValue || 'Passwords do not match.';
                            }
                            // If no new password is being set, the field is optional and considered valid.
                            return true;
                        },
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