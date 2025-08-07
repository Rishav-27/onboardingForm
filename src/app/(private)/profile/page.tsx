'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Briefcase, Calendar, User, Building, Plus, List,Edit } from 'lucide-react';
import { useAuthStore } from '@/lib/useAuthStore';
import { OnboardingData, useOnboardingStore } from '@/features/onboarding/useOnboardingStore';
import toast from 'react-hot-toast';
import { JSX } from 'react/jsx-runtime';
import { Loader2 } from 'lucide-react';
import { UploadAvatar } from '@/features/profile/UploadAvatar';
import { AuthenticationBanner, AuthenticationStatus } from '@/components/common/AuthenticationBanner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage(): JSX.Element {
    const router = useRouter();
    const { isAuthenticated, isAdmin, userId, isFullyAuthenticated } = useAuthStore();
    const { setOnboardingData , setEditingMode} = useOnboardingStore();
    const [profileData, setProfileData] = useState<OnboardingData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getInitials = (name: string | null) => {
        if (!name) return "UN";
        const parts = name.split(' ');
        if (parts.length > 1) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (userId && isAuthenticated) {
                try {
                    console.log("Starting fetch for profile data...");
                    const fetchUrl = `/api/profile?id=${userId}`;
                    console.log("Fetching URL:", fetchUrl);

                    const response = await fetch(fetchUrl);
                    console.log("API response status:", response.status, response.statusText);

                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data.');
                    }
                    const data = await response.json();
                    
                    console.log("Received profile data:", data);
                    setProfileData(data || null);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    toast.error("Failed to load profile data.");
                    setProfileData(null);
                } finally {
                    setIsLoading(false);
                }
            } else if (!isAuthenticated) {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [userId, isAuthenticated]);

    const handleEditProfile =() =>{
        if (profileData){
            setOnboardingData(profileData);
            setEditingMode(true);
            router.push('/edit-profile');
        }else{
            toast.error("Cannot edit: No profile data to load.");
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <p className="text-gray-600 text-lg">No profile data available.</p>
            </div>
        );
    }

    const DetailItem = ({ label, value, icon: Icon }: { label: string; value: string | undefined; icon: React.ElementType }) => (
        <div className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-100">
            <Icon className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">{label}</span>
                <span className="text-base font-semibold text-gray-900">{value || 'N/A'}</span>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-white text-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                {profileData.profile_image_url ? (
                                    <AvatarImage
                                        src={profileData.profile_image_url}
                                        alt="Profile"
                                        className="object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-2xl">
                                        {getInitials(profileData.full_name)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1">
                                {profileData && <UploadAvatar />}
                            </div>
                        </div>

                        <div>
                            <CardTitle className="text-2xl font-extrabold tracking-tight text-gray-900">
                                {profileData.full_name || 'Employee Profile'}
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-1 text-sm max-w-lg mx-auto">
                                A detailed overview of the information submitted during the employee onboarding process.
                            </CardDescription>
                        </div>

                        <div className="mt-2">
                            <AuthenticationStatus isAuthenticated={isFullyAuthenticated} />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6 bg-gray-50">
                    <AuthenticationBanner
                        isAuthenticated={isFullyAuthenticated}
                        userEmail={profileData.email}
                        onAuthenticateClick={() => {
                            toast('Please use Google or GitHub login to complete authentication.', {
                                duration: 4000,
                                icon: '🔐',
                                position: 'bottom-right',
                            });
                        }}
                    />
                    <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
                         <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-base font-semibold text-blue-600">Employee ID:</span>
                                <span className="text-base font-bold text-gray-900">{profileData.employee_id}</span>
                            </div>
                            
                            <Button variant="outline" onClick={handleEditProfile} size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label="Full Name" value={profileData.full_name} icon={User} />
                            <DetailItem label="Email Address" value={profileData.email} icon={Mail} />
                            <DetailItem label="Phone Number" value={profileData.phone_number} icon={Phone} />
                            <DetailItem label="Department" value={profileData.department} icon={Building} />
                            <DetailItem label="Role" value={profileData.role} icon={Briefcase} />
                            <DetailItem label="Date of Joining" value={profileData.date_of_joining} icon={Calendar} />
                        </div>
                    </div>
                </CardContent>
    
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-4 bg-white border-t border-gray-200">
                    {isAdmin && (
                        <Button
                            variant="outline"
                            onClick={() => router.push('/employees')}
                            className="w-full sm:w-auto"
                        >
                            <List className="h-4 w-4 mr-2" />
                            Go to Employee List
                        </Button>
                    )}
    
                    {isAdmin && (
                        <Button
                            onClick={() => router.push('/onboarding')}
                            className="w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Start New Onboarding
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}