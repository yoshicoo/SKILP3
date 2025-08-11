"use client";

import { useState } from "react";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "ログインに失敗しました");
      }
      window.location.href = "/upload";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">ログイン</h1>
        <p className="text-sm text-slate-600 mb-6">認証情報を入力してください（テスト用固定値）</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">ID（メールアドレス）</label>
            <input className="input mt-1" type="email" placeholder="test@shiftinc.jp" value={id} onChange={(e) => setId(e.target.value)} required />
          </div>
          <div>
            <label className="label">パスワード</label>
            <input className="input mt-1" type="password" placeholder="p@ssword" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button className="btn w-full" disabled={loading}>
            {loading ? "認証中..." : "ログイン"}
          </button>
          <div className="text-xs text-slate-500">
            テスト用: ID <span className="badge">test@shiftinc.jp</span> / PW <span className="badge">p@ssword</span>
          </div>
        </form>
      </div>
    </div>
  );
}