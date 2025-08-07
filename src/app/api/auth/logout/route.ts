import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  try {
    // Server-side logout is handled by client clearing session
    // This endpoint just confirms the logout
    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Logout API error:", err.message);
    return NextResponse.json(
      { error: "An unexpected error occurred: " + err.message },
      { status: 500 }
    );
  }
}
