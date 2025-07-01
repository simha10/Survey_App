import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { ulbId: string } }) {
  const token = req.cookies.get("token")?.value;
  const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
  const { ulbId } = params;
  const res = await fetch(`${backendUrl}/zones/ulb/${ulbId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 