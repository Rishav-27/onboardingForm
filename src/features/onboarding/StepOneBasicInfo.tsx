// features/onboarding/StepOneBasicInfo.jsx
'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useOnboardingStore, OnboardingData } from "./useOnboardingStore";

import { Form,FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';

export default function StepOneBasicInfo() {
  const { onboardingData, updateOnboardingData, nextStep } = useOnboardingStore();

  type StepOneFormData = Pick<OnboardingData, 'full_name' | 'email' | 'phone_number'>;

  const form = useForm<StepOneFormData>({
    defaultValues: {
      full_name: onboardingData.full_name || '',
      email: onboardingData.email || '',
      phone_number: onboardingData.phone_number || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = form;

  // Handles form submission, saves data to the store, and moves to the next step.
  const onSubmit = (data: StepOneFormData) => {
    updateOnboardingData(data);
    nextStep();
  };

  // If you need to trigger an action based on form validity, this is how you would do it.
  // The `setIsStepValid` prop is no longer needed with the onSubmit approach,
  // but if you have a back button that needs to be conditionally enabled,
  // you can use `isValid` from the formState.
  useEffect(() => {
    // This part is for your reference if you need to use isValid.
    // For a multi-step form, the submit button handles validity.
  }, [isValid]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-1/2">
        <FormField
          control={control}
          name="full_name"
          rules={{ required: 'Full Name is required' }}
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
                <Input type="email" placeholder="abc@example.com" {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phone_number"
          rules={{
            required:'Phone Number is required',
            pattern:{
              value: /^(?:\+91[-\s]?|0)?[6-9]\d{9}$/ ,
              message:'Invalid phone number',
            },
          }}
          render={({field})=>(
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+91 98765 12345"{...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        
        <Button type="submit">Next</Button>

      </form>
    </Form>
  );
}