import { NextRequest, NextResponse } from "next/server";
import { OnboardingData } from "@/features/onboarding/useOnboardingStore";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);



export async function GET(): Promise<NextResponse> {
  try {
    const { data: employees, error } = await supabase
      .from("employees")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to fetch employees: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const newEmployeeData: OnboardingData = await req.json();

    if (
      !newEmployeeData ||
      !newEmployeeData.employee_id ||
      !newEmployeeData.full_name ||
      !newEmployeeData.email ||
      !newEmployeeData.password
    ) {
      return NextResponse.json(
        { error: "Missing required employee data" },
        { status: 400 }
      );
    }


    // Create Supabase Auth user with email verification
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: newEmployeeData.email.toLowerCase().trim(),
      password: newEmployeeData.password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        full_name: newEmployeeData.full_name,
        employee_id: newEmployeeData.employee_id,
        department: newEmployeeData.department,
        role: newEmployeeData.role
      }
    });

    if (authError || !authUser.user) {
      throw new Error(authError?.message || 'Failed to create user account');
    }

    // Create employee record
    const employeeToInsert = {
      employee_id: newEmployeeData.employee_id,
      full_name: newEmployeeData.full_name,
      email: newEmployeeData.email.toLowerCase().trim(),
      phone_number: newEmployeeData.phone_number,
      department: newEmployeeData.department,
      role: newEmployeeData.role,
      date_of_joining: newEmployeeData.date_of_joining,
      auth_user_id: authUser.user.id,
    };

    const { data: employee, error: dbError } = await supabase
      .from("employees")
      .insert(employeeToInsert)
      .select()
      .single();

    if (dbError) {
      // Clean up auth user if database insert fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw new Error(dbError.message);
    }

    return NextResponse.json(
      {
        message: "Employee created successfully with verified email",
        employee: { ...employee, password: "***" },
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to add employee: " + err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("id");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }

    const { error, count } = await supabase
      .from("employees")
      .delete()
      .eq("employee_id", employeeId);

    if (error || count === 0) {
      return NextResponse.json(
        { error: "Employee not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to delete employee: " + err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const updatedEmployeeData: OnboardingData = await req.json();

    if (!updatedEmployeeData || !updatedEmployeeData.employee_id) {
      return NextResponse.json(
        { error: "Employee ID is required for update" },
        { status: 400 }
      );
    }

    const employeeToUpdate: { [key: string]: unknown } = {
      full_name: updatedEmployeeData.full_name,
      email: updatedEmployeeData.email,
      phone_number: updatedEmployeeData.phone_number,
      department: updatedEmployeeData.department,
      role: updatedEmployeeData.role,
      date_of_joining: updatedEmployeeData.date_of_joining,
    };



    const { data: updatedData, error } = await supabase
      .from("employees")
      .update(employeeToUpdate)
      .eq("employee_id", updatedEmployeeData.employee_id)
      .select();

    if (error || !updatedData?.length) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee updated successfully", employee: updatedData[0] },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to update employee: " + err.message },
      { status: 500 }
    );
  }
}
