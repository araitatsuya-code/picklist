# ピックリスト - ディレクトリ構成ドキュメント

## 📁 プロジェクト構成

```
picklist/
├── app/                     # 🚀 ルーティング層 (Expo Router)
│   ├── (tabs)/             # タブナビゲーション
│   │   ├── _layout.tsx     # タブ設定
│   │   ├── index.tsx       # 買い物リスト一覧
│   │   ├── frequent-products.tsx # よく買う商品
│   │   ├── history.tsx     # 買い物履歴
│   │   ├── settings.tsx    # 設定画面
│   │   ├── list/          # 買い物リスト詳細
│   │   │   ├── _layout.tsx # スタックレイアウト
│   │   │   └── [id].tsx    # 動的ルート
│   │   └── settings/       # 設定関連
│   │       └── categories.tsx # カテゴリー管理
│   ├── (products)/         # 商品関連モーダル
│   │   ├── add.tsx         # 商品追加
│   │   ├── edit.tsx        # 商品編集
│   │   └── add-to-list.tsx # リストに追加
│   ├── _layout.tsx         # ルートレイアウト
│   └── scanner.tsx         # バーコードスキャナー（未実装）
├── src/                     # 🏗️ ビジネスロジック層
│   ├── components/         # 再利用可能なUIコンポーネント
│   │   ├── Calendar.tsx
│   │   ├── DraggableList.tsx
│   │   ├── GroupedPicklistItems.tsx
│   │   ├── ImagePicker.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── Onboarding/     # オンボーディング関連
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── WelcomePage.tsx
│   │   │   └── ...
│   │   └── common/         # 汎用コンポーネント
│   ├── stores/             # 状態管理 (Zustand)
│   │   ├── usePicklistStore.ts
│   │   ├── useFrequentProductStore.ts
│   │   ├── useShoppingHistoryStore.ts
│   │   ├── useCategoryStore.ts
│   │   ├── useThemeStore.ts
│   │   └── useOnboardingStore.ts
│   ├── hooks/              # カスタムフック
│   │   ├── useTheme.ts
│   │   ├── useKeyboard.ts
│   │   └── usePicklistCompletion.ts
│   ├── utils/              # ユーティリティ関数
│   │   ├── imageUtils.ts
│   │   ├── sortUtils.ts
│   │   └── __mocks__/      # テスト用モック
│   ├── types/              # 型定義
│   │   ├── frequentProduct.ts
│   │   └── images.d.ts
│   ├── features/           # 機能別モジュール
│   │   └── categories/     # カテゴリー管理機能
│   │       ├── CategoryManagement.tsx
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── utils/
│   │       └── types.ts
│   ├── styles/             # スタイル定義
│   │   └── theme.ts
│   ├── data/               # 初期データ
│   │   └── initialFrequentProducts.ts
│   ├── assets/             # 画像・アニメーション
│   │   └── onboarding/
│   └── i18n/               # 国際化（将来用）
│       └── translations/
├── assets/                  # 📸 静的リソース
│   ├── icon.png            # アプリアイコン
│   ├── splash-icon.png     # スプラッシュ画像
│   ├── adaptive-icon.png   # Android適応アイコン
│   ├── favicon.png         # Web用ファビコン
│   ├── no-image.png        # 画像なしプレースホルダー
│   └── placeholder.png     # 汎用プレースホルダー
├── docs/                    # 📚 ドキュメント
│   ├── specifications.md   # 仕様書
│   ├── handover.md         # 引き継ぎ資料
│   ├── requirements.md     # 要件定義
│   ├── sort-feature.md     # 並び替え機能仕様
│   ├── onboarding-feature.md # オンボーディング仕様
│   └── directory-structure.md # このファイル
├── ios/                     # iOS固有設定
├── .github/                 # GitHub Actions
│   └── workflows/
├── .husky/                  # Git hooks
└── 設定ファイル群
    ├── package.json
    ├── tsconfig.json
    ├── babel.config.js
    ├── jest.config.js
    └── ...
```

## 🏗️ アーキテクチャ概要

### レイヤー分離設計
1. **ルーティング層** (`/app`) - 画面遷移とナビゲーション
2. **ビジネスロジック層** (`/src`) - 状態管理とビジネスルール
3. **リソース層** (`/assets`) - 静的ファイル

### 技術スタック
- **フレームワーク**: React Native + Expo
- **ルーティング**: Expo Router (file-based routing)
- **状態管理**: Zustand + AsyncStorage
- **テーマ**: カスタムテーマシステム
- **テスト**: Jest + React Native Testing Library

## 📂 各ディレクトリの詳細

### `/app` - ルーティング層
Expo Routerのfile-based routingを採用。各ファイルが画面に対応。

#### 🔍 特徴
- **`(tabs)/`**: タブナビゲーションのグループ化
- **`(products)/`**: モーダル画面のグループ化
- **`[id].tsx`**: 動的ルート（パラメータ受け取り）
- **`_layout.tsx`**: レイアウト設定ファイル

#### 📱 画面構成
- **メイン画面**: 買い物リスト、よく買う商品、履歴、設定
- **詳細画面**: リスト詳細、商品編集
- **モーダル**: 商品追加、編集、リストに追加

### `/src` - ビジネスロジック層

#### `/stores` - 状態管理
Zustandを使用したグローバル状態管理。各ストアは単一責任原則に従って分離。

**ストア一覧:**
- `usePicklistStore`: 買い物リストのCRUD操作
- `useFrequentProductStore`: よく買う商品の管理
- `useShoppingHistoryStore`: 履歴データの管理
- `useCategoryStore`: カテゴリーの管理
- `useThemeStore`: ダークモード等テーマ設定
- `useOnboardingStore`: 初回起動時のチュートリアル

#### `/components` - UIコンポーネント
再利用可能なUIコンポーネントを配置。機能別にサブディレクトリで整理。

**設計原則:**
- **単一責任**: 1つのコンポーネントは1つの責務
- **プロップ型定義**: TypeScriptで厳密な型付け
- **テーマ対応**: ダークモード等の対応
- **アクセシビリティ**: 適切なaccessibility props

#### `/hooks` - カスタムフック
ロジックの再利用とコンポーネントからの分離。

**命名規則**: `use[機能名]` (例: `useTheme`)

#### `/utils` - ユーティリティ関数
純粋関数として実装される汎用的な処理。

**例:**
- `imageUtils.ts`: 画像の圧縮、リサイズ
- `sortUtils.ts`: 配列の並び替えロジック

#### `/features` - 機能別モジュール
大きな機能を独立したモジュールとして管理。

**構成例** (`categories`):
```
features/categories/
├── CategoryManagement.tsx  # メインコンポーネント
├── components/            # 機能専用コンポーネント
├── hooks/                # 機能専用フック
├── utils/                # 機能専用ユーティリティ
└── types.ts              # 型定義
```

## 📝 ファイル命名規則

### TypeScript/React Native
- **コンポーネント**: PascalCase (`ProductList.tsx`)
- **フック**: camelCase + `use` prefix (`useTheme.ts`)
- **ストア**: camelCase + `Store` suffix (`usePicklistStore.ts`)
- **ユーティリティ**: camelCase + 機能名 (`imageUtils.ts`)
- **型定義**: camelCase + `.d.ts` (`images.d.ts`)

### ディレクトリ
- **機能名**: kebab-case (`frequent-products`)
- **コンポーネント群**: PascalCase (`Onboarding/`)

## ➕ 新規ファイル追加ガイド

### 画面の追加
1. `/app` 配下に `.tsx` ファイルを作成
2. タブに追加する場合は `/app/(tabs)/` 配下
3. モーダルの場合は `/app/(products)/` などのグループ配下

### コンポーネントの追加
1. **汎用的**: `/src/components/` 直下
2. **機能専用**: `/src/features/[機能名]/components/`
3. **共通部品**: `/src/components/common/`

### 状態管理の追加
1. `/src/stores/` 配下に `use[機能名]Store.ts` として作成
2. Zustandのベストプラクティスに従う
3. AsyncStorageでの永続化を検討

### ユーティリティの追加
1. `/src/utils/` 配下に `[機能名]Utils.ts` として作成
2. 純粋関数として実装
3. 適切な型定義とJSDocコメント

## 🔧 設計方針

### 状態管理
- **Zustand**: 軽量でシンプルなグローバル状態管理
- **AsyncStorage**: ローカルストレージでの永続化
- **単一ストア原則**: 機能ごとに独立したストア

### コンポーネント設計
- **関数コンポーネント**: Hooks中心の設計
- **型安全性**: TypeScriptで厳密な型付け
- **テーマ対応**: useThemeフックでの統一的なテーマ管理

### テスト戦略
- **ユニットテスト**: ストアとユーティリティ関数
- **コンポーネントテスト**: React Native Testing Library
- **モック**: `__mocks__` ディレクトリでの管理

### パフォーマンス
- **画像最適化**: `imageUtils.ts` での自動圧縮
- **メモ化**: React.memo, useMemo, useCallbackの適切な使用
- **遅延読み込み**: 必要に応じた動的インポート

## 🚀 今後の拡張性

### 予定されている機能
- **バーコードスキャン**: `/app/scanner.tsx` の実装
- **共有機能**: `/src/utils/sharingUtils.ts` の追加
- **AI連携**: `/src/services/aiService.ts` の追加

### 推奨される改善
- **API層**: `/src/services/` でのAPI通信統合
- **定数管理**: `/src/constants/` での定数一元化
- **エラー処理**: `/src/utils/errorUtils.ts` での統一的なエラー処理

---

このディレクトリ構成は、スケーラビリティと保守性を重視して設計されています。新機能の追加時は、このガイドラインに従って適切な場所にファイルを配置してください。