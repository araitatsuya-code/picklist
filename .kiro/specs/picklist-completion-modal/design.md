# Design Document

## Overview

この機能は、ショッピングリスト内の全てのアイテムがピッキング完了した際に、完了モーダルを自動表示し、ユーザーがリストを完了状態にできるようにする機能です。既存のReact Native + Expo + Zustandアーキテクチャに統合し、ユーザー体験を向上させます。

## Architecture

### 既存システムとの統合

現在のアプリケーションは以下の構造を持っています：

- **State Management**: Zustand（`usePicklistStore`, `useShoppingHistoryStore`）
- **Navigation**: Expo Router
- **UI Framework**: React Native + React Native Paper
- **Persistence**: AsyncStorage
- **Completion Logic**: `usePicklistCompletion` hook

### 新機能のアーキテクチャ

```
┌─────────────────────────────────────────┐
│           List Detail Screen            │
│  ┌─────────────────────────────────────┐│
│  │     Completion Detection Logic     ││
│  │  (useCompletionModalState hook)    ││
│  └─────────────────────────────────────┘│
│                    │                    │
│                    ▼                    │
│  ┌─────────────────────────────────────┐│
│  │      Completion Modal Component     ││
│  │   (CompletionModal.tsx)            ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Picklist Store Updates          │
│  - completionModalShown flag           │
│  - existing completion logic           │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### 1. CompletionModal Component

**Location**: `src/components/CompletionModal.tsx`

**Props Interface**:
```typescript
interface CompletionModalProps {
  visible: boolean;
  listName: string;
  totalItems: number;
  completedItems: number;
  onComplete: () => void;
  onCancel: () => void;
}
```

**Features**:
- モーダル表示/非表示制御
- リスト名と完了統計の表示
- 完了/キャンセルボタン
- テーマ対応（ダーク/ライトモード）
- アクセシビリティ対応

### 2. useCompletionModalState Hook

**Location**: `src/hooks/useCompletionModalState.ts`

**Interface**:
```typescript
interface CompletionModalState {
  shouldShowModal: boolean;
  showModal: () => void;
  hideModal: () => void;
  resetModalFlag: () => void;
}

export const useCompletionModalState = (listId: string): CompletionModalState
```

**Responsibilities**:
- 完了モーダル表示状態の管理
- 全アイテム完了検知
- 表示フラグの管理
- 重複表示防止ロジック

### 3. Picklist Store Extensions

**既存の`usePicklistStore`に追加**:

```typescript
interface Picklist {
  // 既存フィールド...
  completionModalShown?: boolean; // 新規追加
}

// 新規アクション
type PicklistActions = {
  // 既存アクション...
  setCompletionModalShown: (listId: string, shown: boolean) => void;
  resetCompletionModalFlag: (listId: string) => void;
}
```

## Data Models

### 完了モーダル状態管理

```typescript
// Picklistインターフェースの拡張
interface Picklist {
  id: string;
  name: string;
  items: PicklistItem[];
  createdAt: number;
  updatedAt: number;
  sortBy?: 'name' | 'category' | 'priority' | 'created';
  sortDirection?: 'asc' | 'desc';
  groupByCategory?: boolean;
  completionModalShown?: boolean; // 新規追加
}

// 完了統計情報
interface CompletionStats {
  totalItems: number;
  completedItems: number;
  completionRate: number;
  isFullyCompleted: boolean;
}
```

## Error Handling

### エラーケース

1. **リストが存在しない場合**
   - モーダルを表示しない
   - コンソールに警告ログを出力

2. **完了処理失敗**
   - エラーアラートを表示
   - モーダルを閉じない（再試行可能）

3. **状態不整合**
   - 自動的に状態をリセット
   - 次回の完了時に正常動作

### エラーハンドリング戦略

```typescript
// エラー境界での処理
try {
  // 完了処理
  const success = completeList(listId);
  if (!success) {
    throw new Error('List completion failed');
  }
} catch (error) {
  console.error('Completion error:', error);
  Alert.alert('エラー', 'リストの完了に失敗しました。');
  // モーダルは開いたままにして再試行を許可
}
```

## Testing Strategy

### Unit Tests

1. **useCompletionModalState Hook**
   - 全アイテム完了時のモーダル表示
   - 未完了アイテムがある場合の非表示
   - フラグリセット機能
   - 重複表示防止

2. **CompletionModal Component**
   - プロパティの正しい表示
   - ボタンクリック時のコールバック実行
   - テーマ適用の確認

3. **Picklist Store Extensions**
   - completionModalShownフラグの設定/取得
   - 状態更新の永続化

### Integration Tests

1. **完了フロー全体**
   - アイテム完了 → モーダル表示 → 完了実行 → 履歴保存
   - キャンセル時の状態維持
   - 再表示防止の確認

2. **エッジケース**
   - 空リストでの動作
   - 全アイテム削除時の動作
   - アプリ再起動後の状態復元

3. **新しいアイテム追加シナリオ**
   - 完了後にアイテム追加 → フラグリセット → 再完了時のモーダル表示
   - 未完了アイテム追加時のフラグリセット
   - 複数回の追加・完了サイクル

### E2E Tests

1. **ユーザーシナリオ**
   - 通常の完了フロー
   - キャンセル後の編集継続
   - 複数リストでの動作確認

## Implementation Details

### モーダル表示タイミング

```typescript
// useCompletionModalState内での検知ロジック
useEffect(() => {
  const list = picklists.find(l => l.id === listId);
  if (!list || list.items.length === 0) return;
  
  const allCompleted = list.items.every(item => item.completed);
  const shouldShow = allCompleted && !list.completionModalShown;
  
  if (shouldShow) {
    showModal();
  }
}, [picklists, listId]);

// アイテム数変更時のフラグリセット検知
useEffect(() => {
  const list = picklists.find(l => l.id === listId);
  if (!list) return;
  
  // アイテムが追加された場合、または未完了アイテムがある場合はフラグをリセット
  const hasIncompleteItems = list.items.some(item => !item.completed);
  if (hasIncompleteItems && list.completionModalShown) {
    resetCompletionModalFlag(listId);
  }
}, [picklists, listId]);
```

### 状態管理の流れ

1. **アイテム完了時**
   ```
   User toggles item → Store updates → Hook detects completion → Modal shows
   ```

2. **完了実行時**
   ```
   User clicks complete → Set flag → Complete list → Navigate away
   ```

3. **キャンセル時**
   ```
   User clicks cancel → Hide modal → Continue editing
   ```

4. **アイテム状態変更時（未完了に変更）**
   ```
   User unchecks item → Reset flag → Hide modal
   ```

5. **新しいアイテム追加時**
   ```
   User adds item → Reset flag → (If all completed again) → Modal shows
   ```

### パフォーマンス考慮事項

- **メモ化**: 完了状態の計算結果をuseMemoでキャッシュ
- **デバウンス**: 連続的なアイテム状態変更時のモーダル表示制御
- **レンダリング最適化**: モーダル表示時のみコンポーネントをマウント

### アクセシビリティ

- **Screen Reader対応**: 適切なaccessibilityLabelとaccessibilityHint
- **Focus管理**: モーダル表示時の適切なフォーカス移動
- **キーボードナビゲーション**: ボタン間の移動サポート

### 国際化対応

現在のアプリは日本語ベースですが、将来的な多言語対応を考慮：

```typescript
// 文字列の外部化準備
const strings = {
  modalTitle: 'リスト完了',
  completeButton: '完了',
  cancelButton: 'キャンセル',
  completionMessage: (listName: string, items: number) => 
    `「${listName}」の買い物が完了しました。\n${items}個のアイテムを履歴に保存します。`
};
```