import "@/app/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "SKILP | スキル可視化Webアプリ",
  description: "SHIFT従業員のスキル・経験を可視化して最適アサインを支援するアプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="container-narrow flex items-center gap-3 py-4">
            <div className="h-9 w-9 rounded-xl bg-primary-600 text-white grid place-items-center font-bold">
              S
            </div>
            <div className="text-lg font-semibold">SKILP</div>
            <div className="ml-auto text-sm text-slate-500">スキル可視化・最適アサイン</div>
          </div>
        </header>
        <main className="container-narrow py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white mt-16">
          <div className="container-narrow py-6 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} SKILP
          </div>
        </footer>
      </body>
    </html>
  );
}