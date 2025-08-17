# Picklist

> 📱 このアプリはApp Storeで公開中です！[App Storeで見る](https://apps.apple.com/jp/app/%E3%83%94%E3%83%83%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%88-%E5%86%99%E7%9C%9F%E3%81%A8%E3%82%AB%E3%83%86%E3%82%B4%E3%83%AA%E3%81%A7%E7%AE%A1%E7%90%86%E3%81%A7%E3%81%8D%E3%82%8B%E8%B2%B7%E3%81%84%E7%89%A9%E3%83%AA%E3%82%B9%E3%83%88/id6745702310)

買い物リストを簡単に管理できるモバイルアプリケーション

## 概要

Picklistは、日常の買い物をサポートするためのモバイルアプリケーションです。
カテゴリー別の整理、並び替え機能、商品画像の管理など、買い物を効率化する機能を提供しています。

## 機能

### 実装済み機能
- 買い物リストの作成・編集・削除
- カテゴリー別の並び替え（カテゴリー順、名前順、作成順）
- よく買う商品の登録と一括追加
- 商品画像の撮影・管理
- ダークモード対応（システム設定連動）
- 買い物履歴の記録と管理
- オンボーディング（初回起動時のチュートリアル）

### 開発予定機能
- バーコードスキャンでのアイテム追加
- LINEなどでのリスト共有
- AIを活用したレシピからの買い物リスト生成

## 詳細仕様
詳細な仕様については[こちら](docs/specifications.md)をご覧ください。

## 技術スタック

- Framework: React Native (Expo)
- Routing: Expo Router
- State Management: Zustand
- Storage: AsyncStorage
- Testing: Jest + React Native Testing Library
- CI/CD: GitHub Actions

## プロジェクト構造

```
picklist/
├── app/                     # ルーティング
├── src/                     # 共通コード
├── assets/                  # リソース
└── docs/                    # ドキュメント
```

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone [repository-url]
cd picklist

# 依存関係のインストール
yarn install

# 開発サーバーの起動
yarn start

# iOSシミュレーターでの起動
yarn ios

# Androidエミュレーターでの起動
yarn android
```

## 開発ワークフロー

1. developブランチからfeatureブランチを作成
2. 機能実装とテストの作成
3. PRの作成とレビュー
4. developブランチへのマージ
5. QAテスト
6. mainブランチへのリリース

## テスト

```bash
# ユニットテストの実行
yarn test

# リンターの実行
yarn lint

# TypeScriptの型チェック
yarn typescript
```

## ライセンス

MIT License