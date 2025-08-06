import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase environment variables are not set.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false,
    },
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;

        if (!file || !userId) {
            return NextResponse.json({ error: 'File and userId are required.' }, { status: 400 });
        }

        const fileExtension = file.name.split('.').pop();
        const newFileName = `${userId}/${uuidv4()}.${fileExtension}`;
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars') // Replace with your bucket name
            .upload(newFileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload image to storage.' }, { status: 500 });
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(newFileName);
        
        const publicUrl = publicUrlData.publicUrl;

        // Update the user's profile in the database
        const { error: updateError } = await supabase
            .from('employees') // Replace with your table name
            .update({ profile_image_url: publicUrl })
            .eq('employee_id', userId);

        if (updateError) {
            console.error('Supabase update error:', updateError);
            return NextResponse.json({ error: 'Failed to update user profile.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Avatar updated successfully.', publicUrl }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}