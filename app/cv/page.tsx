"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SkillRadar from "@/components/SkillRadar";
import StarRating from "@/components/StarRating";
import ProgressBar from "@/components/ProgressBar";

type CV = {
  name: string;
  headline: string;
  strengths: string[];
  recommendedAssignments: string[];
  skills: { name: string; level: number; }[]; // 1-5
  projects: { title: string; industry: string; scale: string; role: string; period?: string; summary?: string; }[];
  domains: string[];
  certifications: string[];
  management?: { teamSize?: string; period?: string; description?: string; };
  careerSupport?: string[];
};

export default function CVPage() {
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceText: sessionStorage.getItem("skilp:sourceText") || "",
            history: JSON.parse(sessionStorage.getItem("skilp:history") || "[]"),
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "CV生成に失敗しました");
        }
        const data = await res.json();
        setCv(data.cv);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 10 : p));
    }, 500);
    return () => clearInterval(timer);
  }, [loading]);

  if (loading)
    return (
      <div className="grid gap-4 place-items-center">
        <div className="text-center text-slate-600">CVを生成しています...</div>
        <ProgressBar value={progress} />
      </div>
    );
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!cv) return <div className="text-center">データがありません</div>;

  const radarData = cv.skills.map(s => ({ subject: s.name, A: s.level, fullMark: 5 }));

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">CV（自動生成）</h1>
        <Link href="/upload" className="btn-secondary">最初に戻る</Link>
      </div>

      <section className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary-600 text-white grid place-items-center text-2xl font-bold">S</div>
          <div>
            <div className="text-xl font-semibold">{cv.name || "（氏名未設定）"}</div>
            <div className="text-slate-600">{cv.headline}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {cv.strengths.map((t) => <span key={t} className="badge">{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">スキル可視化</h2>
          <div className="grid gap-3">
            {cv.skills.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="text-sm">{s.name}</div>
                <StarRating value={s.level} />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <SkillRadar data={radarData} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">推奨アサイン領域</h2>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
            {cv.recommendedAssignments.map((r) => <li key={r}>{r}</li>)}
          </ul>
          <h3 className="text-base font-semibold mt-4">業界知識</h3>
          <div className="mt-2 flex flex-wrap gap-2">{cv.domains.map(d => <span key={d} className="badge">{d}</span>)}</div>
          <h3 className="text-base font-semibold mt-4">資格・認定</h3>
          <div className="mt-2 flex flex-wrap gap-2">{cv.certifications.map(c => <span key={c} className="badge">{c}</span>)}</div>
          {cv.management?.description && (
            <div className="mt-4">
              <h3 className="text-base font-semibold">マネジメント経験</h3>
              <p className="text-sm text-slate-700 mt-1">{cv.management.description}</p>
              <div className="text-xs text-slate-500 mt-1">
                規模: {cv.management.teamSize || "-"} / 期間: {cv.management.period || "-"}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold mb-3">プロジェクト経験</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {cv.projects.map((p, idx) => (
            <div key={idx} className="rounded-xl border p-4">
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-slate-500 mt-1">{p.period || ""}</div>
              <div className="text-xs text-slate-500 mt-1">業界: {p.industry} / 規模: {p.scale} / 役割: {p.role}</div>
              {p.summary && <p className="text-sm text-slate-700 mt-2">{p.summary}</p>}
            </div>
          ))}
        </div>
      </section>

      {cv.careerSupport && (
        <section className="card p-6">
          <h2 className="text-lg font-semibold mb-3">キャリアサポート</h2>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
            {cv.careerSupport.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}