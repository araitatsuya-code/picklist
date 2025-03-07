# 買い物リストのソート機能仕様

## 1. 概要
買い物リストのアイテムを名称とカテゴリ別に整理し、優先順位をつけられるようにする機能。

## 2. データ構造の拡張

### PicklistItemの拡張
```typescript
interface PicklistItem {
  id: string;
  name: string;
  category?: string;     // カテゴリ（食品、日用品など）
  priority: number;      // 優先順位（1: 高, 2: 中, 3: 低）
  completed: boolean;
  quantity: number;
  unit?: string;
  maxPrice?: number;
  note?: string;
}
```

### カテゴリマスター
```typescript
interface Category {
  id: string;
  name: string;         // カテゴリ名
  displayOrder: number; // 表示順
  priority: number;     // カテゴリの優先順位（1が最優先）
  color?: string;       // カテゴリの色（オプション）
}

// デフォルトカテゴリ設定
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'vegetables', name: '野菜', displayOrder: 1, priority: 1 },
  { id: 'meat-fish', name: '魚・肉', displayOrder: 2, priority: 2 },
  { id: 'dairy', name: '日配品', displayOrder: 3, priority: 3 },
  { id: 'deli', name: '惣菜', displayOrder: 4, priority: 4 },
  { id: 'grocery', name: '食品', displayOrder: 5, priority: 5 },
  { id: 'daily', name: '日用品', displayOrder: 6, priority: 6 },
  { id: 'other', name: 'その他', displayOrder: 7, priority: 7 },
]
```

## 3. 機能要件

### ソート機能
1. カテゴリ別グループ化
   - カテゴリごとにアイテムをグループ化
   - カテゴリなしアイテムは「その他」グループに
   - カテゴリの優先順位に従って表示順を決定

2. カテゴリの優先順位
   - カテゴリごとに優先順位を設定可能
   - デフォルトの優先順位を提供
   - ユーザーによる優先順位のカスタマイズ

3. アイテムの優先順位ソート
   - 優先順位の高い順に表示
   - 同じカテゴリ内で優先順位順に表示
   - 同じ優先順位内では名前順にソート

### UI実装
1. ヘッダー部分
   - ソート切り替えボタン
   - カテゴリ表示/非表示の切り替え
   - カテゴリ優先順位の編集ボタン

2. リスト表示
   - カテゴリごとのセクションヘッダー
   - 優先順位を色やアイコンで表示
   - ドラッグ&ドロップで並び替え可能

3. アイテム編集
   - カテゴリと優先順位の設定UI
   - クイック優先順位変更ボタン

4. カテゴリ管理画面
   - カテゴリ一覧の表示
   - ドラッグ&ドロップでの優先順位変更
   - カテゴリの追加・編集・削除
   - カテゴリごとの色設定

## 4. 実装手順

1. Phase 1: データ構造の拡張
   - Zustandストアの更新
   - マイグレーション処理の実装
   - デフォルトカテゴリの実装
   - カテゴリ管理機能の実装

2. Phase 2: 基本的なソート機能
   - ソートロジックの実装
   - カテゴリ別グループ化

3. Phase 3: UI実装
   - ヘッダーのソートコントロール
   - カテゴリ表示の実装
   - 優先順位の視覚的表現

4. Phase 4: インタラクション
   - ドラッグ&ドロップ
   - クイック編集機能

## 5. 注意点

1. パフォーマンス
   - 大量のアイテムがある場合のソートパフォーマンス
   - メモリ使用量の最適化

2. UX
   - 直感的な操作方法
   - アニメーションの適切な使用
   - アクセシビリティへの配慮

3. データ永続化
   - AsyncStorageの更新
   - マイグレーション時のデータ整合性

## 6. テスト要件

1. ユニットテスト
   - ソートロジックのテスト
   - カテゴリ管理のテスト

2. インテグレーションテスト
   - ドラッグ&ドロップ機能
   - データ永続化

3. UIテスト
   - ソート切り替えの動作確認
   - アニメーションの確認 