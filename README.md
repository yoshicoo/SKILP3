# SKILP — スキル可視化Webアプリ

> 株式会社SHIFT従業員のスキル・経験を可視化し、最適なアサインを実現するためのサンプル実装。Next.js App Router + Vercel デプロイ想定。

## 機能概要

- **認証（固定値）**: ID・パスワードでログイン（テスト: `test@shiftinc.jp` / `p@ssword`）。middlewareでページを保護。
- **ファイルアップロード**: PDF / Word(.docx) を複数同時アップロードし、サーバーでテキスト抽出（`pdf-parse` / `mammoth`）。
- **質問フロー**: 生成AI（GPT-4o mini）で一問一答の質問を生成。進捗バーで達成度を表示。
- **CV生成**: 生成AIでCV JSONを作成し、Webでモダンに表示（星評価 / レーダーチャート / カード）。
- **セッション管理**: 保存・再開・履歴はなし。フロー: アップロード → 質問 → CV表示。

## セットアップ

```bash
pnpm i   # もしくは npm i / yarn
cp .env.example .env.local  # OPENAI_API_KEY を設定
pnpm dev  # http://localhost:3000
```

### 必要な環境変数

- `OPENAI_API_KEY` — OpenAIのAPIキー（Vercelの環境変数に設定）
- `AUTH_ID` / `AUTH_PASSWORD` — 固定認証の値（未設定時はテスト値を使用）

## デプロイ（Vercel）

- GitHubにリポジトリを作成し、Vercelにインポート。
- `OPENAI_API_KEY`, `AUTH_ID`, `AUTH_PASSWORD` をVercelのProject Settings → Environment Variablesに設定。
- Node.js 18/20 で動作。App RouterのServerless Functionsでファイル解析（`runtime = "nodejs"`）。

## 注意事項

- `.doc`（旧Word形式）は未対応です。`.docx` or PDF に変換してアップロードしてください。
- 解析はベストエフォートです。元ファイルのレイアウトによっては正しく抽出できない場合があります。
- この実装はサンプルであり、実運用では監査ログや認可の強化、入力バリデーション、レート制限等の追加が必要です。