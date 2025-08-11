import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default as any;
  const data = await pdfParse(buffer);
  return data?.text || "";
}

async function parseDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

export async function POST(req: Request) {
  const form = await req.formData();
  const files = form.getAll("files") as File[];
  if (!files || files.length === 0) {
    return NextResponse.json({ message: "ファイルが指定されていません" }, { status: 400 });
  }

  let combined = "";
  for (const f of files) {
    const ab = await f.arrayBuffer();
    const buf = Buffer.from(ab);
    const lower = f.name.toLowerCase();
    try {
      if (lower.endsWith(".pdf")) {
        combined += await parsePdf(buf);
        combined += "\n\n";
      } else if (lower.endsWith(".docx")) {
        combined += await parseDocx(buf);
        combined += "\n\n";
      } else {
        combined += `【未対応形式: ${f.name}】\n`;
      }
    } catch (e: any) {
      combined += `【解析エラー: ${f.name}: ${e?.message || e}}\n`;
    }
  }

  if (!combined.trim()) {
    return NextResponse.json({ message: "有効なテキストを抽出できませんでした" }, { status: 400 });
  }

  return NextResponse.json({ text: combined });
}