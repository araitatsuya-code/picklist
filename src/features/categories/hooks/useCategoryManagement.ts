import { useState } from 'react';
import { Category } from '../../../stores/useCategoryStore';

export const useCategoryManagement = () => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');

  const handleNameChange = (name: string) => {
    setNewCategoryName(name);
  };

  const handleEditStart = (category: Category) => {
    setEditingName(category.name);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingName('');
  };

  const handleEditSave = (
    category: Category,
    onUpdate: (id: string, data: Partial<Category>) => void
  ) => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      setEditingName(category.name);
      setIsEditing(false);
      return;
    }
    onUpdate(category.id, { name: trimmedName });
    setIsEditing(false);
  };

  return {
    newCategoryName,
    setNewCategoryName,
    isEditing,
    setIsEditing,
    editingName,
    setEditingName,
    handleNameChange,
    handleEditStart,
    handleEditCancel,
    handleEditSave,
  };
};
