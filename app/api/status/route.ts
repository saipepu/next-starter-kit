import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // if(!request.headers.get("authorization")?.includes("refreshed")) return NextResponse.json({ status: "unauthorized" }, { status: 401 });
  return NextResponse.json({ status: "ok" }, { status: 200 })
}
