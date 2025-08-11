"use client";

import { useEffect, useMemo, useState } from "react";
import ProgressBar from "@/components/ProgressBar";

type QType = "text" | "choice";

type Question = {
  field: string;
  question: string;
  type: QType;
  options?: string[];
  progress: number; // 0-100
};

export default function InterviewPage() {
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ field: string; question: string; answer: string }[]>([]);

  const progress = currentQ?.progress ?? 0;

  useEffect(() => {
    // 初回ロード: 最初の質問を取得
    fetchNextQuestion([]);
  }, []);

  const fetchNextQuestion = async (hist: { field: string; question: string; answer: string }[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: hist,
          sourceText: sessionStorage.getItem("skilp:sourceText") || ""
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "質問生成に失敗しました");
      }
      const data: Question = await res.json();
      setCurrentQ(data);
      setAnswer("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQ) return;
    const newHist = [...history, { field: currentQ.field, question: currentQ.question, answer }];
    setHistory(newHist);
    // 保存
    sessionStorage.setItem("skilp:history", JSON.stringify(newHist));
    // 次の質問
    setAnswer("");
    setCurrentQ(null);
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: newHist,
        sourceText: sessionStorage.getItem("skilp:sourceText") || ""
      }),
    });
    if (res.status === 204) {
      // 完了 -> /cv へ
      window.location.href = "/cv";
      return;
    }
    const data: Question = await res.json();
    setCurrentQ(data);
  };

  return (
    <div className="max-w-2xl mx-auto card p-6">
      <h1 className="text-2xl font-semibold mb-1">ヒアリング</h1>
      <p className="text-sm text-slate-600 mb-4">一問一答で必要事項を伺います。回答後に自動で次の質問が表示されます。</p>

      <ProgressBar value={progress} />

      {currentQ ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="text-lg font-medium">{currentQ.question}</div>
          {currentQ.type === "choice" ? (
            <div className="grid grid-cols-1 gap-2">
              {currentQ.options?.map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    name="opt"
                    onChange={() => setAnswer(opt)}
                    checked={answer === opt}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="input h-32"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="自由記述でご回答ください"
              required
            />
          )}
          <div className="flex gap-3">
            <button className="btn" type="submit" disabled={loading || !answer}>
              回答して次へ
            </button>
            <button
              className="btn-secondary"
              type="button"
              onClick={() => fetchNextQuestion(history)}
              disabled={loading}
              title="別の質問を提示"
            >
              スキップ
            </button>
          </div>
        </form>
      ) : (
        <div className="py-12 text-center text-slate-600">{loading ? "生成中..." : "読み込み中..."}</div>
      )}
    </div>
  );
}