// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { OnboardingData } from '@/features/onboarding/useOnboardingStore';

// Define the path to your JSON file
const dataFilePath = path.join(process.cwd(), 'data', 'employees.json');

// --- START: Added/Modified Debugging Logs ---
console.log(`[API Init] Server running. Data file path: ${dataFilePath}`);
// --- END: Added/Modified Debugging Logs ---

// Helper to read employees from file
async function readEmployees(): Promise<OnboardingData[]> {
  try {
    // --- ADDED LOG ---
    console.log(`[Read] Attempting to read from: ${dataFilePath}`);
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    // --- ADDED LOG ---
    console.log(`[Read] File contents read successfully. Size: ${fileContents.length} bytes.`);
    return JSON.parse(fileContents) as OnboardingData[];
  } catch (error) {
    // --- MODIFIED ERROR HANDLING FOR CLARITY ---
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      console.warn(`[Read] File not found at ${dataFilePath}. Returning empty array.`);
      return [];
    }
    console.error(`[Read ERROR] Failed to read employees data from ${dataFilePath}:`, err);
    throw new Error('Failed to read employees data.');
  }
}

// Helper to write employees to file
async function writeEmployees(employees: OnboardingData[]): Promise<void> {
  try {
    // --- ADDED LOG AND MKDIR FOR ROBUSTNESS ---
    const dirPath = path.dirname(dataFilePath);
    console.log(`[Write] Ensuring directory exists: ${dirPath}`);
    await fs.mkdir(dirPath, { recursive: true }); // Ensures the 'data' directory exists

    const dataToWrite = JSON.stringify(employees, null, 2);
    // --- ADDED LOGS ---
    console.log(`[Write] Attempting to write ${employees.length} employees to: ${dataFilePath}`);
    console.log(`[Write] Data to write (first 200 chars): ${dataToWrite.substring(0, 200)}...`);

    await fs.writeFile(dataFilePath, dataToWrite, 'utf8');
    // --- ADDED LOG ---
    console.log(`[Write] Successfully wrote data to: ${dataFilePath}`);
  } catch (error) {
    // --- MODIFIED ERROR HANDLING FOR CLARITY ---
    const err = error as Error;
    console.error(`[Write ERROR] Failed to write employees data to ${dataFilePath}:`, err);
    throw new Error('Failed to write employees data.');
  }
}

// GET handler
export async function GET(): Promise<NextResponse> {
  try {
    console.log('[GET] Received request to fetch employees.');
    const employees = await readEmployees();
    console.log(`[GET] Sending ${employees.length} employees.`);
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error(`[GET ERROR] ${err.message}`);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('[POST] Received request to add new employee.');
    const newEmployeeData = (await req.json()) as OnboardingData;

    if (!newEmployeeData || !newEmployeeData.fullName || !newEmployeeData.email) {
      console.warn('[POST] Missing required employee data.');
      return NextResponse.json(
        { error: 'Missing required employee data' },
        { status: 400 }
      );
    }

    const employees = await readEmployees();

    // --- Auto-generate employeeId if not present or duplicate ---
    if (!newEmployeeData.employeeId || employees.some((emp) => emp.employeeId === newEmployeeData.employeeId)) {
        // Generate a simple unique ID (e.g., timestamp + random number)
        newEmployeeData.employeeId = `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        console.log(`[POST] Generated new employeeId: ${newEmployeeData.employeeId}`);
    }

    // --- Ensure password fields are not saved directly in plaintext to JSON if not intended ---
    // This is a reminder. For a real app, you'd hash and store securely.
    // For this demo, we'll keep it as is, but be aware for production.
    delete (newEmployeeData as Partial<OnboardingData>).password;
    delete (newEmployeeData as Partial<OnboardingData>).confirmPassword;


    employees.push(newEmployeeData);
    console.log(`[POST] Added new employee to list. Total employees: ${employees.length}`);
    await writeEmployees(employees);

    console.log(`[POST] Employee added successfully: ${newEmployeeData.fullName} (ID: ${newEmployeeData.employeeId})`);
    return NextResponse.json(
      { message: 'Employee added successfully', employee: newEmployeeData },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.error(`[POST ERROR] ${err.message}`);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req:NextRequest): Promise<NextResponse>{
  try{
    const {searchParams} =new URL(req.url);
    const employeeId = searchParams.get('id');

    if (!employeeId){
      console.warn('[DELETE] Missing employee ID for deletion.');
      return NextResponse.json({error:'Employee ID is required'},{ status:400});
    }

    console.log(`[DELETE] Received request to delete employee with ID: ${employeeId}`);
    let employees = await readEmployees();
    const initialCount = employees.length;

    employees=employees.filter(emp => emp.employeeId !== employeeId);

    if(employees.length === initialCount){
      console.warn(`[DELETE] Employee with ID ${employeeId} not found.`);
      return NextResponse.json({error: 'Employee not found'},{status:404});
    }
    await writeEmployees(employees);
    console.log(`[DELETE] Successfully deleted employee with ID: ${employeeId}. Remaining employees: ${employees.length}`);
    return NextResponse.json({ message:'Employee deleted successfully'},{ status:200});
  }catch (error){
    const err= error as Error;
    console.error(`[DELETE ERROR] ${err.message}`);
    return NextResponse.json(
      {error: err.message || 'Internal Server Error'},
      { status: 500}
    );
  }
}