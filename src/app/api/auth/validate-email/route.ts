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

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { isValid: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if email exists in employees table
    const { data: employee, error } = await supabase
      .from('employees')
      .select('email, employee_id, full_name')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !employee) {
      return NextResponse.json({
        isValid: false,
        error: 'No employee found with this email address'
      });
    }

    // Email is valid - employee exists
    return NextResponse.json({
      isValid: true,
      employee: {
        email: employee.email,
        employee_id: employee.employee_id,
        full_name: employee.full_name
      }
    });

  } catch (error) {
    console.error("Email validation error:", error);
    return NextResponse.json(
      { isValid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
