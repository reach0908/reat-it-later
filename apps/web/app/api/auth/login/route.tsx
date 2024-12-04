import { NextResponse } from "next/server";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  const { email, password }: LoginRequest = await request.json();

  // Replace this with your actual authentication logic
  if (email === "test@example.com" && password === "password") {
    // Set a session cookie or token here for real applications
    return NextResponse.json({ success: true });
  }

  return NextResponse.error();
}
