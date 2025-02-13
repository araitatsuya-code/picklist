# Picklist

買い物リストを簡単に管理できるモバイルアプリケーション

## 概要

Picklistは、日常の買い物をサポートするためのモバイルアプリケーションです。
ドラッグ&ドロップでの並び替え、バーコードスキャン機能、他のユーザーとの共有機能を備えています。

## 機能

### 主な機能
- 買い物リストの作成・編集・削除
- ドラッグ&ドロップでの並び替え
- バーコードスキャンでのアイテム追加
- LINEなどでのリスト共有
- ダークモード対応
- AIを活用したレシピからの買い物リスト生成（将来実装予定）

## 詳細仕様
詳細な仕様については[こちら](docs/SPECIFICATIONS.md)をご覧ください。

## 技術スタック

- Framework: React Native (Expo)
- State Management: Zustand
- Storage: AsyncStorage
- Testing: Jest + React Native Testing Library
- CI/CD: GitHub Actions

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone [repository-url]
cd picklist

# 依存関係のインストール
yarn install

# 開発サーバーの起動
yarn start
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