import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { employeeId, password } = await req.json();
    
    if (!employeeId || !password) {
      return NextResponse.json(
        { error: "Employee ID and password are required" },
        { status: 400 }
      );
    }

    // Get employee by employee_id
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: 'Invalid employee ID or password' },
        { status: 401 }
      );
    }

    if (!employee.auth_user_id) {
      return NextResponse.json(
        { error: 'Account not activated. Please contact your administrator.' },
        { status: 401 }
      );
    }

    // Try to sign in with the employee's email and provided password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: employee.email,
      password
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid employee ID or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      employee: {
        employee_id: employee.employee_id,
        full_name: employee.full_name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        profile_image_url: employee.profile_image_url,
        auth_user_id: employee.auth_user_id
      }
    });

  } catch (error) {
    console.error("Employee ID login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
