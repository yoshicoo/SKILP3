import { NextResponse } from "next/server";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";
import { REQUIRED_FIELDS } from "@/lib/fields";

export const runtime = "nodejs";
export const maxDuration = 120;

type QA = { field: string; question: string; answer: string };

function computeProgress(history: QA[]) {
  const covered = new Set(history.map(h => h.field));
  const ratio = covered.size / REQUIRED_FIELDS.length;
  return Math.round(ratio * 100);
}

function pickNextField(history: QA[]): string | null {
  const covered = new Set(history.map(h => h.field));
  for (const f of REQUIRED_FIELDS) {
    if (!covered.has(f)) return f;
  }
  return null;
}

export async function POST(req: Request) {
  const { history, sourceText } = await req.json();
  const nextField = pickNextField(history || []);
  if (!nextField) {
    // All covered
    return new NextResponse(null, { status: 204 });
  }

  const openai = getOpenAI();
  const sys = `あなたは日本語で、候補者のスキル・経験を正確に引き出すインタビュアーです。
出力は必ずJSON（単一オブジェクト）で: { "question": string, "type": "text"|"choice", "options": string[] }
制約:
- 一問一答。簡潔だが具体的に。
- フィールド: ${nextField}
- 過度に長い文章は避ける。
- choiceの場合は3〜6個の選択肢を返す。`;

  const user = `候補者の事前情報:
<RESUME>${(sourceText || "").slice(0, 6000)}</RESUME>

これまでのQ/A履歴（最新が末尾）:
${JSON.stringify(history || [], null, 2)}

次のフィールド「${nextField}」を深掘りする1問を作成してください。
期待する観点例:
- projects: 業界/規模/役割/期間/成果など
- technologies: 言語/テストツール/環境/フレームワーク/レベル自己評価
- duties: テスト設計/自動化/マネジメント/提案活動 など
- domains: 業界知識（金融/EC/ゲーム/医療 等）
- certifications: 取得済み/取得予定/スコア
- management: チーム規模/期間/体制/役割
- other: 補足事項/強み/興味関心`;

  const res = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });

  const content = res.choices[0]?.message?.content || "{}";
  let parsed: any = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { question: "詳細を教えてください。", type: "text" };
  }
  const progress = computeProgress(history || []);
  return NextResponse.json({
    field: nextField,
    question: parsed.question || "詳細を教えてください。",
    type: parsed.type === "choice" ? "choice" : "text",
    options: parsed.options || [],
    progress,
  });
}