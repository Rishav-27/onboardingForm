// lib/useAuthStore.ts

import { create } from 'zustand';
type AuthState = {
    isAuthenticated: boolean;
    isAdmin: boolean;
    userId: string | null;
    login: (role: 'admin' | 'user', userId: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isAdmin: false,
    userId: null,


    login: (role, userId) => {
        set({
            isAuthenticated: true,
            isAdmin: role === 'admin',
            userId,
        });
    },

    logout: () => {
        set({
            isAuthenticated: false,
            isAdmin: false,
            userId: null,
        });
    },
}));