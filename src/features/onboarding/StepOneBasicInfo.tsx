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

  type StepOneFormData = Pick<OnboardingData, 'full_name' | 'email' |'phone_number'>;

  const form = useForm<StepOneFormData>({
    defaultValues:{
        full_name: onboardingData.full_name || '',
        email: onboardingData.email || '',
        phone_number: onboardingData.phone_number || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    formState: {isValid},
    watch,

  } = form;

  const full_name = watch('full_name');
  const email = watch('email');
  const phone_number = watch('phone_number');

  useEffect(()=>{
    updateOnboardingData({
        full_name,
        email,
        phone_number,
    });
  },[full_name, email, phone_number, updateOnboardingData]);

  useEffect(()=>{
    setIsStepValid(isValid);
    },[isValid,setIsStepValid]);

  return (
    <Form {...form}>
        <form onSubmit={handleSubmit((data)=>console.log("Step 1 data saved:", data))} className="space-y-6 w-1/2">
            <FormField
            control ={control}
            name="full_name"
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
        </form>
    </Form>
  );
}