'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/useAuthStore';
import { Button } from '@/components/ui/button';

import { Upload, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';



export function UploadAvatar() {
    const { userId } = useAuthStore();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
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

            await response.json();

            toast.success('Profile image updated successfully!', { position: 'bottom-right' });
            setSelectedFile(null);
            router.refresh();
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage, { position: 'bottom-right' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
    };



    return (
        <div className="relative">
            <label className="cursor-pointer">
                <Input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
                <Button
                    size="sm"
                    className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                    asChild
                >
                    <span>
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                    </span>
                </Button>
            </label>

            {selectedFile && (
                <div className="absolute top-10 right-0 bg-white rounded-lg shadow-lg border p-2 z-10">
                    <div className="flex items-center gap-2">
                        <Button onClick={handleUpload} disabled={isLoading} size="sm">
                            {isLoading ? (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                                <Upload className="mr-1 h-3 w-3" />
                            )}
                            {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button onClick={handleRemove} variant="destructive" size="sm">
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}