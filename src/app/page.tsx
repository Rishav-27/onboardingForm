'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Import the auth store and login modal we created
import { useAuthStore } from '@/lib/useAuthStore';
import { LoginModal } from '@/components/authentication/LoginModal';
import { Button } from '@/components/ui/button';

export default function Home() {
    // Get the authentication state from our store
    const { isAuthenticated, isAdmin } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // This function will render the correct buttons based on the user's state
    const renderActionButtons = () => {
        if (isAuthenticated && isAdmin) {
            // Admin is logged in: show onboarding and resources
            return (
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <a
                        href="/onboarding"
                        className="bg-white hover:bg-gray-100 text-blue-900 font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition"
                    >
                        🚀 Start Onboarding
                    </a>
                    <a
                        href="/employees"
                        className="bg-white hover:bg-gray-100 text-blue-900 font-semibold py-3 px-8 rounded-full text-lg shadow border transition"
                    >
                        📁 Employee Resources
                    </a>
                </div>
            );
        } else if (isAuthenticated && !isAdmin) {
            // User is logged in: show a profile button
            return (
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <a
                        href="/profile"
                        className="bg-white hover:bg-gray-100 text-blue-900 font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition"
                    >
                        👤 View Profile Details
                    </a>
                </div>
            );
        } else {
            // No one is logged in: show a login button
            return (
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white hover:bg-gray-100 text-blue-900 font-semibold py-3 px-8 rounded-full text-lg shadow-lg transition"
                    >
                        🔑 Login
                    </Button>
                </div>
            );
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
            {/* The background will now be the one from RootLayout */}

            {/* Floating Circles (just for subtle motion effect) */}
            <motion.div
                className="absolute w-40 h-40 bg-purple-200 rounded-full top-10 left-10 opacity-30 blur-2xl"
                animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute w-24 h-24 bg-blue-200 rounded-full bottom-10 right-20 opacity-30 blur-2xl"
                animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Center Content */}
            <motion.div
                className="relative z-10 w-full max-w-3xl px-8 py-14 bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-900 mb-6 leading-tight">
                    Welcome to <span className="text-purple-700">Your Company</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-800 max-w-xl mx-auto mb-10">
                    Begin your onboarding journey or explore helpful resources designed to support your work.
                </p>

                {/* The new, conditionally rendered action buttons */}
                {renderActionButtons()}
            </motion.div>

            {/* Footer */}
            <footer className="absolute bottom-5 text-gray-500 text-sm z-10">
                &copy; {new Date().getFullYear()} Your Company. All rights reserved.
            </footer>

            {/* The Login Modal component is now rendered here */}
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}