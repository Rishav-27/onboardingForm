'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/useAuthStore';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginModal } from '@/components/authentication/LoginModal';

export default function Home() {
  const { isAuthenticated, isAdmin, full_name } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const renderActionButtons = () => {
    if (isAuthenticated && isAdmin) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => handleNavigation('/onboarding')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Briefcase className="h-5 w-5" />
            Start Onboarding
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleNavigation('/employees')}
            variant="outline"
            size="lg"
            className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
          >
            <Users className="h-5 w-5" />
            Employee Resources
          </Button>
        </div>
      );
    } else if (isAuthenticated && !isAdmin) {
      return (
        <div className="flex justify-center">
          <Button
            onClick={() => handleNavigation('/profile')}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Users className="h-5 w-5" />
            View Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsLoginModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Get Started
          </Button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Simplified background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div
          className="relative z-10 w-full max-w-4xl px-6 sm:px-8 py-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Personalized greeting for authenticated users */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <p className="text-lg text-gray-600 mb-2">Welcome back,</p>
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {full_name || 'User'}
              </h2>
            </motion.div>
          )}

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {isAuthenticated ? (
              <>Ready to continue your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">journey</span>?</>
            ) : (
              <>Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Onboard</span></>
            )}
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {isAuthenticated
              ? isAdmin
                ? "Manage onboarding processes and help new team members get started."
                : "Access your profile and explore resources designed to support your work."
              : "Streamline your employee onboarding experience with our intuitive platform."
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {renderActionButtons()}
          </motion.div>
        </motion.div>

        {/* Minimal footer */}
        <motion.footer
          className="absolute bottom-6 text-gray-400 text-sm z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          &copy; {new Date().getFullYear()} Onboard. All rights reserved.
        </motion.footer>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}