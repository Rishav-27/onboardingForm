// src/app/api/profile/route.ts

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
    const employeeId = searchParams.get("id");

    if (!employeeId) {
      console.error("Error: Employee ID is missing from the request.");
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }



    const { data: employee, error } = await supabase
      .from("employees")
      .select("*")
      .eq("employee_id", employeeId)
      .single();

    if (error || !employee) {
      console.error(
        `Error: Employee with ID ${employeeId} not found. Supabase error:`,
        error?.message
      );
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }



    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Server error during profile fetch:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch profile: " + err.message },
      { status: 500 }
    );
  }
}
