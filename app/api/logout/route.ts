import { NextResponse } from "next/server";
export async function GET() {
  const res = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"));
  res.cookies.set("skilp_auth", "", { httpOnly: true, expires: new Date(0), path: "/" });
  res.cookies.set("skilp_uid", "", { httpOnly: true, expires: new Date(0), path: "/" });
  return res;
}