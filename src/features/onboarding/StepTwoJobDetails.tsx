'use client';

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOnboardingStore, OnboardingData } from "./useOnboardingStore";

type StepProps = {
    setIsStepValid: (isValid: boolean) => void;
};

const departments = [
    "Human Resources",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
];

const roles = [
    "Software Engineer",
    "Project Manager",
    "HR Specialist",
    "Marketing Coordinator",
    "Sales Representative",
    "Financial Analyst",
];

export default function StepTwoJobDetails({ setIsStepValid }: StepProps) {
    // Use the new isEditingMode flag from the store
    const { onboardingData, updateOnboardingData, isEditingMode } = useOnboardingStore();

    type StepTwoFormData = Pick<
        OnboardingData,
        "department" | "role" | "dateOfJoining"
    >;

    const form = useForm<StepTwoFormData>({
        defaultValues: {
            department: onboardingData.department || "",
            role: onboardingData.role || "",
            dateOfJoining: onboardingData.dateOfJoining || "",
        },
        mode: "onChange",
    });

    const {
        handleSubmit,
        control,
        formState: { isValid },
        watch,
    } = form;

    const department = watch("department");
    const role = watch("role");
    const dateOfJoining = watch("dateOfJoining");

    useEffect(() => {
        updateOnboardingData({
            department,
            role,
            dateOfJoining,
        });
    }, [department, role, dateOfJoining, updateOnboardingData]);

    useEffect(() => {
        setIsStepValid(isValid);
    }, [isValid, setIsStepValid]);

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit((data) =>
                    console.log("Step 2 data saved:", data)
                )}
                className="w-1/2 space-y-6"
            >
                <FormField
                    control={control}
                    name="department"
                    rules={{ required: "Department is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditingMode}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a department " />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="role"
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map((r) => (
                                        <SelectItem key={r} value={r}>
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="dateOfJoining"
                    rules={{ required: "Date of Joining is required" }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of Joining</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(new Date(field.value), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => {
                                            field.onChange(
                                                date ? date.toISOString().split("T")[0] : ""
                                            );
                                        }}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}