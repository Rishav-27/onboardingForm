import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService, Employee } from './auth-service';

type AuthState = {
    isAuthenticated: boolean;
    isAdmin: boolean;
    userId: string | null;
    full_name: string | null;
    profile_image_url: string | null;
    role: 'admin' | 'user' | null;
    isFullyAuthenticated: boolean;
    hasShownWelcome: boolean;
    login: (employee: Employee, requiresAuth?: boolean) => void;
    logout: () => void;
    handleOAuthLogin: (authUser: { id: string; email?: string; user_metadata?: { avatar_url?: string } }) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            isAdmin: false,
            full_name: null,
            profile_image_url: null,
            userId: null,
            role: null,
            isFullyAuthenticated: false,
            hasShownWelcome: false,

            login: (employee: Employee, requiresAuth = false) => {
                set({
                    isAuthenticated: true,
                    isAdmin: employee.role === 'admin',
                    userId: employee.employee_id,
                    role: employee.role,
                    full_name: employee.full_name,
                    profile_image_url: employee.profile_image_url || null,
                    isFullyAuthenticated: !requiresAuth,
                });
            },

            logout: () => {
                set({
                    isAuthenticated: false,
                    isAdmin: false,
                    userId: null,
                    role: null,
                    full_name: null,
                    profile_image_url: null,
                    isFullyAuthenticated: false,
                    hasShownWelcome: false,
                });

                // Clear all storage
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    sessionStorage.clear();
                }
            },

            handleOAuthLogin: async (authUser: { id: string; email?: string; user_metadata?: { avatar_url?: string } }) => {
                const currentState = get();

                if (currentState.isAuthenticated) {
                    return;
                }

                try {
                    if (!authUser.email) {
                        throw new Error('No email provided');
                    }
                    const result = await AuthService.linkOAuthUser(authUser.email, authUser.id);

                    if (result.success && result.employee) {
                        set({
                            isAuthenticated: true,
                            isAdmin: result.employee.role === 'admin',
                            userId: result.employee.employee_id,
                            full_name: result.employee.full_name,
                            profile_image_url: result.employee.profile_image_url || authUser.user_metadata?.avatar_url,
                            role: result.employee.role,
                            isFullyAuthenticated: true,
                        });

                        setTimeout(() => {
                            if (result.employee!.role === 'admin') {
                                window.location.href = '/onboarding';
                            } else {
                                window.location.href = '/profile';
                            }
                        }, 1000);
                    } else {
                        throw new Error(result.error || 'Failed to link account');
                    }
                } catch (error) {
                    console.error('OAuth login failed:', error);
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);