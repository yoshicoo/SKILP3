import { NextResponse } from "next/server";
import { getOpenAI, OPENAI_MODEL } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const { sourceText, history } = await req.json();

  const openai = getOpenAI();

  const sys = `あなたは日本語でCV（履歴書）の編集者です。出力はJSON（単一オブジェクト）で返す。
スキルレベルは1〜5の整数。プロジェクトはカード表示に適した短い要約を入れる。
フィールド:
{
  "cv": {
    "name": string,
    "headline": string,
    "strengths": string[],
    "recommendedAssignments": string[],
    "skills": [{"name": string, "level": 1|2|3|4|5}],
    "projects": [{"title": string, "industry": string, "scale": string, "role": string, "period": string, "summary": string}],
    "domains": string[],
    "certifications": string[],
    "management": {"teamSize": string, "period": string, "description": string},
    "careerSupport": {
      "targetRoles": string[],
      "salaryProgression": [{"stage": string, "amount": string}],
      "skillGap": {"current": string, "goal": string, "reason": string},
      "roadmap": {
        "0-3m": [{"action": string, "metric": string}],
        "3-6m": [{"action": string, "metric": string}],
        "6-12m": [{"action": string, "metric": string}]
      },
      "recommendedCertifications": [{"name": string, "reason": string, "timing": string}],
      "learningPlan": [{"topic": string, "modules": string[], "tasks": string[]}],
      "mentoringTips": string[]
    }
  }
}`;

  const user = `以下の情報を統合して、欠けている箇所は常識的に補完しつつ、事実に反しない形でCV JSONを生成してください。
- 解析テキスト:
<RESUME>${(sourceText || "").slice(0, 12000)}</RESUME>

- インタビューQ/A（最新が末尾）:
${JSON.stringify(history || [], null, 2)}

要件:
- 「recommendedAssignments」には、SHIFT内でのアサイン先の例（領域/業界/ポジション）を3〜6件挙げる。
- 「skills」は5〜10個にまとめ、レベルは1〜5。
- 名前が不明な場合は空に。
- 「careerSupport」には、目指せるロール、想定年収の推移、現状→目標のスキルギャップ（理由付き）、0–3ヶ月/3–6ヶ月/6–12ヶ月のロードマップ（各フェーズの具体アクションとメトリクス）、推奨資格（理由・実施タイミング）、学習計画（トピックとモジュール、実践課題）、メンタリング活用Tipsを含める。
- 日本語で、ビジネス文書のトーン。`;

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
  let json: any = {};
  try {
    json = JSON.parse(content);
  } catch {
    json = {};
  }

  return NextResponse.json(json);
}