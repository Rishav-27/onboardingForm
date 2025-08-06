'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, LogIn, User2, Settings, Home, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/useAuthStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
    const { isAuthenticated, logout, userId, full_name, profile_image_url, isAdmin, fetchUserData } = useAuthStore();
    const router = useRouter();

    // Fetch user data if authenticated but missing user info
    useEffect(() => {
        if (isAuthenticated && userId && !full_name) {
            fetchUserData(userId);
        }
    }, [isAuthenticated, userId, full_name, fetchUserData]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            logout();
            toast.success('Logged out successfully!');
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error('Logout failed. Please try again.');
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return "UN";
        const parts = name.split(' ');
        if (parts.length > 1) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <Link
                        href="/"
                        className="flex items-center space-x-3 group transition-all duration-200 hover:scale-105"
                    >
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200">
                            <span className="text-white font-bold text-sm">O</span>
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Onboard
                        </span>
                    </Link>

                    {/* Navigation & User Section */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {/* Welcome Message */}
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm text-gray-600">Welcome back,</span>
                                <span className="font-semibold text-gray-800 max-w-32 truncate">
                                    {full_name || 'User'}
                                </span>
                            </div>

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200"
                                    >
                                        <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                                            {profile_image_url ? (
                                                <AvatarImage
                                                    src={profile_image_url}
                                                    alt="Profile"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                                    {getInitials(full_name)}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    forceMount
                                    className="w-56 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-lg"
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-gray-900">
                                                {full_name || 'User'}
                                            </p>
                                            <p className="text-xs leading-none text-gray-500">
                                                {isAdmin ? 'Administrator' : 'Employee'}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={() => handleNavigation('/')}
                                        className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        <Home className="h-4 w-4 mr-3 text-gray-500" />
                                        <span>Home</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={() => handleNavigation('/profile')}
                                        className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        <User2 className="h-4 w-4 mr-3 text-gray-500" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>

                                    {isAdmin && (
                                        <DropdownMenuItem
                                            onClick={() => handleNavigation('/onboarding')}
                                            className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                                        >
                                            <Briefcase className="h-4 w-4 mr-3 text-gray-500" />
                                            <span>Onboarding</span>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer hover:bg-red-50 text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors duration-150"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button
                            onClick={onLoginClick}
                            variant="ghost"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                            <LogIn className="h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                            <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                                Login
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}