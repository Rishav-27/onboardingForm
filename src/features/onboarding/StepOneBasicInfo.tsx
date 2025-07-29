// features/onboarding/StepOneBasicInfo.jsx
'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOnboardingStore, OnboardingData } from "./useOnboardingStore";

import { Form,FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type StepProps = {
  setIsStepValid: (isValid: boolean) => void;
};

export default function StepOneBasicInfo({ setIsStepValid }: StepProps) {
  const {onboardingData, updateOnboardingData }= useOnboardingStore();

  type StepOneFormData = Pick<OnboardingData, 'fullName' | 'email' |'phoneNumber'>;

  const form = useForm<StepOneFormData>({
    defaultValues:{
        fullName: onboardingData.fullName || '',
        email: onboardingData.email || '',
        phoneNumber: onboardingData.phoneNumber || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    formState: {isValid},
    watch,

  } = form;

  const fullName = watch('fullName');
  const email = watch('email');
  const phoneNumber = watch('phoneNumber');

  useEffect(()=>{
    updateOnboardingData({
        fullName,
        email,
        phoneNumber,
    });
  },[fullName, email, phoneNumber, updateOnboardingData]);

  useEffect(()=>{
    setIsStepValid(isValid);
    },[isValid,setIsStepValid]);

  return (
    <Form {...form}>
        <form onSubmit={handleSubmit((data)=>console.log("Step 1 data saved:", data))} className="space-y-6">
            <FormField
            control ={control}
            name="fullName"
            rules={{required: 'FullName is required'}}
            render={({field})=>(
                <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Rishav Kumar"{...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />

             <FormField
               control={control}
               name="email"
               rules={{
                required: 'Email is required',
                pattern:{
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message:'Invalid email address',
                },
               }}
               render={({field})=>(
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
               )}
               />

               <FormField
                    control={control}
                    name="phoneNumber"
                    rules={{
                        required:'Phone Number is required',
                        pattern:{
                            value: /^\+?[0-9\s-()]{7,20}$/,
                            message:'Invalid phone number',
                        },
                    }}
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="+1 555 123 4567"{...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
        </form>
    </Form>
  );
}