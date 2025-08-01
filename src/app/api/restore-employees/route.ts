// app/api/restore-employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { OnboardingData } from '@/features/onboarding/useOnboardingStore';

const dataFilePath = path.join(process.cwd(), 'data', 'employees.json');
const initialDataFilePath = path.join(process.cwd(), 'data', 'initial-employees.json');

// Helper to write employees to file
async function writeEmployees(employees: OnboardingData[]): Promise<void> {
    try {
        const dirPath = path.dirname(dataFilePath);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(dataFilePath, JSON.stringify(employees, null, 2), 'utf8');
    } catch (error) {
        console.error(`[Write ERROR] Failed to write employees data:`, error);
        throw new Error('Failed to write employees data.');
    }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        console.log('[Restore API] Received request to restore initial employee data.');

        // 1. Read initial data from the template file
        const initialFileContents = await fs.readFile(initialDataFilePath, 'utf8');
        const initialEmployees: OnboardingData[] = JSON.parse(initialFileContents);

        // 2. Overwrite the main employee data file
        await writeEmployees(initialEmployees);

        console.log(`[Restore API] Successfully restored ${initialEmployees.length} employees.`);
        
        return NextResponse.json(
            { message: 'Employee data restored successfully!' },
            { status: 200 }
        );

    } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === 'ENOENT') {
            console.error(`[Restore API ERROR] Initial data file not found at ${initialDataFilePath}.`);
            return NextResponse.json(
                { error: `Initial data file not found. Please create it at data/initial-employees.json.` },
                { status: 404 }
            );
        }
        console.error(`[Restore API ERROR] Failed to restore employees data:`, err);
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}