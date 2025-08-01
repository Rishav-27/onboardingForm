// // app/api/employees/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import path from 'path';
// import fs from 'fs/promises';
// import { OnboardingData } from '@/features/onboarding/useOnboardingStore';

// const dataFilePath = path.join(process.cwd(), 'data', 'employees.json');

// async function readEmployees(): Promise<OnboardingData[]> {
//   try {
//     const fileContents = await fs.readFile(dataFilePath, 'utf8');
//     return JSON.parse(fileContents) as OnboardingData[];
//   } catch (error) {
//     const err = error as NodeJS.ErrnoException;
//     if (err.code === 'ENOENT') {
//       return [];
//     }
//     throw new Error('Failed to read employees data.');
//   }
// }

// async function writeEmployees(employees: OnboardingData[]): Promise<void> {
//   try {
//     const dirPath = path.dirname(dataFilePath);
//     await fs.mkdir(dirPath, { recursive: true });
//     const dataToWrite = JSON.stringify(employees, null, 2);
//     await fs.writeFile(dataFilePath, dataToWrite, 'utf8');
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   } catch (error) {
//     throw new Error('Failed to write employees data.');
//   }
// }

// export async function GET(): Promise<NextResponse> {
//   try {
//     const employees = await readEmployees();
//     return NextResponse.json(employees, { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json(
//       { error: err.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest): Promise<NextResponse> {
//   try {
//     const newEmployeeData = (await req.json()) as OnboardingData;

//     if (!newEmployeeData || !newEmployeeData.fullName || !newEmployeeData.email) {
//       return NextResponse.json(
//         { error: 'Missing required employee data' },
//         { status: 400 }
//       );
//     }

//     const employees = await readEmployees();
//     if (!newEmployeeData.employeeId || employees.some((emp) => emp.employeeId === newEmployeeData.employeeId)) {
//       newEmployeeData.employeeId = `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     }

//     delete (newEmployeeData as Partial<OnboardingData>).password;
//     delete (newEmployeeData as Partial<OnboardingData>).confirmPassword;

//     employees.push(newEmployeeData);
//     await writeEmployees(employees);

//     return NextResponse.json(
//       { message: 'Employee added successfully', employee: newEmployeeData },
//       { status: 201 }
//     );
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json(
//       { error: err.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest): Promise<NextResponse> {
//   try {
//     const { searchParams } = new URL(req.url);
//     const employeeId = searchParams.get('id');

//     if (!employeeId) {
//       return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
//     }

//     let employees = await readEmployees();
//     const initialCount = employees.length;

//     employees = employees.filter(emp => emp.employeeId !== employeeId);

//     if (employees.length === initialCount) {
//       return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
//     }
//     await writeEmployees(employees);
//     return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json(
//       { error: err.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req: NextRequest): Promise<NextResponse> {
//   try {
//     const updatedEmployeeData = (await req.json()) as OnboardingData;
    
//     if (!updatedEmployeeData || !updatedEmployeeData.employeeId) {
//       return NextResponse.json({ error: 'Employee ID is required for update' }, { status: 400 });
//     }

//     const employees = await readEmployees();
//     const employeeIndex = employees.findIndex(emp => emp.employeeId === updatedEmployeeData.employeeId);

//     if (employeeIndex === -1) {
//       return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
//     }

//     employees[employeeIndex] = updatedEmployeeData;

//     await writeEmployees(employees);
//     return NextResponse.json({ message: 'Employee updated successfully', employee: updatedEmployeeData }, { status: 200 });
//   } catch (error) {
//     const err = error as Error;
//     return NextResponse.json(
//       { error: err.message || 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }