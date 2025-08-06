'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/useAuthStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UploadAvatarProps {
    currentImageUrl?: string | null;
}

export function UploadAvatar({ currentImageUrl }: UploadAvatarProps) {
    const { userId } = useAuthStore();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !userId) {
            toast.error('Please select an image first.');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);

        try {
            const response = await fetch('/api/profile/update-avatar', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image.');
            }

            const { publicUrl } = await response.json();
            
           
            toast.success('Profile image updated successfully!');
            setSelectedFile(null);
            setPreviewUrl(null);
            router.refresh(); 
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const getInitials = (id: string | null) => {
        if (!id) return "UN";
        const parts = id.split('');
        return parts.length >= 2 ? `${parts[0]}${parts[1]}`.toUpperCase() : parts[0].toUpperCase();
    };

    return (
        <div className="flex flex-col items-center gap-4">
             <Avatar className="h-24 w-24 border-2 border-gray-200 shadow-md">
                
                <AvatarImage 
                    src={previewUrl || (currentImageUrl ? currentImageUrl : undefined)} 
                    alt="Profile" 
                    className="object-cover" 
                />
                <AvatarFallback>{getInitials(userId)}</AvatarFallback>
            </Avatar>
            
            <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                    <Input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                    <Button asChild>
                        <span><Upload className="h-4 w-4 mr-2" />Select Image</span>
                    </Button>
                </label>
                {selectedFile && (
                    <Button onClick={handleRemove} variant="destructive" size="icon">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {selectedFile && (
                <Button onClick={handleUpload} disabled={isLoading} className="mt-2 w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Uploading...' : 'Save Avatar'}
                </Button>
            )}
        </div>
    );
}