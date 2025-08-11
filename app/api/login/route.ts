import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { id, password } = await req.json();

  const validId = process.env.AUTH_ID || "test@shiftinc.jp";
  const validPw = process.env.AUTH_PASSWORD || "p@ssword";

  if (id === validId && password === validPw) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("skilp_auth", "1", { httpOnly: true, sameSite: "lax", path: "/" });
    res.cookies.set("skilp_uid", id, { httpOnly: true, sameSite: "lax", path: "/" });
    return res;
  }

  return NextResponse.json({ message: "ID またはパスワードが正しくありません" }, { status: 401 });
}