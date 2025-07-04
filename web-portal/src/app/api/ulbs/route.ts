import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Forward JWT from cookies if present
  const token = req.cookies.get("token")?.value;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const res = await fetch(`${backendUrl}/ulbs`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 