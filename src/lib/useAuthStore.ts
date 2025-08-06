import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
    isAuthenticated: boolean;
    isAdmin: boolean;
    userId: string | null;
    full_name: string | null;
    profile_image_url: string | null;
    role: 'admin' | 'user' | null;
    login: (role: 'admin' | 'user', userId: string, userData?: { full_name?: string; profile_image_url?: string }) => void;
    logout: () => void;
    updateUserData: (userData: { full_name?: string; profile_image_url?: string }) => void;
    fetchUserData: (userId: string) => Promise<void>;
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

            login: (role, userId, userData) => {
                set({
                    isAuthenticated: true,
                    isAdmin: role === 'admin',
                    userId,
                    role,
                    full_name: userData?.full_name || null,
                    profile_image_url: userData?.profile_image_url || null,
                });

                // If userData is not provided, fetch it
                if (!userData?.full_name) {
                    get().fetchUserData(userId);
                }
            },

            logout: () => {
                set({
                    isAuthenticated: false,
                    isAdmin: false,
                    userId: null,
                    role: null,
                    full_name: null,
                    profile_image_url: null,
                });
            },

            updateUserData: (userData) => {
                set((state) => ({
                    ...state,
                    full_name: userData.full_name ?? state.full_name,
                    profile_image_url: userData.profile_image_url ?? state.profile_image_url,
                }));
            },

            fetchUserData: async (userId) => {
                try {
                    const response = await fetch(`/api/profile?id=${userId}`);
                    if (response.ok) {
                        const userData = await response.json();
                        set((state) => ({
                            ...state,
                            full_name: userData.full_name,
                            profile_image_url: userData.profile_image_url,
                        }));
                    }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);