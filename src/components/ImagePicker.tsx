import React, { useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as imageUtils from '../utils/imageUtils';

type ImagePickerProps = {
  imageKey: string | null;
  onImageSelected: (key: string) => void;
  onImageRemoved: () => void;
  productId: string;
};

export function ImagePicker({
  imageKey,
  onImageSelected,
  onImageRemoved,
  productId,
}: ImagePickerProps) {
  const [loading, setLoading] = React.useState(false);
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  const loadImage = useCallback(async () => {
    if (!imageKey) return;
    const uri = await imageUtils.loadImage(imageKey);
    setImageUri(uri);
  }, [imageKey]);

  React.useEffect(() => {
    if (imageKey) {
      loadImage();
    }
  }, [imageKey, loadImage]);

  const handleSelectImage = async () => {
    Alert.alert('画像を選択', '画像の取得方法を選択してください', [
      {
        text: 'カメラで撮影',
        onPress: () => captureImage(),
      },
      {
        text: 'ライブラリから選択',
        onPress: () => pickFromLibrary(),
      },
      {
        text: 'キャンセル',
        style: 'cancel',
      },
    ]);
  };

  const captureImage = async () => {
    try {
      setLoading(true);
      const uri = await imageUtils.takePhoto();
      if (uri) {
        const key = await imageUtils.saveImage(uri, productId);
        onImageSelected(key);
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('エラー', '画像の撮影に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const pickFromLibrary = async () => {
    try {
      setLoading(true);
      const uri = await imageUtils.pickImage();
      if (uri) {
        const key = await imageUtils.saveImage(uri, productId);
        onImageSelected(key);
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('エラー', '画像の選択に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    Alert.alert('画像を削除', '本当にこの画像を削除しますか？', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          if (imageKey) {
            await imageUtils.deleteImage(imageKey);
          }
          setImageUri(null);
          onImageRemoved();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.imageContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : imageUri ? (
        <Pressable onPress={handleSelectImage} onLongPress={handleRemoveImage}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </Pressable>
      ) : (
        <Pressable style={styles.imageContainer} onPress={handleSelectImage}>
          <Text style={styles.placeholder}>タップして画像を追加</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imageContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
  },
});
