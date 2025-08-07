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
    const { email, authUserId } = await req.json();
    
    if (!email || !authUserId) {
      return NextResponse.json(
        { error: "Email and auth user ID are required" },
        { status: 400 }
      );
    }

    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { error: 'No employee found with this email' },
        { status: 404 }
      );
    }

    if (employee.auth_user_id && employee.auth_user_id !== authUserId) {
      return NextResponse.json(
        { error: 'Email already linked to another account' },
        { status: 409 }
      );
    }

    if (!employee.auth_user_id) {
      await supabase
        .from('employees')
        .update({ auth_user_id: authUserId })
        .eq('employee_id', employee.employee_id);
    }

    return NextResponse.json({
      ...employee,
      auth_user_id: authUserId
    });
  } catch (error) {
    console.error("Link employee error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
