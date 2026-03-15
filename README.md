# KSB Visitor (Sports Practice App)

KSB Visitorは、スポーツチームの練習参加申し込みおよび抽選を管理するためのWebアプリケーションです。
管理者による練習日程の管理と柔軟な抽選ロジック、およびユーザー向けのシンプルでモダンなインターフェースを提供します。

## ✨ 主な機能 (Features)

- **ユーザー向け機能**
  - **共通パスワードログイン:** チーム内で共有されたパスワード等を利用したシンプルなアクセス制御。
  - **練習一覧・詳細確認:** 今後スケジュールされている練習の確認。
  - **参加申し込み:** 練習への参加申し込み、および自身の申し込み内容の変更・キャンセル。
  - **UI / UX:** Glassmorphism（グラスモーフィズム）を取り入れた、直感操作が可能な美しいモダンデザイン。

- **管理者向け機能**
  - **練習セッション管理:** 練習日程の作成、編集、削除（定員設定の有無も含めて柔軟に設定可能）。
  - **定員オプションと抽選ロジック:**
    - ビジター専用の定員を直接設定するモード。
    - 全体定員、メンバー参加数、特別招待枠などの数値から自動的にビジター枠を計算・算出するモード。
  - **抽選の実行:** 申し込み締め切り後の抽選処理の実行と、結果の確定。

## 💻 技術スタック (Tech Stack)

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React, Tailwind CSS
- **Backend / Database:** [Firebase](https://firebase.google.com/) (Firestore)
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting

*(※以前の Prisma / SQLite 構成から、よりスケーラブルな Firebase / Firestore 構成へ移行しました)*

## 🚀 ローカル環境の構築 (Getting Started)

### 1. リポジトリのクローンとインストール
```bash
git clone <repository-url>
cd ksb-visitor
npm install
```

### 2. 環境変数の設定
プロジェクトルートに `.env.local` を作成し、FirebaseプロジェクトのAPIキーなどを指定してください。

```env
# Next.js (Client) Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Firebase Admin SDK 等（必要に応じて設定）
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."
```

### 3. 開発用サーバーの起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスするとアプリが表示されます。

## 📦 デプロイ (Deployment)

当プロジェクトは Firebase Hosting へのデプロイを標準としています。

```bash
# Firebase CLI のインストール（未インストールの場合）
npm install -g firebase-tools

# Firebase へのログイン
firebase login

# 対象プロジェクトの設定
firebase use --add <your-project-id>

# デプロイ（Hosting, Firestore Rules, Indexes など）
firebase deploy
```

## 📝 ライセンス (License)

See the [LICENSE](LICENSE) file for details.
