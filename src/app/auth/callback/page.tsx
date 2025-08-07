'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { useAuthStore } from '@/lib/useAuthStore';
import { AuthService } from '@/lib/auth-service';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is a fresh login attempt (not a page refresh)
        const urlParams = new URLSearchParams(window.location.search);
        const hasAuthCode = urlParams.has('code') || urlParams.has('access_token');

        if (!hasAuthCode) {
          // No auth code means this is likely a page refresh, redirect to home
          router.push('/');
          return;
        }

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          toast.error('Authentication failed', { position: 'bottom-right' });
          router.push('/');
          return;
        }

        if (data.session?.user) {
          const email = data.session.user.email;

          if (email) {
            const result = await AuthService.linkOAuthUser(email, data.session.user.id);

            if (result.success && result.employee) {
              login(result.employee, false);
              toast.success('Successfully signed in!', { position: 'bottom-right' });

              if (result.employee.role === 'admin') {
                router.push('/onboarding');
              } else {
                router.push('/profile');
              }
            } else {
              toast.error(result.error || 'Failed to link account', { position: 'bottom-right' });
              await supabase.auth.signOut(); // Clear session on failure
              router.push('/');
            }
          } else {
            toast.error('No email found in session', { position: 'bottom-right' });
            await supabase.auth.signOut();
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        toast.error('Authentication failed', { position: 'bottom-right' });
        await supabase.auth.signOut();
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Completing sign in...</h2>
        <p className="text-sm text-gray-600">Please wait while we verify your authentication.</p>
      </div>
    </div>
  );
}
