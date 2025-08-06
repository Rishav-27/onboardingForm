'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

import { useAuthStore } from '@/lib/useAuthStore';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

type LoginFormInputs = {
    userId: string;
    password: string;
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormInputs>({
        defaultValues: {
            userId: '',
            password: '',
        },
    });

    const handleClose = () => {
        form.reset();
        setSelectedRole(null);
        onClose();
    };

    const onSubmit = async (data: LoginFormInputs) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeId: data.userId, password: data.password }),
            });

            const result = await response.json();

            if (response.ok) {
                const userRoleFromApi = result.user.role;
                if (selectedRole === 'admin') {
                    if (userRoleFromApi !== 'admin') {
                        toast.error(`You are a ${userRoleFromApi}, not an admin. Please select 'User Login'.`);
                        return;
                    }
                } else {
                    if (userRoleFromApi === 'admin') {
                        toast.error(`You are an admin, not a user. Please select 'Admin Login'.`);
                        return;
                    }
                }

                login(userRoleFromApi, result.user.id, {
                    full_name: result.user.full_name,
                    profile_image_url: result.user.profile_image_url
                });
                toast.success('Login successful!');

                handleClose();
                if (userRoleFromApi === 'admin') {
                    router.push('/onboarding');
                } else {
                    router.push('/profile');
                }
            } else {
                toast.error(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="relative flex flex-row items-center gap-2 pr-6"> {/* Updated classes here */}
                    {selectedRole && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRole(null)}
                            className="p-2" // Simplified button styling
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <DialogTitle>
                        {selectedRole ? `${selectedRole} Login` : 'Select Your Login Type'}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="px-6">
                    {selectedRole ? 'Enter your credentials to log in.' : 'Choose your role to proceed.'}
                </DialogDescription>
                {!selectedRole ? (
                    <div className="grid gap-4 px-6 pb-6">
                        <Button onClick={() => setSelectedRole('admin')} className="w-full">
                            Admin Login
                        </Button>
                        <Button onClick={() => setSelectedRole('user')} className="w-full" variant="secondary">
                            User Login
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6">
                            <FormField
                                control={form.control}
                                name="userId"
                                rules={{ required: "User ID is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User ID</FormLabel>
                                        <FormControl><Input {...field} disabled={isLoading} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                rules={{ required: "Password is required" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl><Input type="password" {...field} disabled={isLoading} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}