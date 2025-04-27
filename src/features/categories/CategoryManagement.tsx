import React, { useState } from 'react';
import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Card, Button, TextInput, Snackbar } from 'react-native-paper';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useTheme } from '../../hooks/useTheme';
import { useCategoryManagement } from './hooks/useCategoryManagement';
import {
  findNextAvailablePriority,
  handleCategoryMove,
} from './utils/categoryUtils';
import { CategoryList } from './components/CategoryList';
import { useKeyboard } from '../../hooks/useKeyboard';

export const CategoryManagement: React.FC = () => {
  const { colors, isDark } = useTheme();
  const { categories, addCategory, updateCategory, removeCategory } =
    useCategoryStore();
  const { newCategoryName, setNewCategoryName, handleNameChange } =
    useCategoryManagement();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { keyboardVisible } = useKeyboard();

  // テキスト色の設定 - ダークモード時は白っぽく
  const textColor = isDark ? '#FFFFFF' : colors.text.primary;
  const secondaryTextColor = isDark ? '#E0E0E0' : colors.text.secondary;

  // テーマ設定を外部で定義
  const inputTheme = {
    colors: {
      primary: colors.accent.primary,
      placeholder: secondaryTextColor,
      background: colors.background.primary,
    },
  };

  // 新しいカテゴリを追加
  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      setErrorMessage('カテゴリ名を入力してください');
      return;
    }

    // 名前の重複チェック
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setErrorMessage('このカテゴリ名は既に使用されています');
      return;
    }

    const newPriority = findNextAvailablePriority(categories);
    try {
      addCategory({
        name: trimmedName,
        displayOrder: categories.length + 1,
        priority: newPriority,
      });
      setNewCategoryName('');
      setShowSuccess(true);
      Keyboard.dismiss();
    } catch {
      setErrorMessage('カテゴリの追加に失敗しました');
    }
  };

  // 並べ替えられたカテゴリリスト
  const sortedCategories = [...categories].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        { backgroundColor: colors.background.secondary },
      ]}
    >
      {/* シンプルな入力フォーム */}
      <Card style={styles.inputCard}>
        <Card.Content style={styles.inputContainer}>
          <TextInput
            label="新しいカテゴリ名"
            value={newCategoryName}
            onChangeText={handleNameChange}
            style={styles.input}
            mode="outlined"
            textColor={textColor}
            theme={inputTheme}
            // アクセシビリティプロパティ
            accessibilityLabel="新しいカテゴリ名の入力"
            accessibilityHint="ここに新しいカテゴリの名前を入力してください"
            // 日本語入力のちらつき対策
            blurOnSubmit={false}
            autoCapitalize="none"
          />
          <Button
            mode="contained"
            onPress={handleAddCategory}
            disabled={!newCategoryName.trim()}
            style={styles.addButton}
            buttonColor={colors.accent.primary}
            textColor={isDark ? '#FFFFFF' : colors.text.inverse}
            accessibilityLabel="カテゴリを追加"
            accessibilityHint="新しいカテゴリを追加します"
          >
            追加
          </Button>
        </Card.Content>
      </Card>

      {/* カテゴリリスト */}
      <CategoryList
        sortedCategories={sortedCategories}
        updateCategory={updateCategory}
        removeCategory={removeCategory}
        onMoveCategory={(category, direction) =>
          handleCategoryMove(categories, category, direction, updateCategory)
        }
        colors={colors}
        isDark={isDark}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
      />

      {/* エラーメッセージ */}
      <Snackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage(null)}
        duration={3000}
        style={{ backgroundColor: colors.state.error }}
        // キーボードが表示されている場合は上部に表示
        wrapperStyle={
          keyboardVisible
            ? { position: 'absolute', top: 20, left: 16, right: 16 }
            : undefined
        }
      >
        {errorMessage}
      </Snackbar>

      {/* 成功メッセージ */}
      <Snackbar
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
        duration={2000}
        style={{ backgroundColor: colors.state.success }}
        // キーボードが表示されている場合は上部に表示
        wrapperStyle={
          keyboardVisible
            ? { position: 'absolute', top: 20, left: 16, right: 16 }
            : undefined
        }
      >
        カテゴリを追加しました
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputCard: {
    marginBottom: 16,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    justifyContent: 'center',
  },
});
