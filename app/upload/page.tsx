"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<string | null>(null);

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!files || files.length === 0) {
      setError("ファイルを選択してください");
      return;
    }
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));

    setLoading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "アップロードに失敗しました");
      }
      const data = await res.json();
      sessionStorage.setItem("skilp:sourceText", data.text || "");
      setParsedPreview((data.text || "").slice(0, 5000));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onStart = () => {
    router.push("/interview");
  };

  return (
    <div className="grid gap-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">履歴書・職務経歴書のアップロード</h1>
        <p className="text-sm text-slate-600 mb-4">PDFまたはWord（.docx）を複数アップロードできます。内容はAIで解析され、質問に反映されます。</p>
        <form onSubmit={onUpload} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.docx"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-900 hover:file:bg-slate-200"
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex gap-3">
            <button className="btn" type="submit" disabled={loading}>{loading ? "解析中..." : "アップロードして解析"}</button>
            <button className="btn-secondary" type="button" onClick={onStart}>スキップして質問へ進む</button>
          </div>
        </form>
      </div>

      {parsedPreview && (
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">解析プレビュー</h2>
            <button className="btn-secondary" onClick={onStart}>質問を開始</button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-700 max-h-96 overflow-auto">{parsedPreview}</pre>
        </div>
      )}
    </div>
  );
}