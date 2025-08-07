'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, X, CheckCircle } from 'lucide-react';

interface AuthenticationBannerProps {
  isAuthenticated?: boolean;
  userEmail?: string;
  onAuthenticateClick?: () => void;
}

export function AuthenticationBanner({
  isAuthenticated = false,
  onAuthenticateClick
}: AuthenticationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isAuthenticated || isDismissed) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50 text-orange-800 mb-4">
      <Shield className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Complete Your Authentication</strong>
          <p className="text-sm mt-1">
            Enhance your account security by completing authentication. 
            You can use Google/GitHub login or verify your email address.
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button 
            size="sm" 
            onClick={onAuthenticateClick}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Authenticate Now
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setIsDismissed(true)}
            className="text-orange-600 hover:text-orange-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export function AuthenticationStatus({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm">
        <CheckCircle className="h-4 w-4" />
        <span>Account Authenticated</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-orange-600 text-sm">
      <Shield className="h-4 w-4" />
      <span>Authentication Pending</span>
    </div>
  );
}
