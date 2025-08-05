import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Retrieve Supabase environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { employeeId, password } = await req.json();

    // 1. Input Validation
    if (!employeeId || !password) {
      return NextResponse.json({ error: "Employee ID and password are required" }, { status: 400 });
    }

    // 2. Fetch User from Database
    // We only select the necessary columns for security and performance.
    const { data: employees, error } = await supabase
      .from("employees")
      .select("password, employee_id, role")
      .eq("employee_id", employeeId)
      .single();

    // 3. Handle User Not Found
    // Return a generic 'Invalid credentials' error for security.
    if (error || !employees) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Password Verification
    // Use bcrypt.compare() to securely check the hashed password.
    const passwordMatch = await bcrypt.compare(password, employees.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 5. Successful Login Response
    return NextResponse.json({
      message: "Login successful",
      user: { id: employees.employee_id, role: employees.role },
      token: "mock-session-token", // In a production app, this would be a real JWT
    }, { status: 200 });

  } catch (error) {
    const err = error as Error;
    console.error("Login API error:", err.message);
    return NextResponse.json({ error: "An unexpected error occurred: " + err.message }, { status: 500 });
  }
}