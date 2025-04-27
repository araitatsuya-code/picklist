import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, TextInput, List } from 'react-native-paper';
import { useCategoryManagement } from '../hooks/useCategoryManagement';
import { CategoryItemProps } from '../types';

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  updateCategory,
  removeCategory,
  isRemovable,
  colors,
  isDark,
  textColor,
  secondaryTextColor,
  isFirst,
  isLast,
  onMove,
}) => {
  const {
    isEditing,
    editingName,
    setEditingName,
    handleEditStart,
    handleEditSave,
  } = useCategoryManagement();

  return (
    <List.Item
      title={
        isEditing ? (
          <TextInput
            value={editingName}
            onChangeText={setEditingName}
            mode="flat"
            style={styles.editInput}
            onBlur={() => handleEditSave(category, updateCategory)}
            autoFocus
            textColor={textColor}
            theme={{
              colors: {
                primary: colors.accent.primary,
                placeholder: secondaryTextColor,
                background: 'transparent',
              },
            }}
          />
        ) : (
          <Text style={{ color: textColor }}>{category.name}</Text>
        )
      }
      description={() => (
        <Text style={{ color: secondaryTextColor }}>
          優先度: {category.priority}
        </Text>
      )}
      left={() => (
        <View style={styles.priorityButtons}>
          <IconButton
            icon="arrow-up"
            size={20}
            onPress={() => onMove('up')}
            iconColor={isDark ? '#FFFFFF' : colors.text.primary}
            disabled={isFirst}
          />
          <IconButton
            icon="arrow-down"
            size={20}
            onPress={() => onMove('down')}
            iconColor={isDark ? '#FFFFFF' : colors.text.primary}
            disabled={isLast}
          />
        </View>
      )}
      right={() => (
        <View style={styles.actionButtons}>
          <IconButton
            icon={isEditing ? 'check' : 'pencil'}
            size={20}
            onPress={() =>
              isEditing
                ? handleEditSave(category, updateCategory)
                : handleEditStart(category)
            }
            iconColor={isDark ? '#FFFFFF' : colors.text.secondary}
          />
          {isRemovable && (
            <IconButton
              icon="delete"
              size={20}
              onPress={() => removeCategory(category.id)}
              iconColor={isDark ? '#FF5252' : colors.state.error}
            />
          )}
        </View>
      )}
      style={[
        styles.categoryItem,
        {
          backgroundColor: isDark ? '#2C2C2C' : colors.background.primary,
          borderColor: isDark ? '#444444' : colors.border.primary,
          borderWidth: 1,
        },
      ]}
      titleStyle={{ color: textColor }}
      descriptionStyle={{ color: secondaryTextColor }}
    />
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    marginBottom: 8,
    borderRadius: 4,
    elevation: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityButtons: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  editInput: {
    height: 40,
    backgroundColor: 'transparent',
  },
});
