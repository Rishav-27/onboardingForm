// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import { OnboardingData } from '@/features/onboarding/useOnboardingStore';

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } = await db.query('SELECT * FROM employees');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to fetch employees: ' + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const newEmployeeData: OnboardingData = await req.json();

    if (!newEmployeeData || !newEmployeeData.fullName || !newEmployeeData.email) {
      return NextResponse.json(
        { error: 'Missing required employee data' },
        { status: 400 }
      );
    }

    const employeeId = `emp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await db.query(
      `INSERT INTO employees (
        "employeeId", 
        "fullName", 
        "email", 
        "phoneNumber", 
        "department", 
        "role", 
        "dateOfJoining"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        employeeId,
        newEmployeeData.fullName,
        newEmployeeData.email,
        newEmployeeData.phoneNumber,
        newEmployeeData.department,
        newEmployeeData.role,
        newEmployeeData.dateOfJoining,
      ]
    );

    return NextResponse.json(
      { message: 'Employee added successfully', employee: { ...newEmployeeData, employeeId } },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to add employee: ' + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('id');

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    const { rowCount } = await db.query('DELETE FROM employees WHERE "employeeId" = $1', [employeeId]);

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to delete employee: ' + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const updatedEmployeeData: OnboardingData = await req.json();

    if (!updatedEmployeeData || !updatedEmployeeData.employeeId) {
      return NextResponse.json({ error: 'Employee ID is required for update' }, { status: 400 });
    }

    const { rowCount } = await db.query(
      `UPDATE employees
       SET "fullName" = $1, "email" = $2, "phoneNumber" = $3, "department" = $4, "role" = $5, "dateOfJoining" = $6
       WHERE "employeeId" = $7`,
      [
        updatedEmployeeData.fullName,
        updatedEmployeeData.email,
        updatedEmployeeData.phoneNumber,
        updatedEmployeeData.department,
        updatedEmployeeData.role,
        updatedEmployeeData.dateOfJoining,
        updatedEmployeeData.employeeId,
      ]
    );

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Employee updated successfully', employee: updatedEmployeeData }, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update employee: ' + err.message },
      { status: 500 }
    );
  }
}