import { NextResponse, NextRequest } from "next/server"
import admins from "@/lib/domain/mock-data/admins.json"

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, message: { admins } }, { status: 200 })
}
