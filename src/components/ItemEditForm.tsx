import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, SegmentedButtons, Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { usePicklistStore } from '../stores/usePicklistStore';
import { useCategoryStore } from '../stores/useCategoryStore';
import { PicklistItem } from '../stores/usePicklistStore';

interface ItemEditFormProps {
  listId: string;
  item: PicklistItem;
  onClose?: () => void;
}

export const ItemEditForm: React.FC<ItemEditFormProps> = ({
  listId,
  item,
  onClose,
}) => {
  const { updateItem } = usePicklistStore();
  const { categories } = useCategoryStore();
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [unit, setUnit] = useState(item.unit || '個');
  const [category, setCategory] = useState(item.category || 'other');
  const [priority, setPriority] = useState(item.priority.toString());

  const setQuantityWithValidation = (text: string) => {
    // 数字のみを許可
    const numericValue = text.replace(/[^0-9]/g, '');
    // 空の値は「1」にデフォルト設定
    setQuantity(numericValue || '1');
  };

  const handleSave = () => {
    updateItem(listId, item.id, {
      name,
      quantity: Number(quantity),
      unit,
      category,
      priority: Number(priority),
    });
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="商品名"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <View style={styles.row}>
        <TextInput
          label="数量"
          value={quantity}
          onChangeText={setQuantityWithValidation}
          keyboardType="numeric"
          style={[styles.input, styles.quantityInput]}
        />
        <TextInput
          label="単位"
          value={unit}
          onChangeText={setUnit}
          style={[styles.input, styles.unitInput]}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>
      <SegmentedButtons
        value={priority}
        onValueChange={setPriority}
        buttons={[
          { value: '1', label: '高' },
          { value: '2', label: '中' },
          { value: '3', label: '低' },
        ]}
        style={styles.priorityButtons}
      />
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={onClose} style={styles.button}>
          キャンセル
        </Button>
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          保存
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  quantityInput: {
    flex: 2,
  },
  unitInput: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  priorityButtons: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
});
