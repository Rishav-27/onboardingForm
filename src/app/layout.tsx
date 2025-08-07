'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/common/Header";
import { useState, useEffect } from 'react';
import { LoginModal } from '@/components/authentication/LoginModal';
import { supabase } from '@/lib/supabase-client';
import { useAuthStore } from '@/lib/useAuthStore';
import toast from 'react-hot-toast';

// Remove the metadata export from the client component
// export const metadata = {
//   title: "Your App Title",
//   description: "Your App Description",
// };

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { handleOAuthLogin, logout, isAuthenticated } = useAuthStore();

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // If no session but user thinks they're authenticated, clear auth state
      if (!session && isAuthenticated) {
        console.log('No session found, clearing auth state');
        logout();
      }
    };

    checkSession();
  }, [logout, isAuthenticated]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await handleOAuthLogin(session.user);
            toast.success('Login successful!', { position: 'bottom-right' });
          } catch (error) {
            console.error('OAuth linking error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to link account.', { position: 'bottom-right' });
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear auth state when user signs out
          const { logout } = useAuthStore.getState();
          logout();
          console.log('User signed out, clearing auth state');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleOAuthLogin]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header onLoginClick={() => setIsModalOpen(true)} />
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#9ca3af" strokeWidth="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {children}
        <Toaster position="bottom-right" />
        <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </body>
    </html>
  );
}