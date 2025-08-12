"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SkillRadar from "@/components/SkillRadar";
import StarRating from "@/components/StarRating";
import ProgressBar from "@/components/ProgressBar";

type RoadmapItem = { action: string; metric: string };
type CareerSupport = {
  targetRoles: string[];
  salaryProgression: { stage: string; amount: string }[];
  skillGap: { current: string; goal: string; reason: string };
  roadmap: {
    "0-3m": RoadmapItem[];
    "3-6m": RoadmapItem[];
    "6-12m": RoadmapItem[];
  };
  recommendedCertifications: { name: string; reason: string; timing: string }[];
  learningPlan: { topic: string; modules: string[]; tasks: string[] }[];
  mentoringTips: string[];
};

type CV = {
  name: string;
  headline: string;
  strengths: string[];
  recommendedAssignments: string[];
  skills: { name: string; level: number }[]; // 1-5
  projects: { title: string; industry: string; scale: string; role: string; period?: string; summary?: string }[];
  domains: string[];
  certifications: string[];
  management?: { teamSize?: string; period?: string; description?: string };
  careerSupport?: CareerSupport;
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
          <div className="grid gap-4 text-sm text-slate-700">
            <div>
              <h3 className="text-base font-semibold">目指せるロール</h3>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {cv.careerSupport.targetRoles.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mt-4">年収の推移</h3>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {cv.careerSupport.salaryProgression.map((s, idx) => (
                  <li key={idx}>{s.stage}: {s.amount}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mt-4">スキルギャップ</h3>
              <p className="mt-1">現状: {cv.careerSupport.skillGap.current}</p>
              <p>目標: {cv.careerSupport.skillGap.goal}</p>
              <p className="text-xs text-slate-500 mt-1">{cv.careerSupport.skillGap.reason}</p>
            </div>
            <div>
              <h3 className="text-base font-semibold mt-4">ロードマップ</h3>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                {(["0-3m", "3-6m", "6-12m"] as const).map((period) => (
                  <div key={period}>
                    <div className="font-medium">{period}</div>
                    <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                      {cv.careerSupport!.roadmap[period].map((item, idx) => (
                        <li key={idx}>{item.action}（{item.metric}）</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold mt-4">推奨資格</h3>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {cv.careerSupport.recommendedCertifications.map((c, idx) => (
                  <li key={idx}>{c.name} - {c.reason}（{c.timing}）</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mt-4">学習計画</h3>
              <div className="grid gap-3 mt-1">
                {cv.careerSupport.learningPlan.map((lp, idx) => (
                  <div key={idx} className="rounded-lg border p-3">
                    <div className="font-medium">{lp.topic}</div>
                    <div className="text-xs mt-1">モジュール: {lp.modules.join("、")}</div>
                    <div className="text-xs mt-1">実践課題: {lp.tasks.join("、")}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold mt-4">メンタリング活用Tips</h3>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {cv.careerSupport.mentoringTips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
