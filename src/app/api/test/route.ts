// src/app/api/test/route.ts

import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  console.log("SUCCESS: The test API route was hit!");
  return NextResponse.json({ message: "Hello, world!" }, { status: 200 });
}