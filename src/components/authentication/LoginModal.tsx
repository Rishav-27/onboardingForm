'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Eye, EyeOff, Mail } from 'lucide-react';

import { useAuthStore } from '@/lib/useAuthStore';
import { supabase } from '@/lib/supabase-client';
import { AuthService } from '@/lib/auth-service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type LoginMethod = 'main' | 'traditional' | 'magic-link';

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const { login } = useAuthStore();
    const [loginMethod, setLoginMethod] = useState<LoginMethod>('main');
    const [isLoading, setIsLoading] = useState(false);

    // Traditional login state
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Magic link state
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleClose = () => {
        setLoginMethod('main');
        setIdentifier('');
        setPassword('');
        setEmail('');
        setEmailSent(false);
        setShowPassword(false);
        onClose();
    };

    const handleTraditionalLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!identifier || !password) {
            toast.error('Please enter both email/employee ID and password', { position: 'bottom-right' });
            return;
        }

        setIsLoading(true);
        try {
            const result = await AuthService.loginWithCredentials(identifier.trim(), password);

            if (result.success && result.employee) {
                login(result.employee, false);
                toast.success('Login successful!', { position: 'bottom-right' });
                handleClose();

                if (result.employee.role === 'admin') {
                    router.push('/onboarding');
                } else {
                    router.push('/profile');
                }
            } else {
                toast.error(result.error || 'Login failed', { position: 'bottom-right' });
            }
        } catch {
            toast.error('An unexpected error occurred', { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address', { position: 'bottom-right' });
            return;
        }

        setIsLoading(true);
        try {
            const result = await AuthService.sendMagicLink(email);

            if (result.success) {
                setEmailSent(true);
                toast.success('Magic link sent! Check your email to login.', {
                    position: 'bottom-right',
                    duration: 6000
                });
            } else {
                toast.error(result.error || 'Failed to send magic link', { position: 'bottom-right' });
            }
        } catch {
            toast.error('An unexpected error occurred', { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });

            if (error) {
                toast.error(`${provider} login failed. Please try again.`, { position: 'bottom-right' });
            }
        } catch {
            toast.error('Login failed. Please try again.', { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-gray-900">
                        Welcome Back
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Sign in to your account
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {loginMethod === 'main' && (
                        <>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => handleOAuthLogin('google')}
                                    variant="outline"
                                    className="w-full flex items-center gap-3"
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Continue with Google
                                </Button>

                                <Button
                                    onClick={() => handleOAuthLogin('github')}
                                    variant="outline"
                                    className="w-full flex items-center gap-3"
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    Continue with GitHub
                                </Button>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    onClick={() => setLoginMethod('traditional')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Email/ID + Password
                                </Button>
                                <Button
                                    onClick={() => setLoginMethod('magic-link')}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Magic Link
                                </Button>
                            </div>
                        </>
                    )}

                    {loginMethod === 'traditional' && (
                        <div className="space-y-4">
                            <Button
                                onClick={() => setLoginMethod('main')}
                                variant="ghost"
                                size="sm"
                                className="mb-2"
                            >
                                ← Back to options
                            </Button>

                            <form onSubmit={handleTraditionalLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="identifier">Email or Employee ID</Label>
                                    <Input
                                        id="identifier"
                                        type="text"
                                        placeholder="Enter email or employee ID"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}

                    {loginMethod === 'magic-link' && (
                        <div className="space-y-4">
                            <Button
                                onClick={() => setLoginMethod('main')}
                                variant="ghost"
                                size="sm"
                                className="mb-2"
                            >
                                ← Back to options
                            </Button>

                            {!emailSent ? (
                                <form onSubmit={handleMagicLink} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="magic-email">Email Address</Label>
                                        <Input
                                            id="magic-email"
                                            type="email"
                                            placeholder="Enter your work email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="mr-2 h-4 w-4" />
                                                Send Magic Link
                                            </>
                                        )}
                                    </Button>
                                </form>
                            ) : (
                                <div className="text-center space-y-4">
                                    <Mail className="w-12 h-12 text-green-600 mx-auto" />
                                    <div>
                                        <h3 className="font-semibold">Check your email</h3>
                                        <p className="text-sm text-gray-600">
                                            Magic link sent to <strong>{email}</strong>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}